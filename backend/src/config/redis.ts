import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

class RedisCacheManager {
  private client: Redis | null = null;
  private inMemoryFallback: Map<string, { value: string; expiresAt?: number }> = new Map();
  private isConnected = false;

  constructor() {
    try {
      this.client = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) {
            logger.warn('⚠️ Redis max retry limit reached. Falling back to internal memory cache.');
            return null; // Stop retrying
          }
          return Math.min(times * 100, 2000);
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('✅ Connected to Redis cache service.');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        logger.warn(`⚠️ Redis error: ${err.message}. Using in-memory fallback cache.`);
      });
    } catch (err) {
      this.isConnected = false;
      logger.warn('⚠️ Redis initialization failed. Memory cache active.');
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch {
        // Fallback
      }
    }
    const item = this.inMemoryFallback.get(key);
    if (!item) return null;
    if (item.expiresAt && item.expiresAt < Date.now()) {
      this.inMemoryFallback.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch {
        // Fallback
      }
    }
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.inMemoryFallback.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
      } catch {
        // Fallback
      }
    }
    this.inMemoryFallback.delete(key);
  }

  async acquireLock(lockKey: string, ttlSeconds = 10): Promise<boolean> {
    const existing = await this.get(lockKey);
    if (existing) return false;
    await this.set(lockKey, 'LOCKED', ttlSeconds);
    return true;
  }

  async releaseLock(lockKey: string): Promise<void> {
    await this.del(lockKey);
  }
}

export const redisCache = new RedisCacheManager();
