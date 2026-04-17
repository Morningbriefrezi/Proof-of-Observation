'use client';

import type { Mission } from '@/lib/types';

interface Props {
  mission: Mission;
  peakTime: string | null;
  tagline: string;
  onStart: () => void;
}

export default function PrimeTargetCard({ mission, peakTime, tagline, onStart }: Props) {
  return (
    <div
      className="absolute left-3 right-3 bottom-3 px-4 py-3.5"
      style={{
        background: 'rgba(6,9,18,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid var(--stl-border-gold)',
        borderRadius: 'var(--stl-r-lg)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-1.5 h-1.5 rounded-full stl-tw" style={{ background: 'var(--stl-gold)' }} />
        <span className="stl-mono-kicker" style={{ color: 'var(--stl-gold)' }}>
          PRIME TARGET{peakTime ? ` · PEAKS ${peakTime}` : ''}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="stl-display-lg" style={{ color: 'var(--stl-text-bright)' }}>{mission.name}</div>
          <div className="stl-body-sm mt-0.5" style={{ color: 'var(--stl-text-muted)' }}>{tagline}</div>
        </div>
        <button
          onClick={onStart}
          className="flex-shrink-0 py-2.5 px-4 rounded-[10px] font-semibold transition-all active:scale-[0.97] hover:opacity-90"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, var(--stl-gold), var(--stl-gold-dim))',
            color: '#0a0a0a',
            fontSize: 13,
          }}
        >
          Begin · +{mission.stars} ✦
        </button>
      </div>
    </div>
  );
}
