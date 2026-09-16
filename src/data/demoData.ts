import type { Passenger, TripInfo, CameraDevice, SmartAlert, BoardingTimelineEvent } from '../types';

export const initialTripInfo: TripInfo = {
  tripId: "TS-8842-EXPRESS",
  busNumber: "KA 01 F 9922 (Sleeper AC)",
  operatorName: "Royal Star AI Travels",
  routeName: "Bengaluru → Goa Express",
  origin: "Bengaluru (Majestic)",
  destination: "Goa (Panaji)",
  currentStop: "Hubli Highway Plaza (Dinner & Fuel Stop)",
  nextStop: "Belagavi Junction",
  departureTime: "22:00 IST",
  departureCountdownSeconds: 380, // ~6 minutes left
  totalSeats: 30,
  occupiedSeats: 26,
  weather: {
    temp: "22°C",
    condition: "Clear Night",
    humidity: "65%"
  },
  gpsStatus: {
    lat: 15.3647,
    lng: 75.1240,
    speed: "0 km/h (Stopped)",
    signal: "Strong"
  },
  busHealthScore: 98,
  cameraStatus: "Active",
  aiStatus: "Active (Multi-Layer)",
  qrStatus: "Operational"
};

export const initialPassengers: Passenger[] = [
  {
    id: "p1",
    name: "Arjun Verma",
    age: 29,
    gender: "Male",
    seatNumber: "L1",
    berthType: "Lower",
    ticketId: "TK-90210",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90210-L1",
    phone: "+91 98765 43210",
    status: "ON_BUS",
    verificationStatus: "VERIFIED",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:30 IST",
    lastSeenLocation: "Entrance Camera (Confidence: 99.4%)",
    tripHistory: [{ stopName: "Tumkur Rest Stop", exitTime: "21:15", returnTime: "21:28", onTime: true }]
  },
  {
    id: "p2",
    name: "Priya Sharma",
    age: 26,
    gender: "Female",
    seatNumber: "L2",
    berthType: "Lower",
    ticketId: "TK-90211",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90211-L2",
    phone: "+91 98123 45678",
    status: "OUTSIDE",
    verificationStatus: "WARNING",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:35 IST",
    exitTime: "21:40 IST",
    lastSeenLocation: "Bus Doorway - Left to Restroom (8 mins ago)",
    tripHistory: [{ stopName: "Tumkur Rest Stop", exitTime: "21:15", returnTime: "21:25", onTime: true }]
  },
  {
    id: "p3",
    name: "Rohan Kulkarni",
    age: 34,
    gender: "Male",
    seatNumber: "L3",
    berthType: "Lower",
    ticketId: "TK-90212",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90212-L3",
    phone: "+91 97654 32109",
    status: "BOARDING",
    verificationStatus: "VERIFIED",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:40 IST",
    exitTime: "21:42 IST",
    returnTime: "21:54 IST",
    lastSeenLocation: "Entrance Camera Bounding Box (A1-Person)",
    tripHistory: []
  },
  {
    id: "p4",
    name: "Ananya Iyer",
    age: 23,
    gender: "Female",
    seatNumber: "L4",
    berthType: "Lower",
    ticketId: "TK-90213",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90213-L4",
    phone: "+91 99887 76655",
    status: "VERIFICATION_PENDING",
    verificationStatus: "PENDING",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:42 IST",
    lastSeenLocation: "QR Scanned at 21:52 - Camera Detection Pending",
    tripHistory: []
  },
  {
    id: "p5",
    name: "Vikram Malhotra",
    age: 41,
    gender: "Male",
    seatNumber: "L5",
    berthType: "Lower",
    ticketId: "TK-90214",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90214-L5",
    phone: "+91 94567 89012",
    status: "ON_BUS",
    verificationStatus: "VERIFIED",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:45 IST",
    lastSeenLocation: "Berth Seat Sensor L5 Active",
    tripHistory: []
  },
  {
    id: "p6",
    name: "Kavita Rao",
    age: 38,
    gender: "Female",
    seatNumber: "L6",
    berthType: "Lower",
    ticketId: "TK-90215",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90215-L6",
    phone: "+91 93456 78901",
    status: "ON_BUS",
    verificationStatus: "VERIFIED",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:48 IST",
    lastSeenLocation: "Berth L6",
    tripHistory: []
  },
  {
    id: "p7",
    name: "Siddharth Nair",
    age: 31,
    gender: "Male",
    seatNumber: "L7",
    berthType: "Lower",
    ticketId: "TK-90216",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90216-L7",
    phone: "+91 92345 67890",
    status: "EMPTY",
    verificationStatus: "VERIFIED",
    photoUrl: "",
    boardingTime: "-",
    lastSeenLocation: "Unbooked Seat",
    tripHistory: []
  },
  {
    id: "p8",
    name: "Meera Patel",
    age: 28,
    gender: "Female",
    seatNumber: "L8",
    berthType: "Lower",
    ticketId: "TK-90217",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90217-L8",
    phone: "+91 91234 56789",
    status: "ON_BUS",
    verificationStatus: "VERIFIED",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:55 IST",
    lastSeenLocation: "Berth L8",
    tripHistory: []
  },
  // Upper Berth Seats
  {
    id: "p15",
    name: "Deepak Mehta",
    age: 35,
    gender: "Male",
    seatNumber: "U1",
    berthType: "Upper",
    ticketId: "TK-90224",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90224-U1",
    phone: "+91 98989 89898",
    status: "ON_BUS",
    verificationStatus: "VERIFIED",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:25 IST",
    lastSeenLocation: "Upper Berth U1",
    tripHistory: []
  },
  {
    id: "p16",
    name: "Sneha Reddy",
    age: 27,
    gender: "Female",
    seatNumber: "U2",
    berthType: "Upper",
    ticketId: "TK-90225",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90225-U2",
    phone: "+91 97777 66666",
    status: "OUTSIDE",
    verificationStatus: "WARNING",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:28 IST",
    exitTime: "21:38 IST",
    lastSeenLocation: "Highway Restaurant Dining Area",
    tripHistory: []
  },
  {
    id: "p17",
    name: "Aditya Roy",
    age: 30,
    gender: "Male",
    seatNumber: "U3",
    berthType: "Upper",
    ticketId: "TK-90226",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90226-U3",
    phone: "+91 96666 55555",
    status: "ON_BUS",
    verificationStatus: "VERIFIED",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:30 IST",
    lastSeenLocation: "Upper Berth U3",
    tripHistory: []
  },
  {
    id: "p18",
    name: "Tanvi Deshmukh",
    age: 25,
    gender: "Female",
    seatNumber: "U4",
    berthType: "Upper",
    ticketId: "TK-90227",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-90227-U4",
    phone: "+91 95555 44444",
    status: "ON_BUS",
    verificationStatus: "VERIFIED",
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250",
    boardingTime: "20:32 IST",
    lastSeenLocation: "Upper Berth U4",
    tripHistory: []
  }
];

export const initialCameras: CameraDevice[] = [
  {
    id: "cam-entrance-01",
    name: "Bus Doorway Entrance Cam 01",
    type: "builtin",
    status: "connected",
    signalStrength: 98,
    fps: 30,
    resolution: "1080p Full HD",
    health: "Optimal",
    aiReady: true,
    isLiveStream: true
  },
  {
    id: "cam-aisle-02",
    name: "Lower Deck Aisle Wide Angle",
    type: "usb",
    status: "connected",
    signalStrength: 92,
    fps: 28,
    resolution: "1080p Full HD",
    health: "Optimal",
    aiReady: true
  },
  {
    id: "cam-exterior-03",
    name: "Side Door Exit Smart Sensor Cam",
    type: "ip",
    status: "connected",
    signalStrength: 85,
    fps: 25,
    resolution: "720p HD",
    health: "Optimal",
    aiReady: true
  },
  {
    id: "cam-esp32-04",
    name: "ESP32-CAM Restroom Entry (Future)",
    type: "esp32",
    status: "available",
    signalStrength: 76,
    fps: 15,
    resolution: " VGA 640x480",
    health: "Fair",
    aiReady: false
  }
];

export const initialAlerts: SmartAlert[] = [
  {
    id: "alt-001",
    type: "missing_passenger",
    title: "Passenger Departure Hold Warning",
    message: "Passenger Priya Sharma (Seat L2) and Sneha Reddy (Seat U2) have not returned from Hubli Stop.",
    seatNumber: "L2, U2",
    passengerName: "Priya Sharma, Sneha Reddy",
    timestamp: "21:48:10 IST",
    priority: "CRITICAL",
    resolved: false
  },
  {
    id: "alt-002",
    type: "verification_pending",
    title: "QR Code Scanned Without Entrance Motion",
    message: "Passenger Ananya Iyer (Seat L4) scanned QR ticket, but Entrance Cam motion verification is pending.",
    seatNumber: "L4",
    passengerName: "Ananya Iyer",
    timestamp: "21:52:30 IST",
    priority: "HIGH",
    resolved: false
  },
  {
    id: "alt-003",
    type: "unknown_person",
    title: "Unverified Movement Detected",
    message: "Entrance Camera detected a person entering without an active QR ticket scan.",
    timestamp: "21:54:02 IST",
    priority: "MEDIUM",
    resolved: true
  }
];

export const initialTimelineEvents: BoardingTimelineEvent[] = [
  {
    id: "t1",
    timestamp: "21:54:12 IST",
    seatNumber: "L3",
    passengerName: "Rohan Kulkarni",
    action: "returned",
    details: "Multi-Layer AI confirmed entrance. Status updated to On Bus.",
    type: "success"
  },
  {
    id: "t2",
    timestamp: "21:52:30 IST",
    seatNumber: "L4",
    passengerName: "Ananya Iyer",
    action: "scanned_qr",
    details: "QR Scan valid. Waiting for camera motion detection.",
    type: "info"
  },
  {
    id: "t3",
    timestamp: "21:40:05 IST",
    seatNumber: "L2",
    passengerName: "Priya Sharma",
    action: "exited",
    details: "Exited bus at Hubli Stop for dinner break.",
    type: "warning"
  },
  {
    id: "t4",
    timestamp: "21:38:00 IST",
    seatNumber: "U2",
    passengerName: "Sneha Reddy",
    action: "exited",
    details: "Exited bus at Hubli Stop.",
    type: "warning"
  },
  {
    id: "t5",
    timestamp: "21:30:00 IST",
    seatNumber: "ALL",
    passengerName: "System",
    action: "alert_triggered",
    details: "Sleeper Bus arrived at Hubli Highway Plaza. 20-min dinner timer started.",
    type: "info"
  }
];

export const analyticsData = {
  passengerTrends: [
    { time: '18:00', boarded: 5, missing: 0 },
    { time: '19:00', boarded: 14, missing: 0 },
    { time: '20:00', boarded: 24, missing: 0 },
    { time: '21:00 (Stop 1)', boarded: 22, missing: 2 },
    { time: '21:30 (Stop 2)', boarded: 22, missing: 2 },
    { time: '22:00 (Target)', boarded: 26, missing: 0 },
  ],
  lateBoardingByStop: [
    { stop: 'Tumkur Plaza', onTime: 26, late: 0, leftBehindSaved: 1 },
    { stop: 'Hubli Diner', onTime: 24, late: 2, leftBehindSaved: 2 },
    { stop: 'Belagavi Toll', onTime: 26, late: 0, leftBehindSaved: 0 },
    { stop: 'Dharwad Bypass', onTime: 25, late: 1, leftBehindSaved: 1 },
  ],
  systemStats: {
    tripsCompleted: 142,
    passengersAccounted: 4280,
    leftBehindIncidentsPrevented: 38,
    verificationAccuracy: '99.98%'
  }
};
