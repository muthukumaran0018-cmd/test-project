import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock } from 'lucide-react';

export const BoardingTimelinePage: React.FC = () => {
  const { timeline } = useApp();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
          <Clock className="w-4 h-4" />
          <span>Real-Time Event Stream</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Boarding & Exit Timeline</h1>
        <p className="text-xs text-slate-400">
          Chronological audit trail of all passenger exits, QR ticket scans, and AI entrance events at rest stops.
        </p>
      </div>

      {/* TIMELINE EVENT LIST */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-6">
        
        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
          {timeline.map((evt) => {
            const isSuccess = evt.type === 'success';
            const isWarning = evt.type === 'warning';
            const isDanger = evt.type === 'danger';

            return (
              <div key={evt.id} className="relative group">
                
                {/* Timeline Dot */}
                <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isSuccess 
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                    : isWarning
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
                    : isDanger
                    ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30 animate-ping'
                    : 'bg-cyan-500 border-cyan-400 text-slate-950'
                }`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>

                {/* Event Card */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-cyan-500/40 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        Seat {evt.seatNumber}
                      </span>
                      <h4 className="font-bold text-sm text-white">{evt.passengerName}</h4>
                      <span className="text-xs text-slate-400 capitalize">({evt.action})</span>
                    </div>

                    <span className="font-mono text-xs text-slate-400">{evt.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{evt.details}</p>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
