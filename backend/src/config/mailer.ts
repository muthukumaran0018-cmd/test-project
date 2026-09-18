import nodemailer from 'nodemailer';
import { env } from './env.js';
import { logger } from './logger.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT, 10),
  secure: env.SMTP_PORT === '465',
  auth: env.SMTP_USER && env.SMTP_PASS ? {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  } : undefined,
});

export const sendEmail = async (options: {
  to: string;
  subject: string;
  text?: string;
  html: string;
}): Promise<boolean> => {
  try {
    if (!env.SMTP_USER) {
      logger.info(`[MOCK EMAIL SENT TO ${options.to}] Subject: ${options.subject}`);
      return true;
    }
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    logger.info(`📧 Email dispatched successfully to ${options.to}`);
    return true;
  } catch (error) {
    logger.error('❌ Failed to send email via Nodemailer:', error);
    return false;
  }
};
