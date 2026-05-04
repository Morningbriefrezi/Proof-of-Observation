'use client';

import { useMemo } from 'react';
import type { ObjectId, SkyObject } from './types';

const PLANET_COLORS: Record<string, string> = {
  sun:     '#ffd166',
  moon:    '#f4ede0',
  mercury: '#d6cdb1',
  venus:   '#f7e7a8',
  mars:    '#ff7b54',
  jupiter: '#fbe9b7',
  saturn:  '#d4a574',
  uranus:  '#9ad4d4',
  neptune: '#8db7e8',
};

/** Star tint by spectral feel — derived from magnitude as a coarse proxy. */
function starColor(mag: number): string {
  if (mag <= -1) return '#bcd6ff';   // Sirius — slightly cool
  if (mag <= 0)  return '#f4ede0';   // Vega-class — clean white
  if (mag <= 1)  return '#fff1d2';   // Most bright stars — warm white
  return '#e8d8b6';                  // Faint — dim warm
}

const SIZE = 360;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 152;

interface SkyMapProps {
  objects: SkyObject[];
  activeId: ObjectId | null;
  onSelect: (id: ObjectId) => void;
}

interface Plotted {
  obj: SkyObject;
  x: number;
  y: number;
  dist: number;
}

function project(alt: number, az: number): { x: number; y: number; dist: number } {
  const altC = Math.max(0, Math.min(90, alt));
  const dist = (1 - altC / 90) * R;
  const azRad = (az * Math.PI) / 180;
  return {
    x: CX + dist * Math.sin(azRad),
    y: CY - dist * Math.cos(azRad),
    dist,
  };
}

export function SkyMap({ objects, activeId, onSelect }: SkyMapProps) {
  const plotted = useMemo<Plotted[]>(() => {
    return objects
      .filter((o) => o.visible)
      .map((o) => {
        const p = project(o.altitude, o.azimuth);
        return { obj: o, x: p.x, y: p.y, dist: p.dist };
      });
  }, [objects]);

  // Render order: faintest first, brightest above, active body last.
  const drawOrder = useMemo(() => {
    return plotted.slice().sort((a, b) => {
      const aA = a.obj.id === activeId ? 1 : 0;
      const bA = b.obj.id === activeId ? 1 : 0;
      if (aA !== bA) return aA - bA;
      return b.obj.magnitude - a.obj.magnitude; // higher mag = fainter, drawn first
    });
  }, [plotted, activeId]);

  return (
    <div className="sky-map">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="sky-map__svg"
        role="img"
        aria-label="Sky map showing visible bodies"
      >
        <defs>
          <radialGradient id="skymap-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d1a3d" />
            <stop offset="100%" stopColor="#040814" />
          </radialGradient>
          <radialGradient id="skymap-nebula" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(232,164,158,0.85)" />
            <stop offset="60%" stopColor="rgba(190,108,108,0.35)" />
            <stop offset="100%" stopColor="rgba(140,70,80,0.0)" />
          </radialGradient>
          <radialGradient id="skymap-galaxy" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(216,224,248,0.75)" />
            <stop offset="55%" stopColor="rgba(150,170,210,0.30)" />
            <stop offset="100%" stopColor="rgba(110,130,170,0.0)" />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r={R} fill="url(#skymap-bg)" />

        {/* Altitude rings (60°, 30°) */}
        <circle cx={CX} cy={CY} r={R * (1 / 3)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
        <circle cx={CX} cy={CY} r={R * (2 / 3)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />

        {/* Cardinal cross */}
        <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />

        {/* Horizon ring */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth={1} />

        {/* Zenith dot */}
        <circle cx={CX} cy={CY} r={1.5} fill="rgba(255,255,255,0.4)" />

        {/* Altitude tick labels */}
        <text x={CX + 4} y={CY - R * (1 / 3) + 3} fill="rgba(255,255,255,0.30)" fontSize="8"
          fontFamily="var(--mono)" letterSpacing="0.05em">60°</text>
        <text x={CX + 4} y={CY - R * (2 / 3) + 3} fill="rgba(255,255,255,0.30)" fontSize="8"
          fontFamily="var(--mono)" letterSpacing="0.05em">30°</text>

        {/* Cardinals */}
        <text x={CX} y={CY - R - 12} textAnchor="middle" dominantBaseline="middle"
          fill="var(--text)" fontSize="13" fontFamily="var(--mono)" letterSpacing="0.16em">N</text>
        <text x={CX + R + 14} y={CY} textAnchor="middle" dominantBaseline="middle"
          fill="var(--text)" fontSize="13" fontFamily="var(--mono)" letterSpacing="0.16em">E</text>
        <text x={CX} y={CY + R + 14} textAnchor="middle" dominantBaseline="middle"
          fill="var(--text)" fontSize="13" fontFamily="var(--mono)" letterSpacing="0.16em">S</text>
        <text x={CX - R - 14} y={CY} textAnchor="middle" dominantBaseline="middle"
          fill="var(--text)" fontSize="13" fontFamily="var(--mono)" letterSpacing="0.16em">W</text>

        {/* Bodies */}
        {drawOrder.map((p) => {
          const isActive = p.obj.id === activeId;
          return (
            <ObjectGlyph
              key={p.obj.id}
              p={p}
              isActive={isActive}
              onSelect={onSelect}
            />
          );
        })}

        {/* Active crosshair drawn last so it sits above everything */}
        {(() => {
          const a = drawOrder.find((p) => p.obj.id === activeId);
          if (!a) return null;
          return <Crosshair x={a.x} y={a.y} />;
        })()}
      </svg>
    </div>
  );
}

interface GlyphProps {
  p: Plotted;
  isActive: boolean;
  onSelect: (id: ObjectId) => void;
}

function ObjectGlyph({ p, isActive, onSelect }: GlyphProps) {
  const { obj, x, y } = p;
  const dx = x - CX;
  const dy = y - CY;
  const norm = Math.hypot(dx, dy) || 1;

  // Magnitude-driven base radius for stars; planets/sun/moon use fixed sizes.
  const isPlanet = obj.type === 'planet' || obj.type === 'sun' || obj.type === 'moon';
  let radius: number;
  if (isPlanet) {
    radius = obj.id === 'sun' ? 7 : obj.id === 'moon' ? 6.5 : 5.5;
  } else if (obj.type === 'star' || obj.type === 'double') {
    // mag −1.5 → r 4.5, mag 4 → r 1.4
    const m = Math.max(-1.5, Math.min(4, obj.magnitude));
    radius = 4.5 - ((m + 1.5) / 5.5) * 3.1;
  } else {
    radius = 4.5; // DSO glyphs sized by their own renderer
  }
  if (isActive && (obj.type === 'star' || obj.type === 'double')) radius += 1;

  const labelOffset = (isPlanet ? radius : 6) + 11;
  const lx = x + (dx / norm) * labelOffset;
  const ly = y + (dy / norm) * labelOffset;
  const anchor = lx < CX - 24 ? 'end' : lx > CX + 24 ? 'start' : 'middle';

  // Show label for active body always; otherwise only for planets + bright stars.
  const showLabel =
    isActive ||
    isPlanet ||
    (obj.type !== 'star' && obj.type !== 'double') ||
    obj.magnitude <= 1.5;

  return (
    <g
      onClick={() => onSelect(obj.id)}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={obj.name}
    >
      {renderBody(obj, x, y, radius, isActive)}
      {showLabel && (
        <text
          x={lx}
          y={ly}
          textAnchor={anchor}
          dominantBaseline="middle"
          fill={isActive ? 'var(--terracotta)' : isPlanet ? 'var(--text)' : 'rgba(255,255,255,0.55)'}
          fontSize="9.5"
          fontFamily="var(--mono)"
          letterSpacing="0.10em"
        >
          {obj.name.toUpperCase()}
        </text>
      )}
    </g>
  );
}

function renderBody(o: SkyObject, x: number, y: number, r: number, _active: boolean) {
  // Planets / sun / moon — solid disc, planet-specific colour.
  if (o.type === 'planet' || o.type === 'sun' || o.type === 'moon') {
    return <circle cx={x} cy={y} r={r} fill={PLANET_COLORS[o.id] ?? '#ffffff'} />;
  }
  // Stars and doubles — small filled disc tinted by magnitude.
  if (o.type === 'star' || o.type === 'double') {
    return (
      <>
        {/* Tiny halo gives bright stars presence without violating no-glow. */}
        {o.magnitude <= 0.6 && (
          <circle cx={x} cy={y} r={r + 1.6} fill={starColor(o.magnitude)} opacity={0.18} />
        )}
        <circle cx={x} cy={y} r={r} fill={starColor(o.magnitude)} />
        {o.type === 'double' && (
          <circle cx={x + r * 1.3} cy={y - r * 0.6} r={Math.max(1.1, r * 0.55)} fill={starColor(o.magnitude + 1)} />
        )}
      </>
    );
  }
  if (o.type === 'cluster') {
    // Triangle of small dots — reads as "many stars"
    const s = 2.6;
    return (
      <g fill="#f1e4b8" opacity={0.95}>
        <circle cx={x} cy={y - s} r={1.6} />
        <circle cx={x - s} cy={y + s * 0.6} r={1.6} />
        <circle cx={x + s} cy={y + s * 0.6} r={1.6} />
        <circle cx={x} cy={y} r={1.1} opacity={0.7} />
      </g>
    );
  }
  if (o.type === 'nebula') {
    return (
      <>
        <circle cx={x} cy={y} r={6.5} fill="url(#skymap-nebula)" />
        <circle cx={x} cy={y} r={1.4} fill="#f5d8d3" />
      </>
    );
  }
  if (o.type === 'galaxy') {
    return (
      <>
        <ellipse cx={x} cy={y} rx={7.2} ry={3.0} fill="url(#skymap-galaxy)" transform={`rotate(35 ${x} ${y})`} />
        <circle cx={x} cy={y} r={1.3} fill="#e6ecf8" />
      </>
    );
  }
  return <circle cx={x} cy={y} r={r} fill="#ffffff" />;
}

function Crosshair({ x, y }: { x: number; y: number }) {
  const ringR = 11;
  const tickGap = 2.5;
  const tickLen = 6;
  return (
    <g pointerEvents="none">
      <circle
        cx={x}
        cy={y}
        r={ringR}
        fill="none"
        stroke="var(--terracotta)"
        strokeWidth={1.1}
        opacity={0.95}
      />
      {/* Four reticle ticks */}
      <line x1={x} y1={y - ringR - tickGap} x2={x} y2={y - ringR - tickGap - tickLen}
        stroke="var(--terracotta)" strokeWidth={1.1} />
      <line x1={x} y1={y + ringR + tickGap} x2={x} y2={y + ringR + tickGap + tickLen}
        stroke="var(--terracotta)" strokeWidth={1.1} />
      <line x1={x - ringR - tickGap} y1={y} x2={x - ringR - tickGap - tickLen} y2={y}
        stroke="var(--terracotta)" strokeWidth={1.1} />
      <line x1={x + ringR + tickGap} y1={y} x2={x + ringR + tickGap + tickLen} y2={y}
        stroke="var(--terracotta)" strokeWidth={1.1} />
    </g>
  );
}
