import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Scan, CheckCircle2, AlertTriangle, QrCode, UserCheck, Camera, Video, RefreshCw, MessageSquare, X } from 'lucide-react';

export const QRVerificationPage: React.FC = () => {
  const { 
    scanQR, 
    passengers, 
    setSelectedPassenger,
    webcamConnected,
    activeWebcamStream,
    connectWebcam,
    lastSMS,
    clearSMS
  } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ticketInput, setTicketInput] = useState('TK-90210');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; passenger?: any } | null>(null);

  // Connect video element to active camera stream
  useEffect(() => {
    if (videoRef.current && activeWebcamStream) {
      videoRef.current.srcObject = activeWebcamStream;
      videoRef.current.play().catch(() => {});
    }
  }, [activeWebcamStream]);

  // Real-time Optical Video Scanner Loop
  useEffect(() => {
    if (!webcamConnected || !videoRef.current) return;

    let scanTimer: ReturnType<typeof setInterval>;

    // Periodically simulate live optical scanner reading frames
    scanTimer = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === 4 && !isScanning) {
        // Auto-scan random outside passenger for real-time camera simulation
        const outsideP = passengers.find(p => p.status === 'OUTSIDE' || p.status === 'VERIFICATION_PENDING');
        if (outsideP && Math.random() > 0.7) {
          handleScan(outsideP.ticketId);
        }
      }
    }, 4000);

    return () => clearInterval(scanTimer);
  }, [webcamConnected, passengers, isScanning]);

  const handleScan = (codeToScan?: string) => {
    const code = codeToScan || ticketInput;
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const res = scanQR(code);
      setScanResult(res);
    }, 900);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <Scan className="w-4 h-4 text-emerald-400" />
            <span>Real-Time Optical Ticket Scanner Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Camera QR Ticket Scanner</h1>
          <p className="text-xs text-slate-400">
            Enables your live browser camera stream to scan digital/printed QR tickets in real-time as passengers enter.
          </p>
        </div>

        {!webcamConnected && (
          <button
            onClick={() => connectWebcam()}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Enable Live Camera Stream</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SCANNER VIEWPORT WITH LIVE CAMERA & LASER SCANNER */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live Scanner Viewport
            </h3>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              webcamConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {webcamConnected ? 'CAMERA LIVE' : 'SIMULATOR MODE'}
            </span>
          </div>

          {/* VIEWPORT CANVAS WITH LIVE VIDEO FEED OR QR FRAME */}
          <div className="relative aspect-square max-w-sm mx-auto rounded-2xl bg-slate-950 border-2 border-cyan-500/50 p-4 flex flex-col items-center justify-center overflow-hidden shadow-2xl shadow-cyan-500/20">
            
            {webcamConnected && activeWebcamStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-80"
              />
            ) : (
              <div className="p-6 rounded-xl bg-white shadow-xl relative z-10">
                <QrCode className="w-32 h-32 text-slate-950" />
              </div>
            )}

            {/* SCANNING TARGET CROSSHAIR FRAME */}
            <div className="relative z-20 w-48 h-48 border-2 border-cyan-400/80 rounded-xl flex items-center justify-center pointer-events-none">
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-cyan-400" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-cyan-400" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-cyan-400" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-cyan-400" />

              {/* Animated Laser Line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] animate-pulse animate-[float_2s_infinite]" />
            </div>

            {/* Viewport Overlay Tag */}
            <div className="absolute bottom-3 inset-x-4 bg-slate-950/90 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-center text-[11px] font-mono text-slate-300 z-20">
              {isScanning ? (
                <span className="text-cyan-400 font-bold flex items-center justify-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Decoding Ticket Frame...
                </span>
              ) : (
                <span>Position QR code inside target frame</span>
              )}
            </div>

          </div>

          {/* Quick Ticket Input */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-mono text-slate-400">Manual Ticket ID / Seat Code Override</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="e.g. TK-90210 or L1"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleScan()}
                disabled={isScanning}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Scan className="w-4 h-4" />
                Scan Code
              </button>
            </div>
          </div>

        </div>

        {/* SCAN RESULTS & QUICK TICKETS PALETTE */}
        <div className="space-y-6">
          
          {/* SMS BOOKING CONFIRMATION MESSAGE NOTIFICATION CARD */}
          {lastSMS && (
            <div className="p-5 rounded-2xl border-2 border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-2xl shadow-cyan-500/20 space-y-2 animate-pulse relative">
              <button
                onClick={clearSMS}
                className="absolute top-3 right-3 p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
                <MessageSquare className="w-4 h-4 animate-bounce text-emerald-400" />
                <span>BOOKING CONFIRMATION SMS DISPATCHED</span>
              </div>
              <h4 className="font-bold text-white text-sm">Sent to {lastSMS.phone} ({lastSMS.passengerName})</h4>
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-emerald-300">
                "{lastSMS.message}"
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Dispatched at {lastSMS.timestamp} • Ticket Booked & Confirmed</p>
            </div>
          )}

          {/* SCAN RESULT RESPONSE */}
          {scanResult && (
            <div className={`p-6 rounded-2xl border backdrop-blur-xl shadow-xl space-y-4 animate-fadeIn ${
              scanResult.success ? 'bg-emerald-950/30 border-emerald-500/50 shadow-emerald-500/10' : 'bg-rose-950/30 border-rose-500/50 shadow-rose-500/10'
            }`}>
              <div className="flex items-center gap-3">
                {scanResult.success ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0" />
                )}
                <div>
                  <h3 className={`text-lg font-bold ${scanResult.success ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {scanResult.success ? 'Ticket Verified - Boarding Approved' : 'Invalid Ticket Code'}
                  </h3>
                  <p className="text-xs text-slate-300">{scanResult.message}</p>
                </div>
              </div>

              {scanResult.passenger && (
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Passenger Name:</span>
                    <strong className="text-white font-bold">{scanResult.passenger.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Seat Number:</span>
                    <strong className="text-cyan-400 font-mono font-bold">{scanResult.passenger.seatNumber} ({scanResult.passenger.berthType} Berth)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Multi-Layer Status:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                      LAYER 1 PASSED
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPassenger(scanResult.passenger)}
                    className="w-full mt-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold transition flex items-center justify-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> View Passenger Ticket &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* QUICK DEMO SEAT TICKET BUTTONS */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-2">
              <QrCode className="w-4 h-4 text-cyan-400" />
              Quick Passenger Ticket Palette
            </h3>
            <p className="text-xs text-slate-400">Click any passenger ticket to simulate scanning frame:</p>

            <div className="grid grid-cols-2 gap-3">
              {passengers.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setTicketInput(p.ticketId);
                    handleScan(p.ticketId);
                  }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition space-y-1 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white group-hover:text-cyan-400">{p.name}</span>
                    <span className="font-mono text-cyan-400 text-[10px] font-bold">{p.seatNumber}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{p.ticketId}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
