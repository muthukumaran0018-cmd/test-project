import { BaseRepository } from './BaseRepository.js';
import { Passenger, IPassenger, SeatStatus } from '../models/Passenger.model.js';

export class PassengerRepository extends BaseRepository<IPassenger> {
  constructor() {
    super(Passenger);
  }

  async findByTicketId(ticketId: string): Promise<IPassenger | null> {
    return this.model.findOne({ ticketId }).exec();
  }

  async findByTripId(tripId: string): Promise<IPassenger[]> {
    return this.model.find({ tripId }).exec();
  }

  async findBySeatNumber(tripId: string, seatNumber: string): Promise<IPassenger | null> {
    return this.model.findOne({ tripId, seatNumber }).exec();
  }

  async updateStatus(passengerId: string, status: SeatStatus): Promise<IPassenger | null> {
    return this.model.findByIdAndUpdate(passengerId, { status }, { new: true }).exec();
  }
}

export const passengerRepository = new PassengerRepository();
