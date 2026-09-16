import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home,
  LayoutDashboard, 
  Users, 
  Camera, 
  ScanLine, 
  Clock, 
  AlertOctagon, 
  Bus as DriverIcon, 
  Smartphone, 
  BarChart, 
  Cpu, 
  Settings, 
  LogIn,
  UserCheck,
  ShieldCheck,
  Bell
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, alerts } = useApp();

  const menuSections = [
    {
      title: "Core Platform",
      items: [
        { id: 'landing', label: 'Landing Page', icon: Home },
        { id: 'auth', label: 'Authentication', icon: LogIn },
        { id: 'dashboard', label: 'Operational Dashboard', icon: LayoutDashboard },
        { id: 'seats', label: 'Sleeper Seat Layout', icon: Users },
        { id: 'passengers', label: 'Passenger Directory', icon: UserCheck },
      ]
    },
    {
      title: "AI & Verification Engine",
      items: [
        { id: 'camera', label: 'Smart Camera Pair', icon: Camera },
        { id: 'ai-detection', label: 'AI Motion & Bounding Box', icon: ScanLine },
        { id: 'driver-drowsiness', label: 'Driver Drowsiness AI', icon: ShieldCheck },
        { id: 'qr-scanner', label: 'QR Ticket Scanner', icon: ScanLine },
        { id: 'multi-layer', label: 'Multi-Layer AI Logic', icon: ShieldCheck },
        { id: 'timeline', label: 'Live Boarding Timeline', icon: Clock },
      ]
    },
    {
      title: "Operations & Safety",
      items: [
        { id: 'alert-center', label: 'Departure Alert Center', icon: AlertOctagon, badge: alerts.filter(a => !a.resolved).length },
        { id: 'driver-hud', label: 'Driver Night HUD', icon: DriverIcon },
        { id: 'conductor-app', label: 'Conductor Tablet View', icon: Smartphone },
        { id: 'notifications', label: 'Live Notification Log', icon: Bell },
        { id: 'analytics', label: 'Analytics & Trends', icon: BarChart },
      ]
    },
    {
      title: "System Architecture",
      items: [
        { id: 'future-hardware', label: 'Future Hardware Sync', icon: Cpu },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-slate-950/60 backdrop-blur-lg min-h-[calc(100vh-4rem)] p-4 space-y-6">
      {menuSections.map((section, idx) => (
        <div key={idx} className="space-y-1.5">
          <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            {section.title}
          </h4>
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
};
