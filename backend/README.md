# Backend API (Express + Mongoose)

Create a `.env` in this directory with:

```
DB_URI=mongodb://127.0.0.1:27017/beatsbybeatsltd
JWT_SECRET=change_this_in_production
PORT=4000
CORS_ORIGIN=http://localhost:5173

# Optional for production/demo
FRONTEND_URL=http://localhost:5173
PAYSTACK_SECRET= # leave empty for demo
DEMO_MODE=false   # set to true for instant demo checkout
```

Run:

```
npm run dev
```
