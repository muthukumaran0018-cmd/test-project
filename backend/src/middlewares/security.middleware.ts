import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Express } from 'express';
import { env } from '../config/env.js';

export const setupSecurityMiddlewares = (app: Express): void => {
  // Helmet security headers
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS protection
  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Cookie parser
  app.use(cookieParser());
};
