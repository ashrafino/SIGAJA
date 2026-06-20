# Deployment Fix Guide - COMPLETE SOLUTION

## Problem Analysis

### Issue 1: CORS Preflight Failure ✅ FIXED
**Error**: "No 'Access-Control-Allow-Origin' header is present"

**Root Causes**:
1. Helmet middleware was blocking cross-origin requests
2. CORS origin validation wasn't handling regex patterns properly
3. Missing explicit OPTIONS request handling for preflight
4. Missing proper CORS headers configuration

**Fix Applied**:
- Reconfigured Helmet to allow cross-origin requests
- Implemented proper origin validation function with regex support
- Added explicit OPTIONS handler for preflight requests
- Added all necessary CORS headers (methods, allowedHeaders, credentials)

### Issue 2: Placeholder Backend URL ✅ FIXED
**Error**: Trying to access `https://your-backend-url.vercel.app/`

**Root Cause**: The `.env.production` had a placeholder URL

**Fix Applied**:
- Cleared the placeholder
- Created API configuration helper to manage URLs better
- Added fallback mechanism

### Issue 3: EventEmitter Warnings ℹ️ INFO
**Warning**: "MaxListenersExceededWarning" from `contentscript.js`

**Root Cause**: Browser extension (MetaMask/Web3 wallet) injecting code

**Status**: This is NOT your application's issue. These warnings come from browser extensions and do not affect your app functionality.

---

## What Was Fixed in the Code

### 1. Backend CORS Configuration (`backend/server.js`)

**Before**:
```javascript
app.use(helmet());

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, 'https://sigaja.vercel.app', /\.vercel\.app$/]
        : '*', 
    credentials: true,
};
app.use(cors(corsOptions));
```

**After**:
```javascript
// Helmet configured to allow cross-origin
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Proper origin validation with regex support
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight
```

### 2. Frontend API Configuration

Created new files for better API management:
- `frontend/src/config/api.js` - Centralized API URL configuration
- `frontend/src/config/axios.js` - Axios instance with interceptors

---

## Deployment Steps

### Step 1: Deploy Backend to Vercel

```bash
cd backend
vercel
```

When prompted:
- Project name: `sigaja-backend` (or your choice)
- Note the deployed URL (e.g., `https://sigaja-backend.vercel.app`)

### Step 2: Add Environment Variables to Vercel Backend

Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables

Add these variables:

```
MONGO_URI=mongodb+srv://achrafbach2_db_user:F6DKnfJuGwMGotOJ@cluster0.hpzkzv8.mongodb.net/srm_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecret123
CLOUDINARY_API_SECRET=XUsfNxFAFCl8sLrQ_1JvL1Yyxy8
CLOUDINARY_CLOUD_NAME=do8wut8mk
CLOUDINARY_API_KEY=786822589618233
NODE_ENV=production
PORT=5001
```

### Step 3: Update Frontend Environment Variable

Edit `frontend/.env.production`:

```env
VITE_API_URL=https://sigaja-backend.vercel.app/
```

**⚠️ IMPORTANT**: Replace `sigaja-backend.vercel.app` with your ACTUAL backend URL from Step 1

### Step 4: Redeploy Frontend

```bash
cd frontend
npm run build
vercel --prod
```

### Step 5: Update CORS Allowed Origins (If Needed)

If your frontend URL changed, update `backend/server.js`:

```javascript
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://sigaja.vercel.app',
    'https://YOUR-NEW-FRONTEND-URL.vercel.app', // Add your URL here
];
```

Then redeploy the backend:
```bash
cd backend
vercel --prod
```

---

## Testing the Fix

### 1. Test Backend Health
Open your backend URL in browser:
```
https://your-backend-url.vercel.app/
```

You should see: "SIGAJA API is running... (Production Ready)"

### 2. Test CORS Headers
```bash
curl -I -X OPTIONS \
  https://your-backend-url.vercel.app/api/auth/login \
  -H "Origin: https://sigaja.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

Should return headers including:
```
access-control-allow-origin: https://sigaja.vercel.app
access-control-allow-credentials: true
access-control-allow-methods: GET,POST,PUT,DELETE,OPTIONS
```

### 3. Test Login
1. Open your frontend: `https://sigaja.vercel.app`
2. Open browser DevTools (F12) → Console tab
3. Attempt login
4. Check for "API Request:" log showing correct backend URL
5. Should NOT see CORS errors
6. Should successfully log in

---

## Troubleshooting

### Still Getting CORS Error?

**Check 1**: Verify backend is using the updated code
```bash
cd backend
git status  # Make sure changes are committed
vercel --prod  # Redeploy
```

**Check 2**: Verify frontend environment variable
```bash
cd frontend
cat .env.production  # Should show your backend URL
npm run build  # Rebuild
vercel --prod  # Redeploy
```

**Check 3**: Check browser console for "API Configuration" log
- Should show correct VITE_API_URL
- Should show correct API_URL
- Should NOT show localhost in production

**Check 4**: Verify your frontend URL is in allowed origins
- Check the `allowedOrigins` array in `backend/server.js`
- Add your frontend URL if missing
- Redeploy backend

### Backend Won't Deploy?

**Error**: "Cannot find module"
- Make sure all dependencies are in `package.json`
- Run `npm install` before deploying

**Error**: Database connection failed
- Verify `MONGO_URI` environment variable in Vercel
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)

### Login Still Fails?

**Check**: Are you using the placeholder URL?
- If console shows `your-backend-url.vercel.app`, you haven't updated `.env.production`
- Update with actual URL and rebuild

**Check**: Network tab in DevTools
- Click on the failed request
- Check the URL - should be your deployed backend
- Check Request Headers - should include Origin
- Check Response Headers - should include Access-Control-Allow-Origin

---

## Optional Improvements

### 1. Use the New Axios Instance (Recommended)

Instead of importing axios everywhere, use the configured instance:

**Before**:
```javascript
import axios from 'axios';
const { data } = await axios.post(`${import.meta.env.VITE_API_URL}api/auth/login`, ...);
```

**After**:
```javascript
import api from '../config/axios';
const { data } = await api.post('api/auth/login', ...);
```

Benefits:
- Automatic token handling
- Better error logging
- Automatic redirects on 401
- No need to manually add baseURL

### 2. Environment Variables Security

Never commit `.env` files with secrets. Use Vercel environment variables for all sensitive data.

---

## Summary of Changes

✅ Fixed CORS preflight handling in backend
✅ Configured Helmet for cross-origin requests
✅ Added proper origin validation with regex
✅ Added explicit OPTIONS handler
✅ Created API configuration helper
✅ Created axios instance with interceptors
✅ Updated deployment documentation

**Next Action**: Deploy backend to Vercel and update frontend `.env.production` with the actual URL.
