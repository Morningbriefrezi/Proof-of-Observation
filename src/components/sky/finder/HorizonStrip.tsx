'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { SkyObject, ObjectId } from './types';

interface HorizonStripProps {
  objects: SkyObject[];
  highlightedId?: ObjectId;
  onObjectClick?: (id: ObjectId) => void;
}

interface PlottedObject extends SkyObject {
  xPct: number;
  yPct: number;
  labelOffsetY: number;
}

const STRIP_WIDTH = 1600;
const STRIP_HEIGHT = 220;
const BOTTOM_BAND = 32;
const PLOT_HEIGHT = STRIP_HEIGHT - BOTTOM_BAND;
const COMPASS_LABELS: { dir: string; az: number }[] = [
  { dir: 'N', az: 0 },
  { dir: 'NE', az: 45 },
  { dir: 'E', az: 90 },
  { dir: 'SE', az: 135 },
  { dir: 'S', az: 180 },
  { dir: 'SW', az: 225 },
  { dir: 'W', az: 270 },
  { dir: 'NW', az: 315 },
  { dir: 'N', az: 360 },
];

const ACCENT: Record<ObjectId, string> = {
  moon:    '#f4ede0',
  mercury: '#d6cdb1',
  venus:   '#f7e7a8',
  mars:    '#ff7b54',
  jupiter: '#fbe9b7',
  saturn:  '#d4a574',
  uranus:  '#9ad4d4',
  neptune: '#8db7e8',
};

const GLOW: Record<ObjectId, string> = {
  moon:    '0 0 14px rgba(244,237,224,0.55), 0 0 28px rgba(244,237,224,0.18)',
  mercury: '0 0 10px rgba(214,205,177,0.40)',
  venus:   '0 0 14px rgba(247,231,168,0.55), 0 0 26px rgba(247,231,168,0.18)',
  mars:    '0 0 12px rgba(255,123,84,0.50), 0 0 24px rgba(255,123,84,0.18)',
  jupiter: '0 0 14px rgba(255,209,102,0.55), 0 0 28px rgba(255,209,102,0.20)',
  saturn:  '0 0 12px rgba(212,165,116,0.50), 0 0 24px rgba(212,165,116,0.18)',
  uranus:  '0 0 10px rgba(154,212,212,0.40)',
  neptune: '0 0 10px rgba(141,183,232,0.40)',
};

function plot(objects: SkyObject[]): PlottedObject[] {
  const sorted = [...objects].sort((a, b) => a.azimuth - b.azimuth);
  const placed: PlottedObject[] = [];
  for (const o of sorted) {
    const xPct = (o.azimuth / 360) * 100;
    // altitude clamps to 0..90 → yPct from bottom-band edge to 0
    const altClamped = Math.max(0, Math.min(90, o.altitude));
    const yPx = (PLOT_HEIGHT) - (altClamped / 90) * PLOT_HEIGHT;
    const yPct = (yPx / STRIP_HEIGHT) * 100;
    let labelOffsetY = 0;
    for (const p of placed) {
      const dxPct = Math.abs(p.xPct - xPct);
      // 60px of 1600 = ~3.75% — collide if within that range AND vertically close
      if (dxPct < 4 && Math.abs(p.yPct - yPct) < 6) {
        labelOffsetY = (p.labelOffsetY === 0 ? 16 : 0);
      }
    }
    placed.push({ ...o, xPct, yPct, labelOffsetY });
  }
  return placed;
}

export function HorizonStrip({ objects, highlightedId, onObjectClick }: HorizonStripProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const plotted = useMemo(() => plot(objects.filter((o) => o.visible)), [objects]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const focus = highlightedId
      ? plotted.find((p) => p.id === highlightedId)
      : null;
    const az = focus?.azimuth ?? 180;
    const el = scrollRef.current;
    const target = (az / 360) * STRIP_WIDTH - el.clientWidth / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [highlightedId, plotted]);

  return (
    <div className="finder-strip">
      <div ref={scrollRef} className="finder-strip__scroll">
        <div className="finder-strip__inner" style={{ width: STRIP_WIDTH }}>
          <div className="finder-strip__bg" />
          <StarField />
          <div className="finder-strip__horizon" />
          {plotted.map((p) => {
            const isHl = p.id === highlightedId;
            const accent = ACCENT[p.id];
            const glow = GLOW[p.id];
            const discSize = isHl ? 18 : 12;
            return (
              <div key={p.id} style={{ position: 'absolute', left: `${p.xPct}%`, top: 0, bottom: 0 }}>
                {isHl && (
                  <div
                    className="finder-strip__beam"
                    style={{
                      position: 'absolute',
                      left: -1,
                      top: `${p.yPct}%`,
                      bottom: BOTTOM_BAND,
                      width: 2,
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => onObjectClick?.(p.id)}
                  aria-label={p.name}
                  style={{
                    position: 'absolute',
                    top: `${p.yPct}%`,
                    transform: 'translate(-50%, -50%)',
                    width: discSize,
                    height: discSize,
                    borderRadius: '50%',
                    background: accent,
                    boxShadow: glow,
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: `calc(${p.yPct}% - ${discSize / 2 + 14 + p.labelOffsetY}px)`,
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                    fontSize: 10,
                    color: isHl ? accent : 'rgba(244,237,224,0.85)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    fontWeight: isHl ? 600 : 500,
                    letterSpacing: '0.04em',
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: `calc(${p.yPct}% + ${discSize / 2 + 4 + p.labelOffsetY}px)`,
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                    fontSize: 9,
                    color: isHl ? 'rgba(255,209,102,0.85)' : 'rgba(244,237,224,0.50)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    letterSpacing: '0.04em',
                  }}
                >
                  {Math.round(p.altitude)}°
                </div>
              </div>
            );
          })}
          <div className="finder-strip__compass-row" style={{ height: BOTTOM_BAND }}>
            {COMPASS_LABELS.map((c, i) => {
              const xPct = (c.az / 360) * 100;
              const isFocus = highlightedId
                ? plotted.find((p) => p.id === highlightedId)?.compassDirection === c.dir
                : false;
              return (
                <span
                  key={`${c.dir}-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${xPct}%`,
                    bottom: 8,
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                    fontSize: 10,
                    color: isFocus ? '#5EEAD4' : 'rgba(255,255,255,0.42)',
                    letterSpacing: '0.08em',
                    fontWeight: isFocus ? 600 : 400,
                  }}
                >
                  {c.dir}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StarField() {
  // Faint star dots — 1px boxes with multiple shadow offsets baked in.
  // Stable seeded scatter so it doesn't wiggle between renders.
  const stars = useMemo(() => {
    const out: { x: number; y: number; o: number }[] = [];
    let seed = 1337;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 70; i++) {
      out.push({
        x: rand() * STRIP_WIDTH,
        y: rand() * (STRIP_HEIGHT - BOTTOM_BAND - 8) + 4,
        o: 0.25 + rand() * 0.55,
      });
    }
    return out;
  }, []);
  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            width: 1,
            height: 1,
            background: 'white',
            opacity: s.o,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}
