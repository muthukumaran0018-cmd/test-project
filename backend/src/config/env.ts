import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_VERSION: z.string().default('v1'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  
  MONGODB_URI: z.string().default('mongodb://localhost:27017/tripsecure_db'),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  JWT_SECRET: z.string().default('tripsecure_access_secret_key_default'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('tripsecure_refresh_secret_key_default'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  MFA_APP_NAME: z.string().default('TripSecureAI'),
  QR_ENCRYPTION_KEY: z.string().default('32charslongsecretkeyforqrapp!!'),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('TripSecure AI <alerts@tripsecure.ai>'),

  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
