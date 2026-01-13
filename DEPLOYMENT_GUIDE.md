# DJ Flowerz Deployment Guide

## 1. Overview
Your application handles payments, emails, and bookings. It consists of two parts:
- **Frontend** (React/Vite): The website users see.
- **Backend** (Node/Express): The server handling emails and Paystack secure transactions.

To go LIVE, you must deploy BOTH parts.

---

## 2. Backend Deployment (Node.js)
You need to host the `server/` code. Good options include Render, Railway, or Heroku.

### Steps:
1. **Upload Code**: Push your code to GitHub.
2. **Create Service**: Create a new "Web Service" on your hosting provider.
3. **Build Command**: `npm install`
4. **Start Command**: `node server/index.cjs`
5. **Environment Variables**: Set these in your hosting dashboard:
   - `PAYSTACK_SECRET_KEY`: `sk_live_...` (Get from Paystack Dashboard)
   - `PAYSTACK_PUBLIC_KEY`: `pk_live_...`
   - `EMAIL_PASSWORD`: Your Gmail App Password.
   - `INSFORGE_PROJECT_ID`: `ik_bbd06f551be2c3e1ddd1cdff804eb445`
   - `INSFORGE_API_KEY`: Your InsForge Secret Key (or Project ID if allowed).
   - `PORT`: `3001` (or let the host assign one).

**Copy your Live Backend URL** (e.g., `https://djflowerz-backend.onrender.com`). You will need it for the frontend.

---

## 3. Frontend Deployment (Cloudflare Pages)

### Option 1: Git Integration (Recommended)
1. **Connect GitHub**: Connect your repo to Cloudflare Pages.
2. **Build Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables**:
   Add `VITE_BACKEND_URL` in Cloudflare Pages settings.

### Option 2: Direct Upload (Wrangler CLI)
1. Login: `npx wrangler login`
2. Build: `VITE_BACKEND_URL=https://your-backend.onrender.com npm run build` (Set your live backend URL!)
3. Deploy: `npx wrangler pages deploy dist`

### Live Mode Verification:
- **Payments**: The app is already configured with Live Paystack keys (`pk_live_...`).
- **API Calls**: The app will automatically use the `VITE_BACKEND_URL` you set. If not set, it defaults to `http://localhost:3001` for testing.

---

## 4. Final Checklist
- [ ] Backend is running and accessible (try visiting `YOUR_BACKEND_URL/api/paystack/transaction/test` - should respond).
- [ ] Frontend `VITE_BACKEND_URL` matches your backend URL.
- [ ] Paystack Dashboard is switched to "Live" mode.
- [ ] `EMAIL_PASSWORD` is set and correct.
- [ ] Run the SQL migration (`server/bookings_table.sql`) in InsForge.

🚀 **Your site is ready for the world!**
