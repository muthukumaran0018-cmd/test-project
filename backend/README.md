# TripSecure Backend (Express + TypeScript + Prisma)

This folder contains the backend scaffold for TripSecure: an Express + TypeScript API server with Prisma + PostgreSQL, Socket.IO for realtime, JWT auth, Zod validation, and Jest + Supertest for tests.

Quick start (local):

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.

2. Install dependencies:

```bash
cd backend
npm install
```

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Start dev server:

```bash
npm run dev
```

OpenAPI spec is available at `backend/openapi.yaml`.

Next steps implemented by the scaffold:
- Implement Prisma schema and seed script
- Implement Express routes, Socket.IO, auth middleware
- Add integration tests (Jest + Supertest)

I'll now implement the Prisma schema and initial migrations in the backend scaffold (next task).