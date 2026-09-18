import { Request, Response } from 'express';
import { authService } from '../services/AuthService.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const register = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  return sendSuccess(res, 'User registered successfully. Check email for verification OTP.', result, 201);
});

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  if (result.refreshToken) {
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  return sendSuccess(res, 'Login successful', result);
});

export const refreshToken = asyncWrapper(async (req: Request, res: Response) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Refresh token required' });
  }

  const result = await authService.refreshTokens(token);
  return sendSuccess(res, 'Token refreshed successfully', result);
});

export const logout = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const accessToken = authHeader.split(' ')[1];
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

  await authService.logout(req.user!.userId, accessToken, refreshToken);
  res.clearCookie('refreshToken');
  return sendSuccess(res, 'Logged out successfully');
});

export const verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);
  return sendSuccess(res, 'Email verified successfully');
});

export const requestPasswordReset = asyncWrapper(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.requestPasswordReset(email);
  return sendSuccess(res, 'Password reset OTP sent to email');
});

export const resetPassword = asyncWrapper(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  return sendSuccess(res, 'Password reset successful. Please login with new password.');
});

export const setupMFA = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  const result = await authService.setupMFA(req.user!.userId);
  return sendSuccess(res, 'MFA setup initialized', result);
});

export const verifyMFA = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  const { token } = req.body;
  await authService.verifyAndEnableMFA(req.user!.userId, token);
  return sendSuccess(res, 'MFA enabled successfully');
});
