# Vercel Environment Variables Setup Guide

## Problem Fixed
The MongoDB connection was timing out because environment variables were not configured on Vercel.

## Solution: Add Environment Variables to Vercel

### Step 1: Open Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your project: `auth-backend-api-1`

### Step 2: Add Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add the following variables **for all environments** (Production, Preview, Development):

| Variable Name | Value |
|---|---|
| `MONGO_URL` | *(from your local .env)* |
| `JWT_SECRET` | *(from your local .env)* |
| `GOOGLE_CLIENT_ID` | *(from your local .env)* |
| `GOOGLE_CLIENT_SECRET` | *(from your local .env)* |
| `GOOGLE_REFRESH_TOKEN` | *(from your local .env)* |
| `GOOGLE_USER` | *(from your local .env)* |

⚠️ **DO NOT paste your secrets here or in any public file!** Copy values from your local `.env` file only.

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click the three dots (⋯) on your latest deployment
3. Select **Redeploy** → **Redeploy** button
4. Wait for deployment to complete (should show "Ready")

### Step 4: Verify the Fix
After redeploying, test the API:
```bash
curl -X POST https://auth-backend-api-1.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

✅ Should return success (not 500 error)

## Important Security Notes

- ✅ `.env` file is in `.gitignore` (never committed)
- ✅ Use Vercel Dashboard **ONLY** for production secrets
- ❌ Never paste actual secrets in code, docs, or commit messages
- ❌ Never expose credentials in GitHub commits

## Code Improvements Made

The following files were updated for better reliability:

### 1. `server.js` - Proper async startup
- Waits for DB connection before starting server
- Gracefully exits if connection fails
- Supports Vercel's dynamic PORT environment variable

### 2. `src/config/database.js` - Connection pooling & timeouts
- Connection caching to reuse connections
- `serverSelectionTimeoutMS: 5000` - Detects issues faster
- Connection pooling (max: 10, min: 2)
- Better error logging for debugging

These changes eliminate "buffering timed out" errors and improve reliability.
