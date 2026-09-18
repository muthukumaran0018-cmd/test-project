import mongoose, { Schema, Document } from 'mongoose';

export interface ITrip extends Document {
  _id: mongoose.Types.ObjectId;
  tripId: string;
  busNumber: string;
  operatorName: string;
  routeName: string;
  origin: string;
  destination: string;
  currentStop: string;
  nextStop: string;
  departureTime: Date;
  departureCountdownSeconds: number;
  totalSeats: number;
  occupiedSeats: number;
  weather: {
    temp: string;
    condition: string;
    humidity: string;
  };
  gpsStatus: {
    lat: number;
    lng: number;
    speed: string;
    signal: 'Strong' | 'Moderate' | 'Weak';
  };
  busHealthScore: number;
  cameraStatus: 'Active' | 'Warning' | 'Offline';
  aiStatus: 'Active (Multi-Layer)' | 'Calibrating' | 'Offline';
  qrStatus: 'Operational' | 'Offline';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    tripId: { type: String, required: true, unique: true, index: true },
    busNumber: { type: String, required: true },
    operatorName: { type: String, required: true },
    routeName: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    currentStop: { type: String, required: true },
    nextStop: { type: String, required: true },
    departureTime: { type: Date, required: true },
    departureCountdownSeconds: { type: Number, default: 0 },
    totalSeats: { type: Number, default: 20 },
    occupiedSeats: { type: Number, default: 0 },
    weather: {
      temp: { type: String, default: '28°C' },
      condition: { type: String, default: 'Clear' },
      humidity: { type: String, default: '65%' },
    },
    gpsStatus: {
      lat: { type: Number, default: 12.9716 },
      lng: { type: Number, default: 77.5946 },
      speed: { type: String, default: '65 km/h' },
      signal: { type: String, enum: ['Strong', 'Moderate', 'Weak'], default: 'Strong' },
    },
    busHealthScore: { type: Number, default: 98 },
    cameraStatus: { type: String, enum: ['Active', 'Warning', 'Offline'], default: 'Active' },
    aiStatus: { type: String, enum: ['Active (Multi-Layer)', 'Calibrating', 'Offline'], default: 'Active (Multi-Layer)' },
    qrStatus: { type: String, enum: ['Operational', 'Offline'], default: 'Operational' },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

TripSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  if (!(this as any)._conditions.includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

export const Trip = mongoose.model<ITrip>('Trip', TripSchema);
