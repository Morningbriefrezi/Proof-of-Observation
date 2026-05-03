'use client';

import { useTranslations } from 'next-intl';
import { moonPhaseKey, type CompassDir } from '@/lib/sky/directions';
import type { SkyObject } from './types';

interface HintCardsProps {
  object: SkyObject;
}

function fmtHHmm(iso: string | null): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return null;
  }
}

export function HintCards({ object }: HintCardsProps) {
  const t = useTranslations('sky');
  const phaseKey = object.id === 'moon' ? moonPhaseKey(object.phase ?? 0.5) : null;
  const phaseText = phaseKey ? t(`moonPhase.${phaseKey}`) : '';

  const recognize =
    object.id === 'moon'
      ? t('hints.recognize.moon', { phase: phaseText })
      : t(`hints.recognize.${object.id}`);

  const compassWord = t(`directions.compass.${object.compassDirection as CompassDir}`);
  const setLabel = fmtHHmm(object.setTime);
  const riseLabel = fmtHHmm(object.riseTime);

  let bestWindow: string;
  if (object.visible && setLabel) {
    bestWindow = t('hints.bestWindow.untilSet', { time: setLabel, direction: compassWord });
  } else if (!object.visible && riseLabel) {
    bestWindow = t('hints.bestWindow.untilRise', { time: riseLabel, direction: compassWord });
  } else {
    bestWindow = t('hints.bestWindow.allNight');
  }

  return (
    <div className="finder-hints">
      <HintCard label={t('hints.fistTrick.label')} body={t('hints.fistTrick.body')} />
      <HintCard label={t('hints.recognize.label')} body={recognize} />
      <HintCard label={t('hints.bestWindow.label')} body={bestWindow} />
    </div>
  );
}

function HintCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="finder-hint">
      <div className="finder-hint__label">{label}</div>
      <div className="finder-hint__body">{body}</div>
    </div>
  );
}
