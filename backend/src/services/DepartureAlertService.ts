import { passengerRepository } from '../repositories/PassengerRepository.js';
import { tripRepository } from '../repositories/TripRepository.js';
import { alertRepository } from '../repositories/AlertRepository.js';
import { notificationQueue } from '../config/queue.js';
import { AppError } from '../utils/AppError.js';

export class DepartureAlertService {
  async checkDepartureReadiness(tripId: string) {
    const trip = await tripRepository.findByTripCustomId(tripId);
    if (!trip) throw new AppError('Trip not found', 404);

    const missingPassengers = await passengerRepository.find({
      tripId: trip._id as any,
      status: { $in: ['OUTSIDE', 'BOARDING', 'VERIFICATION_PENDING'] },
    });

    const isDepartureBlocked = missingPassengers.length > 0;

    if (isDepartureBlocked) {
      // Trigger Departure Alert
      await alertRepository.create({
        tripId: trip._id as any,
        type: 'departure_blocked',
        title: `DEPARTURE BLOCKED: ${missingPassengers.length} Passengers Missing`,
        message: `Bus departure held for trip ${tripId}. Unboarded passengers: ${missingPassengers.map((p) => p.name).join(', ')}`,
        priority: 'CRITICAL',
        resolved: false,
      });

      // Enqueue background email notifications to missing passengers
      for (const passenger of missingPassengers) {
        await notificationQueue.add({
          type: 'EMAIL',
          toEmail: 'passenger-alert@tripsecure.ai',
          subject: '⚠️ FINAL BOARDING CALL - TripSecure AI',
          message: `Dear ${passenger.name}, your bus ${trip.busNumber} is preparing to depart from ${trip.currentStop}. Please proceed to seat ${passenger.seatNumber} immediately.`,
        });
      }
    }

    return {
      tripId,
      canDepart: !isDepartureBlocked,
      missingCount: missingPassengers.length,
      missingPassengers: missingPassengers.map((p) => ({ name: p.name, seatNumber: p.seatNumber, phone: p.phone, status: p.status })),
    };
  }
}

export const departureAlertService = new DepartureAlertService();
