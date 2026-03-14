'use client';

import { useState } from 'react';
import { MISSIONS } from '@/lib/constants';
import { useAppState } from '@/hooks/useAppState';
import type { Mission } from '@/lib/types';
import { CheckCircle2, Clock, Telescope, Eye, ChevronRight } from 'lucide-react';
import { MissionIcon } from '@/components/shared/PlanetIcons';
import MissionActive from './MissionActive';

export default function MissionList() {
  const { state } = useAppState();
  const [active, setActive] = useState<Mission | null>(null);
  const completedIds = new Set(state.completedMissions.filter(m => m.status === 'completed').map(m => m.id));
  const pendingIds  = new Set(state.completedMissions.filter(m => m.status === 'pending').map(m => m.id));

  return (
    <>
      {active && <MissionActive mission={active} onClose={() => setActive(null)} />}
      <div className="flex flex-col gap-1.5 mb-6">
        {MISSIONS.map((mission, i) => {
          const done    = completedIds.has(mission.id);
          const pending = pendingIds.has(mission.id);
          const diff    = mission.difficulty === 'Beginner' ? 1 : mission.difficulty === 'Intermediate' ? 2 : 3;

          return (
            <div
              key={mission.id}
              className="group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200"
              style={{
                background: done ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                opacity: done ? 0.55 : 1,
              }}
              onMouseEnter={e => {
                if (!done) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,209,102,0.2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {/* Index */}
              <span className="text-[10px] text-slate-700 font-mono w-4 flex-shrink-0 select-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Planet icon */}
              <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
                <MissionIcon id={mission.id} size={32} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-tight">{mission.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex gap-0.5">
                    {[1,2,3].map(d => (
                      <span
                        key={d}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: d <= diff ? 'rgba(255,209,102,0.7)' : 'rgba(255,255,255,0.12)' }}
                      />
                    ))}
                  </span>
                  <span className="text-slate-600 text-[10px]">{mission.difficulty}</span>
                  <span className="text-slate-700 text-[10px]">·</span>
                  <span className="text-slate-600 text-[10px] flex items-center gap-0.5">
                    {mission.type === 'telescope' ? <Telescope size={9} /> : <Eye size={9} />}
                    {mission.type === 'telescope' ? 'Telescope' : 'Naked Eye'}
                  </span>
                </div>
              </div>

              {/* Stars */}
              <span className="text-[#FFD166] text-xs font-semibold flex-shrink-0">
                +{mission.stars} ✦
              </span>

              {/* Action */}
              <div className="flex-shrink-0 w-16 flex justify-end">
                {done ? (
                  <CheckCircle2 size={16} className="text-slate-600" />
                ) : pending ? (
                  <Clock size={16} className="text-amber-400/60" />
                ) : (
                  <button
                    onClick={() => setActive(mission)}
                    className="flex items-center gap-0.5 text-xs text-[#FFD166] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Begin <ChevronRight size={12} />
                  </button>
                )}
              </div>

              {/* Tap target for mobile */}
              {!done && !pending && (
                <button
                  onClick={() => setActive(mission)}
                  className="absolute inset-0 sm:hidden"
                  aria-label={`Begin ${mission.name}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
