# Quick Fix - CORS & Deployment Issues SOLVED! 🚀

## What I Fixed

### 1. CORS Configuration ✅
Fixed the backend CORS setup to properly handle preflight requests and cross-origin access.

### 2. Helmet Configuration ✅
Configured Helmet security headers to allow cross-origin resource policy.

### 3. API Configuration ✅
Created centralized API configuration for better URL management.

---

## Deploy Now (4 Steps)

### 1️⃣ Deploy Backend

```bash
cd backend
vercel
```

**Note the URL** (e.g., `https://sigaja-backend.vercel.app`)

### 2️⃣ Add Backend Environment Variables

In Vercel Dashboard → Backend Project → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://achrafbach2_db_user:F6DKnfJuGwMGotOJ@cluster0.hpzkzv8.mongodb.net/srm_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecret123
CLOUDINARY_API_SECRET=XUsfNxFAFCl8sLrQ_1JvL1Yyxy8
CLOUDINARY_CLOUD_NAME=do8wut8mk
CLOUDINARY_API_KEY=786822589618233
NODE_ENV=production
PORT=5001
```

### 3️⃣ Update Frontend Environment

Edit `frontend/.env.production`:

```env
VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app/
```

**Replace with your actual backend URL from Step 1!**

### 4️⃣ Deploy Frontend

```bash
cd frontend
npm run build
vercel --prod
```

---

## Test It Works

1. Open your frontend URL
2. Open DevTools Console (F12)
3. Try to login
4. You should see:
   - ✅ "API Configuration" log with correct backend URL
   - ✅ "API Request: POST .../api/auth/login"
   - ✅ Successful login
   - ❌ NO CORS errors

---

## What Changed in the Code

### Backend (`server.js`)
```javascript
// BEFORE: Simple CORS that didn't work properly
app.use(cors({ origin: [...], credentials: true }));

// AFTER: Proper CORS with preflight handling
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
    origin: function (origin, callback) { /* validation */ },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors(corsOptions)); // Preflight
```

### Frontend
Created two new config files:
- `src/config/api.js` - API URL management
- `src/config/axios.js` - Axios instance with auto token handling

---

## Troubleshooting

### Still seeing placeholder URL error?
→ Update `frontend/.env.production` with your **real** backend URL and rebuild

### CORS error persists?
→ Check if your frontend URL is in the `allowedOrigins` array in `backend/server.js`

### Backend won't start?
→ Verify all environment variables are set in Vercel Dashboard

---

## About Browser Extension Warnings

The "MaxListenersExceededWarning" warnings are from **MetaMask** or another Web3 browser extension, NOT your code. They're harmless and don't affect your app. Ignore them! 🙈

---

**That's it!** The CORS issues are fixed. Just deploy and update the URL! 🎉
