'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ExternalLink, Trash2, Clock, CheckCircle2, Cloud, Wifi } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { getUnlockedRewards, getRank } from '@/lib/rewards';
import type { CompletedMission } from '@/lib/types';

function openExplorer(mission: CompletedMission) {
  if (mission.method !== 'onchain' || !mission.txId || mission.txId.length < 40) {
    alert('This observation was recorded locally.\nConnect Phantom wallet with devnet SOL for real on-chain proof.');
    return;
  }
  window.open(`https://explorer.solana.com/tx/${mission.txId}?cluster=devnet`, '_blank', 'noopener,noreferrer');
}

function ProofCard({ mission, onDelete }: { mission: CompletedMission; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const isPending = mission.status === 'pending';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const displayStars = mission.stars ?? (mission as any).points ?? 0;
  const isRealTx = !isPending && mission.method === 'onchain' && !!mission.txId && mission.txId.length >= 40;

  return (
    <div className={`glass-card rounded-xl overflow-hidden flex flex-col ${isPending ? '!border-amber-500/50' : ''}`} style={isPending ? { borderColor: 'rgba(245,158,11,0.5)' } : {}}>
      <img src={mission.photo} alt={mission.name} className="w-full aspect-[4/3] object-cover" />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">{mission.emoji}</span>
          <p className="font-semibold text-white">{mission.name}</p>
        </div>
        <p className="text-slate-400 text-xs">{new Date(mission.timestamp).toLocaleString()}</p>
        <div className="flex items-center gap-2">
          <p className="text-[#c9a84c] font-bold">+{displayStars} stars ✦</p>
          {isPending && <span className="text-amber-400 text-xs">⏳ Pending</span>}
        </div>
        <div className="flex gap-3 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1"><Cloud size={11} />{mission.farmhawk ? `${mission.farmhawk.cloudCover}%` : '—'}</span>
          <span className="flex items-center gap-1"><Wifi size={11} />{mission.pollinet.mode}</span>
        </div>
        {isPending ? (
          <p className="text-amber-400 text-xs italic flex items-center gap-1"><Clock size={11} /> Awaiting connectivity</p>
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-hash text-xs text-[var(--text-dim)] truncate flex-1">
              {mission.txId.slice(0, 8)}...{mission.txId.slice(-8)}
            </p>
            {isRealTx && (
              <span className="text-[#34d399] text-xs shrink-0">✅ On-chain</span>
            )}
            {!isRealTx && !isPending && (
              <span className="text-amber-400 text-xs shrink-0">⚠️ Local</span>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-2">
          <button
            onClick={() => openExplorer(mission)}
            className={`flex-1 text-center text-xs px-2 py-1.5 border rounded transition-all flex items-center justify-center gap-1 ${
              isRealTx
                ? 'border-[#1a2d4d] hover:border-[#22d3ee] text-slate-400 hover:text-[#22d3ee]'
                : 'border-[#1a2d4d] text-slate-600 cursor-default'
            }`}
          >
            <ExternalLink size={12} /> {isRealTx ? 'Explorer →' : 'Local only'}
          </button>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="flex-1 text-xs px-2 py-1.5 border border-[#1a2d4d] hover:border-red-500 text-slate-400 hover:text-red-400 rounded transition-all flex items-center justify-center gap-1"
            >
              <Trash2 size={12} /> Delete
            </button>
          ) : (
            <div className="flex-1 flex gap-1">
              <button onClick={onDelete} className="flex-1 text-xs px-2 py-1.5 bg-red-500/20 border border-red-500 text-red-400 rounded">Confirm</button>
              <button onClick={() => setConfirming(false)} className="flex-1 text-xs px-2 py-1.5 border border-[#1a2d4d] text-slate-400 rounded">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProofPage() {
  const { state, removeMission } = useAppState();
  const clubDone = state.walletConnected && state.membershipMinted && !!state.telescope;
  const proofs = [...state.completedMissions].reverse();

  if (!clubDone) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-4xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold text-[#c9a84c] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Join Club First
        </h2>
        <Link href="/club" className="px-6 py-3 bg-gradient-to-r from-[#c9a84c] to-[#a07840] text-black font-bold rounded-lg hover:from-[#d4b05c] transition-all duration-200">
          Join Club ✦
        </Link>
      </div>
    );
  }

  const isEmailWallet = typeof window !== 'undefined' && !!localStorage.getItem('poo_wallet_email');
  const completedIds = state.completedMissions.filter(m => m.status === 'completed').map(m => m.id);
  const rank = getRank(completedIds.length).name;
  const rewards = getUnlockedRewards(completedIds, rank);
  const unlockedCount = rewards.filter(r => r.unlocked).length;
  const nextReward = rewards.find(r => !r.unlocked && r.progress > 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>
            My NFTs
          </h1>
          <p className="text-slate-400 mt-1">{proofs.length} observation{proofs.length !== 1 ? 's' : ''} sealed on Solana</p>
        </div>
        {proofs.length > 0 && (
          <Link href="/missions" className="text-sm text-[#22d3ee] hover:underline">
            + Add more →
          </Link>
        )}
      </div>

      {/* Email wallet banner */}
      {isEmailWallet && (
        <div className="glass-card border border-amber-500/30 p-4 mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-amber-400 text-sm font-medium">📧 Email Wallet — observations saved locally</p>
            <p className="text-slate-500 text-xs">Connect Phantom for real on-chain transactions</p>
          </div>
          <Link href="/club" className="text-xs px-3 py-1.5 border border-amber-500/50 text-amber-400 rounded hover:bg-amber-500/10 transition-all whitespace-nowrap">
            Connect →
          </Link>
        </div>
      )}

      {/* Rewards summary */}
      <div className="glass-card border border-[#c9a84c]/20 p-4 mb-6 flex flex-col gap-2">
        <p className="text-[#c9a84c] text-sm font-semibold">
          Rewards: {unlockedCount}/{rewards.length} unlocked
          {nextReward && (
            <span className="text-slate-400 font-normal"> · Next: {nextReward.name}</span>
          )}
        </p>
        {nextReward?.requiredMissions && (
          <p className="text-slate-500 text-xs">
            Observe {nextReward.requiredMissions.filter(id => !completedIds.includes(id)).join(', ')} to unlock
          </p>
        )}
        <Link href="/missions" className="text-[#22d3ee] text-xs hover:underline">
          View All Rewards →
        </Link>
      </div>

      {proofs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#1a2d4d] rounded-xl">
          <p className="text-4xl mb-4">🌌</p>
          <p className="text-slate-400 mb-4">No observations minted yet</p>
          <Link href="/missions" className="px-6 py-3 bg-gradient-to-r from-[#c9a84c] to-[#a07840] text-black font-bold rounded-lg">
            Begin Observation →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {proofs.map(m => (
            <ProofCard key={m.txId} mission={m} onDelete={() => removeMission(m.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
