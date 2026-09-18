import { BaseRepository } from './BaseRepository.js';
import { SmartAlert, ISmartAlert } from '../models/SmartAlert.model.js';
import { Incident, IIncident } from '../models/Incident.model.js';
import { AuditLog, IAuditLog } from '../models/AuditLog.model.js';

export class AlertRepository extends BaseRepository<ISmartAlert> {
  constructor() {
    super(SmartAlert);
  }

  async findUnresolvedAlerts(): Promise<ISmartAlert[]> {
    return this.model.find({ resolved: false }).sort({ createdAt: -1 }).exec();
  }
}

export class IncidentRepository extends BaseRepository<IIncident> {
  constructor() {
    super(Incident);
  }

  async findByStatus(status: string): Promise<IIncident[]> {
    return this.model.find({ status }).sort({ createdAt: -1 }).exec();
  }
}

export class AuditLogRepository extends BaseRepository<IAuditLog> {
  constructor() {
    super(AuditLog);
  }

  async findLatestLogs(limit = 100): Promise<IAuditLog[]> {
    return this.model.find().sort({ timestamp: -1 }).limit(limit).exec();
  }
}

export const alertRepository = new AlertRepository();
export const incidentRepository = new IncidentRepository();
export const auditLogRepository = new AuditLogRepository();
