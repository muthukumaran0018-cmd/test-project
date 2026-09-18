# Deployment Guide for Render.com

This guide explains step-by-step how to deploy the TripSecure AI backend to [Render](https://render.com).

---

## Step 1: Prepare Repository
Ensure all backend code in `backend/` is committed to GitHub.

---

## Step 2: Create Web Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following details:
   - **Name**: `tripsecure-backend`
   - **Region**: Select nearest region (e.g., Oregon or Singapore)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

---

## Step 3: Configure Environment Variables
In the Render Web Service settings, add the following Environment Variables:

| Variable | Description / Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `API_VERSION` | `v1` |
| `CLIENT_URL` | `https://your-frontend.vercel.app` |
| `MONGODB_URI` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/tripsecure_db` |
| `REDIS_URL` | `rediss://:<password>@<host>:<port>` |
| `JWT_SECRET` | Standard random 64-char string |
| `JWT_REFRESH_SECRET` | Standard random 64-char string |
| `QR_ENCRYPTION_KEY` | `32charslongsecretkeyforqrapp!!` |

---

## Step 4: Health Check Verification
Set the **Health Check Path** to `/health`.
Render will monitor your service uptime automatically.

---

## Step 5: Verify Deployment
Once deployed, verify:
- Health Check: `https://tripsecure-backend.onrender.com/health`
- Swagger UI Docs: `https://tripsecure-backend.onrender.com/api-docs`
- Socket.IO connection: `wss://tripsecure-backend.onrender.com`
