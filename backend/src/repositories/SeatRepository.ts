import { BaseRepository } from './BaseRepository.js';
import { Seat, ISeat } from '../models/Seat.model.js';

export class SeatRepository extends BaseRepository<ISeat> {
  constructor() {
    super(Seat);
  }

  async findByTripId(tripId: string): Promise<ISeat[]> {
    return this.model.find({ tripId }).exec();
  }

  async updateSeatStatus(tripId: string, seatNumber: string, status: any): Promise<ISeat | null> {
    return this.model.findOneAndUpdate({ tripId, seatNumber }, { status }, { new: true }).exec();
  }
}

export const seatRepository = new SeatRepository();
