'use client';

import React, { useMemo, memo } from 'react';
import { CELESTIAL_ICONS } from './CelestialIcons';
import type { MissionRuntimeState, SkyMission } from '@/lib/mission-catalog';

interface MissionSkymapProps {
  missions: MissionRuntimeState[];
  skyMissions: SkyMission[];
  location?: { lat: number; lon: number; label: string };
  currentTime?: Date;
  cloudCoverPct?: number;
  onMissionClick?: (missionId: string) => void;
  variant?: 'desktop' | 'mobile';
}

interface Star {
  x: number;
  y: number;
  tier: 1 | 2 | 3 | 4 | 5;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateStars(count: number, seed: number): Star[] {
  const rand = mulberry32(seed);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const r = rand();
    let tier: Star['tier'] = 1;
    if (r > 0.99) tier = 5;
    else if (r > 0.95) tier = 4;
    else if (r > 0.85) tier = 3;
    else if (r > 0.6) tier = 2;
    stars.push({ x: rand() * 100, y: rand() * 100, tier });
  }
  return stars;
}

const ICON_SIZE_DESKTOP: Record<string, number> = {
  jupiter: 42,
  saturn: 42,
  moon: 36,
  pleiades: 32,
  andromeda: 30,
  orion_nebula: 30,
  mars: 28,
  crab_nebula: 24,
  ring_nebula: 26,
  double_cluster: 28,
};

function getIconSize(id: string, isPrime: boolean, variant: 'desktop' | 'mobile'): number {
  const base = ICON_SIZE_DESKTOP[id] ?? 28;
  const bump = isPrime ? 8 : 0;
  const scale = variant === 'mobile' ? 0.75 : 1;
  return Math.round((base + bump) * scale);
}

function formatLiveTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MissionSkymap({
  missions,
  skyMissions,
  location = { lat: 41.72, lon: 44.83, label: 'Tbilisi' },
  currentTime,
  cloudCoverPct = 12,
  onMissionClick,
  variant = 'desktop',
}: MissionSkymapProps) {
  const seed = variant === 'mobile' ? 29 : 13;
  const starCount = variant === 'mobile' ? 140 : 200;

  const stars = useMemo(() => generateStars(starCount, seed), [starCount, seed]);

  const now = currentTime ?? new Date();
  const liveTime = formatLiveTime(now);

  const coords = `${location.lat.toFixed(1)}°${location.lat >= 0 ? 'N' : 'S'} ${location.lon.toFixed(1)}°${location.lon >= 0 ? 'E' : 'W'}`;

  const conditionLabel = cloudCoverPct < 30 ? 'CLEAR' : cloudCoverPct < 60 ? 'PARTIAL' : 'CLOUDY';

  const svgViewBox = variant === 'mobile' ? '0 0 400 500' : '0 0 1000 800';

  const constellationLines = variant === 'mobile' ? (
    <>
      {/* Orion belt + body */}
      <line x1="110" y1="320" x2="135" y2="325" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="135" y1="325" x2="160" y2="330" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="160" y1="330" x2="185" y2="335" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="135" y1="325" x2="115" y2="280" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="160" y1="330" x2="180" y2="375" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      {/* Big Dipper */}
      <line x1="220" y1="120" x2="250" y2="130" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="250" y1="130" x2="280" y2="140" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="280" y1="140" x2="310" y2="135" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="310" y1="135" x2="330" y2="155" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="330" y1="155" x2="360" y2="165" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      {/* Cassiopeia W */}
      <line x1="50" y1="80" x2="80" y2="110" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="80" y1="110" x2="110" y2="85" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="110" y1="85" x2="140" y2="115" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="140" y1="115" x2="170" y2="90" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
    </>
  ) : (
    <>
      {/* Orion belt + body */}
      <line x1="280" y1="520" x2="340" y2="530" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="340" y1="530" x2="400" y2="540" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="400" y1="540" x2="460" y2="550" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="340" y1="530" x2="300" y2="440" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="400" y1="540" x2="440" y2="640" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="280" y1="520" x2="250" y2="620" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      {/* Big Dipper */}
      <line x1="560" y1="180" x2="620" y2="200" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="620" y1="200" x2="680" y2="220" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="680" y1="220" x2="740" y2="210" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="740" y1="210" x2="780" y2="250" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="780" y1="250" x2="840" y2="270" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="840" y1="270" x2="880" y2="300" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      {/* Cassiopeia W */}
      <line x1="120" y1="120" x2="180" y2="180" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="180" y1="180" x2="240" y2="130" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="240" y1="130" x2="300" y2="190" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="300" y1="190" x2="360" y2="140" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="2 3" />
    </>
  );

  return (
    <div className={`skymap skymap-${variant}`}>
      {/* background + milky way */}
      <div className="sm-bg" aria-hidden />
      <div className="sm-milky" aria-hidden />

      {/* star field */}
      <div className="sm-stars" aria-hidden>
        {stars.map((s, i) => (
          <span
            key={i}
            className={`star s${s.tier}`}
            style={{ top: `${s.y}%`, left: `${s.x}%` }}
          />
        ))}
      </div>

      {/* constellation overlay */}
      <svg className="sm-const" viewBox={svgViewBox} preserveAspectRatio="none" aria-hidden>
        {constellationLines}
      </svg>

      {/* compass */}
      <div className="compass n">N</div>
      <div className="compass s">S</div>
      <div className="compass e">E</div>
      <div className="compass w">W</div>

      {/* meta strips */}
      <div className="meta-left">
        <span className="pulse-dot" />
        <span>LIVE · {liveTime}</span>
      </div>
      <div className="meta-right">{coords}</div>

      {/* mission objects */}
      {missions.map((state) => {
        const mission = skyMissions.find((m) => m.id === state.id);
        if (!mission) return null;
        const Icon = CELESTIAL_ICONS[mission.iconKey];
        if (!Icon) return null;
        const iconSize = getIconSize(mission.id, state.isPrime, variant);
        const label = mission.name.split(' · ')[0];
        const cls = [
          'sky-obj',
          state.isPrime ? 'prime' : '',
          state.isDone ? 'done' : '',
          state.isCloudy ? 'cloudy' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={state.id}
            type="button"
            className={cls}
            style={{ top: state.skyPosition.top, left: state.skyPosition.left }}
            onClick={() => !state.isCloudy && onMissionClick?.(state.id)}
            disabled={state.isCloudy}
            aria-label={mission.name}
          >
            {state.isPrime && (
              <>
                <svg className="prime-reticle" viewBox="0 0 100 100" aria-hidden>
                  <line x1="50" y1="8" x2="50" y2="24" stroke="#FFD166" strokeWidth="1.5" />
                  <line x1="50" y1="76" x2="50" y2="92" stroke="#FFD166" strokeWidth="1.5" />
                  <line x1="8" y1="50" x2="24" y2="50" stroke="#FFD166" strokeWidth="1.5" />
                  <line x1="76" y1="50" x2="92" y2="50" stroke="#FFD166" strokeWidth="1.5" />
                </svg>
                <span className="prime-ring" />
                <span className="prime-ring p2" />
              </>
            )}
            <Icon size={iconSize} />
            <div className="sky-obj-label">{label}</div>
          </button>
        );
      })}

      {/* conditions pill */}
      <div className="pill conditions">
        <span className="green-dot" />
        <span>{conditionLabel} · {cloudCoverPct}% CLOUD</span>
      </div>

      {/* legend */}
      <div className="pill legend">
        <span className="legend-item"><span className="swatch brass" />Prime</span>
        <span className="legend-item"><span className="swatch white" />Visible</span>
        <span className="legend-item"><span className="swatch grey" />Clouded</span>
      </div>

      <style jsx>{`
        .skymap {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(180deg, #030610 0%, #0A1220 55%, #180820 100%);
          border: 1px solid rgba(255,209,102,0.12);
          clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
        }
        .skymap-desktop { aspect-ratio: 5 / 4; }
        .skymap-mobile  { aspect-ratio: 4 / 5; }

        .skymap::before,
        .skymap::after {
          content: '';
          position: absolute;
          width: 12px; height: 12px;
          border: 1px solid #FFD166;
          z-index: 6;
          pointer-events: none;
        }
        .skymap::before {
          top: 6px; left: 6px;
          border-right: none; border-bottom: none;
        }
        .skymap::after {
          bottom: 6px; right: 6px;
          border-left: none; border-top: none;
        }

        .sm-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 45% at 50% 100%, rgba(255,180,120,0.12), transparent 70%),
            radial-gradient(ellipse 70% 40% at 50% 50%, rgba(132,101,203,0.15), transparent 75%),
            radial-gradient(ellipse 60% 30% at 50% 0%, rgba(0,0,0,0.5), transparent 70%);
          pointer-events: none;
        }

        .sm-milky {
          position: absolute;
          top: 15%; left: -10%;
          width: 120%; height: 50%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,220,180,0.05) 25%,
            rgba(255,200,160,0.12) 50%,
            rgba(255,220,180,0.05) 75%,
            transparent 100%
          );
          filter: blur(20px);
          transform: rotate(-10deg);
          pointer-events: none;
        }

        .sm-stars {
          position: absolute; inset: 0;
          pointer-events: none;
        }
        .star {
          position: absolute;
          background: #FFFFFF;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        .star.s1 { width: 1px; height: 1px; opacity: 0.55; }
        .star.s2 { width: 2px; height: 2px; opacity: 0.75; }
        .star.s3 { width: 3px; height: 3px; opacity: 0.9; box-shadow: 0 0 4px rgba(255,255,255,0.5); }
        .star.s4 {
          width: 4px; height: 4px; opacity: 1;
          box-shadow: 0 0 6px rgba(255,255,255,0.8);
          animation: twinkle 3s ease-in-out infinite;
        }
        .star.s5 {
          width: 5px; height: 5px; opacity: 1;
          box-shadow: 0 0 10px rgba(255,220,180,0.9);
          animation: twinkle 3s ease-in-out infinite;
        }

        .sm-const {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none;
        }

        .compass {
          position: absolute;
          color: #7A7868;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.25em;
          pointer-events: none;
          z-index: 3;
        }
        .compass.n { top: 10px; left: 50%; transform: translateX(-50%); }
        .compass.s { bottom: 10px; left: 50%; transform: translateX(-50%); }
        .compass.e { right: 12px; top: 50%; transform: translateY(-50%); }
        .compass.w { left: 12px; top: 50%; transform: translateY(-50%); }

        .meta-left, .meta-right {
          position: absolute;
          top: 14px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #FFD166;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          z-index: 4;
        }
        .meta-left  { left: 18px; }
        .meta-right { right: 18px; color: #7A7868; }

        .pulse-dot {
          width: 6px; height: 6px;
          background: #FFD166;
          border-radius: 50%;
          box-shadow: 0 0 10px #FFD166;
          animation: live-pulse 1.8s ease-in-out infinite;
        }

        .sky-obj {
          position: absolute;
          transform: translate(-50%, -50%);
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          z-index: 5;
          transition: transform 0.25s ease;
        }
        .sky-obj:hover:not(:disabled) {
          transform: translate(-50%, -50%) scale(1.15);
          z-index: 8;
        }
        .sky-obj:disabled { cursor: default; }
        .sky-obj-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #F5F1E8;
          text-transform: uppercase;
          text-shadow: 0 0 6px rgba(0,0,0,0.8);
          white-space: nowrap;
        }

        .sky-obj.prime .sky-obj-label { color: #FFD166; }

        .prime-reticle {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 110px; height: 110px;
          pointer-events: none;
        }
        .prime-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border: 1.5px solid #FFD166;
          border-radius: 50%;
          animation: prime-pulse 2.4s ease-out infinite;
          opacity: 0;
          pointer-events: none;
        }
        .prime-ring.p2 { animation-delay: 1.2s; }

        .sky-obj.cloudy { filter: grayscale(1) blur(2px); opacity: 0.2; }
        .sky-obj.cloudy::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 100%; height: 100%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(120,120,140,0.4), transparent 70%);
          pointer-events: none;
        }

        .sky-obj.done::before {
          content: '✓';
          position: absolute;
          top: -4px; right: -4px;
          width: 14px; height: 14px;
          background: #34D399;
          color: #070B14;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .pill {
          position: absolute;
          bottom: 14px;
          padding: 6px 10px;
          background: rgba(10,18,32,0.75);
          border: 1px solid rgba(255,255,255,0.08);
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #F5F1E8;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          z-index: 4;
          backdrop-filter: blur(6px);
        }
        .pill.conditions { left: 14px; }
        .pill.legend     { right: 14px; gap: 10px; }

        .green-dot {
          width: 6px; height: 6px;
          background: #34D399;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(52,211,153,0.7);
        }
        .legend-item { display: inline-flex; align-items: center; gap: 5px; }
        .swatch {
          width: 8px; height: 8px;
          display: inline-block;
        }
        .swatch.brass { background: #FFD166; }
        .swatch.white { background: #F5F1E8; }
        .swatch.grey  { background: #3E3F42; }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
        }
        @keyframes prime-pulse {
          0%   { width: 50px; height: 50px; opacity: 0.9; }
          100% { width: 130px; height: 130px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default memo(MissionSkymap);
