import mongoose, { Schema, Document } from 'mongoose';

export interface IQRVerification extends Document {
  _id: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  passengerId: mongoose.Types.ObjectId;
  scannedByUserId?: mongoose.Types.ObjectId;
  scanLocation: string;
  verificationStatus: 'SUCCESS' | 'FAILED_INVALID_QR' | 'FAILED_REPLAY_ATTEMPT' | 'FAILED_SEAT_MISMATCH';
  antiFraudPassed: boolean;
  timestamp: Date;
}

const QRVerificationSchema = new Schema<IQRVerification>(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true, index: true },
    passengerId: { type: Schema.Types.ObjectId, ref: 'Passenger', required: true, index: true },
    scannedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    scanLocation: { type: String, default: 'Bus Entrance Door' },
    verificationStatus: {
      type: String,
      enum: ['SUCCESS', 'FAILED_INVALID_QR', 'FAILED_REPLAY_ATTEMPT', 'FAILED_SEAT_MISMATCH'],
      required: true,
      index: true,
    },
    antiFraudPassed: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  }
);

export const QRVerification = mongoose.model<IQRVerification>('QRVerification', QRVerificationSchema);
