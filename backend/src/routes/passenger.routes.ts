import { Router } from 'express';
import * as passengerController from '../controllers/PassengerController.js';
import * as seatController from '../controllers/SeatController.js';
import * as qrController from '../controllers/QRController.js';
import * as driverController from '../controllers/DriverMonitoringController.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { qrRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { createPassengerSchema, updatePassengerStatusSchema, validateQRSchema, driverStateSchema } from '../validations/passenger.validation.js';

const passengerRouter = Router();
passengerRouter.get('/', authenticate, passengerController.getPassengers);
passengerRouter.get('/:id', authenticate, passengerController.getPassengerById);
passengerRouter.post('/', authenticate, authorize('admin', 'operator', 'conductor'), validateRequest(createPassengerSchema), passengerController.createPassenger);
passengerRouter.patch('/:id/status', authenticate, authorize('admin', 'operator', 'conductor'), validateRequest(updatePassengerStatusSchema), passengerController.updatePassengerStatus);
passengerRouter.delete('/:id', authenticate, authorize('admin', 'operator'), passengerController.deletePassenger);

const seatRouter = Router();
seatRouter.get('/', authenticate, seatController.getSeats);
seatRouter.post('/lock', authenticate, seatController.lockSeat);
seatRouter.post('/unlock', authenticate, seatController.unlockSeat);
seatRouter.patch('/status', authenticate, authorize('admin', 'operator', 'conductor'), seatController.updateSeatStatus);

const qrRouter = Router();
qrRouter.post('/verify', qrRateLimiter, validateRequest(validateQRSchema), qrController.validateBoardingQR);

const driverRouter = Router();
driverRouter.post('/state', authenticate, validateRequest(driverStateSchema), driverController.processDriverState);

export { passengerRouter, seatRouter, qrRouter, driverRouter };
