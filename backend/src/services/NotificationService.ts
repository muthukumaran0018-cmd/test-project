import { sendEmail } from '../config/mailer.js';
import { logger } from '../config/logger.js';

export class NotificationService {
  async dispatchNotification(payload: {
    channels: ('email' | 'sms' | 'push')[];
    toEmail?: string;
    toPhone?: string;
    subject: string;
    message: string;
  }) {
    const results: Record<string, boolean> = {};

    if (payload.channels.includes('email') && payload.toEmail) {
      results.email = await sendEmail({
        to: payload.toEmail,
        subject: payload.subject,
        html: `<p>${payload.message}</p>`,
      });
    }

    if (payload.channels.includes('sms') && payload.toPhone) {
      logger.info(`[SMS DISPATCH MOCK] To: ${payload.toPhone} | Text: ${payload.message}`);
      results.sms = true;
    }

    if (payload.channels.includes('push')) {
      logger.info(`[PUSH NOTIFICATION MOCK] Subject: ${payload.subject} | Body: ${payload.message}`);
      results.push = true;
    }

    return results;
  }
}

export const notificationService = new NotificationService();
