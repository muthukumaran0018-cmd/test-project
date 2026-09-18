import mongoose, { Schema, Document } from 'mongoose';

export interface IDrowsinessEvent extends Document {
  _id: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  eyeAspectRatio: number;
  headNodAngle: number;
  yawnCount: number;
  microsleepDurationSec: number;
  vehicleSpeed: string;
  severity: 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  alarmTriggered: boolean;
  timestamp: Date;
}

const DrowsinessEventSchema = new Schema<IDrowsinessEvent>(
  {
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true, index: true },
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    eyeAspectRatio: { type: Number, required: true },
    headNodAngle: { type: Number, default: 0 },
    yawnCount: { type: Number, default: 0 },
    microsleepDurationSec: { type: Number, default: 0 },
    vehicleSpeed: { type: String, default: '65 km/h' },
    severity: { type: String, enum: ['WARNING', 'CRITICAL', 'EMERGENCY'], default: 'WARNING', index: true },
    alarmTriggered: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  }
);

export const DrowsinessEvent = mongoose.model<IDrowsinessEvent>('DrowsinessEvent', DrowsinessEventSchema);
