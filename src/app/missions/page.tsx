'use client';

import Link from 'next/link';
import { Telescope } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import StatsBar from '@/components/sky/StatsBar';
import MissionList from '@/components/sky/MissionList';
import ObservationLog from '@/components/sky/ObservationLog';
import RewardsSection from '@/components/sky/RewardsSection';

export default function MissionsPage() {
  const { state } = useAppState();
  const clubDone = state.walletConnected && state.membershipMinted && !!state.telescope;

  if (!clubDone) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-4xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold text-[#c9a84c] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Join Club First
        </h2>
        <p className="text-slate-400 mb-6">Complete the three setup steps to unlock Missions.</p>
        <Link
          href="/club"
          className="px-6 py-3 bg-gradient-to-r from-[#c9a84c] to-[#a07840] text-black font-bold rounded-lg hover:from-[#d4b05c] transition-all duration-200"
        >
          Join Club ✦
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#22d3ee] flex items-center gap-3" style={{ fontFamily: 'Georgia, serif' }}>
          <Telescope size={28} strokeWidth={1.5} className="text-[#22d3ee]" />
          Tonight&apos;s Missions
        </h1>
        <p className="text-slate-400 mt-1">Observe. Verify. Collect.</p>
      </div>

      <StatsBar />
      <MissionList />
      <RewardsSection />
      <ObservationLog />
    </div>
  );
}
