import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  MapPin, 
  CloudSun, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Scan, 
  Radio, 
  Shield,
  Zap,
  RefreshCw,
  Video,
  Power
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    tripInfo, 
    passengers, 
    alerts, 
    timeline, 
    setCurrentPage, 
    simulatePassengerReturn,
    simulatePassengerExit,
    webcamConnected,
    activeWebcamStream,
    connectWebcam,
    disconnectWebcam
  } = useApp();

  const dashVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (dashVideoRef.current && activeWebcamStream) {
      dashVideoRef.current.srcObject = activeWebcamStream;
      dashVideoRef.current.play().catch(() => {});
    }
  }, [activeWebcamStream]);

  const [countdown, setCountdown] = useState(tripInfo.departureCountdownSeconds);

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const onBusCount = passengers.filter(p => p.status === 'ON_BUS').length;
  const outsideCount = passengers.filter(p => p.status === 'OUTSIDE').length;
  const boardingCount = passengers.filter(p => p.status === 'BOARDING' || p.status === 'VERIFICATION_PENDING').length;
  const totalBooked = passengers.filter(p => p.status !== 'EMPTY').length;
  const boardingProgress = Math.round((onBusCount / (totalBooked || 1)) * 100);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* TOP TRIP BANNER & COUNTDOWN */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Trip Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30">
                TRIP ID: {tripInfo.tripId}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-xs">
                {tripInfo.busNumber}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{tripInfo.routeName}</h1>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Current Stop: <strong className="text-cyan-300">{tripInfo.currentStop}</strong></span>
              <span className="text-slate-600">•</span>
              <span>Next: {tripInfo.nextStop}</span>
            </p>
          </div>

          {/* Departure Countdown & Alarm Status */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-center space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Departure Countdown</span>
              <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
                outsideCount > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
              }`}>
                {formatTime(countdown)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Target: {tripInfo.departureTime}</span>
            </div>

            <div className="h-10 w-[1px] bg-slate-800" />

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-slate-400">Departure Safety</div>
              {outsideCount > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" /> DEPARTURE BLOCKED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SAFE TO DEPART
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* METRIC COUNTERS & PROGRESS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* On Bus */}
        <div 
          onClick={() => setCurrentPage('seats')}
          className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md cursor-pointer hover:border-emerald-500/60 transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">On Bus (Verified)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{onBusCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Multi-Layer confirmed</p>
        </div>

        {/* Outside Bus */}
        <div 
          onClick={() => setCurrentPage('seats')}
          className={`p-5 rounded-2xl border backdrop-blur-md cursor-pointer transition group ${
            outsideCount > 0 
              ? 'border-rose-500/50 bg-rose-950/30 shadow-lg shadow-rose-500/10'
              : 'border-slate-800 bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-rose-400 font-bold uppercase">Outside (Rest Stop)</span>
            <AlertTriangle className={`w-5 h-5 ${outsideCount > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">{outsideCount}</div>
          <p className="text-[11px] text-rose-300/80 mt-1">{outsideCount > 0 ? 'Action Required!' : 'All accounted'}</p>
        </div>

        {/* Boarding In Progress */}
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase">Boarding / Pending</span>
            <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono">{boardingCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Camera/QR scan active</p>
        </div>

        {/* Boarding Progress Bar */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">Boarding Progress</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{boardingProgress}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 my-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${boardingProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-mono">{onBusCount} of {totalBooked} passengers seated</p>
        </div>

      </div>

      {/* SYSTEM HEALTH & SENSOR HARDWARE STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Hardware & Live Camera Control Status */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Sensor & Live Camera Health
            </h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              webcamConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {webcamConnected ? 'CAM 🟢 ON' : 'CAM 🔴 OFF'}
            </span>
          </div>

          {/* Video Preview viewport when Camera is ON */}
          {webcamConnected && activeWebcamStream ? (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950">
              <video
                ref={dashVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100 opacity-90"
              />
              <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
                <Video className="w-3 h-3 animate-pulse" /> LIVE STREAM ON
              </div>
            </div>
          ) : null}

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="flex items-center gap-2 text-slate-300">
                <Camera className="w-3.5 h-3.5 text-cyan-400" /> Entrance Camera
              </span>
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                webcamConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {webcamConnected ? 'CONNECTED (30 FPS)' : 'OFF / DISCONNECTED'}
              </span>
            </div>

            {/* Dashboard Camera ON/OFF Power Toggle Button */}
            {webcamConnected ? (
              <button
                onClick={disconnectWebcam}
                className="w-full py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/40 font-mono text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Power className="w-3.5 h-3.5 text-rose-400" /> Turn Camera OFF 🔴
              </button>
            ) : (
              <button
                onClick={() => connectWebcam()}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Power className="w-3.5 h-3.5" /> Turn Camera ON & Connect Stream 🟢
              </button>
            )}

            <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="flex items-center gap-2 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> AI Detection Engine
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">Active</span>
            </div>
          </div>
        </div>

        {/* GPS & Weather Widget */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-400" /> Telematics & Environment
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">{tripInfo.weather.temp}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">GPS Coordinates:</span>
              <span className="font-mono text-slate-200">{tripInfo.gpsStatus.lat}, {tripInfo.gpsStatus.lng}</span>
            </div>

            <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Bus Speed:</span>
              <span className="font-mono text-cyan-400 font-bold">{tripInfo.gpsStatus.speed}</span>
            </div>

            <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Weather Condition:</span>
              <span className="font-mono text-slate-200">{tripInfo.weather.condition} ({tripInfo.weather.humidity} Hum)</span>
            </div>
          </div>
        </div>

        {/* Quick Simulation Trigger Hub */}
        <div className="p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-slate-900 to-cyan-950/30 space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Live Demo Control Center
          </h3>
          <p className="text-[11px] text-slate-400">
            Simulate real-time passenger entries and exits to test multi-layer safety alerts.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => simulatePassengerReturn('L2')}
              className="w-full py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Simulate Priya Sharma (L2) Returning
            </button>

            <button
              onClick={() => simulatePassengerExit('L1')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Simulate Arjun Verma (L1) Exit
            </button>

            <button
              onClick={() => setCurrentPage('qr-scanner')}
              className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20"
            >
              <Scan className="w-3.5 h-3.5" /> Open Live QR Ticket Simulator
            </button>
          </div>
        </div>

      </div>

      {/* RECENT ALERTS & ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Smart Alerts */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Active Departure Safety Alerts
            </h3>
            <button 
              onClick={() => setCurrentPage('alert-center')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              Alert Center &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {alerts.filter(a => !a.resolved).slice(0, 3).map((alert) => (
              <div 
                key={alert.id}
                className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400">{alert.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Timeline Stream */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Live Activity Feed
            </h3>
            <button 
              onClick={() => setCurrentPage('timeline')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              Full Timeline &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {timeline.slice(0, 4).map((evt) => (
              <div key={evt.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                <span className="font-mono text-[10px] text-slate-400 shrink-0 mt-0.5">{evt.timestamp}</span>
                <div>
                  <span className="font-bold text-cyan-400">Seat {evt.seatNumber}</span> • <span className="text-slate-200">{evt.passengerName}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{evt.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
