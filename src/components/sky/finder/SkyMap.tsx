'use client';

import { useMemo } from 'react';
import type { ObjectId, SkyObject } from './types';

const COLORS: Record<ObjectId, string> = {
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

  // Render order: active body last so its ring sits on top.
  const drawOrder = useMemo(() => {
    return plotted.slice().sort((a, b) => {
      const aA = a.obj.id === activeId ? 1 : 0;
      const bA = b.obj.id === activeId ? 1 : 0;
      return aA - bA;
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
        <text
          x={CX + 4}
          y={CY - R * (1 / 3) + 3}
          fill="rgba(255,255,255,0.30)"
          fontSize="8"
          fontFamily="var(--mono)"
          letterSpacing="0.05em"
        >
          60°
        </text>
        <text
          x={CX + 4}
          y={CY - R * (2 / 3) + 3}
          fill="rgba(255,255,255,0.30)"
          fontSize="8"
          fontFamily="var(--mono)"
          letterSpacing="0.05em"
        >
          30°
        </text>

        {/* Cardinals — outside the ring */}
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
          const radius = isActive ? 8 : 5.5;
          const dx = p.x - CX;
          const dy = p.y - CY;
          const norm = Math.hypot(dx, dy) || 1;
          const labelOffset = radius + 11;
          const lx = p.x + (dx / norm) * labelOffset;
          const ly = p.y + (dy / norm) * labelOffset;
          const anchor = lx < CX - 24 ? 'end' : lx > CX + 24 ? 'start' : 'middle';
          return (
            <g
              key={p.obj.id}
              onClick={() => onSelect(p.obj.id)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={p.obj.name}
            >
              {isActive && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={radius + 5}
                  fill="none"
                  stroke="var(--terracotta)"
                  strokeWidth={1.25}
                />
              )}
              <circle cx={p.x} cy={p.y} r={radius} fill={COLORS[p.obj.id]} />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="middle"
                fill={isActive ? 'var(--terracotta)' : 'var(--text)'}
                fontSize="9.5"
                fontFamily="var(--mono)"
                letterSpacing="0.10em"
              >
                {p.obj.name.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
