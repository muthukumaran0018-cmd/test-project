import { BaseRepository } from './BaseRepository.js';
import { Incident, IIncident } from '../models/Incident.model.js';

export class IncidentRepository extends BaseRepository<IIncident> {
  constructor() {
    super(Incident);
  }

  async findByStatus(status: string): Promise<IIncident[]> {
    return this.model.find({ status }).sort({ createdAt: -1 }).exec();
  }
}

export const incidentRepository = new IncidentRepository();
