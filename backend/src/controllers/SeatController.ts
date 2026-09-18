import { Request, Response } from 'express';
import { seatService } from '../services/SeatService.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { emitSeatUpdate } from '../sockets/index.js';

export const getSeats = asyncWrapper(async (req: Request, res: Response) => {
  const { tripId } = req.query;
  const seats = await seatService.getSeatsByTrip((tripId as string) || 'TRIP-101');
  return sendSuccess(res, 'Seats layout retrieved', seats);
});

export const lockSeat = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  const { tripId, seatNumber } = req.body;
  const result = await seatService.lockSeat(tripId, seatNumber, req.user!.userId);
  return sendSuccess(res, 'Seat locked successfully', result);
});

export const unlockSeat = asyncWrapper(async (req: Request, res: Response) => {
  const { tripId, seatNumber } = req.body;
  await seatService.unlockSeat(tripId, seatNumber);
  return sendSuccess(res, 'Seat unlocked');
});

export const updateSeatStatus = asyncWrapper(async (req: Request, res: Response) => {
  const { tripId, seatNumber, status } = req.body;
  const updated = await seatService.updateSeatAllocation(tripId, seatNumber, status);
  emitSeatUpdate(tripId, seatNumber, status);
  return sendSuccess(res, 'Seat status updated', updated);
});
