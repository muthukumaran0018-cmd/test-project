# Multi-stage Docker build for production Node.js deployment

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Create log folder
RUN mkdir -p logs && chown -R node:node /app

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
