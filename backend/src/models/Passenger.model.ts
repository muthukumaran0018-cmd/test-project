import mongoose, { Schema, Document } from 'mongoose';

export type SeatStatus = 'ON_BUS' | 'OUTSIDE' | 'BOARDING' | 'VERIFICATION_PENDING' | 'EMPTY';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'WARNING' | 'FAILED';

export interface IPassenger extends Document {
  _id: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seatNumber: string;
  berthType: 'Lower' | 'Upper';
  ticketId: string;
  qrCodeUrl: string;
  phone: string;
  status: SeatStatus;
  verificationStatus: VerificationStatus;
  photoUrl: string;
  biometricHash?: string;
  boardingTime?: Date;
  exitTime?: Date;
  returnTime?: Date;
  lastSeenLocation: string;
  tripHistory: {
    stopName: string;
    exitTime: Date;
    returnTime?: Date;
    onTime: boolean;
  }[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PassengerSchema = new Schema<IPassenger>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    seatNumber: { type: String, required: true, index: true },
    berthType: { type: String, enum: ['Lower', 'Upper'], required: true },
    ticketId: { type: String, required: true, unique: true, index: true },
    qrCodeUrl: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ['ON_BUS', 'OUTSIDE', 'BOARDING', 'VERIFICATION_PENDING', 'EMPTY'],
      default: 'BOARDING',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'PENDING', 'WARNING', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    photoUrl: { type: String, required: true },
    biometricHash: { type: String },
    boardingTime: { type: Date },
    exitTime: { type: Date },
    returnTime: { type: Date },
    lastSeenLocation: { type: String, default: 'Departure Terminal' },
    tripHistory: [
      {
        stopName: { type: String, required: true },
        exitTime: { type: Date, required: true },
        returnTime: { type: Date },
        onTime: { type: Boolean, default: true },
      },
    ],
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

PassengerSchema.index({ tripId: 1, seatNumber: 1 }, { unique: true });

PassengerSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  if (!(this as any)._conditions.includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

export const Passenger = mongoose.model<IPassenger>('Passenger', PassengerSchema);
