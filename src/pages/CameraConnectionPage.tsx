import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Wifi, RefreshCw, Video, Radio, Activity } from 'lucide-react';

export const CameraConnectionPage: React.FC = () => {
  const { 
    cameras, 
    activeWebcamStream, 
    webcamConnected, 
    webcamError,
    connectWebcam, 
    disconnectWebcam, 
    realMediaDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    enumerateCameras
  } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [motionLevel, setMotionLevel] = useState<number>(0);
  const [trackInfo, setTrackInfo] = useState<{ label: string; resolution: string; fps: number }>({
    label: 'Built-in Camera Stream',
    resolution: '1920x1080',
    fps: 30
  });

  // Enumerate devices on load
  useEffect(() => {
    enumerateCameras();
  }, []);

  // Attach webcam stream to video element & get real track settings
  useEffect(() => {
    if (videoRef.current && activeWebcamStream) {
      videoRef.current.srcObject = activeWebcamStream;
      videoRef.current.play().catch(() => {});

      try {
        const track = activeWebcamStream.getVideoTracks()[0];
        if (track) {
          const settings = typeof track.getSettings === 'function' ? track.getSettings() : ({} as MediaTrackSettings);
          setTrackInfo({
            label: track.label || 'Live Laptop Camera Stream',
            resolution: `${settings.width || 1280}x${settings.height || 720}`,
            fps: Math.round(settings.frameRate || 30)
          });
        }
      } catch (err) {
        console.warn("Track info exception:", err);
      }
    }
  }, [activeWebcamStream]);

  // Real-Time Canvas Motion Detection Loop
  useEffect(() => {
    if (!webcamConnected || !videoRef.current) return;

    let animId: number;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 48;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let lastFrameData: Uint8ClampedArray | null = null;

    const analyzeMotion = () => {
      try {
        if (videoRef.current && ctx && videoRef.current.readyState === 4 && videoRef.current.videoWidth > 0) {
          ctx.drawImage(videoRef.current, 0, 0, 64, 48);
          const currentData = ctx.getImageData(0, 0, 64, 48).data;

          if (lastFrameData) {
            let diffSum = 0;
            for (let i = 0; i < currentData.length; i += 4) {
              diffSum += Math.abs(currentData[i + 1] - lastFrameData[i + 1]);
            }
            const avgDiff = diffSum / (currentData.length / 4);
            const score = Math.min(100, Math.round(avgDiff * 2.5));
            setMotionLevel(score);
          }
          lastFrameData = new Uint8ClampedArray(currentData);
        }
      } catch {
        // Safe canvas read fallback
      }
      animId = requestAnimationFrame(analyzeMotion);
    };

    animId = requestAnimationFrame(analyzeMotion);
    return () => cancelAnimationFrame(animId);
  }, [webcamConnected]);

  const handlePairSpecificCamera = async (deviceId?: string, forceSynthetic = false) => {
    setConnecting(true);
    await connectWebcam(deviceId || selectedDeviceId, forceSynthetic);
    setConnecting(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
          <Camera className="w-4 h-4" />
          <span>Real-Time Hardware Camera Pairing Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Smart Camera Pairing & Discovery</h1>
        <p className="text-xs text-slate-400">
          Enumerate physical cameras connected to your device, select input streams, and pair live entrance cameras.
        </p>
      </div>

      {webcamError && (
        <div className="p-4 rounded-xl border-2 border-amber-500 bg-amber-950/40 text-amber-200 text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <strong className="block text-white text-sm font-bold">Laptop Webcam Access Notice:</strong>
              <span>{webcamError}</span>
            </div>
          </div>
          <button
            onClick={() => handlePairSpecificCamera(selectedDeviceId, true)}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition text-xs shrink-0 font-mono"
          >
            Switch to AI Demo Feed 🤖
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: DISCOVERED HARDWARE CAMERAS */}
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Connected Hardware Devices
            </h3>
            <button
              onClick={() => enumerateCameras()}
              className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Rescan Devices
            </button>
          </div>

          {/* REAL HARDWARE CAMERA DEVICE SELECTOR DROPDOWN */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="block text-xs font-mono text-cyan-400 font-bold">
              Select Video Input Hardware / Smart Cam:
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedDeviceId(val);
                handlePairSpecificCamera(val, false);
              }}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Primary Auto-Detect Camera --</option>
              {cameras.map((c) => (
                <option key={c.id} value={c.deviceId || c.id}>
                  {c.name} ({c.type.toUpperCase()} • {c.resolution})
                </option>
              ))}
              {realMediaDevices.map((device, idx) => (
                <option key={device.deviceId || `real-${idx}`} value={device.deviceId}>
                  {device.label || `Hardware Video Input 0${idx + 1}`}
                </option>
              ))}
            </select>

            {/* PAIR & UNPAIR ACTION BUTTONS */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handlePairSpecificCamera(selectedDeviceId, false)}
                disabled={connecting}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow ${
                  connecting
                    ? 'bg-slate-800 text-slate-500 cursor-wait'
                    : webcamConnected
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>{webcamConnected ? 'Pair Real Webcam 📹' : 'Pair Real Webcam 📹'}</span>
              </button>

              <button
                onClick={() => handlePairSpecificCamera(selectedDeviceId, true)}
                disabled={connecting}
                className="px-3 py-2.5 rounded-xl font-bold text-xs bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 transition"
                title="Test AI Simulated Stream"
              >
                AI Feed 🤖
              </button>

              <button
                onClick={disconnectWebcam}
                disabled={!webcamConnected}
                className={`px-3 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow ${
                  !webcamConnected
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>OFF 🔴</span>
              </button>
            </div>
          </div>

          {/* CAMERA LIST */}
          <div className="space-y-3">
            {cameras.map((cam) => {
              const targetId = cam.deviceId || cam.id;
              const isLive = webcamConnected && (cam.isLiveStream || targetId === selectedDeviceId || cam.id === selectedDeviceId);

              return (
                <div
                  key={cam.id}
                  onClick={() => {
                    setSelectedDeviceId(targetId);
                    handlePairSpecificCamera(targetId, false);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isLive
                      ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-[1.01]'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Camera className={`w-4 h-4 ${isLive ? 'text-emerald-400 animate-pulse' : 'text-cyan-400'}`} />
                      <span className="font-bold text-xs text-white truncate max-w-[180px]">{cam.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                      isLive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isLive ? 'PAIRED LIVE 🟢' : cam.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono">
                    <div>Type: <strong className="text-slate-200">{cam.type.toUpperCase()}</strong></div>
                    <div>FPS: <strong className="text-cyan-400">{cam.fps} FPS</strong></div>
                    <div>Res: <strong className="text-slate-200">{cam.resolution}</strong></div>
                    <div>Signal: <strong className="text-emerald-400">{cam.signalStrength}%</strong></div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE CAMERA PREVIEW WITH REAL-TIME MOTION METER */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl space-y-4 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-bold text-sm text-white">Live Hardware Stream Preview</span>
              </div>
              
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">FPS: <strong className="text-cyan-400">{trackInfo.fps}</strong></span>
                <span className="text-slate-400">{trackInfo.resolution}</span>
                <span className={`px-2.5 py-0.5 rounded font-bold border ${
                  webcamConnected
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}>
                  {webcamConnected ? 'REAL-TIME PAIRED 🟢' : 'DISCONNECTED 🔴'}
                </span>
              </div>
            </div>

            {/* VIDEO FEED CANVAS */}
            <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              
              {webcamConnected && activeWebcamStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-center space-y-4 p-6 z-10">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30">
                    <Camera className="w-10 h-10 text-rose-400 opacity-80" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-sm font-bold text-white">Camera Disconnected (OFF)</p>
                    <p className="text-xs text-slate-400">Click below to enable your live device webcam or AI video feed</p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => handlePairSpecificCamera(selectedDeviceId, false)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
                    >
                      <Wifi className="w-4 h-4" /> Turn Real Camera ON 📹
                    </button>
                    <button
                      onClick={() => handlePairSpecificCamera(selectedDeviceId, true)}
                      className="px-4 py-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 font-mono text-xs font-bold transition"
                    >
                      AI Feed Demo 🤖
                    </button>
                  </div>
                </div>
              )}

              {/* OVERLAY TELEMATICS HUD */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="truncate max-w-[200px]">{trackInfo.label}</span>
              </div>

              {/* LIVE REAL-TIME MOTION SENSOR HUD BAR */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-[10px] font-mono space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Activity className="w-3.5 h-3.5" /> Real-Time Frame Motion Diff:
                  </span>
                  <span className={`font-bold ${motionLevel > 20 ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {motionLevel}% {motionLevel > 20 ? '(Motion Detected)' : '(Stationary)'}
                  </span>
                </div>
                
                {/* Motion Activity Bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-150" 
                    style={{ width: `${motionLevel}%` }}
                  />
                </div>
              </div>

            </div>

            {/* REAL-TIME HARDWARE INFORMATION */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Stream Status: <strong className="text-emerald-400">{webcamConnected ? 'ACTIVE LIVE' : 'DISCONNECTED'}</strong></span>
              <span className="text-slate-400">Resolution: <strong className="text-white">{trackInfo.resolution}</strong></span>
              <span className="text-slate-400">Camera Health: <strong className="text-cyan-400">Optimal (100%)</strong></span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
