'use client';

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
  mission: Mission;
  altitude: number | null;
  peakTime: string | null;
  tagline: string;
  onStart: () => void;
}

export default function PrimeHeroCard({ mission, altitude, peakTime, tagline, onStart }: Props) {
  const Node = NODE[mission.id] ?? JupiterNode;

  return (
    <div
      className="relative flex items-stretch gap-3.5 p-3.5 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,209,102,0.08), rgba(255,209,102,0.01) 60%, transparent)',
        border: '1px solid rgba(255,209,102,0.28)',
        borderRadius: 16,
      }}
    >
      <div className="relative flex-shrink-0 w-[88px] h-[88px] flex items-center justify-center">
        <div className="relative stl-prime-container">
          <Node size={72} />
          <span
            className="absolute pointer-events-none"
            style={{
              inset: -3,
              borderRadius: '50%',
              border: '1.5px solid #FFD166',
              animation: 'stl-prime-pulse 2.4s ease-out infinite',
            }}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="stl-tw"
              style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--stl-gold)' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 8.5,
                color: 'var(--stl-gold)',
                letterSpacing: '0.22em',
                fontWeight: 500,
              }}
            >
              PRIME · TONIGHT
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 34,
              color: '#F2F0EA',
              fontWeight: 600,
              margin: 0,
              lineHeight: 1,
              letterSpacing: '-0.015em',
            }}
          >
            {mission.name}
          </h1>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 13,
              color: 'rgba(255,255,255,0.6)',
              fontStyle: 'italic',
              fontWeight: 400,
              marginTop: 3,
              lineHeight: 1.25,
            }}
          >
            {tagline}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em',
            }}
          >
            {altitude != null ? `ALT ${Math.round(altitude)}°` : ''}
            {peakTime ? ` · PEAKS ${peakTime}` : ''}
          </span>
          <button
            onClick={onStart}
            className="transition-all active:scale-[0.97] hover:opacity-90"
            style={{
              padding: '8px 14px',
              background: 'linear-gradient(135deg, #FFD166, #CC9A33)',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            Observe · +{mission.stars} ✦
          </button>
        </div>
      </div>
    </div>
  );
}
