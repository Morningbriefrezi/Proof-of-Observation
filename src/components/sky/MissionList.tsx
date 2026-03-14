'use client';

import { useState } from 'react';
import { MISSIONS } from '@/lib/constants';
import { useAppState } from '@/hooks/useAppState';
import type { Mission } from '@/lib/types';
import { CheckCircle2, Clock, Telescope, Eye } from 'lucide-react';
import { MissionIcon } from '@/components/shared/PlanetIcons';
import MissionActive from './MissionActive';

export default function MissionList() {
  const { state } = useAppState();
  const [active, setActive] = useState<Mission | null>(null);
  const completedIds = new Set(state.completedMissions.filter(m => m.status === 'completed').map(m => m.id));
  const pendingIds   = new Set(state.completedMissions.filter(m => m.status === 'pending').map(m => m.id));

  return (
    <>
      {active && <MissionActive mission={active} onClose={() => setActive(null)} />}

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-6">
        {MISSIONS.map(mission => {
          const done    = completedIds.has(mission.id);
          const pending = pendingIds.has(mission.id);
          const diff    = mission.difficulty === 'Beginner' ? 1 : mission.difficulty === 'Intermediate' ? 2 : 3;

          return (
            <div
              key={mission.id}
              className="relative flex flex-col items-center text-center rounded-2xl px-4 py-5 transition-all duration-200"
              style={{
                background: done ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                opacity: done ? 0.5 : 1,
              }}
            >
              {/* Status badge top-right */}
              {done && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 size={14} className="text-slate-600" />
                </div>
              )}
              {pending && (
                <div className="absolute top-3 right-3">
                  <Clock size={14} className="text-amber-400/60" />
                </div>
              )}

              {/* Planet icon */}
              <div className="mb-3 mt-1">
                <MissionIcon id={mission.id} size={48} />
              </div>

              {/* Name */}
              <p className="text-white font-semibold text-sm leading-tight mb-1">{mission.name}</p>

              {/* Description */}
              <p className="text-slate-600 text-[11px] leading-relaxed mb-3 line-clamp-2">{mission.desc}</p>

              {/* Meta row */}
              <div className="flex items-center justify-center gap-1.5 mb-3 flex-wrap">
                <span className="flex gap-0.5 items-center">
                  {[1,2,3].map(d => (
                    <span
                      key={d}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: d <= diff ? 'rgba(255,209,102,0.6)' : 'rgba(255,255,255,0.1)' }}
                    />
                  ))}
                </span>
                <span className="text-slate-700 text-[10px]">·</span>
                <span className="text-slate-600 text-[10px] flex items-center gap-0.5">
                  {mission.type === 'telescope' ? <Telescope size={9} /> : <Eye size={9} />}
                  {mission.type === 'telescope' ? 'Telescope' : 'Naked Eye'}
                </span>
              </div>

              {/* Reward */}
              <span className="text-[#FFD166] text-xs font-bold mb-4">+{mission.stars} ✦</span>

              {/* CTA */}
              {done ? (
                <div className="w-full py-2.5 rounded-xl text-xs text-slate-600 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  Complete
                </div>
              ) : pending ? (
                <div className="w-full py-2.5 rounded-xl text-xs text-amber-400/60 text-center"
                  style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.1)' }}>
                  Pending
                </div>
              ) : (
                <button
                  onClick={() => setActive(mission)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95 hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #FFD166, #CC9A33)',
                    color: '#070B14',
                  }}
                >
                  Begin →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
