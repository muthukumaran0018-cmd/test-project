import mongoose, { Schema, Document } from 'mongoose';
import { SeatStatus } from './Passenger.model.js';

export interface ISeat extends Document {
  _id: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  seatNumber: string; // e.g. 'L1' .. 'L10', 'U1' .. 'U10'
  berthType: 'Lower' | 'Upper';
  status: SeatStatus;
  passengerId?: mongoose.Types.ObjectId;
  lockedUntil?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SeatSchema = new Schema<ISeat>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    seatNumber: { type: String, required: true },
    berthType: { type: String, enum: ['Lower', 'Upper'], required: true },
    status: {
      type: String,
      enum: ['ON_BUS', 'OUTSIDE', 'BOARDING', 'VERIFICATION_PENDING', 'EMPTY'],
      default: 'EMPTY',
      index: true,
    },
    passengerId: { type: Schema.Types.ObjectId, ref: 'Passenger' },
    lockedUntil: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

SeatSchema.index({ tripId: 1, seatNumber: 1 }, { unique: true });

export const Seat = mongoose.model<ISeat>('Seat', SeatSchema);
