'use client';

import { useState } from 'react';
import type { Mission, FarmHawkResult, PollinetStatus, MissionState } from '@/lib/types';
import { verifyWithFarmHawk } from '@/lib/farmhawk';
import { getPollinetStatus } from '@/lib/pollinet';
import { mintObservation } from '@/lib/solana';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAppState } from '@/hooks/useAppState';
import { getUnlockedRewards, getRank } from '@/lib/rewards';
import CameraCapture from './CameraCapture';
import Verification from './Verification';
import MintAnimation from '@/components/shared/MintAnimation';
import Button from '@/components/shared/Button';
import { Copy, Check } from 'lucide-react';

interface MissionActiveProps {
  mission: Mission;
  onClose: () => void;
}

interface NewReward {
  icon: string;
  name: string;
  description: string;
  code?: string;
}

export default function MissionActive({ mission, onClose }: MissionActiveProps) {
  const { state, addMission } = useAppState();
  const wallet = useWallet();
  const [step, setStep] = useState<MissionState>('observing');
  const [photo, setPhoto] = useState('');
  const [farmhawk, setFarmhawk] = useState<FarmHawkResult | null>(null);
  const [pollinet, setPollinet] = useState<PollinetStatus | null>(null);
  const [coords, setCoords] = useState({ lat: 41.7151, lon: 44.8271 });
  const [timestamp, setTimestamp] = useState('');
  const [mintDone, setMintDone] = useState(false);
  const [newRewards, setNewRewards] = useState<NewReward[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCapture = async (p: string) => {
    setPhoto(p);
    const ts = new Date().toISOString();
    setTimestamp(ts);

    let lat = 41.7151, lon = 44.8271;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 5000 })
      );
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    } catch {
      console.log('[GPS] Unavailable, using Tbilisi coords');
    }
    setCoords({ lat, lon });

    const ps = getPollinetStatus();
    setPollinet(ps);

    if (!navigator.onLine) {
      console.log('[Pollinet] Offline — queuing observation');
      addMission({
        id: mission.id,
        name: mission.name,
        emoji: mission.emoji,
        stars: mission.stars,
        txId: 'pending',
        photo: p,
        timestamp: ts,
        latitude: lat,
        longitude: lon,
        farmhawk: null,
        pollinet: { mode: 'queued', peers: ps.peers },
        status: 'pending',
      });
      onClose();
      return;
    }

    setStep('verifying');
    console.log('[Verify] Starting FarmHawk verification');
    const fh = await verifyWithFarmHawk(lat, lon);
    setFarmhawk(fh);
    setStep('verified');
  };

  const handleMint = async () => {
    setStep('minting');
    console.log('[Mint] Creating observation proof for', mission.name);

    // Snapshot unlocked rewards before minting
    const prevCompleted = state.completedMissions
      .filter(m => m.status === 'completed')
      .map(m => m.id);
    const prevRank = getRank(prevCompleted.length).name;
    const prevUnlocked = getUnlockedRewards(prevCompleted, prevRank)
      .filter(r => r.unlocked)
      .map(r => r.id);

    const result = await mintObservation(wallet, {
      target: mission.name,
      timestamp,
      lat: coords.lat,
      lon: coords.lon,
      cloudCover: farmhawk?.cloudCover ?? 0,
      oracleHash: farmhawk?.oracleHash ?? 'sim',
      stars: mission.stars,
    });
    setMintDone(true);
    setTimeout(() => {
      const newCompleted = [...prevCompleted, mission.id];
      const newRank = getRank(newCompleted.length).name;
      const nowUnlocked = getUnlockedRewards(newCompleted, newRank).filter(r => r.unlocked);
      const justUnlocked = nowUnlocked.filter(r => !prevUnlocked.includes(r.id));

      addMission({
        id: mission.id,
        name: mission.name,
        emoji: mission.emoji,
        stars: mission.stars,
        txId: result.txId,
        photo,
        timestamp,
        latitude: coords.lat,
        longitude: coords.lon,
        farmhawk: farmhawk!,
        pollinet: { mode: pollinet!.mode, peers: pollinet!.peers },
        status: 'completed',
        method: result.method,
      });

      if (justUnlocked.length > 0) {
        setNewRewards(justUnlocked.map(r => ({ icon: r.icon, name: r.name, description: r.description, code: r.code })));
      } else {
        setStep('done');
        onClose();
      }
    }, 1200);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Reward unlock modal
  if (newRewards.length > 0) {
    return (
      <div className="fixed inset-0 z-50 bg-[#05080f]/95 overflow-y-auto flex items-center justify-center p-4">
        <div className="glass-card glow-emerald max-w-sm w-full p-6 flex flex-col gap-4 text-center">
          <p className="text-4xl">🎉</p>
          <h2 className="text-xl font-bold text-[#34d399]">Reward Unlocked!</h2>
          {newRewards.map(r => (
            <div key={r.name} className="bg-[#0f1a2e] border border-[#34d399]/30 rounded-xl p-4 text-left flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <p className="font-semibold text-white">{r.name}</p>
                  <p className="text-slate-400 text-sm">{r.description}</p>
                </div>
              </div>
              {r.code && (
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-[#05080f] border border-[#1a2d4d] px-2 py-1 rounded text-xs text-[#c9a84c] font-mono flex-1">{r.code}</code>
                  <button onClick={() => copyCode(r.code!)} className="p-1.5 border border-[#1a2d4d] hover:border-[#22d3ee] rounded text-slate-400 hover:text-[#22d3ee] transition-all">
                    {copiedCode === r.code ? <Check size={12} className="text-[#34d399]" /> : <Copy size={12} />}
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-3">
            <a href="https://astroman.ge" target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center text-xs py-2 px-3 border border-[#c9a84c]/50 text-[#c9a84c] rounded hover:bg-[#c9a84c]/10 transition-all">
              Visit astroman.ge →
            </a>
            <button onClick={() => { setStep('done'); onClose(); }}
              className="flex-1 text-xs py-2 px-3 bg-[#34d399]/10 border border-[#34d399]/50 text-[#34d399] rounded hover:bg-[#34d399]/20 transition-all">
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#05080f]/95 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{mission.emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{mission.name}</h2>
              <p className="text-slate-400 text-sm">{mission.desc}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl px-2">✕</button>
        </div>

        {step === 'observing' && (
          <div className="flex flex-col gap-4">
            <div className="border-2 border-dashed border-[#1a2d4d] rounded-xl p-8 text-center">
              <p className="text-4xl mb-4">🔭</p>
              <p className="text-slate-300 mb-2">Point your telescope at <span className="text-[#c9a84c]">{mission.name}</span></p>
              <p className="text-slate-500 text-sm italic">{mission.hint}</p>
            </div>
            <Button variant="brass" onClick={() => setStep('camera')} className="w-full">
              Begin Observation →
            </Button>
          </div>
        )}

        {step === 'camera' && (
          <CameraCapture missionName={mission.name} onCapture={handleCapture} />
        )}

        {step === 'verifying' && (
          <div className="text-center py-12">
            <p className="text-4xl animate-spin-slow mb-4">🛰️</p>
            <p className="text-[#22d3ee] font-semibold">Scanning sky conditions at your location...</p>
            <p className="text-slate-400 text-sm mt-2">Verify with Satellite 🛰️</p>
          </div>
        )}

        {step === 'verified' && farmhawk && pollinet && (
          <Verification
            photo={photo}
            farmhawk={farmhawk}
            pollinet={pollinet}
            stars={mission.stars}
            timestamp={timestamp}
            latitude={coords.lat}
            longitude={coords.lon}
            onMint={handleMint}
          />
        )}

        {step === 'minting' && <MintAnimation done={mintDone} />}
      </div>
    </div>
  );
}
