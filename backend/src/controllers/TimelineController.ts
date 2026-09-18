import { Request, Response } from 'express';
import { timelineService } from '../services/TimelineService.js';
import { notificationService } from '../services/NotificationService.js';
import { analyticsService } from '../services/AnalyticsService.js';
import { incidentService, auditService } from '../services/IncidentService.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const getTimelineEvents = asyncWrapper(async (req: Request, res: Response) => {
  const { tripId } = req.query;
  const events = await timelineService.getEventsByTrip((tripId as string) || 'TRIP-101');
  return sendSuccess(res, 'Timeline events retrieved', events);
});

export const sendNotification = asyncWrapper(async (req: Request, res: Response) => {
  const result = await notificationService.dispatchNotification(req.body);
  return sendSuccess(res, 'Notification dispatched', result);
});

export const getDashboardAnalytics = asyncWrapper(async (req: Request, res: Response) => {
  const analytics = await analyticsService.getDashboardAnalytics();
  return sendSuccess(res, 'Dashboard analytics retrieved', analytics);
});

export const getIncidents = asyncWrapper(async (req: Request, res: Response) => {
  const incidents = await incidentService.getAllIncidents();
  return sendSuccess(res, 'Incidents retrieved', incidents);
});

export const createIncident = asyncWrapper(async (req: Request, res: Response) => {
  const incident = await incidentService.createIncident(req.body);
  return sendSuccess(res, 'Incident created successfully', incident, 201);
});

export const resolveIncident = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  const incident = await incidentService.resolveIncident(id, notes, req.user?.userId);
  return sendSuccess(res, 'Incident resolved', incident);
});

export const getAuditLogs = asyncWrapper(async (req: Request, res: Response) => {
  const logs = await auditService.getLogs();
  return sendSuccess(res, 'Audit logs retrieved', logs);
});
