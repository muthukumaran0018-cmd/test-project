import { Request, Response } from 'express';
import { driverMonitoringService } from '../services/DriverMonitoringService.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { emitDriverDrowsinessAlert } from '../sockets/index.js';

export const processDriverState = asyncWrapper(async (req: Request, res: Response) => {
  const result = await driverMonitoringService.processDriverState(req.body);

  if (result.alertCreated) {
    emitDriverDrowsinessAlert(req.body.tripId || 'TRIP-101', {
      status: req.body.status,
      eyeAspectRatio: req.body.eyeAspectRatio,
      headNodAngle: req.body.headNodAngle,
      yawnCount: req.body.yawnCount,
      microsleepDurationSec: req.body.microsleepDurationSec,
      alarmActive: req.body.alarmActive,
    });
  }

  return sendSuccess(res, 'Driver state processed', result);
});
