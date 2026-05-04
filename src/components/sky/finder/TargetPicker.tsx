'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { CatalogDifficulty } from '@/lib/sky/catalog';
import type { ObjectId, SkyObject } from './types';

interface TargetPickerProps {
  objects: SkyObject[];
  activeId: ObjectId | null;
  onSelect: (id: ObjectId) => void;
  autoRotate: boolean;
  onToggleAuto: () => void;
}

type TierFilter = 'all' | CatalogDifficulty;

const TIER_ORDER: TierFilter[] = ['all', 'easy', 'medium', 'hard'];

function fmtHHmm(iso: string | null): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return null;
  }
}

export function TargetPicker({
  objects,
  activeId,
  onSelect,
  autoRotate,
  onToggleAuto,
}: TargetPickerProps) {
  const t = useTranslations('sky.picker');
  const [tier, setTier] = useState<TierFilter>('all');

  const filtered = useMemo(() => {
    return objects.filter((o) => {
      if (o.id === 'sun' && !o.visible) return false;
      if (tier === 'all') return true;
      return o.difficulty === tier;
    });
  }, [objects, tier]);

  const sorted = useMemo(() => {
    const visible: SkyObject[] = [];
    const below: SkyObject[] = [];
    for (const o of filtered) {
      (o.visible ? visible : below).push(o);
    }
    visible.sort((a, b) => {
      if (a.id === 'moon' && b.id !== 'moon') return -1;
      if (b.id === 'moon' && a.id !== 'moon') return 1;
      return a.magnitude - b.magnitude;
    });
    below.sort((a, b) => {
      const ar = a.riseTime ? new Date(a.riseTime).getTime() : Number.POSITIVE_INFINITY;
      const br = b.riseTime ? new Date(b.riseTime).getTime() : Number.POSITIVE_INFINITY;
      return ar - br;
    });
    return { visible, below };
  }, [filtered]);

  const visibleCount = sorted.visible.length;

  // Tier counts (live, ignore the active tier filter).
  const tierCounts = useMemo(() => {
    const counts: Record<CatalogDifficulty, number> = { easy: 0, medium: 0, hard: 0 };
    for (const o of objects) {
      if (!o.visible) continue;
      if (o.id === 'sun') continue;
      counts[o.difficulty]++;
    }
    return counts;
  }, [objects]);

  // AUTO mode: every 30s, re-pick the brightest visible target in current tier.
  useEffect(() => {
    if (!autoRotate) return;
    if (sorted.visible.length === 0) return;
    const pickBrightest = () => onSelect(sorted.visible[0].id);
    pickBrightest();
    const id = setInterval(pickBrightest, 30_000);
    return () => clearInterval(id);
  }, [autoRotate, sorted.visible, onSelect]);

  return (
    <div className="target-picker">
      <div className="target-picker__tiers" role="tablist" aria-label={t('tierAria')}>
        {TIER_ORDER.map((tk) => {
          const active = tier === tk;
          const count =
            tk === 'all'
              ? tierCounts.easy + tierCounts.medium + tierCounts.hard
              : tierCounts[tk];
          return (
            <button
              key={tk}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTier(tk)}
              className={`target-tier${active ? ' is-active' : ''} target-tier--${tk}`}
            >
              <span className="target-tier__label">{t(`tier.${tk}`)}</span>
              <span className="target-tier__count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="target-picker__label">
        {t('header', { count: visibleCount })}
      </div>

      <div className="target-picker__row">
        <div className="target-picker__chips">
          {sorted.visible.map((o) => (
            <ChipVisible key={o.id} obj={o} active={o.id === activeId} onSelect={onSelect} />
          ))}
          {sorted.below.map((o) => (
            <ChipBelow
              key={o.id}
              obj={o}
              active={o.id === activeId}
              onSelect={onSelect}
              risesLabel={
                o.circumpolar
                  ? t('circumpolar')
                  : t('risesAt', { time: fmtHHmm(o.riseTime) ?? '—' })
              }
            />
          ))}
          {sorted.visible.length === 0 && sorted.below.length === 0 && (
            <span className="target-picker__empty">{t('emptyTier')}</span>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleAuto}
          className={`target-picker__auto${autoRotate ? ' is-on' : ''}`}
          aria-pressed={autoRotate}
          title={t('autoToggle')}
        >
          <span className="target-picker__auto-dot" />
          {t('auto')}
        </button>
      </div>
    </div>
  );
}

function ChipVisible({
  obj,
  active,
  onSelect,
}: {
  obj: SkyObject;
  active: boolean;
  onSelect: (id: ObjectId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(obj.id)}
      className={`target-chip target-chip--${obj.type}${active ? ' is-active' : ''}`}
      aria-pressed={active}
    >
      <TypeGlyph obj={obj} />
      <span className="target-chip__name">{obj.name}</span>
      <span className="target-chip__alt">{Math.round(obj.altitude)}°</span>
      {obj.instrument === 'binoculars' && <BinocsIcon />}
      {obj.instrument === 'telescope' && <TelescopeIcon />}
    </button>
  );
}

function ChipBelow({
  obj,
  active,
  onSelect,
  risesLabel,
}: {
  obj: SkyObject;
  active: boolean;
  onSelect: (id: ObjectId) => void;
  risesLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(obj.id)}
      className={`target-chip target-chip--${obj.type} target-chip--below${active ? ' is-active' : ''}`}
      aria-pressed={active}
    >
      <TypeGlyph obj={obj} />
      <span className="target-chip__name">{obj.name}</span>
      <span className="target-chip__rises">{risesLabel}</span>
    </button>
  );
}

function TypeGlyph({ obj }: { obj: SkyObject }) {
  if (obj.type === 'planet' || obj.type === 'moon' || obj.type === 'sun') {
    return <span className={`target-chip__glyph target-chip__glyph--planet target-chip__glyph--${obj.id}`} />;
  }
  if (obj.type === 'star' || obj.type === 'double') {
    return (
      <svg width={12} height={12} viewBox="0 0 12 12" className="target-chip__glyph-svg" aria-hidden="true">
        <path
          d="M6 0.6 L7.1 4.5 L11.1 4.5 L7.9 6.9 L9.0 10.8 L6 8.4 L3.0 10.8 L4.1 6.9 L0.9 4.5 L4.9 4.5 Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (obj.type === 'galaxy') {
    return (
      <svg width={14} height={12} viewBox="0 0 14 12" className="target-chip__glyph-svg" aria-hidden="true">
        <ellipse cx={7} cy={6} rx={6.2} ry={2.2} fill="none" stroke="currentColor" strokeWidth={1.2} transform="rotate(-25 7 6)" />
        <circle cx={7} cy={6} r={1.1} fill="currentColor" />
      </svg>
    );
  }
  if (obj.type === 'nebula') {
    return (
      <svg width={12} height={12} viewBox="0 0 12 12" className="target-chip__glyph-svg" aria-hidden="true">
        <path
          d="M3 6 Q3 3 6 3 Q9 3 9 6 Q9 9 6 9 Q3 9 3 6 Z M2 5 Q4 4 6 5 M10 7 Q8 8 6 7"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.1}
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (obj.type === 'cluster') {
    return (
      <svg width={12} height={12} viewBox="0 0 12 12" className="target-chip__glyph-svg" aria-hidden="true">
        <circle cx={6} cy={3} r={1.1} fill="currentColor" />
        <circle cx={3} cy={8} r={1.1} fill="currentColor" />
        <circle cx={9} cy={8} r={1.1} fill="currentColor" />
        <circle cx={6} cy={6.5} r={0.7} fill="currentColor" opacity={0.7} />
      </svg>
    );
  }
  return null;
}

function TelescopeIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 16 16" aria-hidden="true" className="target-chip__scope">
      <path d="M2.5 11l4.5-7 6 3.5-2 3.5L2.5 11Z" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinejoin="round" />
      <path d="M5 11.5l-2 3.5" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" />
      <path d="M9.5 11.5l-1 2.5" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" />
    </svg>
  );
}

function BinocsIcon() {
  return (
    <svg width={12} height={11} viewBox="0 0 16 14" aria-hidden="true" className="target-chip__scope">
      <circle cx={4} cy={9} r={3.5} fill="none" stroke="currentColor" strokeWidth={1.2} />
      <circle cx={12} cy={9} r={3.5} fill="none" stroke="currentColor" strokeWidth={1.2} />
      <path d="M3 5l1.4-2.5h7.2L13 5" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinejoin="round" />
      <line x1={7.5} y1={9} x2={8.5} y2={9} stroke="currentColor" strokeWidth={1.2} />
    </svg>
  );
}
