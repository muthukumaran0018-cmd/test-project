# MongoDB Atlas Configuration & Schema Setup Guide

This guide details how to create and configure a MongoDB Atlas Cluster for TripSecure AI.

---

## 1. MongoDB Atlas Cluster Provisioning
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create a New Deployment** -> Select **M0 Free Tier** (or M10+ Enterprise Tier for Production).
3. Region: Select your primary user base region (e.g. AWS `ap-south-1` Mumbai or `us-east-1`).
4. Database Name: Set cluster name to `tripsecure-cluster`.

---

## 2. Database User & IP Whitelist
1. Go to **Security** -> **Database Access**.
2. Click **Add New Database User**:
   - Authentication Method: Password
   - Username: `tripsecure_admin`
   - Role: `Read and write to any database`
3. Go to **Network Access** -> **Add IP Address**:
   - For Render/Vercel Deployment: Add `0.0.0.0/0` (Allow Access from Anywhere) or Render static egress IPs.

---

## 3. Connection String Format
Obtain connection URI from **Database** -> **Connect** -> **Drivers (Node.js)**:

```env
MONGODB_URI=mongodb+srv://tripsecure_admin:<password>@tripsecure-cluster.xxxx.mongodb.net/tripsecure_db?retryWrites=true&w=majority
```

---

## 4. Performance & Index Optimization
The Mongoose models automatically create optimized compound indexes:

- **Users**: Unique Index on `email`, Index on `role`, Index on `isDeleted`.
- **Passengers**: Unique Compound Index on `{ tripId: 1, seatNumber: 1 }`, Unique Index on `ticketId`, Index on `status`.
- **Seats**: Unique Compound Index on `{ tripId: 1, seatNumber: 1 }`.
- **Trips**: Unique Index on `tripId`.
- **Timeline Events**: Index on `tripId`, Compound Index on `{ tripId: 1, timestamp: -1 }`.
- **Smart Alerts**: Index on `{ tripId: 1, resolved: 1, priority: 1 }`.
- **Audit Logs**: Index on `{ userId: 1, timestamp: -1 }`.
