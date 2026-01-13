const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const { createClient } = require('@insforge/sdk');

// Initialize InsForge Client
const INSFORGE_PROJECT_ID = process.env.INSFORGE_PROJECT_ID || 'ik_bbd06f551be2c3e1ddd1cdff804eb445';
const INSFORGE_API_URL = process.env.INSFORGE_API_URL || 'https://3cfrtvt6.us-west.insforge.app';

const insforge = createClient(INSFORGE_PROJECT_ID, {
    baseUrl: INSFORGE_API_URL,
    apiKey: process.env.INSFORGE_API_KEY || INSFORGE_PROJECT_ID
});
const db = insforge.database;

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Keys from configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const BASE_URL = 'https://api.paystack.co';

// Helper function for API calls
const paystackApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
    }
});

// --- API Endpoints ---

// Endpoint 1: Initialize Transaction (Kenya Context - 2026)
app.post('/api/paystack/initialize', async (req, res) => {
    const { email, amount, productId, planCode, metadata } = req.body;

    // CRITICAL: Validate we're using live keys in production
    if (!PAYSTACK_SECRET_KEY || !PAYSTACK_SECRET_KEY.startsWith('sk_live_')) {
        console.error("❌ CRITICAL ERROR: Live mode active, but live secret key not set or is invalid.");
        return res.status(500).json({
            error: "Misconfigured API keys. Cannot process live payment.",
            hint: "Set PAYSTACK_SECRET_KEY environment variable with sk_live_... key"
        });
    }

    try {
        const payload = {
            email: email,
            amount: Math.round(amount * 100), // KES in minor units (kobo)
            currency: 'KES',      // Confirmed enabled in dashboard
            channels: ['card', 'mobile_money'], // Optimized for M-Pesa in Kenya
            callback_url: 'https://djflowerz-site.pages.dev/payment-success',
            metadata: {
                product_id: productId,
                custom_fields: [
                    {
                        display_name: "Product ID",
                        variable_name: "product_id",
                        value: productId
                    }
                ],
                ...metadata // Allow additional metadata
            },
            // Adding a plan code here automatically handles subscriptions
            ...(planCode && { plan: planCode })
        };

        const response = await paystackApi.post('/transaction/initialize', payload);

        // Log the initialization for debugging
        console.log(`✅ Transaction initialized for ${email}: ${response.data.data.reference}`);
        console.log(`   Amount: KES ${amount}`);
        console.log(`   Channels: card, mobile_money (M-Pesa)`);

        res.json(response.data); // Returns authorization_url to frontend
    } catch (error) {
        console.error("❌ Initialization Error:", error.response?.data || error.message);
        res.status(500).json({
            error: error.response?.data?.message || "Payment initialization failed",
            details: error.response?.data || error.message
        });
    }
});

// Endpoint 5: Send Booking Email
app.post('/api/send-booking-email', async (req, res) => {
    const data = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "djflowerz254@gmail.com",
            pass: process.env.EMAIL_PASSWORD // Requires app-specific password in .env
        }
    });

    const mailOptions = {
        from: '"DJ Flowerz Bookings" <djflowerz254@gmail.com>',
        to: 'djflowerz254@gmail.com',
        subject: `New Booking: ${data.eventType} - ${data.name}`,
        html: `
            <h3>New Booking Request</h3>
            <p><b>Name:</b> ${data.name}</p>
            <p><b>Phone:</b> ${data.phone}</p>
            <p><b>Email:</b> ${data.email}</p>
            <p><b>Event Type:</b> ${data.eventType}</p>
            <p><b>Event Date:</b> ${data.eventDate}</p>
            <p><b>Budget:</b> KES ${data.budget}</p>
            <p><b>Location:</b> ${data.location}</p>
            <p><b>Details:</b> ${data.details}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Booking email sent for ${data.name}`);
        res.status(200).send("Email Sent");
    } catch (error) {
        console.error("❌ Email Error:", error);
        res.status(500).send(error.message);
    }
});

// Endpoint 6: Send Contact Email
app.post('/api/send-contact-email', async (req, res) => {
    const data = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "djflowerz254@gmail.com",
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: '"DJ Flowerz Contact" <djflowerz254@gmail.com>',
        to: 'djflowerz254@gmail.com',
        subject: `New Inquiry: ${data.subject} - ${data.name}`,
        html: `
            <h3>New General Inquiry</h3>
            <p><b>Name:</b> ${data.name}</p>
            <p><b>Email:</b> ${data.email}</p>
            <p><b>Subject:</b> ${data.subject}</p>
            <p><b>Message:</b></p>
            <p>${data.message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Contact email sent for ${data.name}`);
        res.status(200).send("Email Sent");
    } catch (error) {
        console.error("❌ Email Error:", error);
        res.status(500).send(error.message);
    }
});

// Endpoint 2.5: Store Checkout (Physical & Digital Products)
app.post('/api/store/checkout', async (req, res) => {
    const { email, amount, productId, productType, address, productName } = req.body;

    // Validate required fields
    if (!email || !amount || !productId || !productType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // For physical products, shipping address is required
    if (productType === 'physical' && !address) {
        return res.status(400).json({ error: 'Shipping address required for physical products' });
    }

    try {
        const payload = {
            email,
            amount: Math.round(amount * 100), // KES minor units
            currency: 'KES',
            channels: ['card', 'mobile_money'],
            metadata: {
                product_id: productId,
                product_type: productType,
                product_name: productName,
                shipping_address: productType === 'physical' ? address : null,
                custom_fields: [
                    {
                        display_name: "Product Type",
                        variable_name: "product_type",
                        value: productType
                    },
                    {
                        display_name: "Product ID",
                        variable_name: "product_id",
                        value: productId
                    }
                ]
            },
            callback_url: 'https://djflowerz-site.pages.dev/payment-success'
        };

        const response = await paystackApi.post('/transaction/initialize', payload);

        console.log(`✅ Checkout initialized for ${email}`);
        console.log(`   Product: ${productName} (${productType})`);
        console.log(`   Amount: KES ${amount}`);

        res.json(response.data);
    } catch (error) {
        console.error("❌ Checkout Error:", error.response?.data || error.message);
        res.status(500).json({
            error: error.response?.data?.message || "Checkout failed",
            details: error.response?.data || error.message
        });
    }
});

// Endpoint 3: Verification & Digital Delivery
app.get('/api/paystack/verify/:reference', async (req, res) => {
    const { reference } = req.params;

    try {
        const response = await paystackApi.get(`/transaction/verify/${reference}`);
        const data = response.data.data;

        if (data.status === 'success') {
            const productId = data.metadata?.product_id || data.metadata?.custom_fields?.find(f => f.variable_name === 'product_id')?.value;

            console.log(`Payment verified for reference: ${reference}, Product ID: ${productId}`);

            console.log(`Payment verified for reference: ${reference}, Product ID: ${productId}`);

            // Update order status in DB
            try {
                await db.from('orders').update({ status: 'paid' }).eq('reference', reference);
            } catch (err) {
                console.error("DB Update Error", err);
            }

            // TODO: Generate digital software download link
            // const downloadLink = await getDigitalSoftwareLink(productId);

            res.json({
                status: 'success',
                message: 'Payment verified successfully',
                data: {
                    reference: data.reference,
                    amount: data.amount / 100, // Convert back to KES
                    customer: data.customer,
                    productId: productId,
                    // downloadLink: downloadLink // Uncomment when implemented
                }
            });
        } else {
            res.status(400).json({
                status: 'failed',
                message: 'Payment not successful',
                paymentStatus: data.status
            });
        }
    } catch (error) {
        console.error(`Verification error for ${reference}:`, error.message);
        res.status(500).json({ error: 'Verification failed', details: error.message });
    }
});

// Endpoint 3: Webhook Listener (Handles subscriptions & renewals)
app.post('/api/paystack/webhook', async (req, res) => {
    // SECURITY: Validate the signature
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    if (hash !== req.headers['x-paystack-signature']) {
        console.log("❌ Invalid webhook signature!");
        return res.sendStatus(400);
    }

    const event = req.body;
    console.log(`📨 Received webhook event: ${event.event}`);

    try {
        // Handle relevant events
        if (event.event === 'charge.success') {
            // One-time payment or first subscription charge
            const reference = event.data.reference;
            const productId = event.data.metadata?.product_id;
            const productType = event.data.metadata?.product_type;
            const customerEmail = event.data.customer.email;
            const amount = event.data.amount / 100;
            const shippingAddress = event.data.metadata?.shipping_address;

            console.log(`✅ Charge success: ${reference}`);
            console.log(`   Customer: ${customerEmail}`);
            console.log(`   Amount: KES ${amount}`);
            console.log(`   Product: ${productId || 'N/A'} (${productType || 'N/A'})`);

            // Handle based on product type
            if (productType === 'digital') {
                console.log(`📧 Digital product - Sending download link to ${customerEmail}`);
                // TODO: Send digital download email
                // await sendDigitalDownloadEmail(customerEmail, productId);

            } else if (productType === 'physical') {
                console.log(`📦 Physical product - Creating shipping order`);
                console.log(`   Shipping to: ${JSON.stringify(shippingAddress)}`);
                // TODO: Create shipping label or notify fulfillment team
                // await createShippingOrder(shippingAddress, productId, customerEmail);
            }

            if (productType === 'tip') {
                await db.from('tips').insert({
                    id: reference,
                    email: customerEmail,
                    amount: amount,
                    senderName: event.data.metadata?.custom_fields?.find(f => f.variable_name === 'name')?.value || 'Anonymous',
                    message: event.data.metadata?.custom_fields?.find(f => f.variable_name === 'message')?.value || '',
                    createdAt: new Date().toISOString()
                });
            } else {
                await db.from('orders').insert({
                    reference,
                    product_id: productId,
                    customer_email: customerEmail,
                    amount,
                    status: 'paid', // Webhook confirms payment
                    shipping_address: productType === 'physical' ? shippingAddress : null,
                    created_at: new Date().toISOString()
                });
            }

        } else if (event.event === 'subscription.create') {
            // New subscription created - Grant access
            const subscriptionCode = event.data.subscription_code;
            const customerEmail = event.data.customer.email;
            const planCode = event.data.plan.plan_code;
            const nextPaymentDate = event.data.next_payment_date;

            console.log(`🎉 Subscription created!`);
            console.log(`   Subscription Code: ${subscriptionCode}`);
            console.log(`   Customer: ${customerEmail}`);
            console.log(`   Plan: ${planCode}`);
            console.log(`   Next Payment: ${nextPaymentDate}`);

            // Update user subscription status in database
            await db.from('users').update({
                subscription_status: 'ACTIVE',
                subscription_code: subscriptionCode,
                subscription_plan: planCode, // ensure planCode matches enum in DB if strict
                subscription_valid_until: nextPaymentDate
            }).eq('email', customerEmail);

            // TODO: Send welcome email with access instructions
            // await sendWelcomeEmail(customerEmail, planCode);

        } else if (event.event === 'invoice.payment_succeeded') {
            // Subscription renewal payment succeeded - Extend access
            const subscriptionCode = event.data.subscription_code;
            const customerEmail = event.data.customer.email;
            const nextPaymentDate = event.data.next_payment_date;
            const amount = event.data.amount / 100;

            console.log(`🔄 Subscription renewed!`);
            console.log(`   Subscription Code: ${subscriptionCode}`);
            console.log(`   Customer: ${customerEmail}`);
            console.log(`   Amount: KES ${amount}`);
            console.log(`   Next Payment: ${nextPaymentDate}`);

            // Extend user access in database
            await db.from('users').update({
                subscription_status: 'ACTIVE',
                subscription_valid_until: nextPaymentDate,
                // last_payment_date: new Date().toISOString()
            }).eq('email', customerEmail);

            // TODO: Send renewal confirmation email
            // await sendRenewalEmail(customerEmail, amount);

        } else if (event.event === 'subscription.disable') {
            // User cancelled subscription - Revoke access at end of period
            const subscriptionCode = event.data.subscription_code;
            const customerEmail = event.data.customer.email;

            console.log(`⚠️ Subscription cancelled`);
            console.log(`   Subscription Code: ${subscriptionCode}`);
            console.log(`   Customer: ${customerEmail}`);

            // TODO: Update subscription status (keep active until valid_until date)
            /*
            await db.updateUserSubscription(customerEmail, {
                subscription_status: 'cancelled',
                will_renew: false
            });
            */

            // TODO: Send cancellation confirmation
            // await sendCancellationEmail(customerEmail);

        } else if (event.event === 'invoice.payment_failed') {
            // Subscription renewal failed - Notify user
            const subscriptionCode = event.data.subscription_code;
            const customerEmail = event.data.customer.email;

            console.log(`❌ Subscription payment failed`);
            console.log(`   Subscription Code: ${subscriptionCode}`);
            console.log(`   Customer: ${customerEmail}`);

            // TODO: Send payment failure notification
            // await sendPaymentFailureEmail(customerEmail);
        }

        // Always respond with 200 OK to acknowledge receipt
        res.sendStatus(200);
    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        // Still return 200 to prevent Paystack from retrying
        res.sendStatus(200);
    }
});

// Endpoint 4: Get Transaction Status
app.get('/api/paystack/transaction/:reference', async (req, res) => {
    const { reference } = req.params;

    try {
        const response = await paystackApi.get(`/transaction/verify/${reference}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`\n🚀 Paystack Backend Server Running`);
    console.log(`   Port: ${port}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Secret Key: ...${PAYSTACK_SECRET_KEY.slice(-4)}`);
    console.log(`\n📋 Available Endpoints:`);
    console.log(`   POST /api/paystack/initialize - Initialize payment/subscription`);
    console.log(`   GET  /api/paystack/verify/:reference - Verify transaction`);
    console.log(`   POST /api/paystack/webhook - Webhook listener`);
    console.log(`   GET  /api/paystack/transaction/:reference - Get transaction status`);
    console.log(`\n⚠️  Remember to:`);
    console.log(`   1. Set PAYSTACK_SECRET_KEY environment variable`);
    console.log(`   2. Configure webhook URL in Paystack Dashboard`);
    console.log(`   3. Implement database update logic (marked with TODO)`);
    console.log(`\n`);
});
