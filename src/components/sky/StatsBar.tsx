'use client';

import { Telescope, Sparkles, Award } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { getRank } from '@/lib/rewards';

const TOTAL = 5;

export default function StatsBar() {
  const { state } = useAppState();
  const completed = state.completedMissions.filter(m => m.status === 'completed');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalStars = completed.reduce((sum, m) => sum + (m.stars ?? (m as any).points ?? 0), 0);
  const count = completed.length;
  const rank = getRank(count);
  const pct = (count / TOTAL) * 100;

  const stats = [
    { icon: <Telescope size={13} />, label: 'Observations', display: `${count}/${TOTAL}`, color: '#FFD166' },
    { icon: <Sparkles size={13} />, label: 'Stars', display: `${totalStars} ✦`, color: '#38F0FF' },
    { icon: <Award size={13} />, label: 'Rank', display: rank.name, color: '#a78bfa' },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-xl p-3 sm:p-4 text-center"
            style={{
              background: `linear-gradient(145deg, ${s.color}0D 0%, ${s.color}05 100%)`,
              border: `1px solid ${s.color}1A`,
            }}
          >
            <div className="flex items-center justify-center gap-1 mb-1.5" style={{ color: s.color, opacity: 0.5 }}>
              {s.icon}
              <span className="text-[9px] uppercase tracking-widest font-medium">{s.label}</span>
            </div>
            <p className="font-bold text-lg sm:text-xl leading-none" style={{ color: s.color }}>
              {s.display}
            </p>
          </div>
        ))}
      </div>

      {/* Progress track */}
      <div className="space-y-2">
        <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: count >= TOTAL
                ? 'linear-gradient(90deg, #34d399, #38F0FF)'
                : 'linear-gradient(90deg, #FFD166 0%, #38F0FF 100%)',
              boxShadow: count > 0 ? '0 0 8px rgba(255,209,102,0.4)' : 'none',
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL }, (_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: i < count ? '#38F0FF' : 'rgba(148,163,184,0.15)',
                  boxShadow: i < count ? '0 0 4px rgba(56,240,255,0.5)' : 'none',
                }}
              />
            ))}
          </div>
          {count >= TOTAL
            ? <span className="text-[10px] text-[#34d399] font-semibold tracking-wide">All missions complete ✦</span>
            : <span className="text-[10px] text-slate-600">{TOTAL - count} mission{TOTAL - count !== 1 ? 's' : ''} remaining</span>
          }
        </div>
      </div>
    </div>
  );
}
