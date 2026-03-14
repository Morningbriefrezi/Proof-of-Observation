'use client';

import { Eye, Zap, Star, Trophy } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

function getRank(count: number) {
  if (count === 0) return { icon: <span className="text-[var(--text-dim)] text-xl">—</span>, label: 'Novice' };
  if (count < 3) return { icon: <Star size={22} className="text-[#c9a84c] fill-[#c9a84c]" />, label: 'Observer' };
  return { icon: <Trophy size={22} className="text-[#c9a84c] fill-[#c9a84c]" />, label: 'Expert' };
}

export default function StatsBar() {
  const { state } = useAppState();
  const completed = state.completedMissions.filter(m => m.status === 'completed');
  const total = completed.reduce((sum, m) => sum + m.points, 0);
  const count = completed.length;
  const rank = getRank(count);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { icon: <Eye size={16} className="text-[var(--text-secondary)]" />, label: 'Observations', value: <span className="text-[#c9a84c] text-xl sm:text-2xl font-bold">{count}</span> },
        { icon: <Zap size={16} className="text-[var(--text-secondary)]" />, label: 'Points', value: <span className="text-[#22d3ee] text-xl sm:text-2xl font-bold">{total}</span> },
        { icon: null, label: 'Rank', value: <div className="flex items-center gap-1.5">{rank.icon}<span className="text-xs text-[var(--text-secondary)] hidden sm:inline">{rank.label}</span></div> },
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
