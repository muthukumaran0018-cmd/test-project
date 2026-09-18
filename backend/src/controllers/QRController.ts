import { Request, Response } from 'express';
import { qrService } from '../services/QRService.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { emitBoardingEvent, emitSeatUpdate } from '../sockets/index.js';

export const validateBoardingQR = asyncWrapper(async (req: Request, res: Response) => {
  const { qrPayload } = req.body;
  const result = await qrService.validateBoardingQR(qrPayload);

  // Broadcast real-time Socket events
  emitSeatUpdate('TRIP-101', result.seatNumber, 'ON_BUS');
  emitBoardingEvent('TRIP-101', {
    id: `EV-${Date.now()}`,
    timestamp: new Date().toISOString(),
    seatNumber: result.seatNumber,
    passengerName: result.passengerName,
    action: 'scanned_qr',
    details: `Boarding verified via encrypted QR Code`,
    type: 'success',
  });

  return sendSuccess(res, 'Boarding QR Code verified successfully', result);
});
