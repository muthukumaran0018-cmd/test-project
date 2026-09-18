import { passengerRepository } from '../repositories/PassengerRepository.js';
import { seatRepository } from '../repositories/SeatRepository.js';
import { decryptQRPayload } from '../utils/qr.utils.js';
import { redisCache } from '../config/redis.js';
import { AppError } from '../utils/AppError.js';

export class QRService {
  async validateBoardingQR(qrDataHex: string) {
    // Decrypt QR payload
    const payload = decryptQRPayload(qrDataHex);

    // Anti-fraud check: Prevents replay attacks (must not be reused within 60s)
    const scannedKey = `scanned_qr:${payload.ticketId}:${payload.timestamp}`;
    const alreadyScanned = await redisCache.get(scannedKey);
    if (alreadyScanned) {
      throw new AppError('Anti-Fraud Warning: This QR Code ticket was already scanned recently!', 400);
    }
    await redisCache.set(scannedKey, 'true', 300);

    const passenger = await passengerRepository.findByTicketId(payload.ticketId);
    if (!passenger) {
      throw new AppError('Passenger ticket not found in system database', 444);
    }

    // Update boarding verification status
    passenger.status = 'ON_BUS';
    passenger.verificationStatus = 'VERIFIED';
    passenger.boardingTime = new Date();
    await passenger.save();

    await seatRepository.updateSeatStatus(passenger.tripId.toString(), passenger.seatNumber, 'ON_BUS');

    return {
      verified: true,
      ticketId: passenger.ticketId,
      passengerName: passenger.name,
      seatNumber: passenger.seatNumber,
      status: passenger.status,
      verificationStatus: passenger.verificationStatus,
      scannedAt: new Date(),
    };
  }
}

export const qrService = new QRService();
