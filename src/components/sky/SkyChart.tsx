'use client';

import { useMemo } from 'react';
import type { Mission } from '@/lib/types';
import {
  getChartStars,
  getChartPlanets,
  getChartDeepSky,
} from '@/lib/sky-chart';
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

const W = 400;
const H = 200;
const CX = 200;
const CY = 100;
const CHART_RX = 190;
const CHART_RY = 90;

interface Props {
  lat: number;
  lon: number;
  date: Date;
  missions: Mission[];
  primeId: string | null;
  onSelect: (mission: Mission) => void;
}

const NODE_MAP: Record<string, { comp: React.ComponentType<{ size?: number }>; size: number; primeSize: number }> = {
  moon:       { comp: MoonNode,       size: 22, primeSize: 30 },
  jupiter:    { comp: JupiterNode,    size: 28, primeSize: 36 },
  saturn:     { comp: SaturnNode,     size: 28, primeSize: 36 },
  venus:      { comp: VenusNode,      size: 18, primeSize: 24 },
  mars:       { comp: MarsNode,       size: 20, primeSize: 26 },
  mercury:    { comp: MercuryNode,    size: 16, primeSize: 22 },
  pleiades:   { comp: PleiadesNode,   size: 22, primeSize: 28 },
  orion:      { comp: OrionNode,      size: 22, primeSize: 28 },
  andromeda:  { comp: AndromedaNode,  size: 24, primeSize: 30 },
  crab:       { comp: CrabNode,       size: 18, primeSize: 22 },
};

function projectWide(altDeg: number, azDeg: number): { x: number; y: number; aboveHorizon: boolean } {
  const altClamped = Math.max(-10, Math.min(90, altDeg));
  const r = 1 - altClamped / 90;
  const azRad = (azDeg * Math.PI) / 180;
  return {
    x: CX + r * CHART_RX * Math.sin(azRad),
    y: CY - r * CHART_RY * Math.cos(azRad),
    aboveHorizon: altDeg > 0,
  };
}

export default function SkyChart({ lat, lon, date, missions, primeId, onSelect }: Props) {
  const stars = useMemo(
    () => getChartStars(lat, lon, date, CX, CY, 180, 3.0),
    [lat, lon, date]
  );

  const plottedPlanets = useMemo(() => {
    const raw = getChartPlanets(lat, lon, date, CX, CY, 180);
    return raw.map(p => ({ ...p, ...projectWide(p.altitude, p.azimuth) }));
  }, [lat, lon, date]);

  const plottedDeepSky = useMemo(() => {
    const raw = getChartDeepSky(lat, lon, date, CX, CY, 180);
    return raw.map(d => ({ ...d, ...projectWide(d.altitude, d.azimuth) }));
  }, [lat, lon, date]);

  const plottedMissions = useMemo(() => {
    const planetByKey = new Map(plottedPlanets.map(p => [p.key, p]));
    const deepByKey = new Map(plottedDeepSky.map(d => [d.id, d]));
    return missions
      .map(m => {
        const src = planetByKey.get(m.id) ?? deepByKey.get(m.id);
        const nodeSpec = NODE_MAP[m.id];
        if (!src || !nodeSpec) return null;
        return { mission: m, x: src.x, y: src.y, aboveHorizon: src.aboveHorizon, nodeSpec };
      })
      .filter(Boolean) as Array<{
        mission: Mission;
        x: number;
        y: number;
        aboveHorizon: boolean;
        nodeSpec: typeof NODE_MAP[string];
      }>;
  }, [missions, plottedPlanets, plottedDeepSky]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: '2 / 1',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.08)',
        background: [
          'radial-gradient(ellipse 320px 180px at 70% 40%, rgba(132,101,203,0.2) 0%, transparent 55%)',
          'radial-gradient(ellipse 260px 160px at 25% 60%, rgba(56,155,240,0.14) 0%, transparent 60%)',
          'radial-gradient(ellipse 200px 120px at 50% 15%, rgba(255,143,184,0.08) 0%, transparent 60%)',
          'radial-gradient(ellipse 400px 200px at 50% 100%, rgba(255,209,102,0.05) 0%, transparent 70%)',
          'radial-gradient(ellipse at 50% 50%, #0A1428 0%, #050A1C 60%, #010206 100%)',
        ].join(', '),
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="stl-mw-wide" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFE8C4" stopOpacity="0.14" />
            <stop offset="0.4" stopColor="#B8C5FF" stopOpacity="0.08" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="stl-dust-wide" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#030612" stopOpacity="0" />
            <stop offset="0.35" stopColor="#030612" stopOpacity="0.35" />
            <stop offset="0.65" stopColor="#030612" stopOpacity="0.35" />
            <stop offset="1" stopColor="#030612" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`rotate(-12 ${CX} ${CY})`}>
          <ellipse cx={CX} cy={CY} rx="280" ry="38" fill="url(#stl-mw-wide)" />
          <ellipse cx={CX} cy={CY} rx="280" ry="8" fill="url(#stl-dust-wide)" opacity="0.75" />
        </g>

        {stars.map((s, i) => {
          const r = Math.max(0.3, (3.4 - s.mag) * 0.45);
          const fill = s.mag < 1.2 ? '#FFF' : s.mag < 2.2 ? '#E8F0FF' : '#B8D4FF';
          const opacity = s.aboveHorizon
            ? Math.min(1, 0.4 + (3 - s.mag) * 0.22)
            : 0.1;
          const normX = (s.x - 200) / 180;
          const normY = (s.y - 100) / 180;
          const wideX = CX + normX * CHART_RX;
          const wideY = CY + normY * CHART_RY;
          if (wideX < 0 || wideX > W || wideY < 0 || wideY > H) return null;
          return <circle key={i} cx={wideX} cy={wideY} r={r} fill={fill} opacity={opacity} />;
        })}

        <g fontFamily="var(--font-mono)" fill="rgba(255,255,255,0.22)" fontSize="8" fontWeight="500">
          <text x={CX} y="12" textAnchor="middle">N</text>
          <text x={CX} y={H - 6} textAnchor="middle">S</text>
          <text x={W - 8} y={CY + 3} textAnchor="end">E</text>
          <text x={8} y={CY + 3}>W</text>
        </g>
      </svg>

      <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full stl-tw" style={{ background: 'var(--stl-gold)' }} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.22em',
          }}
        >
          LIVE · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {plottedMissions.map(({ mission, x, y, aboveHorizon, nodeSpec }) => {
        const isPrime = mission.id === primeId;
        const leftPct = (x / W) * 100;
        const topPct = (y / H) * 100;
        const NodeComp = nodeSpec.comp;
        const size = isPrime ? nodeSpec.primeSize : nodeSpec.size;

        return (
          <button
            key={mission.id}
            onClick={() => onSelect(mission)}
            className="absolute transition-transform active:scale-95 hover:scale-110"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: 'translate(-50%, -50%)',
              opacity: aboveHorizon ? 1 : 0.35,
              cursor: 'pointer',
              zIndex: isPrime ? 3 : 2,
            }}
            aria-label={`Jump to ${mission.name}`}
          >
            <div className="relative">
              {isPrime && aboveHorizon && (
                <span
                  className="absolute pointer-events-none"
                  style={{
                    inset: -3,
                    borderRadius: '50%',
                    border: '1.5px solid #FFD166',
                    animation: 'stl-prime-pulse 2.4s ease-out infinite',
                  }}
                />
              )}
              <NodeComp size={size} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
