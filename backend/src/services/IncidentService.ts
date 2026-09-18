import { incidentRepository } from '../repositories/AlertRepository.js';
import { auditLogRepository } from '../repositories/AlertRepository.js';
import { AppError } from '../utils/AppError.js';

export class IncidentService {
  async getAllIncidents() {
    return incidentRepository.find();
  }

  async createIncident(data: {
    title: string;
    category: 'SECURITY' | 'DROWSINESS' | 'QR_FRAUD' | 'MISSING_PASSENGER' | 'SYSTEM';
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    tripId?: string;
  }) {
    const incidentId = `INC-${Math.floor(100000 + Math.random() * 900000)}`;

    return incidentRepository.create({
      incidentId,
      title: data.title,
      category: data.category,
      severity: data.severity,
      description: data.description,
      tripId: data.tripId as any,
      status: 'OPEN',
    });
  }

  async resolveIncident(id: string, notes: string, resolvedByUserId?: string) {
    const incident = await incidentRepository.findById(id);
    if (!incident) throw new AppError('Incident not found', 404);

    incident.status = 'RESOLVED';
    incident.resolutionNotes = notes;
    incident.resolvedAt = new Date();
    if (resolvedByUserId) {
      incident.assignedTo = resolvedByUserId as any;
    }
    return await incident.save();
  }
}

export class AuditService {
  async logAction(data: {
    userId?: string;
    userEmail?: string;
    userRole?: string;
    action: string;
    entity: string;
    entityId?: string;
    ipAddress?: string;
    userAgent?: string;
    changes?: Record<string, any>;
  }) {
    return auditLogRepository.create({
      userId: data.userId as any,
      userEmail: data.userEmail,
      userRole: data.userRole,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      changes: data.changes,
      timestamp: new Date(),
    });
  }

  async getLogs(limit = 100) {
    return auditLogRepository.findLatestLogs(limit);
  }
}

export const incidentService = new IncidentService();
export const auditService = new AuditService();
