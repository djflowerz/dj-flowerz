/**
 * Cloudflare Pages Function for Paystack Webhook
 * Responds to POST /api/paystack/webhook
 */

export const onRequestPost = async ({ request, env }: any) => {
    try {
        const text = await request.text();
        const signature = request.headers.get('x-paystack-signature');
        const secretKey = 'sk_live_ec66162f517e07fb5e2322ec5e5281e2fe3ab74b';

        if (!signature) {
            return new Response("No signature", { status: 400 });
        }

        const isValid = await verifySignature(text, signature, secretKey);
        if (!isValid) {
            return new Response("Invalid signature", { status: 401 });
        }

        const body = JSON.parse(text);
        const event = body.event;
        const data = body.data;

        console.log(`Received Paystack Event: ${event}`, data.reference);

        if (event === 'charge.success') {
            // Logic to fulfill order:
            // 1. Send email (using MailChannels or similar CF integration)
            // 2. Update database (e.g. Supabase/Insforge via REST API)

            // Example success log
            console.log("Charge verified successfully via webhook.");
        }

        return new Response("Webhook Received", { status: 200 });

    } catch (err: any) {
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
