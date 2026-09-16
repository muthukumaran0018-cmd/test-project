export type SeatStatus = 'ON_BUS' | 'OUTSIDE' | 'BOARDING' | 'VERIFICATION_PENDING' | 'EMPTY';

export type SystemRole = 'admin' | 'operator' | 'driver' | 'conductor';

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seatNumber: string; // e.g., 'L1', 'U1'
  berthType: 'Lower' | 'Upper';
  ticketId: string;
  qrCodeUrl: string;
  phone: string;
  status: SeatStatus;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'WARNING' | 'FAILED';
  photoUrl: string;
  biometricHash?: string;
  boardingTime: string;
  exitTime?: string;
  returnTime?: string;
  lastSeenLocation: string;
  tripHistory: {
    stopName: string;
    exitTime: string;
    returnTime: string;
    onTime: boolean;
  }[];
}

export interface TripInfo {
  tripId: string;
  busNumber: string;
  operatorName: string;
  routeName: string;
  origin: string;
  destination: string;
  currentStop: string;
  nextStop: string;
  departureTime: string;
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
}

export interface CameraDevice {
  id: string;
  deviceId?: string;
  name: string;
  type: 'builtin' | 'usb' | 'ip' | 'esp32' | 'rpi';
  status: 'connected' | 'available' | 'disconnected';
  signalStrength: number; // 0 - 100
  fps: number;
  resolution: string;
  health: 'Optimal' | 'Fair' | 'Poor';
  aiReady: boolean;
  isLiveStream?: boolean;
  isRealDevice?: boolean;
}

export interface SmartAlert {
  id: string;
  type: 'missing_passenger' | 'unknown_person' | 'camera_disconnected' | 'verification_pending' | 'departure_blocked';
  title: string;
  message: string;
  seatNumber?: string;
  passengerName?: string;
  timestamp: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  resolved: boolean;
}

export interface BoardingTimelineEvent {
  id: string;
  timestamp: string;
  seatNumber: string;
  passengerName: string;
  action: 'boarded' | 'exited' | 'returned' | 'scanned_qr' | 'ai_detected' | 'alert_triggered';
  details: string;
  type: 'success' | 'warning' | 'info' | 'danger';
}

export interface DriverDrowsinessState {
  status: 'ALERT' | 'DROWSY' | 'SLEEPING';
  eyeAspectRatio: number; // e.g. 0.35 (Open), 0.15 (Closed)
  headNodAngle: number;
  yawnCount: number;
  microsleepDurationSec: number;
  alarmActive: boolean;
}
