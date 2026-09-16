import React from 'react';
import { Cpu, Radio, Zap, Server, Layers } from 'lucide-react';

export const FutureIntegrationPage: React.FC = () => {
  const hardwareNodes = [
    {
      title: "ESP32 Microcontroller",
      badge: "FUTURE READY",
      desc: "Low-cost Wi-Fi module installed at seat berths & restroom doors for direct hardware pulse signals.",
      icon: Cpu,
      color: "border-purple-500/40 bg-purple-950/20 text-purple-400"
    },
    {
      title: "IR Motion Sensors (PIR)",
      badge: "FUTURE READY",
      desc: "Wakes up the camera vision model only when body heat/motion passes through the doorway frame.",
      icon: Zap,
      color: "border-cyan-500/40 bg-cyan-950/20 text-cyan-400"
    },
    {
      title: "Raspberry Pi Edge Computer",
      badge: "FUTURE READY",
      desc: "Runs offline neural inference models locally inside the bus engine bay without cellular cloud dependencies.",
      icon: Server,
      color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-400"
    },
    {
      title: "MQTT Broker & WebSockets",
      badge: "FUTURE READY",
      desc: "Real-time sub-second telemetry sync between bus operators, central dispatch, and driver HUD.",
      icon: Radio,
      color: "border-amber-500/40 bg-amber-950/20 text-amber-400"
    }
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
          <Cpu className="w-4 h-4" />
          <span>Hardware & IoT Architecture Blueprint</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Future Hardware & IoT Integration</h1>
        <p className="text-xs text-slate-400">
          Designed for instant plug-and-play compatibility with low-cost IoT sensors, edge microcontrollers, and cloud AI APIs.
        </p>
      </div>

      {/* ARCHITECTURE DIAGRAM BLUEPRINT CARD */}
      <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> End-to-End System Topology
          </h2>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
            Hardware Abstraction Layer Active
          </span>
        </div>

        {/* Interactive Diagram Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs font-mono">
          
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-purple-400 font-bold block">1. SENSOR LAYER</span>
            <p className="text-slate-300 text-[11px]">IR Door Motion Sensor + ESP32 Berth Nodes</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold block">2. EDGE COMPUTING</span>
            <p className="text-slate-300 text-[11px]">Raspberry Pi 4 Vision Model Processing</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold block">3. PROTOCOL PIPELINE</span>
            <p className="text-slate-300 text-[11px]">MQTT Broker / WebSockets Real-time Bus Sync</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold block">4. OPERATOR HUD</span>
            <p className="text-slate-300 text-[11px]">TripSecure AI Web Platform & Driver Display</p>
          </div>

        </div>
      </div>

      {/* HARDWARE MODULE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hardwareNodes.map((node, idx) => {
          const Icon = node.icon;
          return (
            <div key={idx} className={`p-6 rounded-2xl border backdrop-blur-xl ${node.color} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-white">{node.title}</h3>
                </div>

                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800">
                  {node.badge}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{node.desc}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
