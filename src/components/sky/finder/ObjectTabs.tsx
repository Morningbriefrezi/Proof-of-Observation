'use client';

import { useTranslations } from 'next-intl';
import type { SkyObject, ObjectId } from './types';

interface ObjectTabsProps {
  objects: SkyObject[];
  activeId: ObjectId | null;
  onSelect: (id: ObjectId) => void;
  autoRotate: boolean;
  onToggleAuto: () => void;
}

export function ObjectTabs({ objects, activeId, onSelect, autoRotate, onToggleAuto }: ObjectTabsProps) {
  const t = useTranslations('sky.page');
  const visible = objects
    .filter((o) => o.visible)
    .sort((a, b) => a.magnitude - b.magnitude);

  if (visible.length === 0) return null;

  return (
    <div className="finder-tabs-row">
      <div className="finder-tabs">
        {visible.map((o) => {
          const active = o.id === activeId;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onSelect(o.id)}
              className={`finder-tab${active ? ' finder-tab--active' : ''}`}
            >
              {o.name}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onToggleAuto}
        className={`finder-auto${autoRotate ? ' finder-auto--on' : ''}`}
        aria-pressed={autoRotate}
        title={t('autoToggle')}
      >
        <span style={{ fontSize: 9, marginRight: 4 }}>{autoRotate ? '▶' : '⏸'}</span>
        {t('autoToggle')}
      </button>
    </div>
  );
}
