import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Passenger, TripInfo, CameraDevice, SmartAlert, BoardingTimelineEvent, SystemRole, DriverDrowsinessState } from '../types';
import { initialPassengers, initialTripInfo, initialCameras, initialAlerts, initialTimelineEvents } from '../data/demoData';

interface AppContextType {
  role: SystemRole;
  setRole: (role: SystemRole) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  tripInfo: TripInfo;
  passengers: Passenger[];
  cameras: CameraDevice[];
  alerts: SmartAlert[];
  timeline: BoardingTimelineEvent[];
  activeWebcamStream: MediaStream | null;
  webcamConnected: boolean;
  webcamError: string | null;
  connectWebcam: (deviceId?: string, forceSynthetic?: boolean) => Promise<boolean>;
  disconnectWebcam: () => void;
  realMediaDevices: MediaDeviceInfo[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  enumerateCameras: () => Promise<MediaDeviceInfo[]>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  simulatePassengerReturn: (seatNumber: string) => void;
  simulatePassengerExit: (seatNumber: string) => void;
  scanQR: (ticketId: string) => { success: boolean; passenger?: Passenger; message: string };
  triggerEmergencyAlert: (title: string, message: string) => void;
  resolveAlert: (alertId: string) => void;
  nightMode: boolean;
  setNightMode: (enabled: boolean) => void;
  selectedPassenger: Passenger | null;
  setSelectedPassenger: (passenger: Passenger | null) => void;
  drowsinessState: DriverDrowsinessState;
  triggerDriverSleepiness: () => void;
  resetDriverDrowsiness: () => void;
  autoDrowsinessEnabled: boolean;
  setAutoDrowsinessEnabled: (enabled: boolean) => void;
  entryCount: number;
  exitCount: number;
  verifyBiometric: (seatNumber?: string) => Promise<{ success: boolean; hash: string; passengerName: string }>;
  lastSMS: { phone: string; message: string; timestamp: string; passengerName: string; seatNumber: string } | null;
  clearSMS: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<SystemRole>('operator');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [tripInfo] = useState<TripInfo>(initialTripInfo);
  const [passengers, setPassengers] = useState<Passenger[]>(initialPassengers);
  const [cameras, setCameras] = useState<CameraDevice[]>(initialCameras);
  const [alerts, setAlerts] = useState<SmartAlert[]>(initialAlerts);
  const [timeline, setTimeline] = useState<BoardingTimelineEvent[]>(initialTimelineEvents);
  const [activeWebcamStream, setActiveWebcamStream] = useState<MediaStream | null>(null);
  const [webcamConnected, setWebcamConnected] = useState<boolean>(false);
  const [realMediaDevices, setRealMediaDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [nightMode, setNightMode] = useState<boolean>(true);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [entryCount, setEntryCount] = useState<number>(24);
  const [exitCount, setExitCount] = useState<number>(2);
  const [lastSMS, setLastSMS] = useState<{ phone: string; message: string; timestamp: string; passengerName: string; seatNumber: string } | null>(null);
  const [autoDrowsinessEnabled, setAutoDrowsinessEnabled] = useState<boolean>(true);

  const [drowsinessState, setDrowsinessState] = useState<DriverDrowsinessState>({
    status: 'ALERT',
    eyeAspectRatio: 0.36,
    headNodAngle: 0,
    yawnCount: 0,
    microsleepDurationSec: 0,
    alarmActive: false,
  });

  // Sync theme to root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Audio Beep Generator using Web Audio API
  const playAlertTone = (frequency = 880, duration = 0.3) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const enumerateCameras = async (): Promise<MediaDeviceInfo[]> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      setRealMediaDevices(videoDevices);

      // Update camera list with real devices if found
      if (videoDevices.length > 0) {
        setCameras(prev => {
          const realCams: CameraDevice[] = videoDevices.map((dev, idx) => ({
            id: dev.deviceId || `real-cam-${idx}`,
            deviceId: dev.deviceId,
            name: dev.label || `Smart Hardware Camera 0${idx + 1}`,
            type: idx === 0 ? 'builtin' : 'usb',
            status: 'available',
            signalStrength: 98 - idx * 5,
            fps: 30,
            resolution: '1080p Full HD',
            health: 'Optimal',
            aiReady: true,
            isRealDevice: true,
          }));
          return [...realCams, ...prev.filter(c => !c.isRealDevice)];
        });
      }
      return videoDevices;
    } catch {
      return [];
    }
  };

  // Helper to build a high-tech animated camera MediaStream fallback
  const createSyntheticWebcamStream = (): MediaStream => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    let frameCount = 0;
    const drawFrame = () => {
      if (!ctx) return;
      frameCount++;

      // Deep space cabin background gradient
      const bg = ctx.createLinearGradient(0, 0, 1280, 720);
      bg.addColorStop(0, '#020617');
      bg.addColorStop(0.5, '#0f172a');
      bg.addColorStop(1, '#020617');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1280, 720);

      // Grid overlay
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1280; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 720);
        ctx.stroke();
      }
      for (let y = 0; y < 720; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1280, y);
        ctx.stroke();
      }

      // Animated face contour representation for AI Vision camera tracking
      const headX = 640 + Math.sin(frameCount * 0.04) * 20;
      const headY = 360 + Math.cos(frameCount * 0.03) * 10;

      // Outer face oval contour
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(headX, headY, 130, 175, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Eyes
      ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
      ctx.beginPath();
      ctx.ellipse(headX - 45, headY - 35, 20, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(headX + 45, headY - 35, 20, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupils tracking movement
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(headX - 45 + Math.sin(frameCount * 0.05) * 4, headY - 35, 5, 0, Math.PI * 2);
      ctx.arc(headX + 45 + Math.sin(frameCount * 0.05) * 4, headY - 35, 5, 0, Math.PI * 2);
      ctx.fill();

      // Mouth / Smile arc
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(headX, headY + 35, 35, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Scanning laser beam
      const scanY = (frameCount * 5) % 720;
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      scanGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.4)');
      scanGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, 1280, 60);

      // Live Camera HUD text
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('🔴 LIVE CAMERA STREAM ACTIVE [ON]', 40, 50);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '14px monospace';
      const now = new Date();
      const timeStr = now.toLocaleTimeString() + '.' + String(now.getMilliseconds()).padStart(3, '0');
      ctx.fillText(`SYSTEM TIME: ${timeStr} IST`, 40, 85);
      ctx.fillText('RESOLUTION: 1920x1080 FULL HD @ 30 FPS', 40, 110);
      ctx.fillText('NEURAL AI ENGINE: OPTICAL FACE & EYE ASPECT TRACKING ACTIVE', 40, 135);

      requestAnimationFrame(drawFrame);
    };

    drawFrame();
    return canvas.captureStream(30);
  };

  const [webcamError, setWebcamError] = useState<string | null>(null);

  // Browser webcam pairing & smart camera stream connector
  const connectWebcam = async (targetDeviceId?: string, forceSynthetic = false): Promise<boolean> => {
    try {
      setWebcamError(null);

      if (activeWebcamStream) {
        activeWebcamStream.getTracks().forEach(track => track.stop());
      }

      let stream: MediaStream | null = null;
      const devId = targetDeviceId || selectedDeviceId;

      if (forceSynthetic) {
        stream = createSyntheticWebcamStream();
      } else {
        // Explicitly request user's physical laptop camera
        try {
          const videoConstraint = devId && !devId.startsWith('cam-')
            ? { deviceId: { exact: devId } }
            : true;

          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraint,
            audio: false
          });
        } catch (err: any) {
          console.warn("Exact hardware camera constraint failed, attempting fallback default webcam", err);
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          } catch (fallbackErr: any) {
            console.error("Laptop webcam permission denied or device unavailable:", fallbackErr);
            const errMsg = fallbackErr?.name === 'NotAllowedError' || fallbackErr?.message?.includes('Permission')
              ? "Safari blocked camera access. Click the camera icon in your Safari address bar or check Safari Settings -> Websites -> Camera to allow access."
              : `Laptop webcam error: ${fallbackErr?.message || 'Camera device not accessible'}`;
            setWebcamError(errMsg);
            setActiveWebcamStream(null);
            setWebcamConnected(false);
            return false;
          }
        }
      }

      if (!stream) {
        setWebcamError("Unable to acquire video stream.");
        setActiveWebcamStream(null);
        setWebcamConnected(false);
        return false;
      }

      setActiveWebcamStream(stream);
      setWebcamConnected(true);
      setWebcamError(null);
      if (devId) setSelectedDeviceId(devId);

      await enumerateCameras();

      // Update camera list: mark paired target camera as live & connected
      const pairedId = devId || 'cam-entrance-01';
      setCameras(prev =>
        prev.map(c => {
          const isTarget = c.id === pairedId || c.deviceId === pairedId;
          return {
            ...c,
            status: isTarget ? 'connected' : c.status,
            isLiveStream: isTarget
          };
        })
      );

      playAlertTone(1050, 0.2);
      return true;
    } catch (err: any) {
      console.error("Camera connection exception:", err);
      setWebcamError(err?.message || "Camera connection error.");
      setWebcamConnected(false);
      setActiveWebcamStream(null);
      return false;
    }
  };

  const disconnectWebcam = () => {
    if (activeWebcamStream) {
      activeWebcamStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    setActiveWebcamStream(null);
    setWebcamConnected(false);
    setWebcamError(null);
    playAlertTone(440, 0.2);
  };

  const simulatePassengerReturn = (seatNumber: string) => {
    setPassengers(prev =>
      prev.map(p => {
        if (p.seatNumber === seatNumber) {
          return {
            ...p,
            status: 'ON_BUS',
            verificationStatus: 'VERIFIED',
            returnTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST',
            lastSeenLocation: 'Entrance Cam (Verified via Multi-Layer)'
          };
        }
        return p;
      })
    );

    setEntryCount(prev => prev + 1);
    setExitCount(prev => Math.max(0, prev - 1));

    const passenger = passengers.find(p => p.seatNumber === seatNumber);

    const newEvent: BoardingTimelineEvent = {
      id: `t-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      seatNumber,
      passengerName: passenger?.name || 'Passenger',
      action: 'returned',
      details: 'AI Person Detection matched entrance. Seat status updated to ON BUS.',
      type: 'success'
    };

    setTimeline(prev => [newEvent, ...prev]);
    playAlertTone(1200, 0.15);
  };

  const simulatePassengerExit = (seatNumber: string) => {
    setPassengers(prev =>
      prev.map(p => {
        if (p.seatNumber === seatNumber) {
          return {
            ...p,
            status: 'OUTSIDE',
            verificationStatus: 'WARNING',
            exitTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST',
            lastSeenLocation: 'Bus Exit Door (Sensor Triggered)'
          };
        }
        return p;
      })
    );

    setExitCount(prev => prev + 1);

    const passenger = passengers.find(p => p.seatNumber === seatNumber);

    const newEvent: BoardingTimelineEvent = {
      id: `t-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      seatNumber,
      passengerName: passenger?.name || 'Passenger',
      action: 'exited',
      details: 'Exited bus at rest stop. Multi-Layer tracking active.',
      type: 'warning'
    };

    setTimeline(prev => [newEvent, ...prev]);
    playAlertTone(440, 0.2);
  };

  const verifyBiometric = async (seatNumber?: string): Promise<{ success: boolean; hash: string; passengerName: string }> => {
    playAlertTone(1350, 0.25);

    const passenger = seatNumber 
      ? passengers.find(p => p.seatNumber === seatNumber) 
      : passengers.find(p => p.status === 'OUTSIDE') || passengers[0];

    const generatedHash = `FP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    if (passenger) {
      setPassengers(prev =>
        prev.map(p => (p.id === passenger.id ? { ...p, biometricHash: generatedHash, verificationStatus: 'VERIFIED' } : p))
      );
    }

    return {
      success: true,
      hash: generatedHash,
      passengerName: passenger ? passenger.name : 'Verified Operator'
    };
  };

  const scanQR = (ticketId: string) => {
    const passenger = passengers.find(p => p.ticketId.toUpperCase() === ticketId.toUpperCase() || p.seatNumber.toUpperCase() === ticketId.toUpperCase());
    if (passenger) {
      // Complete ticket booking & update status to ON_BUS
      setPassengers(prev =>
        prev.map(p => {
          if (p.id === passenger.id) {
            return {
              ...p,
              status: 'ON_BUS',
              verificationStatus: 'VERIFIED',
              lastSeenLocation: 'QR Scanner Station - Booking Confirmed'
            };
          }
          return p;
        })
      );

      const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';

      // Generate SMS booking confirmation message
      const smsBody = `[TripSecure SMS] Booking Confirmed! Dear ${passenger.name}, your ticket ${passenger.ticketId} for Seat ${passenger.seatNumber} on ${tripInfo.routeName} is CONFIRMED & VERIFIED. Safe travels!`;

      const smsObject = {
        phone: passenger.phone,
        message: smsBody,
        timestamp,
        passengerName: passenger.name,
        seatNumber: passenger.seatNumber
      };

      setLastSMS(smsObject);

      // Log to alerts stream
      const smsAlert: SmartAlert = {
        id: `sms-${Date.now()}`,
        type: 'verification_pending',
        title: `📱 SMS Sent to ${passenger.name}`,
        message: `Booking Confirmation SMS dispatched to ${passenger.phone}: ${smsBody}`,
        timestamp,
        priority: 'INFO',
        resolved: true
      };
      setAlerts(prev => [smsAlert, ...prev]);

      const newEvent: BoardingTimelineEvent = {
        id: `t-${Date.now()}`,
        timestamp,
        seatNumber: passenger.seatNumber,
        passengerName: passenger.name,
        action: 'scanned_qr',
        details: `QR Code Verified & Booking SMS sent to ${passenger.phone}`,
        type: 'success'
      };
      setTimeline(prev => [newEvent, ...prev]);
      playAlertTone(1400, 0.2);

      return { 
        success: true, 
        passenger, 
        message: `Ticket ${passenger.ticketId} (Seat ${passenger.seatNumber}) BOOKED & CONFIRMED! SMS Message Sent to ${passenger.phone}.` 
      };
    } else {
      playAlertTone(300, 0.4);
      return { success: false, message: 'Invalid or Unrecognized QR Ticket Code.' };
    }
  };

  const clearSMS = () => setLastSMS(null);

  const triggerEmergencyAlert = (title: string, message: string) => {
    const newAlert: SmartAlert = {
      id: `alt-${Date.now()}`,
      type: 'missing_passenger',
      title,
      message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      priority: 'CRITICAL',
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);
    playAlertTone(300, 0.6);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, resolved: true } : a)));
  };

  const triggerDriverSleepiness = () => {
    setDrowsinessState(prev => ({
      status: 'SLEEPING',
      eyeAspectRatio: 0.08,
      headNodAngle: 28,
      yawnCount: prev.yawnCount + 1,
      microsleepDurationSec: 4.5,
      alarmActive: true,
    }));

    // Audio alarm tone
    playAlertTone(280, 0.8);
    playAlertTone(180, 0.8);

    // Text to Speech Emergency Voice Alert
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("CRITICAL WARNING! Driver Drowsiness and Eye Closure Detected! Wake Up Immediately!");
      utterance.rate = 1.1;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }

    // Add alert to emergency feed
    const newAlert: SmartAlert = {
      id: `alt-drowsy-${Date.now()}`,
      type: 'missing_passenger',
      title: '⚠️ CRITICAL: Driver Microsleep Detected',
      message: 'AI Camera detected driver eye closure for > 3.5 seconds! Emergency alarm sounded.',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      priority: 'CRITICAL',
      resolved: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const resetDriverDrowsiness = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setDrowsinessState({
      status: 'ALERT',
      eyeAspectRatio: 0.36,
      headNodAngle: 0,
      yawnCount: 0,
      microsleepDurationSec: 0,
      alarmActive: false,
    });
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        theme,
        toggleTheme,
        currentPage,
        setCurrentPage,
        tripInfo,
        passengers,
        cameras,
        alerts,
        timeline,
        activeWebcamStream,
        webcamConnected,
        webcamError,
        connectWebcam,
        disconnectWebcam,
        soundEnabled,
        setSoundEnabled,
        simulatePassengerReturn,
        simulatePassengerExit,
        scanQR,
        triggerEmergencyAlert,
        resolveAlert,
        nightMode,
        setNightMode,
        selectedPassenger,
        setSelectedPassenger,
        drowsinessState,
        triggerDriverSleepiness,
        resetDriverDrowsiness,
        realMediaDevices,
        selectedDeviceId,
        setSelectedDeviceId,
        enumerateCameras,
        entryCount,
        exitCount,
        verifyBiometric,
        lastSMS,
        clearSMS,
        autoDrowsinessEnabled,
        setAutoDrowsinessEnabled
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
