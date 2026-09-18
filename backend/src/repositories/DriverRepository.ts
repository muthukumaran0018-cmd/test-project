import { BaseRepository } from './BaseRepository.js';
import { Driver, IDriver } from '../models/Driver.model.js';

export class DriverRepository extends BaseRepository<IDriver> {
  constructor() {
    super(Driver);
  }

  async findByUserId(userId: string): Promise<IDriver | null> {
    return this.model.findOne({ userId }).exec();
  }

  async findHighRiskDrivers(): Promise<IDriver[]> {
    return this.model.find({ riskStatus: 'HIGH_RISK' }).exec();
  }
}

export const driverRepository = new DriverRepository();
