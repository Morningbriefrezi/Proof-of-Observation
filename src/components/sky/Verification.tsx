'use client';

import { Satellite, Cloud, Eye, Thermometer, Link2, Wifi, WifiOff, CheckCircle2, Trophy } from 'lucide-react';
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
      <img src={photo} alt="Captured observation" className="w-full max-w-md mx-auto rounded-xl border-2 border-[#34d399]" />

      <Card glow="emerald">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-[#34d399]" />
          <p className="text-[#34d399] font-semibold">Observation Verified!</p>
        </div>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {new Date(timestamp).toLocaleString()} · {latitude.toFixed(4)}°N {longitude.toFixed(4)}°E
        </p>
      </Card>

      {/* FarmHawk card */}
      <div className="glass-card border border-[#22d3ee]/30 p-5 glow-cyan">
        <div className="flex items-center gap-2 mb-4">
          <Satellite size={16} className="text-[#22d3ee]" />
          <p className="text-[#22d3ee] font-semibold text-sm">FarmHawk Satellite Verification</p>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]"><Cloud size={13} /> Cloud Cover</div>
            <span className="text-[var(--text-primary)] font-medium">{farmhawk.cloudCover}%</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]"><Eye size={13} /> Visibility</div>
            <span className={farmhawk.visibility === 'Excellent' ? 'text-[#34d399] font-medium' : farmhawk.visibility === 'Good' ? 'text-[#c9a84c] font-medium' : 'text-red-400 font-medium'}>
              {farmhawk.visibility}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]"><Thermometer size={13} /> Conditions</div>
            <span className="text-[var(--text-primary)] text-right max-w-[55%] text-xs">{farmhawk.conditions}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]"><Link2 size={13} /> Oracle</div>
            <span className="font-hash text-xs text-[var(--text-secondary)]">{farmhawk.oracleHash.slice(0, 10)}...{farmhawk.oracleHash.slice(-6)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[var(--border-glass)]">
          <CheckCircle2 size={14} className="text-[#34d399]" />
          <p className="text-[#34d399] font-semibold text-xs uppercase tracking-wide">Sky Conditions Verified</p>
        </div>
      </div>

      {/* Pollinet card */}
      <Card>
        <div className="flex items-center gap-2 mb-1">
          {pollinet.online ? <Wifi size={14} className="text-[#34d399]" /> : <WifiOff size={14} className="text-amber-400" />}
          <p className="text-[var(--text-secondary)] text-sm font-medium">Pollinet Network</p>
        </div>
        <p className="text-sm text-[var(--text-primary)]">
          {pollinet.online ? 'Online — submitting directly to Solana' : `Offline — mesh relay (${pollinet.peers} peers)`}
        </p>
      </Card>

      <Button variant="brass" onClick={onMint} className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2">
        <Trophy size={18} />
        Mint Observation NFT (+{points} pts)
      </Button>
    </div>
  );
}
