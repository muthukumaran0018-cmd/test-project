import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const globalRateLimiter = rateLimit({
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

export const qrRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many QR verification attempts.',
  },
});
