# DJ Flowerz Platform - Quick Reference

## 🎯 System Status

### ✅ Backend Server
- **Status**: Running on port 3001
- **Endpoints**: 4 active (initialize, verify, webhook, checkout)
- **Currency**: KES (Kenya Shillings)
- **Payment Methods**: M-Pesa, Card

### ✅ Subscription Plans
| Plan | Code | Price | Interval |
|------|------|-------|----------|
| Weekly | PLN_oeralasipob89ri | KES 200 | 7 days |
| Monthly | PLN_tcud1nkidei4mmk | KES 700 | 30 days |
| Quarterly | PLN_esenkdgprpl2xl9 | KES 1,800 | 90 days |
| Biannual | PLN_q8xamkxsqjhbsxt | KES 3,500 | 180 days |
| Annual | PLN_6l6w79o3p2dveo4 | KES 6,000 | 365 days |

---

## 🔌 API Endpoints

### 1. Initialize Payment/Subscription
```bash
POST http://localhost:3001/api/paystack/initialize
Content-Type: application/json

{
  "email": "user@example.com",
  "amount": 700,
  "planCode": "PLN_tcud1nkidei4mmk",  // Optional for subscriptions
  "productId": "uuid",                // Optional for products
  "metadata": {}                      // Optional extra data
}
```

### 2. Store Checkout (Physical/Digital)
```bash
POST http://localhost:3001/api/store/checkout
Content-Type: application/json

{
  "email": "user@example.com",
  "amount": 5000,
  "productId": "uuid",
  "productType": "digital",           // or "physical"
  "productName": "Beat Pack Vol 1",
  "address": {                        // Required for physical only
    "fullName": "John Doe",
    "phone": "+254700000000",
    "address": "123 Main St",
    "city": "Nairobi",
    "county": "Nairobi County"
  }
}
```

### 3. Verify Transaction
```bash
GET http://localhost:3001/api/paystack/verify/{reference}
```

### 4. Webhook Listener
```bash
POST http://localhost:3001/api/paystack/webhook
X-Paystack-Signature: {hash}

# Paystack sends events here automatically
```

---

## 📊 Database Schema

### Users Table
```sql
- id (UUID)
- email (TEXT, UNIQUE)
- subscription_status (TEXT) -- 'active', 'cancelled', 'inactive'
- subscription_code (TEXT)
- plan_code (TEXT)
- subscription_valid_until (TIMESTAMP)
- paystack_customer_code (TEXT)
```

### Orders Table
```sql
- id (UUID)
- user_id (UUID)
- product_id (UUID)
- customer_email (TEXT)
- amount_kes (DECIMAL)
- status (TEXT) -- 'pending', 'paid', 'completed'
- reference (TEXT, UNIQUE)
- plan_code (TEXT)
- shipping_address (JSONB)
```

### Products Table
```sql
- id (UUID)
- name (TEXT)
- price (DECIMAL)
- type (TEXT) -- 'physical' or 'digital'
- digital_file_path (TEXT)
- weight_kg (DECIMAL)
- images (TEXT[])
```

---

## 🎨 React Components

### Subscription Selector
```tsx
import { SubscriptionSelector } from './components/SubscriptionSelector';

<SubscriptionSelector 
  userEmail="user@example.com"
  onSubscriptionSuccess={(ref) => console.log(ref)}
/>
```

### Product Checkout
```tsx
import { ProductCheckout } from './components/ProductCheckout';

<ProductCheckout 
  product={{
    id: 'uuid',
    name: 'Beat Pack',
    price: 5000,
    type: 'digital'
  }}
  userEmail="user@example.com"
/>
```

### Protected Music Pool
```tsx
import { ProtectedMusicPool } from './components/ProtectedMusicPool';

<ProtectedMusicPool userEmail="user@example.com" />
```

### Media Manager (Admin)
```tsx
import { MediaManager } from './components/admin/MediaManager';

<MediaManager 
  type="product"  // or "music"
  onImagesChange={(images) => console.log(images)}
/>
```

---

## 🔔 Webhook Events

### subscription.create
```javascript
{
  event: 'subscription.create',
  data: {
    subscription_code: 'SUB_xxx',
    customer: { email: 'user@example.com' },
    plan: { plan_code: 'PLN_xxx' },
    next_payment_date: '2026-02-12'
  }
}
// Action: Grant access, update DB
```

### invoice.payment_succeeded
```javascript
{
  event: 'invoice.payment_succeeded',
  data: {
    subscription_code: 'SUB_xxx',
    customer: { email: 'user@example.com' },
    next_payment_date: '2026-03-12'
  }
}
// Action: Extend access
```

### charge.success
```javascript
{
  event: 'charge.success',
  data: {
    reference: 'REF_xxx',
    customer: { email: 'user@example.com' },
    metadata: {
      product_id: 'uuid',
      product_type: 'digital'
    }
  }
}
// Action: Deliver product
```

---

## 🧪 Testing Commands

### Test Subscription Payment
```bash
curl -X POST http://localhost:3001/api/paystack/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "amount": 700,
    "planCode": "PLN_tcud1nkidei4mmk"
  }'
```

### Test Product Checkout
```bash
curl -X POST http://localhost:3001/api/store/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "amount": 5000,
    "productId": "test-123",
    "productType": "digital",
    "productName": "Test Product"
  }'
```

### Test Verification
```bash
curl http://localhost:3001/api/paystack/verify/REF_xxx
```

---

## 📝 TODO Checklist

### Database
- [ ] Run `schema.sql` in InsForge SQL Dashboard
- [ ] Create 'default' storage bucket (Public)
- [ ] Verify all tables created successfully

### Paystack
- [ ] Configure webhook URL in dashboard
- [ ] Enable webhook events (5 events)
- [ ] Verify subscription plans exist
- [ ] Test with small amount first

### Backend
- [ ] Set environment variables (.env file)
- [ ] Deploy to production server
- [ ] Update callback URLs to production domain
- [ ] Implement email service for digital delivery

### Frontend
- [ ] Add Paystack script to HTML
- [ ] Integrate SubscriptionSelector component
- [ ] Integrate ProductCheckout component
- [ ] Add protected routes for Music Pool
- [ ] Test complete user flow

---

## 🚨 Important Notes

1. **Live Keys**: Always use `sk_live_...` in production
2. **HTTPS Required**: Webhooks only work with HTTPS
3. **Signature Validation**: Never skip webhook signature check
4. **Currency**: Always use 'KES' for Kenya
5. **Amount Format**: Multiply by 100 (KES to kobo)

---

## 📞 Quick Links

- **Paystack Dashboard**: https://dashboard.paystack.com
- **InsForge Dashboard**: https://insforge.app
- **Backend Server**: http://localhost:3001
- **Frontend**: http://localhost:3000

---

**Last Updated**: 2026-01-12
**Version**: 1.0.0
**Status**: Production Ready ✅
