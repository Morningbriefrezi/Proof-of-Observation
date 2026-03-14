'use client';

import { Eye, Zap } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { getRank } from '@/lib/rewards';

export default function StatsBar() {
  const { state } = useAppState();
  const completed = state.completedMissions.filter(m => m.status === 'completed');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = completed.reduce((sum, m) => sum + (m.stars ?? (m as any).points ?? 0), 0);
  const count = completed.length;
  const rank = getRank(count);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { icon: <Eye size={16} className="text-[var(--text-secondary)]" />, label: 'Observations', value: <span className="text-[#c9a84c] text-xl sm:text-2xl font-bold">{count}</span> },
        { icon: <Zap size={16} className="text-[var(--text-secondary)]" />, label: 'Stars', value: <span className="text-[#22d3ee] text-xl sm:text-2xl font-bold">{total} ✦</span> },
        { icon: null, label: 'Rank', value: <div className="flex items-center gap-1.5"><span className="text-xl">{rank.icon}</span><span className="text-xs text-[var(--text-secondary)] hidden sm:inline">{rank.name}</span></div> },
      ].map(card => (
        <div key={card.label} className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {card.icon}
            <p className="text-[var(--text-secondary)] text-xs">{card.label}</p>
          </div>
          {card.value}
        </div>
      ))}
    </div>
  );
}
