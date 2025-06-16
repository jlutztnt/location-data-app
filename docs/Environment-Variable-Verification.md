# Environment Variable Verification Guide

## 🚨 Current Issue

The error `POST http://localhost:8787/api/auth/sign-in/email net::ERR_CONNECTION_REFUSED` indicates that the frontend is still trying to connect to localhost instead of the deployed backend.

## ✅ Solution: Verify Vercel Environment Variables

### Step 1: Check Current Environment Variables in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `location-data-app`
3. **Go to Settings** → **Environment Variables**
4. **Verify these variables exist**:

| Variable Name | Required Value |
|---------------|----------------|
| `BETTER_AUTH_SECRET` | `2e69abaa8c76ecb15c8a7cad203c710c90fd5504b10d0a0f95b46179cd834705` |
| `BETTER_AUTH_URL` | `https://location-data-app.vercel.app` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://location-data-api.jlutz.workers.dev` |
| `NODE_ENV` | `production` |

### Step 2: Add Missing Variables

If `NEXT_PUBLIC_BACKEND_URL` is missing or incorrect:

1. **Click "Add New"** in the Environment Variables section
2. **Name**: `NEXT_PUBLIC_BACKEND_URL`
3. **Value**: `https://location-data-api.jlutz.workers.dev`
4. **Environment**: Select "Production", "Preview", and "Development"
5. **Click "Save"**

### Step 3: Force Redeploy

After adding/updating environment variables:

1. **Go to Deployments tab** in your Vercel project
2. **Click the three dots** on the latest deployment
3. **Select "Redeploy"**
4. **Wait for deployment to complete**

### Step 4: Test the Fix

1. **Visit**: https://location-data-app.vercel.app/login
2. **Open browser developer tools** (F12)
3. **Go to Network tab**
4. **Try to login**
5. **Verify the request goes to**: `https://location-data-api.jlutz.workers.dev/api/auth/sign-in/email`

## 🔍 Troubleshooting

### If still connecting to localhost:

1. **Clear browser cache** and try again
2. **Check that `NEXT_PUBLIC_BACKEND_URL` is spelled correctly** (note the underscore)
3. **Verify the environment variable is set for "Production"** environment
4. **Confirm the redeploy completed successfully**

### If getting CORS errors:

The backend is configured to accept requests from your Vercel domain, so this should work once the environment variable is correct.

### If getting 404 errors:

Verify the backend is responding by visiting: https://location-data-api.jlutz.workers.dev/api/auth/session

## 📋 Expected Behavior

Once fixed, you should see:
- ✅ Network requests go to `https://location-data-api.jlutz.workers.dev`
- ✅ Login attempts reach the backend
- ✅ Successful authentication and redirect to dashboard
- ✅ Password visibility toggle works
- ✅ No browser console errors

## 🆘 If Still Not Working

Double-check that:
1. The environment variable name is exactly: `NEXT_PUBLIC_BACKEND_URL`
2. The value is exactly: `https://location-data-api.jlutz.workers.dev`
3. The variable is set for the "Production" environment
4. You've redeployed after setting the variable
5. You've cleared your browser cache

The `NEXT_PUBLIC_` prefix is required for Next.js to make the variable available in the browser!
