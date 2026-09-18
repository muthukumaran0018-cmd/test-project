import { Request, Response } from 'express';
import { driverSafetyService } from '../services/DriverSafetyService.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export const recordTelemetry = asyncWrapper(async (req: Request, res: Response) => {
  const event = await driverSafetyService.recordDrowsinessTelemetry(req.body);
  return sendSuccess(res, 'Telemetry recorded and safety score job queued', event, 201);
});

export const getDriverPerformance = asyncWrapper(async (req: Request, res: Response) => {
  const { driverId } = req.params;
  const performance = await driverSafetyService.getDriverPerformance(driverId);
  return sendSuccess(res, 'Driver performance analytics retrieved', performance);
});
