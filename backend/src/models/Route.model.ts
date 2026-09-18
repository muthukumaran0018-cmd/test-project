import mongoose, { Schema, Document } from 'mongoose';

export interface IRoute extends Document {
  _id: mongoose.Types.ObjectId;
  routeCode: string;
  routeName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedDurationHours: number;
  stops: {
    stopName: string;
    stopOrder: number;
    estimatedTimeFromOriginMinutes: number;
  }[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RouteSchema = new Schema<IRoute>(
  {
    routeCode: { type: String, required: true, unique: true, index: true },
    routeName: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    estimatedDurationHours: { type: Number, required: true },
    stops: [
      {
        stopName: { type: String, required: true },
        stopOrder: { type: Number, required: true },
        estimatedTimeFromOriginMinutes: { type: Number, required: true },
      },
    ],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const Route = mongoose.model<IRoute>('Route', RouteSchema);
