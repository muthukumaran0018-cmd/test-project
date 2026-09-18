import { passengerRepository } from '../repositories/PassengerRepository.js';
import { seatRepository } from '../repositories/SeatRepository.js';
import { tripRepository } from '../repositories/TripRepository.js';
import { generateEncryptedQRPayload, generateQRCodeDataUrl } from '../utils/qr.utils.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { AppError } from '../utils/AppError.js';
import { SeatStatus } from '../models/Passenger.model.js';

export class PassengerService {
  async getAllPassengers(tripId?: string) {
    if (tripId) {
      return passengerRepository.findByTripId(tripId);
    }
    return passengerRepository.find();
  }

  async getPassengerById(id: string) {
    const passenger = await passengerRepository.findById(id);
    if (!passenger) throw new AppError('Passenger not found', 404);
    return passenger;
  }

  async createPassenger(data: {
    tripId: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    seatNumber: string;
    berthType: 'Lower' | 'Upper';
    phone: string;
    photoBase64?: string;
  }) {
    const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;

    const existingSeat = await passengerRepository.findBySeatNumber(data.tripId, data.seatNumber);
    if (existingSeat) {
      throw new AppError(`Seat ${data.seatNumber} is already allocated on this trip`, 400);
    }

    let photoUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    if (data.photoBase64) {
      photoUrl = await uploadToCloudinary(data.photoBase64, 'passengers');
    }

    const encryptedPayload = generateEncryptedQRPayload({
      ticketId,
      passengerId: '',
      seatNumber: data.seatNumber,
      tripId: data.tripId,
      timestamp: Date.now(),
    });

    const qrCodeUrl = await generateQRCodeDataUrl(encryptedPayload);

    const passenger = await passengerRepository.create({
      tripId: data.tripId as any,
      name: data.name,
      age: data.age,
      gender: data.gender,
      seatNumber: data.seatNumber,
      berthType: data.berthType,
      ticketId,
      qrCodeUrl,
      phone: data.phone,
      photoUrl,
      status: 'BOARDING',
      verificationStatus: 'PENDING',
      lastSeenLocation: 'Check-in Counter',
    });

    // Update Seat Status
    await seatRepository.updateSeatStatus(data.tripId, data.seatNumber, 'BOARDING');

    return passenger;
  }

  async updatePassengerStatus(passengerId: string, status: SeatStatus) {
    const passenger = await passengerRepository.findById(passengerId);
    if (!passenger) throw new AppError('Passenger not found', 404);

    passenger.status = status;
    if (status === 'ON_BUS') {
      passenger.verificationStatus = 'VERIFIED';
      passenger.boardingTime = new Date();
    } else if (status === 'OUTSIDE') {
      passenger.exitTime = new Date();
    }
    await passenger.save();

    await seatRepository.updateSeatStatus(passenger.tripId.toString(), passenger.seatNumber, status);
    return passenger;
  }

  async deletePassenger(passengerId: string) {
    const passenger = await passengerRepository.findById(passengerId);
    if (!passenger) throw new AppError('Passenger not found', 404);

    await passengerRepository.softDelete(passengerId);
    await seatRepository.updateSeatStatus(passenger.tripId.toString(), passenger.seatNumber, 'EMPTY');
    return true;
  }
}

export const passengerService = new PassengerService();
