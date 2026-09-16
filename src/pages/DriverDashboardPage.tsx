import React from 'react';
import { useApp } from '../context/AppContext';
import { Bus, CheckCircle2, AlertOctagon, Sun, Moon, Eye } from 'lucide-react';

export const DriverDashboardPage: React.FC = () => {
  const { 
    passengers, 
    tripInfo, 
    nightMode, 
    setNightMode,
    drowsinessState,
    triggerDriverSleepiness,
    resetDriverDrowsiness
  } = useApp();

  const missingCount = passengers.filter(p => p.status === 'OUTSIDE' || p.status === 'VERIFICATION_PENDING').length;
  const isSafe = missingCount === 0;
  const isSleeping = drowsinessState.status === 'SLEEPING';

  return (
    <div className={`min-h-[calc(100vh-4rem)] p-6 flex flex-col justify-between transition-colors ${
      nightMode ? 'bg-black text-white' : 'bg-slate-900 text-slate-100'
    }`}>
      
      {/* HUD HEADER BAR */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <Bus className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono uppercase tracking-wider text-slate-300">
              DRIVER HUD • BUS KA 01 F 9922
            </h1>
            <p className="text-xs text-slate-400">Hubli Rest Stop • Route: {tripInfo.routeName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSleeping ? (
            <button
              onClick={resetDriverDrowsiness}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg transition"
            >
              Reset Sleepiness Alarm
            </button>
          ) : (
            <button
              onClick={triggerDriverSleepiness}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Simulate Sleepiness Alarm</span>
            </button>
          )}

          <button
            onClick={() => setNightMode(!nightMode)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold hover:border-cyan-500/40 transition flex items-center gap-2"
          >
            {nightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            <span>{nightMode ? 'OLED Night Vision: ON' : 'OLED Night Vision: OFF'}</span>
          </button>
        </div>
      </div>

      {/* DROWSINESS ALARM STROBE OVERLAY */}
      {isSleeping && (
        <div className="my-4 p-6 rounded-2xl border-4 border-rose-600 bg-rose-950/90 text-white shadow-2xl animate-bounce text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <AlertOctagon className="w-12 h-12 text-white animate-spin" />
            <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
              🚨 DROWSINESS DETECTED! WAKE UP!
            </h2>
          </div>
          <p className="text-xs font-mono text-rose-200">
            Eye Closure & Microsleep Threshold Exceeded • Loud Audio Alarm Playing
          </p>
        </div>
      )}

      {/* HUGE DEPARTURE STATUS INDICATOR */}
      <div className="my-auto text-center space-y-6">
        {isSafe ? (
          <div className="p-12 rounded-3xl border-4 border-emerald-500 bg-emerald-950/40 glow-emerald max-w-4xl mx-auto space-y-4">
            <CheckCircle2 className="w-24 h-24 text-emerald-400 mx-auto animate-bounce" />
            <h2 className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-emerald-400">
              SAFE TO DEPART
            </h2>
            <p className="text-lg sm:text-xl font-mono text-emerald-200">
              100% Passengers Verified Onboard ({passengers.filter(p => p.status === 'ON_BUS').length} / {passengers.filter(p => p.status !== 'EMPTY').length})
            </p>
          </div>
        ) : (
          <div className="p-12 rounded-3xl border-4 border-rose-600 bg-rose-950/60 glow-rose max-w-4xl mx-auto space-y-4 animate-pulse">
            <AlertOctagon className="w-24 h-24 text-rose-500 mx-auto" />
            <h2 className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-rose-400">
              PASSENGER MISSING
            </h2>
            <p className="text-xl sm:text-2xl font-mono text-rose-200 font-bold">
              ⚠️ DO NOT DEPART • {missingCount} PASSENGER(S) OUTSIDE
            </p>
            <div className="inline-block px-6 py-2 rounded-full bg-rose-500 text-white font-mono text-sm font-bold">
              HOLD ENGINE START
            </div>
          </div>
        )}
      </div>

      {/* FOOTER QUICK HUD METRICS */}
      <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 text-center font-mono">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
          <span className="text-xs text-slate-500 block">GPS Speed</span>
          <span className="text-xl font-bold text-cyan-400">{tripInfo.gpsStatus.speed}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
          <span className="text-xs text-slate-500 block">Departure Timer</span>
          <span className="text-xl font-bold text-amber-400">{tripInfo.departureTime}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
          <span className="text-xs text-slate-500 block">Camera Telematics</span>
          <span className="text-xl font-bold text-emerald-400">30 FPS (Active)</span>
        </div>
      </div>

    </div>
  );
};
