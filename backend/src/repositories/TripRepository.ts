import { BaseRepository } from './BaseRepository.js';
import { Trip, ITrip } from '../models/Trip.model.js';

export class TripRepository extends BaseRepository<ITrip> {
  constructor() {
    super(Trip);
  }

  async findByTripCustomId(tripId: string): Promise<ITrip | null> {
    return this.model.findOne({ tripId }).exec();
  }

  async updateOccupiedSeats(tripId: string, count: number): Promise<void> {
    await this.model.updateOne({ _id: tripId }, { occupiedSeats: count });
  }
}

export const tripRepository = new TripRepository();
