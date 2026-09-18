import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { AppError } from '../utils/AppError.js';

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User authentication missing', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(`Forbidden: Access denied for role '${req.user.role}'`, 403)
      );
    }

    next();
  };
};
