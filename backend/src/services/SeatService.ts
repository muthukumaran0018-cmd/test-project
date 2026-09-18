import { seatRepository } from '../repositories/SeatRepository.js';
import { passengerRepository } from '../repositories/PassengerRepository.js';
import { redisCache } from '../config/redis.js';
import { AppError } from '../utils/AppError.js';
import { SeatStatus } from '../models/Passenger.model.js';

export class SeatService {
  async getSeatsByTrip(tripId: string) {
    const cachedSeats = await redisCache.get(`seats:${tripId}`);
    if (cachedSeats) {
      return JSON.parse(cachedSeats);
    }

    const seats = await seatRepository.findByTripId(tripId);
    await redisCache.set(`seats:${tripId}`, JSON.stringify(seats), 60); // cache for 1 min
    return seats;
  }

  async lockSeat(tripId: string, seatNumber: string, userId: string) {
    const lockKey = `lock:seat:${tripId}:${seatNumber}`;
    const acquired = await redisCache.acquireLock(lockKey, 300); // 5 min lock
    if (!acquired) {
      throw new AppError(`Seat ${seatNumber} is currently locked by another transaction`, 409);
    }
    return { success: true, lockKey, seatNumber };
  }

  async unlockSeat(tripId: string, seatNumber: string) {
    const lockKey = `lock:seat:${tripId}:${seatNumber}`;
    await redisCache.releaseLock(lockKey);
    return true;
  }

  async updateSeatAllocation(tripId: string, seatNumber: string, status: SeatStatus) {
    const updated = await seatRepository.updateSeatStatus(tripId, seatNumber, status);
    await redisCache.del(`seats:${tripId}`);
    return updated;
  }
}

export const seatService = new SeatService();
