import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketClientManager {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return this.socket;

    const token = localStorage.getItem('accessToken');

    this.socket = io(SOCKET_SERVER_URL, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('⚡ Real-time Socket.IO connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.warn('⚠️ Real-time Socket.IO disconnected');
    });

    return this.socket;
  }

  joinTrip(tripId: string) {
    if (this.socket) {
      this.socket.emit('join_trip', tripId);
    }
  }

  onSeatUpdated(callback: (data: { tripId: string; seatNumber: string; status: string }) => void) {
    this.socket?.on('seat_updated', callback);
  }

  onDriverDrowsinessAlert(callback: (data: any) => void) {
    this.socket?.on('driver_drowsiness_alert', callback);
  }

  onBoardingEvent(callback: (event: any) => void) {
    this.socket?.on('boarding_timeline_event', callback);
  }

  onCameraHealthUpdated(callback: (data: any) => void) {
    this.socket?.on('camera_health_updated', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketClient = new SocketClientManager();
