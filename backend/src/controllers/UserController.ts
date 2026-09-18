import { Response } from 'express';
import { userRepository } from '../repositories/UserRepository.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AppError } from '../utils/AppError.js';

export const getProfile = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  const user = await userRepository.findById(req.user!.userId);
  if (!user) throw new AppError('User not found', 404);
  return sendSuccess(res, 'User profile retrieved', user);
});

export const getUsers = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  const users = await userRepository.find();
  return sendSuccess(res, 'Users list retrieved', users);
});

export const updateUserRole = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  const { userId, role } = req.body;
  const user = await userRepository.update(userId, { role });
  return sendSuccess(res, 'User role updated successfully', user);
});
