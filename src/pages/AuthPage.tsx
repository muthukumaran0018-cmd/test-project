import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { SystemRole } from '../types';
import { Bus, Shield, User, Key, Fingerprint, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { setRole, setCurrentPage } = useApp();
  const [selectedRole, setSelectedRole] = useState<SystemRole>('operator');
  const [accessKey, setAccessKey] = useState('TS-8842-SECURE');
  const [isScanning, setIsScanning] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const roles: { id: SystemRole; title: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'operator', title: 'Fleet Operator', desc: 'Full fleet monitoring, alert logs & analytics', icon: Bus },
    { id: 'driver', title: 'Bus Driver', desc: 'Minimal high-contrast departure HUD', icon: SteeringWheelIcon },
    { id: 'conductor', title: 'Conductor', desc: 'Seat passenger checklist & QR scanner', icon: User },
    { id: 'admin', title: 'System Admin', desc: 'Camera configuration & hardware sync', icon: Shield },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setAuthenticated(true);
      setRole(selectedRole);
      setTimeout(() => {
        if (selectedRole === 'driver') setCurrentPage('driver-hud');
        else if (selectedRole === 'conductor') setCurrentPage('conductor-app');
        else setCurrentPage('dashboard');
      }, 800);
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 cyber-grid bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl shadow-cyan-500/10">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2">
            <Bus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">TripSecure AI Portal</h2>
          <p className="text-xs text-slate-400">Select system role to access operational dashboard</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <Icon className="w-4 h-4" />
                  <span>{r.title}</span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{r.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Access Key / Operator ID</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                placeholder="Enter access key..."
                required
              />
            </div>
          </div>

          {/* Biometric Scan Simulation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center space-y-3">
            <div className="flex items-center justify-center">
              <div className={`p-4 rounded-full border transition-all ${
                isScanning 
                  ? 'border-cyan-400 bg-cyan-500/20 animate-pulse'
                  : authenticated
                  ? 'border-emerald-400 bg-emerald-500/20'
                  : 'border-slate-700 bg-slate-900'
              }`}>
                {authenticated ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <Fingerprint className={`w-8 h-8 ${isScanning ? 'text-cyan-400 animate-spin' : 'text-slate-400'}`} />
                )}
              </div>
            </div>
            <p className="text-xs font-mono text-slate-400">
              {isScanning ? 'Verifying Biometric Hash...' : authenticated ? 'Authentication Successful!' : 'Click login to verify biometric key'}
            </p>
          </div>

          <button
            type="submit"
            disabled={isScanning || authenticated}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/20 transition flex items-center justify-center gap-2"
          >
            <span>Authenticate as {roles.find(r => r.id === selectedRole)?.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-[10px] text-slate-500 font-mono">
            Demo Portal • Multi-Role Access • 256-bit Encrypted
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper SteeringWheel icon
function SteeringWheelIcon(props: { className?: string }) {
  return (
    <svg className={props.className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 016.93 6H15a3 3 0 00-6 0H5.07A7 7 0 0112 5zm-7 8h3.07a3 3 0 005.86 0H19a7 7 0 01-14 0z" />
    </svg>
  );
}
