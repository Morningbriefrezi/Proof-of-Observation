'use client';

import { MISSIONS } from '@/lib/constants';
import { useAppState } from '@/hooks/useAppState';
import type { Mission } from '@/lib/types';
import { CheckCircle2 } from 'lucide-react';
import { getMissionImage } from '@/lib/mission-icons';
import { useState, useEffect } from 'react';
import { getStarlight, MAX_STARLIGHT_VALUE } from '@/lib/starlight';

interface MissionListProps {
  onStart: (mission: Mission) => void;
}

export default function MissionList({ onStart }: MissionListProps) {
  const { state } = useAppState();
  const completedIds = new Set(state.completedMissions.filter(m => m.status === 'completed').map(m => m.id));
  const DAY_MS = 24 * 60 * 60 * 1000;

  const [starlight, setStarlight] = useState(MAX_STARLIGHT_VALUE);
  useEffect(() => {
    setStarlight(getStarlight().remaining);
    const id = setInterval(() => setStarlight(getStarlight().remaining), 60000);
    return () => clearInterval(id);
  }, [state.completedMissions.length]);

  function completedTodayId(id: string): boolean {
    const cutoff = Date.now() - DAY_MS;
    return state.completedMissions.some(
      m => m.id === id && m.status === 'completed' && new Date(m.timestamp).getTime() > cutoff
    );
  }

  const outOfStarlight = starlight <= 0;

  return (
    <div className="grid grid-cols-2 gap-2">
      {MISSIONS.map(mission => {
        const isRepeatable = mission.repeatable === true;
        const done = completedIds.has(mission.id) && !isRepeatable;
        const doneToday = isRepeatable && completedTodayId(mission.id);
        const diffLabel = mission.difficulty === 'Beginner' ? 'Easy' : mission.difficulty === 'Intermediate' ? 'Medium' : mission.difficulty === 'Advanced' ? 'Hard' : mission.difficulty === 'Hard' ? 'Hard+' : 'Expert';

        const locked = !mission.demo && outOfStarlight;
        const disabled = done || locked;
        const handleClick = () => { if (!disabled) onStart(mission); };

        return (
          <button
            key={mission.id}
            onClick={handleClick}
            disabled={disabled}
            className="relative flex flex-col items-center text-center rounded-xl p-2.5 w-full transition-all active:scale-[0.98]"
            style={{
              background: done
                ? 'rgba(52,211,153,0.04)'
                : 'rgba(255,255,255,0.035)',
              border: done
                ? '1px solid rgba(52,211,153,0.2)'
                : '1px solid rgba(255,255,255,0.08)',
              opacity: locked ? 0.55 : 1,
              cursor: disabled ? 'default' : 'pointer',
            }}
            onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = 'rgba(255,209,102,0.35)'; }}
            onMouseLeave={e => { if (!done) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            {done && (
              <div className="absolute top-1.5 right-1.5">
                <CheckCircle2 size={12} className="text-emerald-400" />
              </div>
            )}

            <div className="w-14 h-14 rounded-lg overflow-hidden mb-1.5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={getMissionImage(mission.id)} alt={mission.name} className="w-full h-full object-cover" />
            </div>

            <p className="text-white font-semibold text-[12px] leading-tight truncate w-full">{mission.name}</p>

            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] text-slate-500 uppercase tracking-wide">{diffLabel}</span>
              {mission.demo && (
                <span className="text-[8px] px-1 py-0 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>Demo</span>
              )}
            </div>

            <span className="text-[#FFD166] text-[11px] font-bold mt-1">+{mission.stars} ✦</span>

            {done ? (
              <span className="text-[9px] text-[#34d399] mt-1">Done</span>
            ) : locked ? (
              <span className="text-[9px] text-amber-400/70 mt-1">No Starlight</span>
            ) : (
              <span
                className="mt-1.5 w-full py-1 rounded-md text-[11px] font-bold"
                style={{ background: 'linear-gradient(135deg, #FFD166, #CC9A33)', color: '#0a0a0a' }}
              >
                Begin →
              </span>
            )}
            {doneToday && <span className="text-[9px] text-slate-500 mt-0.5">✓ today</span>}
          </button>
        );
      })}
    </div>
  );
}
