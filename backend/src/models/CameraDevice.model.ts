import mongoose, { Schema, Document } from 'mongoose';

export interface ICameraDevice extends Document {
  _id: mongoose.Types.ObjectId;
  deviceId: string;
  name: string;
  type: 'builtin' | 'usb' | 'ip' | 'esp32' | 'rpi';
  status: 'connected' | 'available' | 'disconnected';
  signalStrength: number;
  fps: number;
  resolution: string;
  health: 'Optimal' | 'Fair' | 'Poor';
  aiReady: boolean;
  isLiveStream: boolean;
  isRealDevice: boolean;
  tripId?: mongoose.Types.ObjectId;
  streamUrl?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CameraDeviceSchema = new Schema<ICameraDevice>(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['builtin', 'usb', 'ip', 'esp32', 'rpi'], required: true },
    status: { type: String, enum: ['connected', 'available', 'disconnected'], default: 'available', index: true },
    signalStrength: { type: Number, default: 95 },
    fps: { type: Number, default: 30 },
    resolution: { type: String, default: '1080p' },
    health: { type: String, enum: ['Optimal', 'Fair', 'Poor'], default: 'Optimal' },
    aiReady: { type: Boolean, default: true },
    isLiveStream: { type: Boolean, default: false },
    isRealDevice: { type: Boolean, default: true },
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
    streamUrl: { type: String },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const CameraDevice = mongoose.model<ICameraDevice>('CameraDevice', CameraDeviceSchema);
