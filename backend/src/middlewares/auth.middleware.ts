import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, isTokenBlacklisted } from '../utils/token.utils.js';
import { AppError } from '../utils/AppError.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError('Authentication required. Please provide a valid Bearer token.', 401);
    }

    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      throw new AppError('Token has been revoked. Please log in again.', 401);
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  }
);
