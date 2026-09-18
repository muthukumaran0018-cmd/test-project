import { z } from 'zod';

export const createPassengerSchema = z.object({
  body: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    name: z.string().min(2, 'Passenger name is required'),
    age: z.number().min(1).max(120),
    gender: z.enum(['Male', 'Female', 'Other']),
    seatNumber: z.string().min(1),
    berthType: z.enum(['Lower', 'Upper']),
    phone: z.string().min(5),
    photoBase64: z.string().optional(),
  }),
});

export const updatePassengerStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(['ON_BUS', 'OUTSIDE', 'BOARDING', 'VERIFICATION_PENDING', 'EMPTY']),
  }),
});

export const validateQRSchema = z.object({
  body: z.object({
    qrPayload: z.string().min(1, 'QR payload required'),
  }),
});

export const driverStateSchema = z.object({
  body: z.object({
    tripId: z.string().min(1),
    status: z.enum(['ALERT', 'DROWSY', 'SLEEPING']),
    eyeAspectRatio: z.number(),
    headNodAngle: z.number(),
    yawnCount: z.number(),
    microsleepDurationSec: z.number(),
    alarmActive: z.boolean(),
  }),
});
