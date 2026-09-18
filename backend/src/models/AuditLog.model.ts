import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, any>;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    userEmail: { type: String },
    userRole: { type: String },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    changes: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
