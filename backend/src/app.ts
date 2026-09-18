import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { setupSecurityMiddlewares } from './middlewares/security.middleware.js';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware.js';
import { globalErrorHandler } from './middlewares/error.middleware';
import { swaggerSpec } from './config/swagger.js';
import apiRoutes from './routes/index.js';
import { AppError } from './utils/AppError.js';

const app = express();

// Core Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security & Rate Limiting Middlewares
setupSecurityMiddlewares(app);
app.use(globalRateLimiter);

// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    service: 'TripSecure AI Enterprise Backend',
    environment: env.NODE_ENV,
  });
});

// Primary API V1 Routes
app.use(`/api/${env.API_VERSION}`, apiRoutes);

// 404 Handler
app.use('*', (req, res, next) => {
  next(new AppError(`Cannot find route ${req.originalUrl} on this server`, 404));
});

// Global Error Middleware
app.use(globalErrorHandler);

export default app;
