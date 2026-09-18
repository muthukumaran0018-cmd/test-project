import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  licenseNumber: string;
  experienceYears: number;
  safetyScore: number; // 0 - 100
  totalMilesDriven: number;
  totalTripsCompleted: number;
  totalDrowsinessIncidents: number;
  riskStatus: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
  assignedBusNumber?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    licenseNumber: { type: String, required: true, unique: true, index: true },
    experienceYears: { type: Number, default: 5 },
    safetyScore: { type: Number, default: 100, index: true },
    totalMilesDriven: { type: Number, default: 0 },
    totalTripsCompleted: { type: Number, default: 0 },
    totalDrowsinessIncidents: { type: Number, default: 0 },
    riskStatus: {
      type: String,
      enum: ['LOW_RISK', 'MODERATE_RISK', 'HIGH_RISK'],
      default: 'LOW_RISK',
      index: true,
    },
    assignedBusNumber: { type: String },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const Driver = mongoose.model<IDriver>('Driver', DriverSchema);
