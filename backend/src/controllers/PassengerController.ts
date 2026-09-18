import { Request, Response } from 'express';
import { passengerService } from '../services/PassengerService.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { emitSeatUpdate, emitBoardingEvent } from '../sockets/index.js';

export const getPassengers = asyncWrapper(async (req: Request, res: Response) => {
  const { tripId } = req.query;
  const passengers = await passengerService.getAllPassengers(tripId as string);
  return sendSuccess(res, 'Passengers retrieved successfully', passengers);
});

export const getPassengerById = asyncWrapper(async (req: Request, res: Response) => {
  const passenger = await passengerService.getPassengerById(req.params.id);
  return sendSuccess(res, 'Passenger retrieved', passenger);
});

export const createPassenger = asyncWrapper(async (req: Request, res: Response) => {
  const passenger = await passengerService.createPassenger(req.body);

  // Emit Socket Event for real-time seat update
  emitSeatUpdate(passenger.tripId.toString(), passenger.seatNumber, passenger.status);

  return sendSuccess(res, 'Passenger check-in created successfully', passenger, 201);
});

export const updatePassengerStatus = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const passenger = await passengerService.updatePassengerStatus(id, status);

  // Emit real-time updates
  emitSeatUpdate(passenger.tripId.toString(), passenger.seatNumber, passenger.status);
  emitBoardingEvent(passenger.tripId.toString(), {
    id: `EV-${Date.now()}`,
    timestamp: new Date().toISOString(),
    seatNumber: passenger.seatNumber,
    passengerName: passenger.name,
    action: status === 'ON_BUS' ? 'boarded' : 'exited',
    details: `Passenger status changed to ${status}`,
    type: status === 'ON_BUS' ? 'success' : 'warning',
  });

  return sendSuccess(res, 'Passenger status updated', passenger);
});

export const deletePassenger = asyncWrapper(async (req: Request, res: Response) => {
  await passengerService.deletePassenger(req.params.id);
  return sendSuccess(res, 'Passenger record deleted');
});
