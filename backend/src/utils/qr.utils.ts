import QRCode from 'qrcode';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { AppError } from './AppError.js';

export interface QRPayload {
  ticketId: string;
  passengerId: string;
  seatNumber: string;
  tripId: string;
  timestamp: number;
}

export const generateEncryptedQRPayload = (payload: QRPayload): string => {
  const jsonStr = JSON.stringify(payload);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(env.QR_ENCRYPTION_KEY.padEnd(32).slice(0, 32)),
    Buffer.from('1234567890123456')
  );
  let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decryptQRPayload = (encryptedHex: string): QRPayload => {
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(env.QR_ENCRYPTION_KEY.padEnd(32).slice(0, 32)),
      Buffer.from('1234567890123456')
    );
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted) as QRPayload;
  } catch {
    throw new AppError('Invalid or corrupted QR Code token', 400);
  }
};

export const generateQRCodeDataUrl = async (text: string): Promise<string> => {
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#1e1b4b',
      light: '#ffffff',
    },
  });
};
