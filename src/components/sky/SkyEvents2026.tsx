// src/components/sky/SkyEvents2026.tsx
//
// Year-in-the-sky rail. Each card is mostly illustration: a small inline
// SVG animation tuned to the event type. Tap to expand a sheet with date,
// location, peak time hint, moon phase note, and three-line "how to observe".

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import './SkyEvents2026.css';

type EventKind =
  | 'lunarEclipse'
  | 'solarEclipse'
  | 'meteorShower'
  | 'opposition'
  | 'conjunction';

interface SkyEvent {
  id: string;
  kind: EventKind;
  date: string;       // ISO date, primary day
  endDate?: string;   // optional end of multi-day event
}

const EVENTS: SkyEvent[] = [
  { id: 'lunar_eclipse_mar3',  kind: 'lunarEclipse',  date: '2026-03-03' },
  { id: 'lyrids',              kind: 'meteorShower',  date: '2026-04-22', endDate: '2026-04-23' },
  { id: 'mars_saturn_conj',    kind: 'conjunction',   date: '2026-05-12' },
  { id: 'perseids',            kind: 'meteorShower',  date: '2026-08-12', endDate: '2026-08-13' },
  { id: 'solar_eclipse_aug12', kind: 'solarEclipse',  date: '2026-08-12' },
  { id: 'saturn_opp',          kind: 'opposition',    date: '2026-10-04' },
  { id: 'geminids',            kind: 'meteorShower',  date: '2026-12-13', endDate: '2026-12-14' },
];

export function SkyEvents2026() {
  const t = useTranslations('sky.events');
  const [openId, setOpenId] = useState<string | null>(null);

  const opened = EVENTS.find((e) => e.id === openId) ?? null;

  // Lock body scroll while sheet open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!openId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [openId]);

  return (
    <section className="ev" aria-label={t('aria')}>
      <header className="ev__head">
        <p className="ev__eyebrow">{t('eyebrow')}</p>
        <h2 className="ev__title">{t('title')}</h2>
        <p className="ev__sub">{t('subtitle')}</p>
      </header>

      <ol className="ev__rail" role="list">
        {EVENTS.map((ev) => (
          <li key={ev.id} className="ev__cell">
            <button
              type="button"
              className={`ev__card ev__card--${ev.kind}`}
              onClick={() => setOpenId(ev.id)}
              aria-label={t(`names.${ev.id}`)}
            >
              <div className="ev__art">
                <EventArt kind={ev.kind} />
              </div>
              <div className="ev__caption">
                <span className="ev__date">{formatDateRange(ev.date, ev.endDate)}</span>
                <span className="ev__name">{t(`names.${ev.id}`)}</span>
              </div>
            </button>
          </li>
        ))}
      </ol>

      {opened && (
        <div className="ev__sheet-backdrop" onClick={() => setOpenId(null)}>
          <div className="ev__sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ev__sheet-close"
              aria-label={t('close')}
              onClick={() => setOpenId(null)}
            >
              <X size={18} />
            </button>
            <div className="ev__sheet-art">
              <EventArt kind={opened.kind} large />
            </div>
            <p className="ev__sheet-eyebrow">{formatDateRange(opened.date, opened.endDate)}</p>
            <h3 className="ev__sheet-title">{t(`names.${opened.id}`)}</h3>
            <p className="ev__sheet-body">{t(`details.${opened.id}.body`)}</p>
            <ul className="ev__sheet-meta">
              <li>
                <span className="ev__sheet-key">{t('peak')}</span>
                <span className="ev__sheet-val">{t(`details.${opened.id}.peak`)}</span>
              </li>
              <li>
                <span className="ev__sheet-key">{t('moon')}</span>
                <span className="ev__sheet-val">{t(`details.${opened.id}.moon`)}</span>
              </li>
              <li>
                <span className="ev__sheet-key">{t('gear')}</span>
                <span className="ev__sheet-val">{t(`details.${opened.id}.gear`)}</span>
              </li>
            </ul>
            <p className="ev__sheet-tip">{t(`details.${opened.id}.tip`)}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function formatDateRange(start: string, end?: string): string {
  const s = new Date(start);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (!end) return s.toLocaleDateString('en-US', opts);
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth();
  if (sameMonth) {
    return `${s.toLocaleDateString('en-US', opts)}–${e.getDate()}`;
  }
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`;
}

interface EventArtProps {
  kind: EventKind;
  large?: boolean;
}

function EventArt({ kind, large = false }: EventArtProps) {
  switch (kind) {
    case 'lunarEclipse':
      return <LunarEclipseArt large={large} />;
    case 'solarEclipse':
      return <SolarEclipseArt large={large} />;
    case 'meteorShower':
      return <MeteorShowerArt large={large} />;
    case 'opposition':
      return <SaturnOppositionArt large={large} />;
    case 'conjunction':
      return <ConjunctionArt large={large} />;
  }
}

function LunarEclipseArt({ large }: { large: boolean }) {
  // The Moon drifts across, dimming and reddening as Earth's shadow falls.
  return (
    <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden="true" className={large ? 'ev-art ev-art--lg' : 'ev-art'}>
      <defs>
        <radialGradient id="moonNorm" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f4ede0" />
          <stop offset="60%" stopColor="#c8c2b5" />
          <stop offset="100%" stopColor="#6a665e" />
        </radialGradient>
        <radialGradient id="moonBlood" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFB28A" />
          <stop offset="60%" stopColor="#C84A2E" />
          <stop offset="100%" stopColor="#3F0E0A" />
        </radialGradient>
      </defs>
      <BackgroundDots />
      <g className="ev-le__moon">
        <circle cx="0" cy="60" r="22" fill="url(#moonNorm)" className="ev-le__pre" />
        <circle cx="0" cy="60" r="22" fill="url(#moonBlood)" className="ev-le__blood" />
      </g>
    </svg>
  );
}

function SolarEclipseArt({ large }: { large: boolean }) {
  // Sun disc with the Moon sliding across, exposing the corona at totality.
  return (
    <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden="true" className={large ? 'ev-art ev-art--lg' : 'ev-art'}>
      <defs>
        <radialGradient id="se-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbe1" />
          <stop offset="50%" stopColor="#ffd166" />
          <stop offset="100%" stopColor="#ff7b1a" />
        </radialGradient>
        <radialGradient id="se-corona" cx="50%" cy="50%" r="60%">
          <stop offset="40%" stopColor="rgba(255,209,102,0.0)" />
          <stop offset="60%" stopColor="rgba(255,209,102,0.6)" />
          <stop offset="100%" stopColor="rgba(255,209,102,0)" />
        </radialGradient>
      </defs>
      <BackgroundDots />
      <g transform="translate(100,60)">
        <circle r="42" fill="url(#se-corona)" className="ev-se__corona" />
        <circle r="26" fill="url(#se-sun)" />
        <circle r="26" cx="0" cy="0" fill="#0A1735" className="ev-se__moon" />
      </g>
    </svg>
  );
}

function MeteorShowerArt({ large }: { large: boolean }) {
  // Multiple streaks falling diagonally with staggered delays.
  const streaks = [
    { x: 20,  y: 0,   delay: '0s'   },
    { x: 60,  y: 0,   delay: '0.6s' },
    { x: 100, y: 0,   delay: '1.2s' },
    { x: 140, y: 0,   delay: '0.3s' },
    { x: 170, y: 0,   delay: '0.9s' },
  ];
  return (
    <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden="true" className={large ? 'ev-art ev-art--lg' : 'ev-art'}>
      <BackgroundDots dense />
      <defs>
        <linearGradient id="ms-streak" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="#FFD166" />
        </linearGradient>
      </defs>
      {streaks.map((s, i) => (
        <g key={i} className="ev-ms__streak" style={{ animationDelay: s.delay }}>
          <line x1={s.x} y1={s.y - 30} x2={s.x + 30} y2={s.y} stroke="url(#ms-streak)" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

function SaturnOppositionArt({ large }: { large: boolean }) {
  // Saturn growing from small to bright as opposition approaches.
  return (
    <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden="true" className={large ? 'ev-art ev-art--lg' : 'ev-art'}>
      <BackgroundDots />
      <defs>
        <radialGradient id="op-saturn" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f0dc9a" />
          <stop offset="55%" stopColor="#c89a3e" />
          <stop offset="100%" stopColor="#6b5020" />
        </radialGradient>
      </defs>
      <g transform="translate(100,60)" className="ev-op__saturn">
        <ellipse cx="0" cy="0" rx="50" ry="10" fill="none" stroke="rgba(212,169,84,0.55)" strokeWidth="1.2" />
        <ellipse cx="0" cy="0" rx="42" ry="8" fill="none" stroke="rgba(212,169,84,0.30)" strokeWidth="0.8" strokeDasharray="1 2" />
        <circle r="22" fill="url(#op-saturn)" />
      </g>
    </svg>
  );
}

function ConjunctionArt({ large }: { large: boolean }) {
  // Two planets approach, kiss, and drift apart.
  return (
    <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden="true" className={large ? 'ev-art ev-art--lg' : 'ev-art'}>
      <BackgroundDots />
      <defs>
        <radialGradient id="cj-mars" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ff7b54" />
          <stop offset="60%" stopColor="#c2451f" />
          <stop offset="100%" stopColor="#5a1d08" />
        </radialGradient>
        <radialGradient id="cj-saturn" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f0dc9a" />
          <stop offset="55%" stopColor="#c89a3e" />
          <stop offset="100%" stopColor="#6b5020" />
        </radialGradient>
      </defs>
      <g className="ev-cj__a">
        <circle cx="40" cy="60" r="9" fill="url(#cj-mars)" />
      </g>
      <g className="ev-cj__b">
        <circle cx="160" cy="60" r="10" fill="url(#cj-saturn)" />
      </g>
    </svg>
  );
}

function BackgroundDots({ dense = false }: { dense?: boolean }) {
  // Stable pseudo-random dots — adds depth without making the art noisy.
  const stars = dense
    ? [[12,12,0.7],[28,40,0.6],[44,18,0.5],[60,55,0.7],[84,10,0.6],[110,30,0.7],[132,8,0.5],[150,40,0.6],[170,16,0.7],[188,50,0.5],[24,90,0.5],[68,100,0.6],[120,95,0.5],[176,98,0.6]]
    : [[18,20,0.6],[52,12,0.5],[92,32,0.6],[140,18,0.6],[178,28,0.5],[30,90,0.5],[80,100,0.6],[150,92,0.5]];
  return (
    <g aria-hidden="true">
      {stars.map(([cx, cy, op], i) => (
        <circle key={i} cx={cx} cy={cy} r={1} fill="#fff" opacity={op} />
      ))}
    </g>
  );
}
