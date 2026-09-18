import { userRepository } from '../repositories/UserRepository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, blacklistToken } from '../utils/token.utils.js';
import { generateNumericOTP, generateMFASecret, verifyMFAToken } from '../utils/otp.utils.js';
import { sendEmail } from '../config/mailer.js';
import { AppError } from '../utils/AppError.js';
import { SystemRole } from '../models/User.model.js';

export class AuthService {
  async register(data: { name: string; email: string; password: string; role?: SystemRole; phone?: string }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('User with this email already exists', 400);
    }

    const emailVerificationToken = generateNumericOTP(6);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'passenger',
      phone: data.phone,
      emailVerificationToken,
    });

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: 'Verify your TripSecure AI Account',
      html: `<h2>Welcome to TripSecure AI, ${user.name}!</h2><p>Your 6-digit email verification OTP is: <strong>${emailVerificationToken}</strong></p>`,
    });

    const accessToken = generateAccessToken({ userId: user._id.toString(), email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), email: user.email, role: user.role });

    await userRepository.addRefreshToken(user._id.toString(), refreshToken);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        mfaEnabled: user.mfaEnabled,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password?: string) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
      }
    }

    if (user.mfaEnabled) {
      return {
        mfaRequired: true,
        userId: user._id.toString(),
        email: user.email,
      };
    }

    const accessToken = generateAccessToken({ userId: user._id.toString(), email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), email: user.email, role: user.role });

    await userRepository.addRefreshToken(user._id.toString(), refreshToken);

    return {
      mfaRequired: false,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        mfaEnabled: user.mfaEnabled,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new AppError('Invalid refresh token or session revoked', 401);
    }

    // Rotate refresh token
    await userRepository.removeRefreshToken(user._id.toString(), refreshToken);

    const newAccessToken = generateAccessToken({ userId: user._id.toString(), email: user.email, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user._id.toString(), email: user.email, role: user.role });

    await userRepository.addRefreshToken(user._id.toString(), newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string, accessToken: string, refreshToken?: string) {
    await blacklistToken(accessToken);
    if (refreshToken) {
      await userRepository.removeRefreshToken(userId, refreshToken);
    }
    return true;
  }

  async verifyEmail(email: string, otp: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError('User not found', 404);

    if (user.emailVerificationToken !== otp) {
      throw new AppError('Invalid OTP verification code', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return true;
  }

  async requestPasswordReset(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError('User not found', 404);

    const otp = generateNumericOTP(6);
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Reset Password - TripSecure AI',
      html: `<h3>Password Reset Requested</h3><p>Your password reset OTP code is: <strong>${otp}</strong> (valid for 15 minutes).</p>`,
    });

    return true;
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) throw new AppError('User not found', 404);

    if (user.resetPasswordOTP !== otp || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new AppError('Invalid or expired OTP code', 400);
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await userRepository.clearAllRefreshTokens(user._id.toString());
    return true;
  }

  async setupMFA(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const { otpauthUrl, base32 } = generateMFASecret(user.email);
    user.mfaSecret = base32;
    await user.save();

    return { otpauthUrl, secret: base32 };
  }

  async verifyAndEnableMFA(userId: string, token: string) {
    const user = await userRepository.findByIdWithMfaSecret(userId);
    if (!user || !user.mfaSecret) throw new AppError('MFA setup incomplete', 400);

    const isValid = verifyMFAToken(token, user.mfaSecret);
    if (!isValid) throw new AppError('Invalid MFA TOTP token code', 400);

    user.mfaEnabled = true;
    await user.save();
    return true;
  }
}

export const authService = new AuthService();
