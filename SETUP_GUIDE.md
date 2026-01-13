# DJ Flowerz Platform - Complete Setup Guide

## 🎯 Overview
This guide will help you set up the complete DJ Flowerz platform with Paystack payments, subscriptions, and product sales for Kenya (KES currency).

## 📋 Prerequisites
- Node.js installed
- InsForge account with project created
- Paystack account with live keys
- Domain configured (for webhooks)

---

## 🚀 Step 1: Database Setup

### Run SQL Schema
1. Open your **InsForge SQL Dashboard**
2. Copy the entire contents of `schema.sql`
3. Execute the SQL commands

This will create:
- ✅ `users` table with subscription tracking
- ✅ `orders` table with product and shipping info
- ✅ `products` table with physical/digital support
- ✅ `mixtapes` and `pool_tracks` tables
- ✅ All necessary indexes

### Create Storage Bucket
1. Go to **Storage > Buckets** in InsForge Dashboard
2. Click **"Create New Bucket"**
3. Name: `default`
4. Permissions: **Public** (required for download links)

---

## 🔧 Step 2: Backend Server Setup

### Install Dependencies
```bash
cd /Users/DJFLOWERZ/Downloads/dj-flowerz
npm install express axios cors body-parser crypto
```

### Set Environment Variables
Create a `.env` file in the root directory:
```env
PAYSTACK_SECRET_KEY=your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
PORT=3001
NODE_ENV=production
```

### Start the Backend
```bash
node server/index.cjs
```

You should see:
```
🚀 Paystack Backend Server Running
   Port: 3001
   Environment: production
   Secret Key: ...74b

📋 Available Endpoints:
   POST /api/paystack/initialize - Initialize payment/subscription
   POST /api/store/checkout - Checkout physical/digital products
   GET  /api/paystack/verify/:reference - Verify transaction
   POST /api/paystack/webhook - Webhook listener
```

---

## 💳 Step 3: Paystack Dashboard Configuration

### 1. Enable KES Currency
- ✅ Already enabled (confirmed in your dashboard)

### 2. Configure Webhook
1. Go to **Settings > API Keys & Webhooks**
2. Add webhook URL: `https://your-domain.com/api/paystack/webhook`
3. Enable these events:
   - ✅ `charge.success`
   - ✅ `subscription.create`
   - ✅ `invoice.payment_succeeded`
   - ✅ `subscription.disable`
   - ✅ `invoice.payment_failed`

### 3. Subscription Plans (Already Created)
Your plans are configured in `config/subscriptionPlans.ts`:

| Plan | Code | Amount | Interval |
|------|------|--------|----------|
| 1 Week | `PLN_oeralasipob89ri` | KES 200 | Weekly |
| 1 Month | `PLN_tcud1nkidei4mmk` | KES 700 | Monthly |
| 3 Months | `PLN_esenkdgprpl2xl9` | KES 1,800 | Quarterly |
| 6 Months | `PLN_q8xamkxsqjhbsxt` | KES 3,500 | Biannually |
| 12 Months | `PLN_6l6w79o3p2dveo4` | KES 6,000 | Annually |

---

## 🎨 Step 4: Frontend Integration

### Add Paystack Script to HTML
In your `index.html` (before closing `</body>`):
```html
<script src="https://js.paystack.co/v1/inline.js"></script>
```

### Example: Subscription Page
```tsx
import { SubscriptionSelector } from './components/SubscriptionSelector';

function SubscriptionPage() {
    const user = useUser(); // Your auth context

    return (
        <SubscriptionSelector 
            userEmail={user.email}
            onSubscriptionSuccess={(reference) => {
                console.log('Subscription created:', reference);
                window.location.href = '/music-pool';
            }}
        />
    );
}
```

### Example: Product Checkout
```tsx
import { ProductCheckout } from './components/ProductCheckout';

function ProductPage({ product }) {
    const user = useUser();

    return (
        <ProductCheckout 
            product={product}
            userEmail={user.email}
        />
    );
}
```

### Example: Protected Music Pool
```tsx
import { ProtectedMusicPool } from './components/ProtectedMusicPool';

function MusicPoolPage() {
    const user = useUser();

    return <ProtectedMusicPool userEmail={user.email} />;
}
```

---

## 🔄 Step 5: Webhook Integration

### Test Webhook Locally (Development)
Use ngrok to expose your local server:
```bash
ngrok http 3001
```

Copy the HTTPS URL and use it in Paystack webhook settings:
```
https://abc123.ngrok.io/api/paystack/webhook
```

### Production Deployment
Deploy your backend to:
- **Cloudflare Workers** (recommended)
- **Vercel** (serverless functions)
- **Heroku** (traditional hosting)
- **Railway** (modern hosting)

Update webhook URL to your production domain.

---

## 📊 Step 6: Admin Dashboard

### Upload Products
Use the `MediaManager` component in your admin panel:
```tsx
import { MediaManager } from './components/admin/MediaManager';

// For digital products (software, beats)
<MediaManager 
    type="music" 
    onImagesChange={(images) => {
        // Save digital file path
        setProduct({
            ...product,
            type: 'digital',
            digital_file_path: images[0].filePath
        });
    }}
/>

// For physical products (merchandise)
<MediaManager 
    type="product" 
    onImagesChange={(images) => {
        // Save multiple product images
        setProduct({
            ...product,
            type: 'physical',
            images: images.map(i => i.url)
        });
    }}
/>
```

---

## ✅ Testing Checklist

### Test Subscriptions
1. ✅ Visit subscription page
2. ✅ Select a plan (e.g., Monthly - KES 700)
3. ✅ Click "Subscribe Now"
4. ✅ Complete M-Pesa payment
5. ✅ Check webhook logs for `subscription.create`
6. ✅ Verify access to Music Pool

### Test Digital Products
1. ✅ Add digital product in admin
2. ✅ Upload file to storage
3. ✅ User clicks "Buy Now"
4. ✅ Complete payment
5. ✅ Check webhook logs for `charge.success` with `product_type: 'digital'`
6. ✅ Verify download email sent

### Test Physical Products
1. ✅ Add physical product in admin
2. ✅ Upload product images
3. ✅ User enters shipping address
4. ✅ Complete payment
5. ✅ Check webhook logs for `charge.success` with `product_type: 'physical'`
6. ✅ Verify shipping order created

---

## 🐛 Troubleshooting

### "Currency not supported" Error
- ✅ Ensure using `sk_live_...` key (not test key)
- ✅ Verify `currency: 'KES'` in all payment calls
- ✅ Check Paystack dashboard shows KES enabled

### Webhook Not Receiving Events
- ✅ Verify webhook URL is HTTPS
- ✅ Check signature validation in code
- ✅ Test with Paystack webhook tester
- ✅ Check server logs for errors

### Subscription Not Granting Access
- ✅ Check `subscription_status` in database
- ✅ Verify `subscription_valid_until` is in future
- ✅ Check webhook processed `subscription.create` event

### Payment Succeeds But No Delivery
- ✅ Check webhook logs for `charge.success`
- ✅ Verify `product_type` in metadata
- ✅ Check email service configuration
- ✅ Verify storage permissions for digital files

---

## 📚 File Reference

### Core Files
- `server/index.cjs` - Backend API server
- `schema.sql` - Database schema
- `config/subscriptionPlans.ts` - Subscription plans
- `services/insforge.ts` - Database service
- `services/paystack.ts` - Payment service

### Components
- `components/SubscriptionSelector.tsx` - Subscription UI
- `components/ProductCheckout.tsx` - Product checkout
- `components/ProtectedMusicPool.tsx` - Gated content
- `components/admin/MediaManager.tsx` - File uploads

### Examples
- `examples/subscription-usage.ts` - Subscription examples
- `examples/store-usage.ts` - Product examples
- `services/payment-examples.ts` - Payment examples

---

## 🎉 You're Ready!

Your platform now supports:
- ✅ **5 subscription tiers** (weekly to annual)
- ✅ **Automatic M-Pesa payments**
- ✅ **Digital product delivery**
- ✅ **Physical product shipping**
- ✅ **Subscription renewals**
- ✅ **Protected content access**

Start generating revenue! 💰🇰🇪

---

## 📞 Support

If you encounter issues:
1. Check server logs: `node server/index.cjs`
2. Check Paystack dashboard for transaction details
3. Review webhook event logs
4. Verify database schema is applied

Good luck with your DJ Flowerz platform! 🎵🚀
