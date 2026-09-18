import { Router } from 'express';
import * as authController from '../controllers/AuthController.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  requestResetSchema,
  resetPasswordSchema,
} from '../validations/auth.validation.js';

const router = Router();

router.post('/register', authRateLimiter, validateRequest(registerSchema), authController.register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

router.post('/verify-email', validateRequest(verifyEmailSchema), authController.verifyEmail);
router.post('/request-password-reset', authRateLimiter, validateRequest(requestResetSchema), authController.requestPasswordReset);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

router.post('/mfa/setup', authenticate, authController.setupMFA);
router.post('/mfa/verify', authenticate, authController.verifyMFA);

export default router;
