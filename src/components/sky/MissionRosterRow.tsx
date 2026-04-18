'use client';

import React from 'react';
import { CELESTIAL_ICONS } from './CelestialIcons';
import type { SkyMission, MissionRuntimeState } from '@/lib/mission-catalog';

interface MissionRosterRowProps {
  mission: SkyMission;
  state: MissionRuntimeState;
  onClick?: () => void;
  compact?: boolean;
}

export default function MissionRosterRow({
  mission,
  state,
  onClick,
  compact,
}: MissionRosterRowProps) {
  const Icon = CELESTIAL_ICONS[mission.iconKey];
  const iconSize = compact ? 40 : 48;

  const label = state.visibilityLabel ?? '';
  const altitudeClass = label.includes('LOW') || label.includes('RISING') ? 'vis-low' : 'vis-good';
  const showEquipHint =
    !compact && (mission.type === 'planet' || mission.type === 'nebula' || mission.type === 'galaxy');

  const classes = [
    'roster-item',
    state.isDone ? 'done' : '',
    state.isCloudy ? 'cloudy' : '',
    compact ? 'compact' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={state.isCloudy}
    >
      <div className="roster-icon">{Icon && <Icon size={iconSize} />}</div>

      <div className="roster-text">
        <div className="roster-name">{mission.name}</div>
        <div className="roster-sub">
          {state.isDone ? (
            <span style={{ color: '#34D399' }}>✓ SEALED ON SOLANA</span>
          ) : state.isCloudy ? (
            <span>{state.visibilityLabel}</span>
          ) : (
            <>
              <span className={altitudeClass}>{state.visibilityLabel}</span>
              {showEquipHint && ' · TELESCOPE'}
            </>
          )}
        </div>
      </div>

      <div className="roster-stars-col">
        {state.isDone ? (
          <div className="roster-done-stars">MINTED</div>
        ) : (
          <>
            <div className="roster-stars">{mission.stars}</div>
            <div className="roster-stars-sub">✦ STARS</div>
          </>
        )}
      </div>

      <style jsx>{`
        .roster-item {
          display: grid;
          grid-template-columns: 48px 1fr auto;
          gap: 14px;
          align-items: center;
          padding: 12px 14px;
          margin-bottom: 6px;
          width: 100%;
          text-align: left;
          background: #0A1220;
          border: 1px solid rgba(255,255,255,0.04);
          color: inherit;
          cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          transition: background 0.18s ease, border-color 0.18s ease;
        }
        .roster-item:hover:not(:disabled) {
          border-color: rgba(255,209,102,0.3);
          background: #0C1528;
        }
        .roster-item:disabled { cursor: default; }
        .roster-item.done { opacity: 0.55; border-color: rgba(52,211,153,0.2); }
        .roster-item.cloudy { opacity: 0.4; filter: grayscale(0.7); }

        .roster-item.compact { grid-template-columns: 40px 1fr auto; gap: 12px; padding: 10px 12px; }

        .roster-icon {
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
        }
        .roster-item.compact .roster-icon { width: 40px; height: 40px; }

        .roster-text { min-width: 0; }
        .roster-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 18px;
          color: #F5F1E8;
          line-height: 1.15;
        }
        .roster-item.compact .roster-name { font-size: 16px; }

        .roster-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: #7A7868;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 3px;
        }
        .vis-good { color: #34D399; }
        .vis-low  { color: #D97757; }

        .roster-stars-col { text-align: right; }
        .roster-stars {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 600;
          font-size: 20px;
          color: #FFD166;
          line-height: 1;
        }
        .roster-item.compact .roster-stars { font-size: 17px; }
        .roster-stars-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          color: #7A7868;
          letter-spacing: 0.2em;
          margin-top: 4px;
        }
        .roster-done-stars {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #34D399;
          letter-spacing: 0.15em;
        }
      `}</style>
    </button>
  );
}
