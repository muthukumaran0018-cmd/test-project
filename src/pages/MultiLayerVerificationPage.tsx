import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scan, 
  Camera, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Eye,
  Layers
} from 'lucide-react';

export const MultiLayerVerificationPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    { num: 1, title: "QR Ticket Scan", desc: "Passenger scans QR ticket upon return", icon: Scan, detail: "Validates ticket identity & seat number" },
    { num: 2, title: "System Database Check", desc: "Verifies seat assignment", icon: Cpu, detail: "Confirms active ticket booking status" },
    { num: 3, title: "Doorway AI Detection", desc: "Entrance camera detects motion", icon: Camera, detail: "Generates neural bounding box over doorway" },
    { num: 4, title: "AI Physical Motion Match", desc: "Confirms body passage", icon: Eye, detail: "Ensures person physically entered sleeper cabin" },
    { num: 5, title: "Status Sync to ON BUS", desc: "Greenlights departure HUD", icon: CheckCircle2, detail: "Updates seat status to ON BUS" }
  ];

  const edgeCases = [
    {
      title: "QR Scanned but Camera No Motion",
      result: "Verification Pending (Blue Badge)",
      desc: "Prevents a passenger from scanning their ticket for someone else without physically entering.",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    {
      title: "Camera Motion Detected without QR Scan",
      result: "Unknown Passenger Warning (Yellow/Red Alert)",
      desc: "Alerts conductor if an unauthorized individual boards the sleeper bus.",
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30"
    },
    {
      title: "Passenger Exits at Dinner Stop",
      result: "Status updated to Outside Bus (Red Badge)",
      desc: "Bus door exit sensor triggers status change, locking departure until return.",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    }
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Core Flagship Security Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Multi-Layer Passenger Verification System</h1>
        <p className="text-xs text-slate-400">
          Why Multi-Layer Verification solves 100% of the failures of traditional facial recognition in sleeper bus travel.
        </p>
      </div>

      {/* SYSTEM ARCHITECTURE HIGHLIGHT CARD */}
      <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono border border-cyan-500/30">
              <Layers className="w-3.5 h-3.5" /> 3-Pillar Verification Architecture
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Identity + Physical Entrance = Zero Left Behind Passengers
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">1. QR Ticket</span>
                <span className="text-slate-300">Confirms <strong className="text-white">WHO</strong> is boarding.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">2. Entrance Camera</span>
                <span className="text-slate-300">Confirms <strong className="text-white">THAT</strong> a person entered.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-indigo-400 font-bold block mb-1">3. AI Motion Engine</span>
                <span className="text-slate-300">Verifies <strong className="text-white">MOVEMENT</strong> direction.</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-2 shrink-0 max-w-xs">
            <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold">Future Sensor Ready</span>
            <p className="text-slate-400 leading-relaxed">
              Future IR motion sensors wake the camera only when movement occurs near the bus doorway, reducing power consumption on long highway journeys.
            </p>
          </div>

        </div>
      </div>

      {/* STEP-BY-STEP INTERACTIVE WORKFLOW SIMULATOR */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono uppercase text-cyan-400 font-bold">
            Interactive Verification Flow Visualizer
          </h3>
          <span className="text-xs text-slate-400">Step {activeStep} of 5</span>
        </div>

        {/* Step Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.num;
            const isCompleted = activeStep > s.num;

            return (
              <div
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
                    : isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold">STEP 0{s.num}</span>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-white mb-1">{s.title}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-2">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Stepper Detail View */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="space-y-1">
            <span className="text-cyan-400 font-mono font-bold">ACTIVE STEP {activeStep}: {steps[activeStep - 1].title}</span>
            <p className="text-slate-300">{steps[activeStep - 1].detail}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveStep(prev => (prev > 1 ? prev - 1 : 5))}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 font-mono"
            >
              &larr; Prev Step
            </button>
            <button
              onClick={() => setActiveStep(prev => (prev < 5 ? prev + 1 : 1))}
              className="px-3 py-1.5 rounded bg-cyan-500 text-slate-950 font-bold font-mono"
            >
              Next Step &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* WHY TRADITIONAL FACE RECOGNITION FAILS VS MULTI-LAYER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Failures Solved Card */}
        <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-4">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Flaws of Face-Recognition Only Systems
          </h3>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Face Masks & Caps:</strong> Passengers returning from dinner stops wear masks or hoodies, failing camera face matching.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Night Travel & Low Light:</strong> Highway sleeper bus stops occur between 11 PM and 4 AM with pitch-black lighting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Similar Looking Passengers:</strong> High rate of false positives between relatives or similar facial structures.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Camera Occlusion:</strong> Luggage bags or crowds blocking camera lens during boarding.</span>
            </li>
          </ul>
        </div>

        {/* Multi-Layer Edge Cases Logic */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Multi-Layer Fail-Safe Logic
          </h3>

          <div className="space-y-3">
            {edgeCases.map((ec, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{ec.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${ec.badgeColor}`}>
                    {ec.result}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{ec.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
