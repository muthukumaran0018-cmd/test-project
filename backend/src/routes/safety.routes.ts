import { Router } from 'express';
import * as driverSafetyController from '../controllers/DriverSafetyController.js';
import * as departureAlertController from '../controllers/DepartureAlertController.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';

const safetyRouter = Router();

safetyRouter.post('/telemetry', authenticate, driverSafetyController.recordTelemetry);
safetyRouter.get('/driver/:driverId/performance', authenticate, driverSafetyController.getDriverPerformance);
safetyRouter.get('/departure-readiness/:tripId', authenticate, authorize('admin', 'operator', 'conductor', 'driver'), departureAlertController.checkDepartureReadiness);

export default safetyRouter;
