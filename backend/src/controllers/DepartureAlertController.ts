import { Request, Response } from 'express';
import { departureAlertService } from '../services/DepartureAlertService.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export const checkDepartureReadiness = asyncWrapper(async (req: Request, res: Response) => {
  const { tripId } = req.params;
  const result = await departureAlertService.checkDepartureReadiness(tripId);
  return sendSuccess(res, 'Departure readiness checked', result);
});
