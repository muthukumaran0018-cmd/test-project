import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Radio, ScanLine, UserCheck, AlertTriangle, Shield, Eye, Camera, CheckCircle2 } from 'lucide-react';

export const AIDetectionPage: React.FC = () => {
  const { 
    webcamConnected, 
    activeWebcamStream, 
    connectWebcam,
    simulatePassengerReturn, 
    simulatePassengerExit,
    passengers
  } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [detectionState, setDetectionState] = useState<'ENTERING' | 'LEAVING' | 'DOORWAY' | 'UNKNOWN'>('ENTERING');
  const [confidence, setConfidence] = useState(98.4);
  const [matchedSeat, setMatchedSeat] = useState('L3 (Rohan Kulkarni)');
  const [ticketMatched, setTicketMatched] = useState(true);
  const [faceMatched, setFaceMatched] = useState(true);

  // Attach webcam stream to video element
  useEffect(() => {
    if (videoRef.current && activeWebcamStream) {
      videoRef.current.srcObject = activeWebcamStream;
      videoRef.current.play().catch(() => {});
    }
  }, [activeWebcamStream]);

  // Periodic confidence variations for realistic AI feel
  useEffect(() => {
    const interval = setInterval(() => {
      setConfidence(parseFloat((97 + Math.random() * 2.5).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerState = (state: 'ENTERING' | 'LEAVING' | 'DOORWAY' | 'UNKNOWN') => {
    setDetectionState(state);
    if (state === 'ENTERING') {
      setMatchedSeat('L3 (Rohan Kulkarni)');
      setTicketMatched(true);
      setFaceMatched(true);
      simulatePassengerReturn('L3');
    } else if (state === 'LEAVING') {
      setMatchedSeat('L2 (Priya Sharma)');
      setTicketMatched(true);
      setFaceMatched(true);
      simulatePassengerExit('L2');
    } else if (state === 'UNKNOWN') {
      setMatchedSeat('UNASSIGNED');
      setTicketMatched(false);
      setFaceMatched(false);
    } else {
      setMatchedSeat('L1 (Arjun Verma)');
      setTicketMatched(true);
      setFaceMatched(true);
    }
  };

  const onboardCount = passengers.filter(p => p.status === 'ON_BUS').length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
            <span>Neural Vision Motion & Passenger Counting Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Passenger Motion Bounding Box & Counter</h1>
          <p className="text-xs text-slate-400">
            Object detection identifies body passage through doorway frames, automatically counting entries and exits.
          </p>
        </div>

        {!webcamConnected && (
          <button
            onClick={() => connectWebcam()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Camera className="w-4 h-4" />
            <span>Pair Browser Camera</span>
          </button>
        )}
      </div>

      {/* REAL-TIME PASSENGER COUNTERS BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Entered */}
        <div className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Entered (On Bus)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{onboardCount}</div>
          <p className="text-[10px] text-emerald-300 mt-1">Total Passengers Seated</p>
        </div>

        {/* Total Exited */}
        <div className="p-5 rounded-2xl border border-rose-500/40 bg-rose-950/20 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-rose-400 font-bold uppercase">Exited (Outside Bus)</span>
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">{passengers.filter(p => p.status === 'OUTSIDE').length}</div>
          <p className="text-[10px] text-rose-300 mt-1">Passengers Outside at Rest Stop</p>
        </div>

        {/* Total Events Tracked */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">AI Motion Precision</span>
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">{confidence}%</div>
          <p className="text-[10px] text-slate-400 mt-1">Multi-Layer Bounding Box Accuracy</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CONTROLS & AI SETTINGS */}
        <div className="space-y-4">
          
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
              Simulate Entrance Motion Events
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => triggerState('ENTERING')}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs border transition flex items-center justify-between ${
                  detectionState === 'ENTERING'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" /> Passenger Entering Bus (Count +1)
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded">L3</span>
              </button>

              <button
                onClick={() => triggerState('LEAVING')}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs border transition flex items-center justify-between ${
                  detectionState === 'LEAVING'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-md shadow-rose-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Passenger Exiting Bus (Count Exit)
                </span>
                <span className="text-[10px] font-mono bg-rose-500/20 px-2 py-0.5 rounded">L2</span>
              </button>

              <button
                onClick={() => triggerState('DOORWAY')}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs border transition flex items-center justify-between ${
                  detectionState === 'DOORWAY'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" /> Standing Near Doorway
                </span>
                <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded">L1</span>
              </button>

              <button
                onClick={() => triggerState('UNKNOWN')}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs border transition flex items-center justify-between ${
                  detectionState === 'UNKNOWN'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-md shadow-purple-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ScanLine className="w-4 h-4 text-purple-400" /> Unknown Person Detected
                </span>
                <span className="text-[10px] font-mono bg-purple-500/20 px-2 py-0.5 rounded">ALERT</span>
              </button>
            </div>
          </div>

          {/* AI PARAMETERS */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">Verification Parameters</h3>
            
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium">Ticket Match Validation</span>
              <button
                onClick={() => setTicketMatched(!ticketMatched)}
                className={`w-10 h-5 rounded-full p-0.5 transition ${ticketMatched ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition ${ticketMatched ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium">Face Geometry Hash</span>
              <button
                onClick={() => setFaceMatched(!faceMatched)}
                className={`w-10 h-5 rounded-full p-0.5 transition ${faceMatched ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition ${faceMatched ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: VIDEO HUD WITH BOUNDING BOX OVERLAY */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-white">Entrance Vision & Counter Monitor</span>
              </div>
              
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                Confidence: {confidence}%
              </span>
            </div>

            {/* VIDEO FEED & DYNAMIC BOUNDING BOX OVERLAY */}
            <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              
              {webcamConnected && activeWebcamStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100 opacity-90"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <UserCheck className="w-12 h-12 text-cyan-400 mx-auto opacity-50" />
                    <p className="font-mono text-xs text-slate-400">Simulated Entrance AI Camera Active</p>
                  </div>
                </div>
              )}

              {/* BOUNDING BOX OVERLAY */}
              <div className={`absolute transition-all duration-300 ${
                detectionState === 'ENTERING'
                  ? 'top-1/4 left-1/3 w-48 h-64 border-2 border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                  : detectionState === 'LEAVING'
                  ? 'top-1/4 right-1/4 w-48 h-64 border-2 border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/20'
                  : detectionState === 'DOORWAY'
                  ? 'top-1/3 left-1/2 -translate-x-1/2 w-48 h-64 border-2 border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20'
                  : 'top-1/4 left-1/2 -translate-x-1/2 w-48 h-64 border-2 border-purple-500 bg-purple-500/10 animate-pulse'
              } rounded-lg flex flex-col justify-between p-2`}>
                
                {/* Bounding Box Top Tag */}
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-950 px-2 py-0.5 rounded bg-emerald-400">
                  <span>PERSON DETECTED</span>
                  <span>{confidence}%</span>
                </div>

                {/* Bounding Box Center Crosshair */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border border-white/40 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  </div>
                </div>

                {/* Bounding Box Bottom Details */}
                <div className="p-1.5 rounded bg-slate-950/90 text-[9px] font-mono space-y-0.5 text-white">
                  <div>Seat Match: <strong className="text-cyan-400">{matchedSeat}</strong></div>
                  <div>Event: <strong className="text-emerald-400">{detectionState}</strong></div>
                </div>

              </div>

            </div>

            {/* EVENT RESULTS DATA SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">AI Motion Confirmation</span>
                <span className="font-bold text-emerald-400">{detectionState} BUS</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">Seat Assigned</span>
                <span className="font-bold text-cyan-400">{matchedSeat}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">Verification Status</span>
                <span className="font-bold text-emerald-400">
                  {ticketMatched && faceMatched ? '100% VERIFIED' : 'PENDING'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
