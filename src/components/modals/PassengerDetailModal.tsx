import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Phone, Ticket, Clock, MapPin, CheckCircle, AlertTriangle, Shield, UserCheck, Fingerprint } from 'lucide-react';

export const PassengerDetailModal: React.FC = () => {
  const { selectedPassenger, setSelectedPassenger, simulatePassengerReturn, simulatePassengerExit, verifyBiometric } = useApp();
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricResult, setBiometricResult] = useState<string | null>(null);

  if (!selectedPassenger) return null;

  const handleFingerprintScan = async () => {
    setBiometricScanning(true);
    const res = await verifyBiometric(selectedPassenger.seatNumber);
    setBiometricScanning(false);
    setBiometricResult(res.hash);
  };

  const statusColors = {
    ON_BUS: { label: 'On Bus', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40' },
    OUTSIDE: { label: 'Outside Bus', bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/40' },
    BOARDING: { label: 'Boarding', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40' },
    VERIFICATION_PENDING: { label: 'Verification Pending', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40' },
    EMPTY: { label: 'Seat Empty', bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/40' },
  };

  const currentStatus = statusColors[selectedPassenger.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/10">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedPassenger(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-500/50 bg-slate-800 flex items-center justify-center">
            {selectedPassenger.photoUrl ? (
              <img src={selectedPassenger.photoUrl} alt={selectedPassenger.name} className="w-full h-full object-cover" />
            ) : (
              <UserCheck className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{selectedPassenger.name}</h3>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
                {currentStatus.label}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Seat <span className="font-mono text-cyan-400 font-bold">{selectedPassenger.seatNumber}</span> ({selectedPassenger.berthType} Berth) • {selectedPassenger.age} yrs • {selectedPassenger.gender}
            </p>
          </div>
        </div>

        {/* Ticket & Contact Info */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Ticket className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ticket ID</span>
            </div>
            <p className="font-mono text-sm font-bold text-slate-200">{selectedPassenger.ticketId}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phone Contact</span>
            </div>
            <p className="font-mono text-xs font-bold text-slate-200">{selectedPassenger.phone}</p>
          </div>
        </div>

        {/* Status Timeline Details */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-6 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> Boarded Bus At:
            </span>
            <span className="font-mono font-semibold text-slate-200">{selectedPassenger.boardingTime}</span>
          </div>

          {selectedPassenger.exitTime && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Exit Time (Rest Stop):
              </span>
              <span className="font-mono font-semibold text-amber-400">{selectedPassenger.exitTime}</span>
            </div>
          )}

          {selectedPassenger.returnTime && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Re-Boarded Time:
              </span>
              <span className="font-mono font-semibold text-emerald-400">{selectedPassenger.returnTime}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-start gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span>Last Sensor Verification: <strong className="text-slate-200">{selectedPassenger.lastSeenLocation}</strong></span>
          </div>
        </div>

        {/* QR Code Preview & Multi-Layer Badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <img src={selectedPassenger.qrCodeUrl} alt="QR Code" className="w-12 h-12" />
            </div>
            <div>
              <p className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Multi-Layer Verified
              </p>
              <p className="text-[11px] text-slate-400">QR Code + AI Entrance Cam matched</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
            100% Match
          </span>
        </div>

        {/* BIOMETRIC FINGERPRINT SCANNER CARD */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border transition ${
              biometricScanning ? 'bg-cyan-500/20 border-cyan-400 animate-pulse' : 'bg-slate-900 border-slate-800'
            }`}>
              <Fingerprint className={`w-5 h-5 ${biometricResult ? 'text-emerald-400' : 'text-cyan-400'}`} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Biometric Fingerprint Sensor</span>
              <span className="text-[10px] font-mono text-slate-400">
                {biometricResult ? `Hash: ${biometricResult}` : 'Click to scan passenger fingerprint'}
              </span>
            </div>
          </div>

          <button
            onClick={handleFingerprintScan}
            disabled={biometricScanning}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 transition"
          >
            {biometricScanning ? 'Scanning...' : 'Scan Print'}
          </button>
        </div>

        {/* Quick Simulation Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              simulatePassengerReturn(selectedPassenger.seatNumber);
              setSelectedPassenger(null);
            }}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Mark as Returned (On Bus)
          </button>

          <button
            onClick={() => {
              simulatePassengerExit(selectedPassenger.seatNumber);
              setSelectedPassenger(null);
            }}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-rose-600/80 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            Mark as Exit (Outside)
          </button>
        </div>

      </div>
    </div>
  );
};
