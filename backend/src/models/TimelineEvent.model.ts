import mongoose, { Schema, Document } from 'mongoose';

export type TimelineAction = 'boarded' | 'exited' | 'returned' | 'scanned_qr' | 'ai_detected' | 'alert_triggered';
export type TimelineType = 'success' | 'warning' | 'info' | 'danger';

export interface ITimelineEvent extends Document {
  _id: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  seatNumber: string;
  passengerName: string;
  action: TimelineAction;
  details: string;
  type: TimelineType;
  timestamp: Date;
  isDeleted: boolean;
  createdAt: Date;
}

const TimelineEventSchema = new Schema<ITimelineEvent>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    seatNumber: { type: String, required: true },
    passengerName: { type: String, required: true },
    action: {
      type: String,
      enum: ['boarded', 'exited', 'returned', 'scanned_qr', 'ai_detected', 'alert_triggered'],
      required: true,
      index: true,
    },
    details: { type: String, required: true },
    type: { type: String, enum: ['success', 'warning', 'info', 'danger'], default: 'info' },
    timestamp: { type: Date, default: Date.now, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const TimelineEvent = mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);
