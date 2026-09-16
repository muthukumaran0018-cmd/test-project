import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Sun, Sliders } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, soundEnabled, setSoundEnabled } = useApp();
  const [aiThreshold, setAiThreshold] = useState(95);
  const [resolution, setResolution] = useState('1080p');

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
          <Settings className="w-4 h-4" />
          <span>System Preferences & Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Application Settings</h1>
        <p className="text-xs text-slate-400">Configure theme, AI confidence sliders, and telematics hardware rules.</p>
      </div>

      <div className="space-y-6">
        
        {/* Appearance & Theme */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" /> Interface Appearance
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="font-bold text-white block">Theme Mode</span>
              <span className="text-slate-400 text-[11px]">Current: {theme === 'dark' ? 'Dark Futuristic' : 'Light Mode'}</span>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:border-cyan-400 transition"
            >
              Toggle Theme
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="font-bold text-white block">System Sound Alerts</span>
              <span className="text-slate-400 text-[11px]">Audio feedback on scan & missing passenger alarms</span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                soundEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>
        </div>

        {/* AI & Camera Rules */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> AI Detection Thresholds
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Minimum AI Confidence Score:</span>
              <strong className="text-cyan-400 font-bold">{aiThreshold}%</strong>
            </div>
            <input
              type="range"
              min="80"
              max="99"
              value={aiThreshold}
              onChange={(e) => setAiThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-300 font-bold">Default Stream Resolution</span>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
            >
              <option value="720p">720p HD</option>
              <option value="1080p">1080p Full HD</option>
              <option value="4K">4K UHD</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
};
