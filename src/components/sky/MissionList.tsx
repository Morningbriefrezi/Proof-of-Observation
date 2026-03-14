'use client';

import { useState } from 'react';
import { MISSIONS } from '@/lib/constants';
import { useAppState } from '@/hooks/useAppState';
import type { Mission } from '@/lib/types';
import { CheckCircle2, Clock } from 'lucide-react';
import Badge from '@/components/shared/Badge';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import { MissionIcon } from '@/components/shared/PlanetIcons';
import MissionActive from './MissionActive';
import { MISSION_REWARD_HINTS } from '@/lib/rewards';

export default function MissionList() {
  const { state } = useAppState();
  const [active, setActive] = useState<Mission | null>(null);
  const completedIds = new Set(state.completedMissions.filter(m => m.status === 'completed').map(m => m.id));
  const pendingIds = new Set(state.completedMissions.filter(m => m.status === 'pending').map(m => m.id));

  return (
    <>
      {active && <MissionActive mission={active} onClose={() => setActive(null)} />}
      <div className="flex flex-col gap-3">
        {MISSIONS.map(mission => {
          const done = completedIds.has(mission.id);
          const pending = pendingIds.has(mission.id);
          const rewardHint = MISSION_REWARD_HINTS[mission.id];
          return (
            <Card key={mission.id} className={done ? 'opacity-60' : ''}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                  <MissionIcon id={mission.id} size={40} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm sm:text-base">{mission.name}</p>
                  <p className="text-slate-400 text-xs sm:text-sm">{mission.desc}</p>
                  <p className="text-slate-500 text-xs italic mt-0.5 hidden sm:block">{mission.hint}</p>
                  {rewardHint && !done && (
                    <p className="text-[#c9a84c]/70 text-xs mt-1">🎁 {rewardHint}</p>
                  )}
                  {/* Mobile badges inline */}
                  <div className="flex gap-1.5 mt-1.5 sm:hidden flex-wrap">
                    <Badge color={mission.difficulty === 'Beginner' ? 'emerald' : 'brass'}>
                      {mission.difficulty}
                    </Badge>
                    <Badge color="dim">
                      {mission.type === 'telescope' ? '🔭' : '👁️'}
                    </Badge>
                    <span className="text-[#c9a84c] text-xs font-semibold">+{mission.stars} stars ✦</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  {/* Desktop badges */}
                  <div className="hidden sm:flex flex-col items-end gap-1.5">
                    <Badge color={mission.difficulty === 'Beginner' ? 'emerald' : 'brass'}>
                      {mission.difficulty}
                    </Badge>
                    <Badge color="dim">
                      {mission.type === 'telescope' ? '🔭' : '👁️'} {mission.type === 'telescope' ? 'Telescope' : 'Naked Eye'}
                    </Badge>
                    <p className="text-[#c9a84c] text-sm font-semibold">+{mission.stars} stars ✦</p>
                  </div>
                  {done ? (
                    <span className="flex items-center gap-1 text-[#34d399] text-xs"><CheckCircle2 size={14} /> Observed ✓</span>
                  ) : pending ? (
                    <span className="flex items-center gap-1 text-amber-400 text-xs"><Clock size={13} /> Pending</span>
                  ) : (
                    <Button variant="ghost" onClick={() => setActive(mission)} className="text-sm px-3 min-h-[44px]">
                      Begin Observation →
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
