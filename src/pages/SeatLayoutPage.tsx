import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Passenger, SeatStatus } from '../types';
import { Bus } from 'lucide-react';
import { PassengerDetailModal } from '../components/modals/PassengerDetailModal';

export const SeatLayoutPage: React.FC = () => {
  const { passengers, setSelectedPassenger } = useApp();
  const [activeDeck, setActiveDeck] = useState<'both' | 'lower' | 'upper'>('both');

  // Build grid data for 15 Lower seats (L1-L15) and 15 Upper seats (U1-U15)
  const lowerSeats = Array.from({ length: 15 }).map((_, idx) => {
    const seatNo = `L${idx + 1}`;
    return passengers.find(p => p.seatNumber === seatNo) || {
      id: `empty-${seatNo}`,
      name: "Available Seat",
      age: 0,
      gender: "Male" as const,
      seatNumber: seatNo,
      berthType: "Lower" as const,
      ticketId: "N/A",
      qrCodeUrl: "",
      phone: "N/A",
      status: "EMPTY" as SeatStatus,
      verificationStatus: "VERIFIED" as const,
      photoUrl: "",
      boardingTime: "-",
      lastSeenLocation: "Empty Berth"
    };
  });

  const upperSeats = Array.from({ length: 15 }).map((_, idx) => {
    const seatNo = `U${idx + 1}`;
    return passengers.find(p => p.seatNumber === seatNo) || {
      id: `empty-${seatNo}`,
      name: "Available Seat",
      age: 0,
      gender: "Male" as const,
      seatNumber: seatNo,
      berthType: "Upper" as const,
      ticketId: "N/A",
      qrCodeUrl: "",
      phone: "N/A",
      status: "EMPTY" as SeatStatus,
      verificationStatus: "VERIFIED" as const,
      photoUrl: "",
      boardingTime: "-",
      lastSeenLocation: "Empty Berth"
    };
  });

  const getStatusStyles = (status: SeatStatus) => {
    switch (status) {
      case 'ON_BUS':
        return { bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30', badge: 'bg-emerald-500 text-slate-950', glow: 'shadow-emerald-500/20' };
      case 'OUTSIDE':
        return { bg: 'bg-rose-500/25 border-rose-500 text-rose-300 animate-pulse hover:bg-rose-500/40', badge: 'bg-rose-500 text-white', glow: 'shadow-rose-500/40' };
      case 'BOARDING':
        return { bg: 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30', badge: 'bg-amber-500 text-slate-950', glow: 'shadow-amber-500/20' };
      case 'VERIFICATION_PENDING':
        return { bg: 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30', badge: 'bg-blue-500 text-white', glow: 'shadow-blue-500/20' };
      default:
        return { bg: 'bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700', badge: 'bg-slate-800 text-slate-400', glow: '' };
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      <PassengerDetailModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <Bus className="w-4 h-4" />
            <span>2-Level AC Sleeper Layout Visualizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Passenger Seat Matrix</h1>
          <p className="text-xs text-slate-400">Click any berth to view ticket details, QR verification & last seen location.</p>
        </div>

        {/* Deck Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveDeck('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeDeck === 'both' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Both Decks
          </button>
          <button
            onClick={() => setActiveDeck('lower')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeDeck === 'lower' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Lower Deck Only
          </button>
          <button
            onClick={() => setActiveDeck('upper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeDeck === 'upper' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Upper Deck Only
          </button>
        </div>
      </div>

      {/* STATUS LEGEND BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
          <span className="text-slate-300">Green: On Bus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-rose-400 font-bold">Red: Outside Bus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
          <span className="text-slate-300">Yellow: Boarding</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-500" />
          <span className="text-slate-300">Blue: Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-slate-600" />
          <span className="text-slate-400">Gray: Empty</span>
        </div>
      </div>

      {/* SLEEPER BUS CABIN GRAPHICAL VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LOWER DECK CABIN */}
        {(activeDeck === 'both' || activeDeck === 'lower') && (
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl relative space-y-4">
            
            {/* Bus Cabin Header & Driver Cabin Marker */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30">
                  LOWER DECK (L1 - L15)
                </span>
                <span className="text-xs text-slate-400 font-mono">Single & Double Berths</span>
              </div>
              <div className="px-3 py-1 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                [FRONT / DRIVER DOORWAY 🚪]
              </div>
            </div>

            {/* Sleeper Cabin Seat Matrix */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {lowerSeats.map((seat) => {
                const styles = getStatusStyles(seat.status);
                return (
                  <div
                    key={seat.seatNumber}
                    onClick={() => setSelectedPassenger(seat as Passenger)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${styles.bg} ${styles.glow} shadow-md flex flex-col justify-between h-28 relative group`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{seat.seatNumber}</span>
                      <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded ${styles.badge}`}>
                        {seat.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-xs truncate text-slate-100">{seat.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{seat.ticketId}</p>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-800/60 pt-1.5">
                      <span>{seat.berthType}</span>
                      <span className="text-cyan-400 group-hover:underline">Details &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* UPPER DECK CABIN */}
        {(activeDeck === 'both' || activeDeck === 'upper') && (
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-mono text-xs font-bold border border-purple-500/30">
                  UPPER DECK (U1 - U15)
                </span>
                <span className="text-xs text-slate-400 font-mono">Upper Sleeper Deck</span>
              </div>
              <div className="px-3 py-1 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                [LADDER ACCESS 🪜]
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {upperSeats.map((seat) => {
                const styles = getStatusStyles(seat.status);
                return (
                  <div
                    key={seat.seatNumber}
                    onClick={() => setSelectedPassenger(seat as Passenger)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${styles.bg} ${styles.glow} shadow-md flex flex-col justify-between h-28 relative group`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{seat.seatNumber}</span>
                      <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded ${styles.badge}`}>
                        {seat.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-xs truncate text-slate-100">{seat.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{seat.ticketId}</p>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-800/60 pt-1.5">
                      <span>{seat.berthType}</span>
                      <span className="text-cyan-400 group-hover:underline">Details &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
