import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell } from 'lucide-react';

export const NotificationCenterPage: React.FC = () => {
  const { alerts, resolveAlert } = useApp();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
          <Bell className="w-4 h-4" />
          <span>Real-Time Audit Log & Toast Notification Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Notification Center</h1>
        <p className="text-xs text-slate-400">
          Complete log of all camera connect/disconnect events, passenger boardings, and departure warnings.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
        <div className="space-y-3">
          {alerts.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  <Bell className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-slate-300 mt-0.5">{item.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">{item.timestamp}</span>
                </div>
              </div>

              {!item.resolved ? (
                <button
                  onClick={() => resolveAlert(item.id)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-xs font-semibold"
                >
                  Mark Read
                </button>
              ) : (
                <span className="text-slate-500 text-xs font-mono">Archived</span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
