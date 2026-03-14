'use client';

import type { FarmHawkResult, PollinetStatus } from '@/lib/types';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';

interface VerificationProps {
  photo: string;
  farmhawk: FarmHawkResult;
  pollinet: PollinetStatus;
  points: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  onMint: () => void;
}

export default function Verification({ photo, farmhawk, pollinet, points, timestamp, latitude, longitude, onMint }: VerificationProps) {
  return (
    <div className="flex flex-col gap-4">
      <img src={photo} alt="Captured observation" className="w-full max-w-md mx-auto rounded-lg border-2 border-[#34d399]" />

      <Card glow="emerald">
        <p className="text-[#34d399] font-semibold">✅ Observation Verified!</p>
        <p className="text-slate-400 text-sm mt-1">
          {new Date(timestamp).toLocaleString()} · {latitude.toFixed(4)}°N {longitude.toFixed(4)}°E
        </p>
      </Card>

      {/* FarmHawk card */}
      <div className="bg-[#111c30] border border-[#22d3ee]/40 rounded-xl p-5 glow-cyan">
        <p className="text-[#22d3ee] font-semibold mb-3">🛰️ FarmHawk Satellite Verification</p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">☁️ Cloud Cover</span>
            <span className="text-white font-medium">{farmhawk.cloudCover}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">👁️ Visibility</span>
            <span className={
              farmhawk.visibility === 'Excellent' ? 'text-[#34d399] font-medium' :
              farmhawk.visibility === 'Good' ? 'text-[#c9a84c] font-medium' : 'text-red-400 font-medium'
            }>{farmhawk.visibility}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">🌡️ Conditions</span>
            <span className="text-white text-right max-w-[55%]">{farmhawk.conditions}</span>
          </div>
          <div className="flex justify-between items-start mt-1">
            <span className="text-slate-400">⛓️ Oracle Hash</span>
            <span className="font-mono text-xs text-slate-300">{farmhawk.oracleHash.slice(0, 10)}...{farmhawk.oracleHash.slice(-6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">📡 Scanned</span>
            <span className="text-slate-300 text-xs">{new Date(farmhawk.scanTimestamp).toLocaleTimeString()}</span>
          </div>
        </div>
        <p className="text-[#34d399] font-semibold text-sm mt-3">✅ SKY CONDITIONS VERIFIED</p>
      </div>

      {/* Pollinet card */}
      <Card>
        <p className="text-slate-300 font-medium text-sm mb-2">📡 Pollinet Network Status</p>
        <p className="text-sm">{pollinet.icon} {pollinet.online ? 'Online — Submitting directly to Solana' : `Offline — Queued for mesh relay (${pollinet.peers} peers)`}</p>
      </Card>

      <Button variant="brass" onClick={onMint} className="w-full text-lg py-3">
        🏆 Mint Observation NFT (+{points} pts)
      </Button>
    </div>
  );
}
