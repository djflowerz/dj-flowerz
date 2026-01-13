/**
 * Cloudflare Pages Function for Paystack Webhook
 * Responds to POST /api/paystack/webhook
 */
import { createClient } from '@insforge/sdk';

export const onRequestPost = async ({ request, env }: any) => {
    try {
        const text = await request.text();
        const signature = request.headers.get('x-paystack-signature');

        // Secrets from env
        const secretKey = env.PAYSTACK_SECRET_KEY;
        const projectID = env.INSFORGE_PROJECT_ID || 'ik_bbd06f551be2c3e1ddd1cdff804eb445';
        const apiKey = env.INSFORGE_API_KEY || projectID;
        const apiUrl = env.INSFORGE_API_URL || 'https://3cfrtvt6.us-west.insforge.app';

        if (!signature || !secretKey) {
            return new Response("Configuration Error or Missing Signature", { status: 400 });
        }

        const isValid = await verifySignature(text, signature, secretKey);
        if (!isValid) {
            return new Response("Invalid signature", { status: 401 });
        }

        // Initialize DB Client
        const client = createClient(projectID, {
            baseUrl: apiUrl,
            apiKey: apiKey
        });

        const body = JSON.parse(text);
        const event = body.event;
        const data = body.data;

        console.log(`Received Paystack Event: ${event}`, data.reference);

        if (event === 'charge.success') {
            const reference = data.reference;
            const customerEmail = data.customer.email;
            const amount = data.amount / 100;
            const metadata = data.metadata || {};
            const productId = metadata.product_id;
            const productType = metadata.product_type;
            const shippingAddress = metadata.shipping_address;

            if (productType === 'tip') {
                await client.database.from('tips').insert({
                    id: reference,
                    email: customerEmail,
                    amount: amount,
                    senderName: metadata.custom_fields?.find((f: any) => f.variable_name === 'name')?.value || 'Anonymous',
                    message: metadata.custom_fields?.find((f: any) => f.variable_name === 'message')?.value || '',
                    createdAt: new Date().toISOString()
                });
            } else {
                // Determine status. If physical, maybe 'processing', if digital 'paid'
                const status = 'paid';

                // Create Order
                await client.database.from('orders').insert({
                    reference,
                    product_id: productId,
                    customer_email: customerEmail,
                    amount,
                    status: status,
                    shipping_address: productType === 'physical' ? shippingAddress : null,
                    created_at: new Date().toISOString()
                });

                // If digital, we might want to email them (via another service)
            }
            console.log(`✅ Charge processed for ${reference}`);

        } else if (event === 'subscription.create') {
            const subscriptionCode = data.subscription_code;
            const customerEmail = data.customer.email;
            const planCode = data.plan.plan_code;
            const nextPaymentDate = data.next_payment_date;

            // Update User Subscription
            await client.database.from('users').update({
                subscription_status: 'ACTIVE',
                subscription_code: subscriptionCode,
                subscription_plan: planCode,
                subscription_valid_until: nextPaymentDate
            }).eq('email', customerEmail);

            console.log(`🎉 Subscription activated for ${customerEmail}`);

        } else if (event === 'invoice.payment_succeeded') {
            // Renewal
            const customerEmail = data.customer.email;
            const nextPaymentDate = data.next_payment_date;

            await client.database.from('users').update({
                subscription_status: 'ACTIVE',
                subscription_valid_until: nextPaymentDate
            }).eq('email', customerEmail);

            console.log(`🔄 Subscription renewed for ${customerEmail}`);

        } else if (event === 'subscription.disable') {
            // Cancelled
            const customerEmail = data.customer.email;
            // Note: We don't revoke access immediately, usually waits until expiry
            // But we can mark status for logic
            /*
            await client.database.from('users').update({
               subscription_status: 'CANCELLED_PENDING' 
            }).eq('email', customerEmail);
            */
            console.log(`⚠️ Subscription disabled for ${customerEmail}`);
        }

        return new Response("Webhook Processed", { status: 200 });

    } catch (err: any) {
        console.error("Webhook Error:", err);
        return new Response(`Webhook Error: ${err.message}`, { status: 500 });
    }
}

// Helper to verify signature using Web Crypto API available in Cloudflare Workers
async function verifySignature(payload: string, signature: string, secret: string) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: 'SHA-512' }, false, ['verify']
    );
    const signatureBuf = hexStringToBuf(signature);
    const payloadBuf = encoder.encode(payload);

    return await crypto.subtle.verify('HMAC', key, signatureBuf, payloadBuf);
}

function hexStringToBuf(hexString: string) {
    const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    return bytes.buffer;
}
