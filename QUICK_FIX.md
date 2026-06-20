# Quick Fix - Deploy Backend First!

## The Problem
Your frontend on Vercel is trying to connect to `http://localhost:5001`, which only exists on your computer. This causes the CORS error.

## The Solution (3 Steps)

### 1️⃣ Deploy Backend to Vercel

```bash
cd backend
vercel
# Follow prompts, note the deployed URL (e.g., https://sigaja-backend.vercel.app)
```

### 2️⃣ Update Frontend Environment

Edit `frontend/.env.production` and replace with your actual backend URL:

```env
VITE_API_URL=https://your-backend-url.vercel.app/
```

### 3️⃣ Redeploy Frontend

```bash
cd frontend
npm run build
vercel --prod
```

## Environment Variables for Vercel Backend

Add these in Vercel Dashboard → Your Backend Project → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://...your connection string...
JWT_SECRET=supersecret123
CLOUDINARY_API_SECRET=XUsfNxFAFCl8sLrQ_1JvL1Yyxy8
CLOUDINARY_CLOUD_NAME=do8wut8mk
CLOUDINARY_API_KEY=786822589618233
FRONTEND_URL=https://sigaja.vercel.app
NODE_ENV=production
```

## About Those Browser Warnings

The "MaxListenersExceededWarning" and "ObjectMultiplex" warnings are from a **browser extension** (like MetaMask), not your code. You can ignore them - they don't affect your app.

---

**That's it!** Once the backend is deployed and the frontend knows the correct URL, login will work.
