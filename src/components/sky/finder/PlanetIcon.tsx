'use client';

import type { CSSProperties } from 'react';

type ObjectId =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export interface PlanetIconProps {
  id: ObjectId;
  size?: number;
  /** Moon phase 0–1, only used when id === 'moon'. */
  phase?: number | null;
  glow?: boolean;
}

const GRADIENTS: Record<ObjectId, string> = {
  sun:     'radial-gradient(circle at 40% 40%, #fffbe1 0%, #ffd166 50%, #ff7b1a 90%)',
  moon:    'radial-gradient(circle at 40% 40%, #f4ede0 0%, #c8c2b5 60%, #6a665e 95%)',
  mercury: 'radial-gradient(circle at 35% 35%, #e2dccd 0%, #a89e88 55%, #58523f 95%)',
  venus:   'radial-gradient(circle at 35% 35%, #fff5d6 0%, #e7cd84 50%, #8a6b2a 95%)',
  mars:    'radial-gradient(circle at 35% 35%, #ff7b54 0%, #c2451f 60%, #5a1d08 95%)',
  jupiter: 'radial-gradient(circle at 35% 35%, #fbe9b7 0%, #d4a574 30%, #8b5a2b 65%, #3a1f0c 95%)',
  saturn:  'radial-gradient(circle at 35% 35%, #f0dc9a 0%, #c89a3e 55%, #6b5020 95%)',
  uranus:  'radial-gradient(circle at 35% 35%, #b9e8e2 0%, #5fa3a8 55%, #214550 95%)',
  neptune: 'radial-gradient(circle at 35% 35%, #6fa0e0 0%, #2d5a9c 55%, #142a52 95%)',
};

const GLOW: Record<ObjectId, string> = {
  sun:     '0 0 32px rgba(255,209,102,0.55), 0 0 64px rgba(255,123,26,0.35)',
  moon:    '0 0 24px rgba(244,237,224,0.30)',
  mercury: '0 0 18px rgba(232,222,200,0.20)',
  venus:   '0 0 26px rgba(255,232,160,0.30)',
  mars:    '0 0 22px rgba(255,123,84,0.30)',
  jupiter: '0 0 28px rgba(212,165,116,0.32)',
  saturn:  '0 0 24px rgba(200,154,62,0.30)',
  uranus:  '0 0 22px rgba(95,163,168,0.28)',
  neptune: '0 0 22px rgba(111,160,224,0.30)',
};

export function PlanetIcon({ id, size = 88, phase = null, glow = true }: PlanetIconProps) {
  const wrap: CSSProperties = {
    position: 'relative',
    width: size,
    height: size,
    flexShrink: 0,
  };

  const sphere: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: GRADIENTS[id],
    boxShadow: glow ? GLOW[id] : 'none',
    position: 'relative',
    overflow: 'hidden',
  };

  if (id === 'moon') {
    return (
      <div style={wrap}>
        <div style={sphere}>
          <MoonShadow phase={phase ?? 0.5} size={size} />
        </div>
      </div>
    );
  }

  if (id === 'jupiter') {
    return (
      <div style={wrap}>
        <div style={sphere}>
          <JupiterBands size={size} />
        </div>
      </div>
    );
  }

  if (id === 'saturn') {
    return (
      <div style={wrap}>
        <div style={sphere}>
          <JupiterBands size={size} dim />
        </div>
        <SaturnRings size={size} />
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={sphere} />
    </div>
  );
}

function MoonShadow({ phase, size }: { phase: number; size: number }) {
  // phase: 0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter
  // Cover the un-illuminated portion with a dark overlay positioned by phase.
  // Render a circle the same size, offset so its overlap matches the dark side.
  const p = ((phase % 1) + 1) % 1;
  if (p < 0.03 || p > 0.97) {
    // new moon — almost entirely dark
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(7,11,20,0.92)',
        }}
      />
    );
  }
  if (p > 0.47 && p < 0.53) return null; // full

  // Waxing (0..0.5): dark side on the LEFT, shrinks toward 0.5
  // Waning (0.5..1): dark side on the RIGHT, grows toward 1
  const waxing = p < 0.5;
  const k = waxing ? p / 0.5 : (1 - p) / 0.5; // 0..1, where 1 = full
  // offset: how far the shadow disc is shifted off the moon disc
  // at k=0 (new) -> shadow exactly covers; at k=1 (full) -> shadow fully off
  const offset = k * size;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        [waxing ? 'left' : 'right']: -offset,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(7,11,20,0.85)',
      }}
    />
  );
}

function JupiterBands({ size, dim }: { size: number; dim?: boolean }) {
  const bands = [
    { y: 28, h: 6, op: dim ? 0.18 : 0.32 },
    { y: 44, h: 8, op: dim ? 0.14 : 0.26 },
    { y: 60, h: 5, op: dim ? 0.16 : 0.28 },
    { y: 72, h: 4, op: dim ? 0.10 : 0.20 },
  ];
  return (
    <>
      {bands.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${(b.y / 100) * size}px`,
            height: `${(b.h / 100) * size}px`,
            background: `rgba(80,45,20,${b.op})`,
            mixBlendMode: 'multiply',
          }}
        />
      ))}
    </>
  );
}

function SaturnRings({ size }: { size: number }) {
  const ringW = size * 1.55;
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: ringW,
        height: ringW,
        marginTop: -ringW / 2,
        marginLeft: -ringW / 2,
        borderRadius: '50%',
        border: '1.5px solid rgba(200,154,62,0.85)',
        transform: 'rotate(-14deg) scaleY(0.18)',
        boxShadow: '0 0 8px rgba(200,154,62,0.25)',
        pointerEvents: 'none',
      }}
    />
  );
}
