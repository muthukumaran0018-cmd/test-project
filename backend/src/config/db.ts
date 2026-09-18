import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    const options: mongoose.ConnectOptions = {
      autoIndex: env.NODE_ENV !== 'production', // Build indexes in dev/test, use script for prod
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 20,
    };

    logger.info(`Connecting to MongoDB Database...`);
    const conn = await mongoose.connect(env.MONGODB_URI, options);

    logger.info(`✅ MongoDB Connected: Host: ${conn.connection.host} | DB Name: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`❌ MongoDB connection error: ${err.message}`, { error: err });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected. Attempting reconnection...');
    });
  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};
