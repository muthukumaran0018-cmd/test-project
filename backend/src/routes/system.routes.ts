import { Router } from 'express';
import * as userController from '../controllers/UserController.js';
import * as cameraController from '../controllers/CameraController.js';
import * as timelineController from '../controllers/TimelineController.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';

const userRouter = Router();
userRouter.get('/profile', authenticate, userController.getProfile);
userRouter.get('/', authenticate, authorize('admin', 'operator'), userController.getUsers);
userRouter.patch('/role', authenticate, authorize('admin'), userController.updateUserRole);

const cameraRouter = Router();
cameraRouter.get('/', authenticate, cameraController.getCameras);
cameraRouter.post('/', authenticate, authorize('admin', 'operator'), cameraController.registerCamera);
cameraRouter.patch('/status', authenticate, cameraController.updateCameraStatus);

const timelineRouter = Router();
timelineRouter.get('/', authenticate, timelineController.getTimelineEvents);

const notificationRouter = Router();
notificationRouter.post('/dispatch', authenticate, timelineController.sendNotification);

const analyticsRouter = Router();
analyticsRouter.get('/dashboard', authenticate, timelineController.getDashboardAnalytics);

const incidentRouter = Router();
incidentRouter.get('/', authenticate, timelineController.getIncidents);
incidentRouter.post('/', authenticate, timelineController.createIncident);
incidentRouter.patch('/:id/resolve', authenticate, timelineController.resolveIncident);

const auditRouter = Router();
auditRouter.get('/', authenticate, authorize('admin'), timelineController.getAuditLogs);

export { userRouter, cameraRouter, timelineRouter, notificationRouter, analyticsRouter, incidentRouter, auditRouter };
