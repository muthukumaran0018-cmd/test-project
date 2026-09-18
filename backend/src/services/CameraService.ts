import { cameraRepository } from '../repositories/CameraRepository.js';
import { AppError } from '../utils/AppError.js';

export class CameraService {
  async getAllCameras() {
    return cameraRepository.find();
  }

  async registerCamera(data: {
    deviceId?: string;
    name: string;
    type: 'builtin' | 'usb' | 'ip' | 'esp32' | 'rpi';
    streamUrl?: string;
  }) {
    const deviceId = data.deviceId || `CAM-${Math.floor(1000 + Math.random() * 9000)}`;
    const existing = await cameraRepository.findByDeviceId(deviceId);
    if (existing) throw new AppError('Camera device ID already registered', 400);

    return cameraRepository.create({
      deviceId,
      name: data.name,
      type: data.type,
      status: 'connected',
      signalStrength: 98,
      fps: 30,
      resolution: '1080p',
      health: 'Optimal',
      aiReady: true,
      isLiveStream: true,
      streamUrl: data.streamUrl || 'rtsp://192.168.1.100:554/live',
    });
  }

  async updateCameraStatus(deviceId: string, status: 'connected' | 'available' | 'disconnected', health: 'Optimal' | 'Fair' | 'Poor') {
    const updated = await cameraRepository.updateHealthStatus(deviceId, status, health);
    if (!updated) throw new AppError('Camera not found', 404);
    return updated;
  }
}

export const cameraService = new CameraService();
