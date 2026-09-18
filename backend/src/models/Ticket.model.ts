import mongoose, { Schema, Document } from 'mongoose';

export type TicketStatus = 'ISSUED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  ticketCode: string;
  passengerId: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  seatNumber: string;
  price: number;
  status: TicketStatus;
  issuedAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    ticketCode: { type: String, required: true, unique: true, index: true },
    passengerId: { type: Schema.Types.ObjectId, ref: 'Passenger', required: true, index: true },
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    seatNumber: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['ISSUED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED'],
      default: 'ISSUED',
      index: true,
    },
    issuedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
