import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Download, Filter, UserCheck, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PassengerDetailModal } from '../components/modals/PassengerDetailModal';

export const PassengerManagementPage: React.FC = () => {
  const { passengers, setSelectedPassenger } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'seatNumber' | 'name' | 'status'>('seatNumber');

  const filteredPassengers = passengers.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortField === 'seatNumber') return a.seatNumber.localeCompare(b.seatNumber);
    if (sortField === 'name') return a.name.localeCompare(b.name);
    return a.status.localeCompare(b.status);
  });

  const exportCSV = () => {
    const headers = ["Seat Number", "Name", "Ticket ID", "Phone", "Gender", "Age", "Status", "Boarding Time", "Exit Time"];
    const rows = filteredPassengers.map(p => [
      p.seatNumber,
      `"${p.name}"`,
      p.ticketId,
      p.phone,
      p.gender,
      p.age,
      p.status,
      p.boardingTime,
      p.exitTime || '-'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TripSecure_Passenger_Manifest_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      <PassengerDetailModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Smart Passenger Accountability Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Passenger Manifest & Verification Log</h1>
          <p className="text-xs text-slate-400">Real-time status tracking for all sleeper bus tickets.</p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Manifest CSV
        </button>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search passenger, seat L1, ticket..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {['ALL', 'ON_BUS', 'OUTSIDE', 'BOARDING', 'VERIFICATION_PENDING'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {status === 'ALL' ? 'All Seats' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Sort Field */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Sort:</span>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="seatNumber">Seat Number</option>
            <option value="name">Passenger Name</option>
            <option value="status">Status</option>
          </select>
        </div>

      </div>

      {/* DATA GRID TABLE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4">Seat</th>
                <th className="py-3.5 px-4">Passenger</th>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4">Hardware Connection</th>
                <th className="py-3.5 px-4">Last Verification</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPassengers.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  
                  {/* Seat Number */}
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {p.seatNumber}
                    </span>
                  </td>

                  {/* Passenger Photo & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                            {p.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.age} yrs • {p.gender}</p>
                      </div>
                    </div>
                  </td>

                  {/* Ticket ID */}
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {p.ticketId}
                  </td>

                  {/* Phone */}
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {p.phone}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {p.status === 'ON_BUS' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> On Bus
                      </span>
                    )}
                    {p.status === 'OUTSIDE' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/25 text-rose-400 font-bold border border-rose-500/40 animate-pulse flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" /> Outside Bus
                      </span>
                    )}
                    {p.status === 'BOARDING' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30 flex items-center gap-1 w-fit">
                        Boarding
                      </span>
                    )}
                    {p.status === 'VERIFICATION_PENDING' && (
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30 flex items-center gap-1 w-fit">
                        Pending
                      </span>
                    )}
                    {p.status === 'EMPTY' && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px]">
                        Empty
                      </span>
                    )}
                  </td>

                  {/* Hardware Connection Column */}
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1 w-fit">
                      {p.seatNumber.startsWith('L') ? 'ESP32 Berth Node (Wi-Fi)' : 'USB Door Cam 01 (1080p)'}
                    </span>
                  </td>

                  {/* Last Verification */}
                  <td className="py-3 px-4 text-[11px] text-slate-400 truncate max-w-[200px]">
                    {p.lastSeenLocation}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedPassenger(p)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-300 transition flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
