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

export default function MissionList() {
  const { state } = useAppState();
  const [active, setActive] = useState<Mission | null>(null);
  const completedIds = new Set(state.completedMissions.filter(m => m.status === 'completed').map(m => m.id));
  const pendingIds = new Set(state.completedMissions.filter(m => m.status === 'pending').map(m => m.id));

  return (
    <>
      {active && <MissionActive mission={active} onClose={() => setActive(null)} />}
      <div className="flex flex-col gap-2.5 mb-2">
        {MISSIONS.map(mission => {
          const done = completedIds.has(mission.id);
          const pending = pendingIds.has(mission.id);
          return (
            <Card key={mission.id} className={done ? 'opacity-60' : ''}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <MissionIcon id={mission.id} size={38} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{mission.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <Badge color={mission.difficulty === 'Beginner' ? 'emerald' : 'brass'}>
                      {mission.difficulty}
                    </Badge>
                    <Badge color="dim">
                      {mission.type === 'telescope' ? '🔭' : '👁️'}
                    </Badge>
                    <span className="text-[#c9a84c] text-xs font-semibold">+{mission.stars} stars ✦</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {done ? (
                    <span className="flex items-center gap-1 text-[#34d399] text-xs font-medium"><CheckCircle2 size={13} /> Observed ✓</span>
                  ) : pending ? (
                    <span className="flex items-center gap-1 text-amber-400 text-xs"><Clock size={12} /> Pending</span>
                  ) : (
                    <Button variant="ghost" onClick={() => setActive(mission)} className="text-xs px-3 py-1.5 min-h-[36px]">
                      Begin →
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
