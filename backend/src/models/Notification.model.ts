import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'SYSTEM';
  read: boolean;
  timestamp: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['EMAIL', 'SMS', 'PUSH', 'SYSTEM'], default: 'SYSTEM', index: true },
    read: { type: Boolean, default: false, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
