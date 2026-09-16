import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertOctagon, Volume2, Phone, CheckCircle2, UserCheck } from 'lucide-react';

export const AlertCenterPage: React.FC = () => {
  const { passengers, alerts, resolveAlert, simulatePassengerReturn } = useApp();
  const [voiceAlertPlaying, setVoiceAlertPlaying] = useState(false);

  const missingPassengers = passengers.filter(p => p.status === 'OUTSIDE' || p.status === 'VERIFICATION_PENDING');

  const speakVoiceAlert = () => {
    if (!('speechSynthesis' in window)) return;
    setVoiceAlertPlaying(true);
    const text = missingPassengers.length > 0 
      ? `Warning! ${missingPassengers.length} passengers are missing from the sleeper bus. Departure hold is active.` 
      : `All passengers accounted for. Safe to depart.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.onend = () => setVoiceAlertPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto rounded-3xl transition-colors ${
      missingPassengers.length > 0 ? 'animate-alarm-flash border border-rose-500/50' : ''
    }`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono mb-1">
            <AlertOctagon className="w-4 h-4 animate-bounce" />
            <span>Pre-Departure Departure Hold Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Smart Departure Safety & Alert Center</h1>
          <p className="text-xs text-slate-400">
            Automatic pre-departure evaluation locks departure if any booked passenger remains outside.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={speakVoiceAlert}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              voiceAlertPlaying ? 'bg-cyan-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{voiceAlertPlaying ? 'Playing Voice Alert...' : 'Play Voice Alert'}</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY DEPARTURE STATUS BANNER */}
      {missingPassengers.length > 0 ? (
        <div className="p-6 rounded-2xl border-2 border-rose-500 bg-rose-950/40 text-rose-200 shadow-2xl shadow-rose-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-rose-500 text-white animate-ping">
                <AlertOctagon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">DEPARTURE BLOCKED • PASSENGER MISSING</h2>
                <p className="text-xs text-rose-300">
                  {missingPassengers.length} passenger(s) have not re-boarded after the Hubli stop.
                </p>
              </div>
            </div>
            
            <span className="px-4 py-2 rounded-xl bg-rose-600 text-white font-mono text-sm font-bold uppercase tracking-wider">
              HOLD ACTIVE
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl border-2 border-emerald-500 bg-emerald-950/30 text-emerald-200 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div>
                <h2 className="text-2xl font-extrabold text-white">ALL PASSENGERS ACCOUNTED FOR</h2>
                <p className="text-xs text-emerald-300">Multi-Layer AI confirmed 100% seat verification.</p>
              </div>
            </div>
            <span className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-mono text-sm font-bold">
              SAFE TO DEPART
            </span>
          </div>
        </div>
      )}

      {/* MISSING PASSENGERS DETAILED CARDS */}
      {missingPassengers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase text-rose-400 font-bold tracking-wider">
            Unaccounted Passengers ({missingPassengers.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missingPassengers.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl border border-rose-500/40 bg-slate-900/90 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-rose-500">
                      {p.photoUrl ? (
                        <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCheck className="w-6 h-6 text-slate-400 m-2" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{p.name}</h4>
                      <p className="text-xs text-slate-400">Seat <strong className="text-cyan-400 font-mono">{p.seatNumber}</strong> • {p.phone}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-mono text-xs font-bold border border-rose-500/30">
                    OUTSIDE
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p>Exit Time: <strong className="text-amber-400 font-mono">{p.exitTime || '21:40 IST'}</strong></p>
                  <p>Last Sensor Location: <strong className="text-white">{p.lastSeenLocation}</strong></p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => simulatePassengerReturn(p.seatNumber)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    Mark as Returned
                  </button>
                  <a
                    href={`tel:${p.phone}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs transition flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Passenger
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM ALERTS LOG */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
        <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">Alert History & Resolution Log</h3>
        
        <div className="space-y-3">
          {alerts.map((alt) => (
            <div key={alt.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    alt.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {alt.priority}
                  </span>
                  <span className="font-bold text-white">{alt.title}</span>
                </div>
                <p className="text-slate-400">{alt.message}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500 text-[10px]">{alt.timestamp}</span>
                {!alt.resolved ? (
                  <button
                    onClick={() => resolveAlert(alt.id)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-[11px]"
                  >
                    Resolve
                  </button>
                ) : (
                  <span className="text-emerald-400 font-bold">Resolved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
