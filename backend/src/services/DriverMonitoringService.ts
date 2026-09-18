import { alertRepository } from '../repositories/AlertRepository.js';
import { incidentRepository } from '../repositories/IncidentRepository.js';
import { sendEmail } from '../config/mailer.js';

export interface DriverStatePayload {
  tripId: string;
  status: 'ALERT' | 'DROWSY' | 'SLEEPING';
  eyeAspectRatio: number;
  headNodAngle: number;
  yawnCount: number;
  microsleepDurationSec: number;
  alarmActive: boolean;
}

export class DriverMonitoringService {
  async processDriverState(payload: DriverStatePayload) {
    let alertCreated = false;
    let incidentCreated = false;

    if (payload.status === 'DROWSY' || payload.status === 'SLEEPING' || payload.alarmActive) {
      const priority = payload.status === 'SLEEPING' ? 'CRITICAL' : 'HIGH';

      const alert = await alertRepository.create({
        tripId: payload.tripId as any,
        type: 'driver_drowsiness',
        title: `DRIVER ALERT: Drowsiness Detected (${payload.status})`,
        message: `Driver metric anomaly detected. EAR: ${payload.eyeAspectRatio.toFixed(2)}, Yawns: ${payload.yawnCount}, Microsleep: ${payload.microsleepDurationSec}s`,
        priority,
        resolved: false,
      });

      alertCreated = true;

      if (payload.status === 'SLEEPING' || payload.microsleepDurationSec > 3) {
        await incidentRepository.create({
          incidentId: `INC-${Math.floor(100000 + Math.random() * 900000)}`,
          title: `CRITICAL: Driver Drowsiness / Sleep Episode Detected`,
          category: 'DROWSINESS',
          severity: 'CRITICAL',
          description: `Automatic alarm escalated for trip ${payload.tripId}. Immediate driver contact required.`,
          tripId: payload.tripId as any,
          status: 'OPEN',
        });

        incidentCreated = true;

        // Dispatch emergency email notification to fleet operator
        await sendEmail({
          to: 'safety-operator@tripsecure.ai',
          subject: '🚨 CRITICAL SAFETY ALERT: Driver Drowsiness Escalation',
          html: `<h2>CRITICAL DROWSINESS ESCALATION</h2><p>Driver drowsiness alarm activated for Trip <strong>${payload.tripId}</strong>.</p><p>Microsleep duration: ${payload.microsleepDurationSec}s</p>`,
        });
      }

      return { processed: true, alertCreated, incidentCreated, alert };
    }

    return { processed: true, alertCreated: false, incidentCreated: false };
  }
}

export const driverMonitoringService = new DriverMonitoringService();
