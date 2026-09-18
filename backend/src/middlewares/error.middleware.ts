import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // Handle Mongoose Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource ID '${err.value}'.`;
  }

  // Log error details
  if (statusCode >= 500) {
    logger.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);
  } else {
    logger.warn(`[CLIENT ERROR ${statusCode}] ${req.method} ${req.originalUrl}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
