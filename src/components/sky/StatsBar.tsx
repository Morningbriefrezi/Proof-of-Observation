'use client';

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

  return (
    <div className="mb-6">
      {/* Stat row */}
      <div className="flex items-center justify-between mb-4 px-1">
        {[
          { label: 'Observations', value: `${count}/${TOTAL}` },
          { label: 'Stars',        value: `${totalStars} ✦` },
          { label: 'Rank',         value: rank.name },
        ].map((s, i) => (
          <div key={s.label} className={`text-center ${i === 1 ? 'border-x border-white/5 px-6' : ''}`}>
            <p className="text-white font-bold text-lg leading-none">{s.value}</p>
            <p className="text-slate-600 text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-px rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: count >= TOTAL ? '#34d399' : '#FFD166',
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {Array.from({ length: TOTAL }, (_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full transition-colors duration-500"
                style={{ backgroundColor: i < count ? '#FFD166' : 'rgba(255,255,255,0.1)' }}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-700">
            {count >= TOTAL ? 'All complete' : `${TOTAL - count} remaining`}
          </span>
        </div>
      </div>
    </div>
  );
}
