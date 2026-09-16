import React from 'react';
import { analyticsData } from '../data/demoData';
import { BarChart3, TrendingUp, ShieldCheck, Clock, Award } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Fleet Safety Analytics & Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Passenger Accountability Analytics</h1>
        <p className="text-xs text-slate-400">
          Historical trend analysis of rest stop boarding delays, prevented left-behind incidents, and AI precision scores.
        </p>
      </div>

      {/* METRIC HIGHLIGHT STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Total Trips Completed</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{analyticsData.systemStats.tripsCompleted}</div>
          <p className="text-[10px] text-emerald-400 mt-1">+12% vs last month</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Passengers Accounted</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{analyticsData.systemStats.passengersAccounted}</div>
          <p className="text-[10px] text-slate-400 mt-1">100% Zero left behind</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Incidents Prevented</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">{analyticsData.systemStats.leftBehindIncidentsPrevented}</div>
          <p className="text-[10px] text-rose-300 mt-1">Saved from stranded stops</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">AI Verification Precision</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono">{analyticsData.systemStats.verificationAccuracy}</div>
          <p className="text-[10px] text-slate-400 mt-1">Multi-Layer benchmark</p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PASSENGER BOARDING TREND CHART */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
          <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold">
            Live Trip Passenger Boarding Curve (Target vs Actual)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.passengerTrends}>
                <defs>
                  <linearGradient id="colorBoarded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', fontSize: '12px' }} />
                <Area type="monotone" dataKey="boarded" stroke="#00f0ff" fillOpacity={1} fill="url(#colorBoarded)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LATE BOARDING BY STOP CHART */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
          <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold">
            Incidents Saved vs On-Time Boarding by Highway Stop
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.lateBoardingByStop}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="stop" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', fontSize: '12px' }} />
                <Bar dataKey="onTime" fill="#10b981" radius={[4, 4, 0, 0]} name="On Time" />
                <Bar dataKey="leftBehindSaved" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Incidents Prevented" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
