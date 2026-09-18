import { driverRepository } from '../repositories/DriverRepository.js';
import { DrowsinessEvent } from '../models/DrowsinessEvent.model.js';
import { safetyScoreQueue } from '../config/queue.js';
import { AppError } from '../utils/AppError.js';

export class DriverSafetyService {
  async recordDrowsinessTelemetry(data: {
    driverId: string;
    tripId: string;
    eyeAspectRatio: number;
    headNodAngle: number;
    yawnCount: number;
    microsleepDurationSec: number;
    vehicleSpeed?: string;
  }) {
    const severity = data.microsleepDurationSec > 3 ? 'EMERGENCY' : data.microsleepDurationSec > 1.5 ? 'CRITICAL' : 'WARNING';
    const alarmTriggered = severity !== 'WARNING';

    const event = new DrowsinessEvent({
      driverId: data.driverId,
      tripId: data.tripId,
      eyeAspectRatio: data.eyeAspectRatio,
      headNodAngle: data.headNodAngle,
      yawnCount: data.yawnCount,
      microsleepDurationSec: data.microsleepDurationSec,
      vehicleSpeed: data.vehicleSpeed || '65 km/h',
      severity,
      alarmTriggered,
      timestamp: new Date(),
    });
    await event.save();

    // Queue async background job to update driver safety score
    await safetyScoreQueue.add({
      driverId: data.driverId,
      microsleepSec: data.microsleepDurationSec,
      yawnCount: data.yawnCount,
    });

    return event;
  }

  async getDriverPerformance(driverId: string) {
    const driver = await driverRepository.findById(driverId);
    if (!driver) throw new AppError('Driver record not found', 404);

    const recentEvents = await DrowsinessEvent.find({ driverId }).sort({ timestamp: -1 }).limit(20).exec();

    return {
      driver,
      performance: {
        safetyScore: driver.safetyScore,
        riskStatus: driver.riskStatus,
        totalTrips: driver.totalTripsCompleted,
        totalDrowsinessIncidents: driver.totalDrowsinessIncidents,
      },
      recentEvents,
    };
  }
}

export const driverSafetyService = new DriverSafetyService();
