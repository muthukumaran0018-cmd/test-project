import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bus, 
  ShieldCheck, 
  Bell, 
  Sun, 
  Moon, 
  Camera, 
  Scan, 
  Cpu, 
  Users, 
  BarChart3, 
  AlertTriangle,
  Radio,
  UserCheck,
  Smartphone
} from 'lucide-react';
import type { SystemRole } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    theme, 
    toggleTheme, 
    currentPage, 
    setCurrentPage, 
    alerts,
    webcamConnected
  } = useApp();

  const unreadAlertsCount = alerts.filter(a => !a.resolved).length;

  const roleLabels: Record<SystemRole, { title: string; color: string }> = {
    admin: { title: 'System Admin', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    operator: { title: 'Fleet Operator', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    driver: { title: 'Bus Driver', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    conductor: { title: 'Conductor', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  };

  const navItems = [
    { id: 'landing', label: 'Home', icon: Bus },
    { id: 'dashboard', label: 'Dashboard', icon: Cpu },
    { id: 'seats', label: 'Seat Layout', icon: Users },
    { id: 'passengers', label: 'Passengers', icon: UserCheck },
    { id: 'camera', label: 'Camera Connect', icon: Camera },
    { id: 'ai-detection', label: 'AI Detect', icon: Radio },
    { id: 'driver-drowsiness', label: 'Driver Drowsiness', icon: ShieldCheck },
    { id: 'qr-scanner', label: 'QR Scan', icon: Scan },
    { id: 'multi-layer', label: 'Multi-Layer AI', icon: ShieldCheck },
    { id: 'timeline', label: 'Timeline', icon: Smartphone },
    { id: 'alert-center', label: 'Alert Center', icon: AlertTriangle, badge: unreadAlertsCount },
    { id: 'driver-hud', label: 'Driver HUD', icon: Bus },
    { id: 'conductor-app', label: 'Conductor', icon: Smartphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentPage('landing')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-white bg-clip-text text-transparent">
                  TripSecure
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  AI v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-mono">Smart Passenger Accountability</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1">
            {navItems.slice(0, 8).map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Controls & Quick Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Live Camera Badge */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
              <span className={`w-2 h-2 rounded-full ${webcamConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-300 font-mono text-[11px]">
                {webcamConnected ? 'Live Cam Paired' : 'Sim Cam Active'}
              </span>
            </div>

            {/* System Role Selector */}
            <div className="relative group">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as SystemRole)}
                className={`appearance-none px-3 py-1.5 rounded-lg text-xs font-semibold border backdrop-blur-md cursor-pointer transition-all focus:outline-none ${roleLabels[role].color}`}
              >
                <option value="operator" className="bg-slate-900 text-slate-200">Role: Fleet Operator</option>
                <option value="driver" className="bg-slate-900 text-slate-200">Role: Bus Driver</option>
                <option value="conductor" className="bg-slate-900 text-slate-200">Role: Conductor</option>
                <option value="admin" className="bg-slate-900 text-slate-200">Role: System Admin</option>
              </select>
            </div>

            {/* Alert Center Trigger */}
            <button
              onClick={() => setCurrentPage('alert-center')}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              title="Alert Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg animate-bounce">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
