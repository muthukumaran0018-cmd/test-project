import React from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Scan, Users, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { PassengerDetailModal } from '../components/modals/PassengerDetailModal';

export const ConductorDashboardPage: React.FC = () => {
  const { passengers, setCurrentPage, setSelectedPassenger, triggerEmergencyAlert, simulatePassengerReturn } = useApp();

  const missing = passengers.filter(p => p.status === 'OUTSIDE');

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      <PassengerDetailModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Mobile Tablet Conductor Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Conductor On-Boarding Portal</h1>
          <p className="text-xs text-slate-400">Aisle checklist, quick QR verification, and emergency SOS controls.</p>
        </div>

        {/* Emergency SOS Alarm Button */}
        <button
          onClick={() => triggerEmergencyAlert("CONDUCTOR SOS ALARM", "Emergency stop request triggered by bus conductor.")}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/30 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <AlertOctagon className="w-4 h-4 animate-bounce" />
          <span>TRIGGER EMERGENCY SOS</span>
        </button>
      </div>

      {/* QUICK CONDUCTOR ACTIONS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentPage('qr-scanner')}
          className="p-5 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-500/20 transition text-left space-y-2 group"
        >
          <Scan className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-xs text-white">Quick QR Scan</h4>
          <p className="text-[10px] text-slate-400">Verify ticket on entry</p>
        </button>

        <button
          onClick={() => setCurrentPage('seats')}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition text-left space-y-2 group"
        >
          <Users className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-xs text-white">Seat Matrix</h4>
          <p className="text-[10px] text-slate-400">30 Sleeper berths view</p>
        </button>

        <button
          onClick={() => setCurrentPage('camera')}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition text-left space-y-2 group"
        >
          <Smartphone className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-xs text-white">Doorway Camera</h4>
          <p className="text-[10px] text-slate-400">Live AI stream check</p>
        </button>

        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20 text-left space-y-2">
          <AlertTriangle className="w-6 h-6 text-rose-400 animate-pulse" />
          <h4 className="font-bold text-xs text-rose-300">Missing Passengers</h4>
          <p className="text-[10px] text-rose-400 font-bold">{missing.length} Passengers outside</p>
        </div>
      </div>

      {/* PASSENGER AISLE CHECKLIST */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
        <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
          Aisle Passenger Verification Checklist
        </h3>

        <div className="space-y-3">
          {passengers.filter(p => p.status !== 'EMPTY').map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {p.seatNumber}
                </span>
                <div>
                  <h4 className="font-bold text-white">{p.name}</h4>
                  <p className="text-[10px] text-slate-400">Ticket: {p.ticketId} • {p.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {p.status === 'ON_BUS' ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Checked In
                  </span>
                ) : (
                  <button
                    onClick={() => simulatePassengerReturn(p.seatNumber)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition text-xs flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" /> Mark Returned
                  </button>
                )}

                <button
                  onClick={() => setSelectedPassenger(p)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-mono text-[10px]"
                >
                  Ticket &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
