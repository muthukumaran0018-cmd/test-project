import { BaseRepository } from './BaseRepository.js';
import { AuditLog, IAuditLog } from '../models/AuditLog.model.js';

export class AuditLogRepository extends BaseRepository<IAuditLog> {
  constructor() {
    super(AuditLog);
  }

  async findLatestLogs(limit = 100): Promise<IAuditLog[]> {
    return this.model.find().sort({ timestamp: -1 }).limit(limit).exec();
  }
}

export const auditLogRepository = new AuditLogRepository();
