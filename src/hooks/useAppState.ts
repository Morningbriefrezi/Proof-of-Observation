'use client';

import { createContext, useContext, useState, useEffect, ReactNode, createElement } from 'react';
import type { AppState, CompletedMission } from '@/lib/types';
import { verifyWithFarmHawk } from '@/lib/farmhawk';
import { mintNFT } from '@/lib/solana';
import { initPollinetSync } from '@/lib/pollinet';

const defaultState: AppState = {
  walletConnected: false,
  walletAddress: '',
  membershipMinted: false,
  membershipTx: '',
  telescope: null,
  telescopeTx: '',
  completedMissions: [],
  claimedRewards: [],
};

interface AppStateCtx {
  state: AppState;
  setWallet: (address: string) => void;
  setMembership: (tx: string) => void;
  setTelescope: (data: { brand: string; model: string; aperture: string }, tx: string) => void;
  addMission: (mission: CompletedMission) => void;
  removeMission: (id: string) => void;
  claimReward: (id: string) => void;
  pendingCount: number;
  reset: () => void;
}

const Ctx = createContext<AppStateCtx | null>(null);
const STORAGE_KEY = 'stellar_state';

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setState({ ...defaultState, ...JSON.parse(saved) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  // Process pending queue when back online via Pollinet IndexedDB sync
  useEffect(() => {
    const cleanup = initPollinetSync(async (m) => {
      const fh = await verifyWithFarmHawk(m.latitude, m.longitude);
      const result = await mintNFT(`${m.name} Observation`, 'OBS');
      setState(prev => ({
        ...prev,
        completedMissions: prev.completedMissions.map(x =>
          x.id === m.id ? { ...x, farmhawk: fh, txId: result.txId, status: 'completed' as const } : x
        ),
      }));
    });
    return cleanup;
  }, [loaded]);

  const update = (patch: Partial<AppState>) => setState(s => ({ ...s, ...patch }));

  const ctx: AppStateCtx = {
    state,
    setWallet: (address) => update({ walletConnected: true, walletAddress: address }),
    setMembership: (tx) => update({ membershipMinted: true, membershipTx: tx }),
    setTelescope: (data, tx) => update({ telescope: data, telescopeTx: tx }),
    addMission: (mission) => setState(s => ({
      ...s,
      completedMissions: [...s.completedMissions.filter(m => m.id !== mission.id), mission],
    })),
    removeMission: (id) => setState(s => ({
      ...s,
      completedMissions: s.completedMissions.filter(m => m.id !== id),
    })),
    claimReward: (id) => setState(s => ({
      ...s,
      claimedRewards: s.claimedRewards.includes(id) ? s.claimedRewards : [...s.claimedRewards, id],
    })),
    pendingCount: state.completedMissions.filter(m => m.status === 'pending').length,
    reset: () => { localStorage.removeItem(STORAGE_KEY); setState(defaultState); },
  };

  return createElement(Ctx.Provider, { value: ctx }, children);
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState outside provider');
  return ctx;
}
