# Deployment Fix Guide

## Issues Fixed

### 1. CORS Error - Frontend Cannot Access Backend
**Problem**: Vercel-deployed frontend was trying to access `http://localhost:5001` which is blocked by browser security.

**Root Cause**: The `.env.production` file had an incorrect API URL (`/_/backend/`) instead of the actual deployed backend URL.

### 2. EventEmitter Memory Leak Warnings
**Problem**: Browser console shows EventEmitter warnings from `contentscript.js`.

**Root Cause**: These warnings come from a browser extension (likely MetaMask or another Web3 wallet), NOT from your application code. They are harmless and do not affect your application.

## Actions Required

### Step 1: Deploy Your Backend
You need to deploy your backend to a hosting service. Options:

1. **Vercel** (Recommended for Node.js):
   - Add `vercel.json` to backend folder
   - Deploy using `vercel` CLI

2. **Heroku**:
   - Create a new Heroku app
   - Deploy using git

3. **Railway**, **Render**, or other Node.js hosting

### Step 2: Update Frontend Environment Variable
Once your backend is deployed, update the production environment file:

```bash
# In frontend/.env.production
VITE_API_URL=https://your-actual-backend-url.com/
```

**Replace** `https://your-backend-url.vercel.app/` with your **actual deployed backend URL**.

### Step 3: Redeploy Frontend
After updating `.env.production`, rebuild and redeploy your frontend:

```bash
cd frontend
npm run build
# Then deploy the dist folder to Vercel
```

### Step 4: Update Backend Environment Variables
Make sure your backend deployment has these environment variables set:

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
FRONTEND_URL=https://sigaja.vercel.app
NODE_ENV=production
```

## Vercel Backend Deployment (Recommended)

Create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

Then deploy:
```bash
cd backend
vercel
```

## Testing the Fix

1. **Local Development**: Should work as before with `http://localhost:5001`
2. **Production**: After deploying backend and updating frontend, login should work without CORS errors

## About the Browser Extension Warnings

The EventEmitter warnings are from a browser extension (MetaMask, etc.) and are **completely unrelated** to your application. They appear because:

- The extension injects code into all web pages
- The extension code has event listener management issues
- **Your application is NOT causing these warnings**
- **These warnings do NOT affect your application functionality**

To verify, try logging in with browser extensions disabled - the login CORS error will still occur (because of the localhost URL issue), but the EventEmitter warnings will disappear.

## Summary

✅ Updated CORS configuration to allow Vercel preview deployments
✅ Prepared `.env.production` for backend URL (needs your actual URL)
✅ Identified browser extension as source of EventEmitter warnings

**Next Steps**:
1. Deploy your backend to Vercel/Heroku/Railway
2. Update `frontend/.env.production` with the real backend URL
3. Rebuild and redeploy your frontend
