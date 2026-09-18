import { Request, Response } from 'express';
import { cameraService } from '../services/CameraService.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { emitCameraHealthUpdate } from '../sockets/index.js';

export const getCameras = asyncWrapper(async (req: Request, res: Response) => {
  const cameras = await cameraService.getAllCameras();
  return sendSuccess(res, 'Camera list retrieved', cameras);
});

export const registerCamera = asyncWrapper(async (req: Request, res: Response) => {
  const camera = await cameraService.registerCamera(req.body);
  emitCameraHealthUpdate(camera.deviceId, camera.status, camera.health);
  return sendSuccess(res, 'Camera device registered successfully', camera, 201);
});

export const updateCameraStatus = asyncWrapper(async (req: Request, res: Response) => {
  const { deviceId, status, health } = req.body;
  const camera = await cameraService.updateCameraStatus(deviceId, status, health);
  emitCameraHealthUpdate(deviceId, status, health);
  return sendSuccess(res, 'Camera health status updated', camera);
});
