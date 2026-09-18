import { BaseRepository } from './BaseRepository.js';
import { CameraDevice, ICameraDevice } from '../models/CameraDevice.model.js';

export class CameraRepository extends BaseRepository<ICameraDevice> {
  constructor() {
    super(CameraDevice);
  }

  async findByDeviceId(deviceId: string): Promise<ICameraDevice | null> {
    return this.model.findOne({ deviceId }).exec();
  }

  async updateHealthStatus(deviceId: string, status: 'connected' | 'available' | 'disconnected', health: 'Optimal' | 'Fair' | 'Poor'): Promise<ICameraDevice | null> {
    return this.model.findOneAndUpdate({ deviceId }, { status, health }, { new: true }).exec();
  }
}

export const cameraRepository = new CameraRepository();
