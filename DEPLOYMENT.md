# Vercel Demo Deployment Guide

This app is split into frontend (Vite/React) and backend (Express/MongoDB).

## 1) Backend (Express)
Host on your server/VPS or any Node host. Configure environment:

Required:
- DB_URI
- JWT_SECRET
- PORT (e.g., 4000)
- CORS_ORIGIN=https://YOUR-VERCEL-APP.vercel.app
- FRONTEND_URL=https://YOUR-VERCEL-APP.vercel.app

Payments:
- PAYSTACK_SECRET (omit for demo)

Demo:
- DEMO_MODE=true (enables instant checkout endpoint and fast-path)

Start:
```
npm run start
```

## 2) Frontend (Vercel)
- Set Environment Variables in Vercel Project Settings:
  - VITE_API_URL=https://YOUR-BACKEND-HOST
  - VITE_DEMO_MODE=true (to show demo badge and button)
- Deploy (Vercel will auto-detect Vite)

## 3) Seed Convincing Data
- Login as admin on the deployed site.
- Call the seed endpoint once (e.g., from devtools):
```
fetch(`${import.meta.env.VITE_API_URL}/api/admin/seed-demo`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})
```
- Verify content on Home, Store, Artists.

## 4) Demo Checkout
- Ensure DEMO_MODE=true on backend and VITE_DEMO_MODE=true on frontend.
- Add products to cart → Checkout → click “Complete Demo Purchase”.
- Check /library and /admin/orders.

## 5) Going Live Later
- Set DEMO_MODE=false
- Provide PAYSTACK_SECRET
- Keep VITE_DEMO_MODE=false
- Optional: add Flutterwave/Stripe as secondary providers.


