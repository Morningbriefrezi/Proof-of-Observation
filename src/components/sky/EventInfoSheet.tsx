'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { AstroEvent } from '@/lib/astro-events';

interface Props {
  open: boolean;
  event: AstroEvent | null;
  onClose: () => void;
}

const DIFFICULTY_LABEL: Record<AstroEvent['difficulty'], string> = {
  'naked-eye': 'Naked eye',
  'binoculars': 'Binoculars',
  'telescope': 'Telescope',
  'expert': 'Expert',
};

const TYPE_LABEL: Record<AstroEvent['type'], string> = {
  'eclipse-lunar': 'Lunar eclipse',
  'eclipse-solar': 'Solar eclipse',
  'conjunction': 'Conjunction',
  'comet': 'Comet',
  'opposition': 'Opposition',
  'meteor-shower': 'Meteor shower',
};

export default function EventInfoSheet({ open, event, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !event) return null;

  const eventDate = new Date(event.date + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(7,11,20,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 flex flex-col gap-3 max-h-[80vh] overflow-y-auto"
        style={{
          background: 'var(--canvas)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] font-mono">
              {TYPE_LABEL[event.type]} · {DIFFICULTY_LABEL[event.difficulty]}
            </p>
            <h2 className="text-text-primary text-lg font-semibold mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
              {event.name}
            </h2>
            <p className="text-text-muted text-xs mt-1 font-mono">{eventDate}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-text-primary text-sm leading-relaxed">
          {event.infoBar}
        </p>

        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
          <Row label="Visibility" value={event.visibilityRegion} />
          <Row label="Tip" value={event.viewingTip} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] font-mono">{label}</p>
      <p className="text-text-primary text-xs leading-relaxed">{value}</p>
    </div>
  );
}
