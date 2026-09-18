import { Router } from 'express';
import authRoutes from './auth.routes.js';
import safetyRoutes from './safety.routes.js';
import { passengerRouter, seatRouter, qrRouter, driverRouter } from './passenger.routes.js';
import { userRouter, cameraRouter, timelineRouter, notificationRouter, analyticsRouter, incidentRouter, auditRouter } from './system.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRouter);
router.use('/passengers', passengerRouter);
router.use('/seats', seatRouter);
router.use('/qr', qrRouter);
router.use('/driver', driverRouter);
router.use('/safety', safetyRoutes);
router.use('/cameras', cameraRouter);
router.use('/timeline', timelineRouter);
router.use('/notifications', notificationRouter);
router.use('/analytics', analyticsRouter);
router.use('/incidents', incidentRouter);
router.use('/audit', auditRouter);

export default router;
