import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/token.utils.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

let io: Server | null = null;

export const initializeSocketIO = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Socket Authentication Middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      logger.info('🔌 Socket connected in guest mode (read-only feeds)');
      return next();
    }
    try {
      const decoded = verifyAccessToken(token);
      (socket as any).user = decoded;
      next();
    } catch {
      logger.warn('⚠️ Socket auth failed. Proceeding with anonymous channel.');
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`⚡ Socket Client Connected: ${socket.id}`);

    socket.on('join_trip', (tripId: string) => {
      socket.join(`trip:${tripId}`);
      logger.info(`Socket ${socket.id} joined room trip:${tripId}`);
    });

    socket.on('leave_trip', (tripId: string) => {
      socket.leave(`trip:${tripId}`);
    });

    socket.on('disconnect', (reason) => {
      logger.info(`🔌 Socket Client Disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

// Real-Time Event Dispatchers
export const emitSeatUpdate = (tripId: string, seatNumber: string, status: string) => {
  if (!io) return;
  io.to(`trip:${tripId}`).emit('seat_updated', { tripId, seatNumber, status, timestamp: new Date() });
  io.emit('seat_updated', { tripId, seatNumber, status, timestamp: new Date() });
};

export const emitDriverDrowsinessAlert = (tripId: string, payload: any) => {
  if (!io) return;
  io.to(`trip:${tripId}`).emit('driver_drowsiness_alert', payload);
  io.emit('driver_drowsiness_alert', payload);
};

export const emitCameraHealthUpdate = (deviceId: string, status: string, health: string) => {
  if (!io) return;
  io.emit('camera_health_updated', { deviceId, status, health, timestamp: new Date() });
};

export const emitBoardingEvent = (tripId: string, event: any) => {
  if (!io) return;
  io.to(`trip:${tripId}`).emit('boarding_timeline_event', event);
  io.emit('boarding_timeline_event', event);
};
