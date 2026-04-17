'use client';

import { useMemo, useState } from 'react';
import type { Mission } from '@/lib/types';
import JupiterNode from './chart-nodes/JupiterNode';
import SaturnNode from './chart-nodes/SaturnNode';
import MoonNode from './chart-nodes/MoonNode';
import VenusNode from './chart-nodes/VenusNode';
import MarsNode from './chart-nodes/MarsNode';
import MercuryNode from './chart-nodes/MercuryNode';
import PleiadesNode from './chart-nodes/PleiadesNode';
import OrionNode from './chart-nodes/OrionNode';
import AndromedaNode from './chart-nodes/AndromedaNode';
import CrabNode from './chart-nodes/CrabNode';

const NODE: Record<string, React.ComponentType<{ size?: number }>> = {
  moon: MoonNode, jupiter: JupiterNode, saturn: SaturnNode,
  venus: VenusNode, mars: MarsNode, mercury: MercuryNode,
  pleiades: PleiadesNode, orion: OrionNode, andromeda: AndromedaNode, crab: CrabNode,
};

interface Props {
  missions: Mission[];
  statusById: Record<string, { aboveHorizon: boolean; label: string; labelColor: string }>;
  completedIds: Set<string>;
  onStart: (m: Mission) => void;
}

export default function MissionRail({ missions, statusById, completedIds, onStart }: Props) {
  const [filter, setFilter] = useState<'visible' | 'all'>('visible');

  const list = useMemo(() => {
    if (filter === 'all') return missions;
    return missions.filter(m => statusById[m.id]?.aboveHorizon);
  }, [filter, missions, statusById]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="stl-display-md" style={{ color: 'var(--stl-text-bright)' }}>All targets</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: 'var(--stl-text-dim)', background: 'var(--stl-bg-surface)' }}>
            {missions.length}
          </span>
        </div>
        <div className="flex gap-[2px] p-[2px] rounded-lg" style={{ background: 'var(--stl-bg-surface)', border: '1px solid var(--stl-border-soft)' }}>
          {(['visible','all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
              style={{
                background: filter === f ? 'var(--stl-text-bright)' : 'transparent',
                color: filter === f ? '#0a0a0a' : 'var(--stl-text-muted)',
              }}
            >
              {f === 'visible' ? 'Visible' : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 px-1 scroll-x scrollbar-hide">
        {list.map(m => {
          const Node = NODE[m.id];
          const status = statusById[m.id];
          const done = completedIds.has(m.id);
          const dim = !status?.aboveHorizon || done;
          return (
            <button
              key={m.id}
              onClick={() => !done && onStart(m)}
              disabled={done}
              className="flex-shrink-0 w-[124px] p-3 rounded-[14px] text-left transition-transform active:scale-[0.97]"
              style={{
                background: 'var(--stl-bg-surface)',
                border: '1px solid var(--stl-border-regular)',
                opacity: dim ? 0.6 : 1,
                cursor: done ? 'default' : 'pointer',
              }}
            >
              <div className="w-11 h-11 mb-2 flex items-center justify-center">
                {Node && <Node size={38} />}
              </div>
              <div className="stl-display-sm" style={{ color: 'var(--stl-text-bright)' }}>{m.name}</div>
              <div className="text-[9px] mt-0.5" style={{ letterSpacing: '0.05em', color: status?.labelColor ?? 'var(--stl-text-dim)' }}>
                {status?.label ?? ''}
              </div>
              <div className="mt-2 text-[13px] font-semibold" style={{ color: 'var(--stl-gold)' }}>
                +{m.stars} ✦
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
