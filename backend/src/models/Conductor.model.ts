import mongoose, { Schema, Document } from 'mongoose';

export interface IConductor extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  badgeNumber: string;
  activeTripId?: mongoose.Types.ObjectId;
  totalVerificationsCompleted: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConductorSchema = new Schema<IConductor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    badgeNumber: { type: String, required: true, unique: true, index: true },
    activeTripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
    totalVerificationsCompleted: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const Conductor = mongoose.model<IConductor>('Conductor', ConductorSchema);
