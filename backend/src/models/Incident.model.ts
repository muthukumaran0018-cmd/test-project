import mongoose, { Schema, Document } from 'mongoose';

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface IIncident extends Document {
  _id: mongoose.Types.ObjectId;
  incidentId: string;
  title: string;
  category: 'SECURITY' | 'DROWSINESS' | 'QR_FRAUD' | 'MISSING_PASSENGER' | 'SYSTEM';
  severity: IncidentSeverity;
  description: string;
  tripId?: mongoose.Types.ObjectId;
  passengerId?: mongoose.Types.ObjectId;
  status: IncidentStatus;
  assignedTo?: mongoose.Types.ObjectId;
  resolutionNotes?: string;
  resolvedAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>(
  {
    incidentId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['SECURITY', 'DROWSINESS', 'QR_FRAUD', 'MISSING_PASSENGER', 'SYSTEM'],
      required: true,
      index: true,
    },
    severity: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'HIGH', index: true },
    description: { type: String, required: true },
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
    passengerId: { type: Schema.Types.ObjectId, ref: 'Passenger' },
    status: { type: String, enum: ['OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'], default: 'OPEN', index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    resolutionNotes: { type: String },
    resolvedAt: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const Incident = mongoose.model<IIncident>('Incident', IncidentSchema);
