import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { redisCache } from '../config/redis.js';
import { AppError } from './AppError.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    throw new AppError('Invalid or expired access token', 401);
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }
};

export const blacklistToken = async (token: string, ttlSeconds = 900): Promise<void> => {
  await redisCache.set(`blacklist:${token}`, 'true', ttlSeconds);
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const result = await redisCache.get(`blacklist:${token}`);
  return result === 'true';
};
