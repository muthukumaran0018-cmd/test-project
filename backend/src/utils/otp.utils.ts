import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { env } from '../config/env.js';

export const generateMFASecret = (userEmail: string) => {
  const secret = speakeasy.generateSecret({
    name: `${env.MFA_APP_NAME} (${userEmail})`,
    length: 20,
  });
  return {
    otpauthUrl: secret.otpauth_url,
    base32: secret.base32,
  };
};

export const verifyMFAToken = (token: string, secretBase32: string): boolean => {
  return speakeasy.totp.verify({
    secret: secretBase32,
    encoding: 'base32',
    token,
    window: 2,
  });
};

export const generateNumericOTP = (length = 6): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, 10)];
  }
  return otp;
};

export const generateQRCodeForMFA = async (otpauthUrl: string): Promise<string> => {
  return await QRCode.toDataURL(otpauthUrl);
};
