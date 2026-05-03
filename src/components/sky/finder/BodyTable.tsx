'use client';

import { useTranslations } from 'next-intl';
import type { ObjectId, SkyObject } from './types';

const DOT: Record<ObjectId, string> = {
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

interface BodyTableProps {
  objects: SkyObject[];
  activeId: ObjectId | null;
  onSelect: (id: ObjectId) => void;
}

function fmtTime(iso: string | null): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return null;
  }
}

function equipmentTier(mag: number): 'eye' | 'binocs' | 'scope' {
  if (mag <= 4) return 'eye';
  if (mag <= 9) return 'binocs';
  return 'scope';
}

export function BodyTable({ objects, activeId, onSelect }: BodyTableProps) {
  const t = useTranslations('sky.bodyTable');

  const sorted = [...objects].sort((a, b) => {
    if (a.visible && !b.visible) return -1;
    if (!a.visible && b.visible) return 1;
    if (a.visible) return b.altitude - a.altitude;
    if (a.riseTime && b.riseTime) return a.riseTime.localeCompare(b.riseTime);
    return 0;
  });

  return (
    <div className="body-table" role="listbox" aria-label={t('label')}>
      <header className="body-table__head">
        <span className="body-table__col body-table__col--name">{t('cols.body')}</span>
        <span className="body-table__col body-table__col--bearing">{t('cols.bearing')}</span>
        <span className="body-table__col body-table__col--alt">{t('cols.altitude')}</span>
        <span className="body-table__col body-table__col--mag">{t('cols.mag')}</span>
        <span className="body-table__col body-table__col--event">{t('cols.event')}</span>
      </header>
      <div className="body-table__rows">
        {sorted.map((o) => {
          const isActive = o.id === activeId;
          const setLabel = fmtTime(o.setTime);
          const riseLabel = fmtTime(o.riseTime);
          const tier = equipmentTier(o.magnitude);
          const tierLabel = t(`tier.${tier}`);
          const magStr = `${o.magnitude > 0 ? '+' : ''}${o.magnitude.toFixed(1)}`;
          const event = o.visible
            ? (setLabel ? t('setsAt', { time: setLabel }) : t('upAllNight'))
            : (riseLabel ? t('risesAt', { time: riseLabel }) : '—');

          return (
            <button
              key={o.id}
              type="button"
              role="option"
              aria-selected={isActive}
              className={`body-row ${isActive ? 'is-active' : ''} ${!o.visible ? 'is-below' : ''}`}
              onClick={() => onSelect(o.id)}
            >
              <span className="body-row__name">
                <span className="body-row__disc" style={{ background: DOT[o.id] }} />
                <span className="body-row__name-text">{o.name}</span>
                <span className={`body-row__tier body-row__tier--${tier}`}>{tierLabel}</span>
              </span>
              {o.visible ? (
                <>
                  <span className="body-row__bearing">
                    {Math.round(o.azimuth)}° <small>{o.compassDirection}</small>
                  </span>
                  <span className="body-row__alt">+{Math.round(o.altitude)}°</span>
                </>
              ) : (
                <>
                  <span className="body-row__bearing body-row__bearing--dim">—</span>
                  <span className="body-row__alt body-row__alt--dim">{t('below')}</span>
                </>
              )}
              <span className="body-row__mag">{magStr}</span>
              <span className="body-row__event">{event}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
