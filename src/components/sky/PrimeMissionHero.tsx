'use client';

import React from 'react';
import { CELESTIAL_ICONS } from './CelestialIcons';
import type { SkyMission } from '@/lib/mission-catalog';

interface PrimeMissionHeroProps {
  mission: SkyMission;
  bestViewingTime?: string;
  elevation?: string;
  onStart: () => void;
  variant?: 'desktop' | 'mobile';
}

export default function PrimeMissionHero({
  mission,
  bestViewingTime,
  elevation,
  onStart,
  variant = 'desktop',
}: PrimeMissionHeroProps) {
  const Icon = CELESTIAL_ICONS[mission.iconKey];
  const isMobile = variant === 'mobile';
  const iconSize = isMobile ? 54 : 84;

  const typeLabel = mission.type.replace('_', ' ');

  const metaItems: string[] = isMobile
    ? [
        elevation ? `ELEV ${elevation}` : '',
        bestViewingTime ? `BEST ${bestViewingTime}` : '',
        `+${mission.stars} ✦`,
      ].filter(Boolean)
    : [
        typeLabel,
        mission.description,
        elevation ? `ELEV ${elevation}` : '',
        bestViewingTime ? `BEST ${bestViewingTime}` : '',
      ].filter(Boolean);

  const ctaText = isMobile
    ? `Observe ${mission.name.split(' · ')[0]} · +${mission.stars} ✦ →`
    : `Observe · +${mission.stars} ✦  →`;

  return (
    <div className={`hero hero-${variant}`}>
      <div className="hero-icon">
        {Icon && <Icon size={iconSize} />}
      </div>

      <div className="hero-text">
        <div className="kicker">◆ PRIME TONIGHT</div>
        <div className="hero-title">{mission.name.split(' · ')[0]}</div>
        <div className="meta-row">
          {metaItems.map((item, i) => (
            <React.Fragment key={i}>
              <span className="meta-item">{item}</span>
              {i < metaItems.length - 1 && <span className="dot-sep" aria-hidden />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <button type="button" className="hero-cta" onClick={onStart}>
        {ctaText}
      </button>

      <style jsx>{`
        .hero {
          position: relative;
          padding: 22px 26px;
          background:
            radial-gradient(ellipse at 85% 50%, rgba(255,209,102,0.12), transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.02), transparent),
            #0C1424;
          border: 1px solid rgba(255,209,102,0.3);
          clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 24px;
          align-items: center;
        }
        .hero::before,
        .hero::after {
          content: '';
          position: absolute;
          width: 12px; height: 12px;
          border: 1px solid #FFD166;
          pointer-events: none;
        }
        .hero::before {
          top: 6px; left: 6px;
          border-right: none; border-bottom: none;
        }
        .hero::after {
          bottom: 6px; right: 6px;
          border-left: none; border-top: none;
        }

        .hero-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-text { min-width: 0; }
        .kicker {
          position: relative;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #FFD166;
          padding-left: 24px;
        }
        .kicker::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          width: 18px; height: 1px;
          background: #FFD166;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 34px;
          line-height: 1;
          color: #FFFFFF;
          margin-top: 6px;
        }
        .meta-row {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7A7868;
        }
        .meta-item { white-space: nowrap; }
        .dot-sep {
          width: 4px; height: 4px;
          background: #3E3F42;
          display: inline-block;
        }

        .hero-cta {
          padding: 14px 22px;
          background: #FFD166;
          color: #070B14;
          border: none;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          transition: transform 0.18s ease;
          white-space: nowrap;
        }
        .hero-cta:hover { transform: translateY(-1px); }

        .hero-mobile {
          padding: 16px;
          grid-template-columns: auto 1fr;
          gap: 14px;
        }
        .hero-mobile .hero-title { font-size: 26px; }
        .hero-mobile .meta-row { font-size: 9px; gap: 8px; }
        .hero-mobile .hero-cta {
          grid-column: span 2;
          margin-top: 12px;
          justify-self: stretch;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
