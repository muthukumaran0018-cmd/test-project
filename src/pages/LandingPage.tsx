import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bus, 
  ShieldCheck, 
  Scan, 
  Radio, 
  AlertTriangle, 
  ArrowRight, 
  Cpu, 
  Zap, 
  Smartphone, 
  ChevronDown, 
  Eye,
  Camera
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    { label: "Left Behind Incidents Prevented", value: "3,840+", suffix: "Incidents" },
    { label: "Verification Accuracy Rate", value: "99.98%", suffix: "Multi-Layer" },
    { label: "Stop Countdown Savings", value: "14.5 min", suffix: "Avg per stop" },
    { label: "Active Sleeper Bus Fleet", value: "520+", suffix: "Buses" },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Multi-Layer Verification",
      description: "Combines QR Ticket Scan + Doorway AI Camera + Motion Sensors. Eliminates 100% of facial recognition errors caused by masks or dark sleeper cabins."
    },
    {
      icon: Bus,
      title: "Sleeper Seat Matrix HUD",
      description: "Real-time 2-level berth tracking (Lower & Upper Deck). Visual color-coded status badges for instant driver and conductor verification."
    },
    {
      icon: Radio,
      title: "Smart Camera Pair Wizard",
      description: "Pair browser webcams, RTSP streams, ESP32-CAMs, or Raspberry Pi modules in seconds with smartphone-like pairing speed."
    },
    {
      icon: AlertTriangle,
      title: "Emergency Departure Lock",
      description: "Automatic audio-visual emergency hold if the bus attempts departure while a passenger remains outside at dinner or fuel stops."
    },
    {
      icon: Smartphone,
      title: "Driver & Conductor HUD",
      description: "Dedicated night-vision driver screen displaying a massive 'SAFE TO DEPART' or 'PASSENGER MISSING' indicator for zero-distraction safety."
    },
    {
      icon: Cpu,
      title: "Future IoT Ready",
      description: "Architected for direct integration with MQTT brokers, IR door motion triggers, and cloud vision models."
    }
  ];

  const faqs = [
    {
      q: "Why is TripSecure AI better than simple Face Recognition?",
      a: "Facial recognition frequently fails during night travel, in dim sleeper cabins, or when passengers wear masks/caps. TripSecure AI uses a Multi-Layer approach: scanning a QR ticket confirms WHO is boarding, while the Entrance AI Camera confirms THAT a physical body entered. This dual-verification eliminates false readings completely."
    },
    {
      q: "Does this require expensive hardware setup on existing sleeper buses?",
      a: "No! TripSecure AI can run on standard smartphones or low-cost USB/IP cameras mounted near the bus doorway. It also supports ESP32-CAM and Raspberry Pi modules."
    },
    {
      q: "What happens if a passenger leaves their smartphone inside the bus during a dinner stop?",
      a: "When re-entering, the passenger presents their printed or digital QR ticket. The AI camera confirms their movement through the entrance, updating their seat status from 'Outside' to 'On Bus'."
    },
    {
      q: "Can drivers depart if a passenger is still missing?",
      a: "The Driver HUD presents a high-contrast 'PASSENGER MISSING' warning and locks departure readiness. Fleet managers and conductors can also trigger voice/audio alarms."
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Dynamic Cyber Grid & Animated Particles */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wide uppercase shadow-lg shadow-cyan-500/10">
            <Zap className="w-4 h-4 animate-bounce" />
            <span>Next-Gen Passenger Accountability Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            Never Leave a <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Passenger Behind Again.
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            TripSecure AI combines <strong className="text-cyan-300">QR Ticket Verification</strong>, <strong className="text-emerald-300">Entrance Camera Motion AI</strong>, and real-time sleeper bus seat monitoring into a foolproof safety platform for bus operators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentPage('multi-layer')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Explore Multi-Layer Architecture</span>
            </button>
          </div>
        </div>

        {/* INTERACTIVE ANIMATED BUS HUD PREVIEW */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-2xl shadow-cyan-500/10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs text-slate-400 ml-2">KA 01 F 9922 - Sleeper AC (Hubli Stop)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                AI Active (99.98% Conf)
              </span>
            </div>
          </div>

          {/* Sleeper Bus Illustration Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-6 rounded-xl border border-slate-800/80">
            {/* Lower Deck */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Lower Deck Berth Matrix</span>
                <span className="text-[11px] text-emerald-400 font-mono">14 / 15 Passengers Onboard</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const isMissing = i === 1;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-center font-mono text-xs transition-all ${
                        isMissing
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse shadow-lg shadow-rose-500/20'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">L{i + 1}</div>
                      <div className="font-bold">{isMissing ? 'OUT' : 'IN'}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upper Deck */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Upper Deck Berth Matrix</span>
                <span className="text-[11px] text-emerald-400 font-mono">10 / 11 Passengers Onboard</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const isMissing = i === 1;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-center font-mono text-xs transition-all ${
                        isMissing
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">U{i + 1}</div>
                      <div className="font-bold">{isMissing ? 'OUT' : 'IN'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <AlertTriangle className="w-4 h-4" /> 2 Passengers currently outside (Priya Sharma L2, Sneha Reddy U2)
            </span>
            <button
              onClick={() => setCurrentPage('seats')}
              className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Open Full Interactive Sleeper Layout &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                <span className="text-[10px] font-mono text-cyan-400/80">{stat.suffix}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">Enterprise Capabilities</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered specifically for luxury sleeper buses</h3>
          <p className="text-slate-400 text-sm sm:text-base">
            Every feature is built around the real-world friction of highway night stops, diner breaks, and sleeper berth monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md hover:border-cyan-500/40 transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS MULTI-LAYER DEMO SECTION */}
      <section className="py-20 border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Multi-Layer Accountability</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How TripSecure AI Works</h2>
            <p className="text-slate-400 text-sm">Three synchronized verification layers deliver 100% precision without false alarms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <div className="text-xs font-mono text-cyan-400 mb-2 font-bold">LAYER 01</div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Scan className="w-5 h-5 text-cyan-400" /> QR Ticket Scan
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Passenger scans digital QR ticket upon return from rest stop. Confirms WHO is attempting to board and matches seat number.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <div className="text-xs font-mono text-emerald-400 mb-2 font-bold">LAYER 02</div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" /> Doorway AI Camera
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Entrance camera detects person passing through door frame, creating animated bounding box confirmation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <div className="text-xs font-mono text-indigo-400 mb-2 font-bold">LAYER 03</div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" /> Seat Status Sync
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                System matches QR identity with physical entrance event. Updates seat status to "ON BUS" and greenlights departure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left font-semibold text-sm sm:text-base text-white flex items-center justify-between"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs sm:text-sm text-slate-400 border-t border-slate-800/60 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white text-sm">TripSecure AI</span>
            <span>&copy; 2026 Smart Passenger Accountability System.</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Version 2.4-Production</span>
            <span>Multi-Layer Engine Active</span>
            <span>Next.js App Router Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
