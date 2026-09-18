import Bull, { Job } from 'bull';
import { env } from './env.js';
import { logger } from './logger.js';
import { sendEmail } from './mailer.js';
import { Driver } from '../models/Driver.model.js';

export const notificationQueue = new Bull('notification-queue', env.REDIS_URL, {
  redis: {
    maxRetriesPerRequest: 3,
  },
});

export const safetyScoreQueue = new Bull('safety-score-queue', env.REDIS_URL, {
  redis: {
    maxRetriesPerRequest: 3,
  },
});

// Process Notification Queue Jobs
notificationQueue.process(async (job: Job) => {
  const { type, toEmail, subject, message } = job.data;
  logger.info(`[BULL QUEUE] Processing ${type} notification job #${job.id}`);

  if (type === 'EMAIL' && toEmail) {
    await sendEmail({ to: toEmail, subject, html: `<p>${message}</p>` });
  } else {
    logger.info(`[BULL QUEUE] Dispatched ${type} job payload: ${message}`);
  }
  return { status: 'COMPLETED', timestamp: new Date() };
});

// Process Driver Safety Score Jobs
safetyScoreQueue.process(async (job: Job) => {
  const { driverId, microsleepSec, yawnCount } = job.data;
  logger.info(`[BULL QUEUE] Recalculating Driver Safety Score for driver ${driverId}`);

  const driver = await Driver.findById(driverId);
  if (driver) {
    driver.totalDrowsinessIncidents += 1;
    // Safety score reduction formula
    const penalty = 5 + microsleepSec * 2.5 + yawnCount * 1.5;
    driver.safetyScore = Math.max(0, Math.round(driver.safetyScore - penalty));

    if (driver.safetyScore < 60) {
      driver.riskStatus = 'HIGH_RISK';
    } else if (driver.safetyScore < 85) {
      driver.riskStatus = 'MODERATE_RISK';
    }

    await driver.save();
    logger.info(`✅ Updated Driver ${driverId} Safety Score: ${driver.safetyScore} (${driver.riskStatus})`);
  }
  return { status: 'UPDATED' };
});

notificationQueue.on('failed', (job: Job, err: Error) => {
  logger.error(`❌ Notification job #${job.id} failed:`, err);
});

safetyScoreQueue.on('failed', (job: Job, err: Error) => {
  logger.error(`❌ Safety score job #${job.id} failed:`, err);
});
