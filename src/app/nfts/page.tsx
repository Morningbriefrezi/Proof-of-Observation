'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import type { CompletedMission } from '@/lib/types';

function NFTCard({ mission, onDelete }: { mission: CompletedMission; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);

  const isPending = mission.status === 'pending';
  return (
    <div className={`bg-[#111c30] rounded-xl overflow-hidden flex flex-col border ${isPending ? 'border-amber-500/60' : 'border-[#1a2d4d]'}`}>
      <img src={mission.photo} alt={mission.name} className="w-full aspect-[4/3] object-cover" />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">{mission.emoji}</span>
          <p className="font-semibold text-white">{mission.name}</p>
        </div>
        <p className="text-slate-400 text-xs">{new Date(mission.timestamp).toLocaleString()}</p>
        <div className="flex items-center gap-2">
          <p className="text-[#c9a84c] font-bold">+{mission.points} pts</p>
          {isPending && <span className="text-amber-400 text-xs">⏳ Pending</span>}
        </div>
        <div className="flex gap-3 text-xs text-slate-400">
          {mission.farmhawk ? <span>☁️ {mission.farmhawk.cloudCover}% clouds</span> : <span>☁️ —</span>}
          <span>{mission.pollinet.mode === 'direct' ? '🟢 Direct' : mission.pollinet.mode === 'queued' ? '📡 Queued' : '📡 Mesh'}</span>
        </div>
        {isPending ? (
          <p className="text-amber-400 text-xs italic">Awaiting connectivity to verify & mint</p>
        ) : (
          <p className="font-mono text-xs text-slate-500 truncate">
            {mission.txId.slice(0, 8)}...{mission.txId.slice(-8)}
          </p>
        )}

        <div className="flex gap-2 mt-auto pt-2">
          <a
            href={isPending ? '#' : `https://explorer.solana.com/tx/${mission.txId}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs px-2 py-1.5 border border-[#1a2d4d] hover:border-[#22d3ee] text-slate-400 hover:text-[#22d3ee] rounded transition-all"
          >
            🔗 Explorer
          </a>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="flex-1 text-xs px-2 py-1.5 border border-[#1a2d4d] hover:border-red-500 text-slate-400 hover:text-red-400 rounded transition-all"
            >
              🗑️ Delete
            </button>
          ) : (
            <div className="flex-1 flex gap-1">
              <button
                onClick={onDelete}
                className="flex-1 text-xs px-2 py-1.5 bg-red-500/20 border border-red-500 text-red-400 rounded transition-all"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 text-xs px-2 py-1.5 border border-[#1a2d4d] text-slate-400 rounded transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NFTsPage() {
  const { state, removeMission } = useAppState();
  const clubDone = state.walletConnected && state.membershipMinted && !!state.telescope;
  const nfts = [...state.completedMissions].reverse();

  if (!clubDone) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-4xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold text-[#c9a84c] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Join AstroClub First
        </h2>
        <Link href="/club" className="px-6 py-3 bg-gradient-to-r from-[#c9a84c] to-[#a07840] text-black font-bold rounded-lg hover:from-[#d4b05c] transition-all duration-200">
          🏛️ Go to AstroClub →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>
            🖼️ NFT Gallery
          </h1>
          <p className="text-slate-400 mt-1">{nfts.length} observation{nfts.length !== 1 ? 's' : ''} minted</p>
        </div>
        {nfts.length > 0 && (
          <Link href="/sky" className="text-sm text-[#22d3ee] hover:underline">
            + Add more →
          </Link>
        )}
      </div>

      {nfts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#1a2d4d] rounded-xl">
          <p className="text-4xl mb-4">🌌</p>
          <p className="text-slate-400 mb-4">No observations minted yet</p>
          <Link href="/sky" className="px-6 py-3 bg-gradient-to-r from-[#c9a84c] to-[#a07840] text-black font-bold rounded-lg">
            🔭 Start Observing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {nfts.map(m => (
            <NFTCard key={m.txId} mission={m} onDelete={() => removeMission(m.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
