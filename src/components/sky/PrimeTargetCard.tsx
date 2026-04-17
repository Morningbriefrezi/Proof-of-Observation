'use client';

import type { Mission } from '@/lib/types';

interface Props {
  mission: Mission;
  peakTime: string | null;
  tagline: string;
  skyStatus?: { verified: boolean; cloudCover: number; visibility: string } | null;
  onStart: () => void;
}

export default function PrimeTargetCard({ mission, peakTime, tagline, skyStatus, onStart }: Props) {
  return (
    <div
      className="px-3.5 py-2.5 sm:px-4 sm:py-3"
      style={{
        fontFamily: 'var(--font-display)',
        background: 'linear-gradient(135deg, rgba(255,209,102,0.05), rgba(6,9,18,0.7))',
        border: '1px solid var(--stl-border-gold)',
        borderRadius: 'var(--stl-r-md)',
      }}
    >
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full stl-tw" style={{ background: 'var(--stl-gold)' }} />
          <span
            className="text-[9px] font-semibold uppercase"
            style={{ letterSpacing: '0.18em', color: 'var(--stl-gold)' }}
          >
            Prime Target{peakTime ? ` · Peaks ${peakTime}` : ''}
          </span>
        </div>
        {skyStatus && (
          <span
            className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
            style={{
              background: skyStatus.verified ? 'rgba(52,211,153,0.08)' : 'rgba(245,158,11,0.08)',
              border: skyStatus.verified ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(245,158,11,0.25)',
              color: skyStatus.verified ? 'var(--stl-green)' : '#F59E0B',
            }}
          >
            {skyStatus.verified ? `Clear · ${skyStatus.cloudCover}%` : `Cloudy · ${skyStatus.cloudCover}%`}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div
            className="truncate"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(17px, 3vw, 21px)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              color: 'var(--stl-text-bright)',
            }}
          >
            {mission.name}
          </div>
          <div
            className="mt-0.5 truncate"
            style={{ fontSize: 12, color: 'var(--stl-text-muted)' }}
          >
            {tagline}
          </div>
        </div>
        <button
          onClick={onStart}
          className="flex-shrink-0 py-1.5 px-3 rounded-lg font-semibold transition-all active:scale-[0.97] hover:brightness-110"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, var(--stl-gold), var(--stl-gold-dim))',
            color: '#0a0a0a',
            fontSize: 12,
          }}
        >
          Begin · +{mission.stars} ✦
        </button>
      </div>
    </div>
  );
}
