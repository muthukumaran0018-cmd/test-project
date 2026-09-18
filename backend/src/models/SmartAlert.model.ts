import mongoose, { Schema, Document } from 'mongoose';

export type AlertType = 'missing_passenger' | 'unknown_person' | 'camera_disconnected' | 'verification_pending' | 'departure_blocked' | 'driver_drowsiness';
export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export interface ISmartAlert extends Document {
  _id: mongoose.Types.ObjectId;
  tripId?: mongoose.Types.ObjectId;
  type: AlertType;
  title: string;
  message: string;
  seatNumber?: string;
  passengerName?: string;
  priority: PriorityLevel;
  resolved: boolean;
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SmartAlertSchema = new Schema<ISmartAlert>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', index: true },
    type: {
      type: String,
      enum: ['missing_passenger', 'unknown_person', 'camera_disconnected', 'verification_pending', 'departure_blocked', 'driver_drowsiness'],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    seatNumber: { type: String },
    passengerName: { type: String },
    priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'], default: 'HIGH', index: true },
    resolved: { type: Boolean, default: false, index: true },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const SmartAlert = mongoose.model<ISmartAlert>('SmartAlert', SmartAlertSchema);
