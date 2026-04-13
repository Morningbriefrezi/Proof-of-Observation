'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/lib/location';
import type { SkyDay } from '@/lib/sky-data';
import type { PlanetInfo } from '@/lib/planets';

const PLANET_SYMBOL: Record<string, string> = {
  moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄',
};

function dayBadge(day: SkyDay): 'Go' | 'Maybe' | 'Skip' {
  const nightHours = day.hours.filter(h => { const hr = new Date(h.time).getHours(); return hr >= 20 || hr < 4; });
  const hours = nightHours.length > 0 ? nightHours : day.hours;
  const avg = hours.reduce((s, h) => s + h.cloudCover, 0) / hours.length;
  if (avg < 30) return 'Go';
  if (avg < 60) return 'Maybe';
  return 'Skip';
}

function formatDay(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tom';
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
}

function getDayStats(day: SkyDay) {
  const nightHours = day.hours.filter(h => { const hr = new Date(h.time).getHours(); return hr >= 20 || hr < 4; });
  const hours = nightHours.length > 0 ? nightHours : day.hours;
  const avgCloud = hours.length > 0
    ? Math.round(hours.reduce((s, h) => s + h.cloudCover, 0) / hours.length)
    : null;
  const visibility =
    avgCloud === null ? null
    : avgCloud < 20 ? 'Excellent'
    : avgCloud < 50 ? 'Good'
    : avgCloud < 70 ? 'Fair'
    : 'Poor';
  const clearHours = hours.filter(h => h.cloudCover < 40);
  const bestWindow: string | null = (() => {
    if (clearHours.length === 0) return null;
    const first = new Date(clearHours[0].time);
    const last = new Date(clearHours[clearHours.length - 1].time);
    const fmt = (d: Date) => `${d.getHours().toString().padStart(2, '0')}:00`;
    return `${fmt(first)}–${fmt(last)}`;
  })();
  const status: 'Go' | 'Maybe' | 'Skip' =
    avgCloud === null ? 'Skip'
    : avgCloud < 30 ? 'Go'
    : avgCloud < 60 ? 'Maybe'
    : 'Skip';
  return { avgCloud, visibility, bestWindow, status };
}

// Semicircle sky clarity gauge
function ClarityGauge({ cloudCover, color }: { cloudCover: number; color: string }) {
  const ARC = 106.8; // π × 34
  const fill = (1 - cloudCover / 100) * ARC;
  const pct = Math.round(100 - cloudCover);
  return (
    <svg width="88" height="54" viewBox="0 0 88 54" style={{ overflow: 'visible', flexShrink: 0 }}>
      <path d="M 10 48 A 34 34 0 0 1 78 48"
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 10 48 A 34 34 0 0 1 78 48"
        fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={`${fill} ${ARC}`}
        style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1)' }}
      />
      <text x="44" y="40" textAnchor="middle" fill={color} fontSize="15" fontWeight="800" fontFamily="monospace">{pct}%</text>
      <text x="44" y="52" textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="8.5">clear sky</text>
    </svg>
  );
}

// Planet card with altitude ring
function PlanetCard({ planet, index }: { planet: PlanetInfo; index: number }) {
  const R = 19;
  const CIRC = 2 * Math.PI * R;
  const altFill = Math.max(0, Math.min(1, planet.altitude / 90)) * CIRC;
  const quality = planet.altitude > 30 ? 'good' : planet.altitude > 10 ? 'ok' : 'low';
  const color =
    quality === 'good' ? '#34d399'
    : quality === 'ok' ? '#FFD166'
    : 'rgba(148,163,184,0.35)';
  const symbol = PLANET_SYMBOL[planet.key] ?? '✦';
  const name = planet.key.charAt(0).toUpperCase() + planet.key.slice(1);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      minWidth: 68, flexShrink: 0,
      animation: `skyFadeUp 0.45s ease-out ${index * 0.08}s both`,
    }}>
      {/* Ring with symbol inside */}
      <div style={{ position: 'relative', width: 50, height: 50 }}>
        <svg width="50" height="50" viewBox="0 0 50 50"
          style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
          <circle cx="25" cy="25" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle cx="25" cy="25" r={R} fill="none" stroke={color} strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${altFill} ${CIRC - altFill}`}
            style={{
              filter: quality !== 'low' ? `drop-shadow(0 0 5px ${color}99)` : 'none',
              transition: 'stroke-dasharray 1.1s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, color,
        }}>
          {symbol}
        </div>
      </div>
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 500 }}>{name}</span>
      <span style={{ color, fontSize: 11, fontWeight: 700, marginTop: -2, fontFamily: 'monospace' }}>
        {Math.round(planet.altitude)}°
      </span>
    </div>
  );
}

export default function HomeSkyPreview() {
  const { location } = useLocation();
  const [forecast, setForecast] = useState<SkyDay[] | null>(null);
  const [planets, setPlanets] = useState<PlanetInfo[] | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [planetsLoading, setPlanetsLoading] = useState(false);

  useEffect(() => {
    const lat = location.lat || 41.6941;
    const lng = location.lon || 44.8337;
    setForecast(null);
    setPlanets(null);
    setSelectedDay(0);
    fetch(`/api/sky/forecast?lat=${lat}&lng=${lng}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setForecast(d))
      .catch(() => setForecast([]));
    fetch(`/api/sky/planets?lat=${lat}&lng=${lng}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setPlanets(d))
      .catch(() => setPlanets([]));
  }, [location.lat, location.lon]);

  function selectDay(index: number, dateStr: string) {
    setSelectedDay(index);
    const lat = location.lat || 41.6941;
    const lng = location.lon || 44.8337;
    setPlanetsLoading(true);
    const date = index === 0 ? new Date().toISOString() : `${dateStr}T21:00:00`;
    fetch(`/api/sky/planets?lat=${lat}&lng=${lng}&date=${encodeURIComponent(date)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setPlanets(d); setPlanetsLoading(false); })
      .catch(() => setPlanetsLoading(false));
  }

  // Loading skeleton
  if (forecast === null || planets === null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          height: 130, borderRadius: 20,
          background: 'rgba(52,211,153,0.03)',
          border: '1px solid rgba(52,211,153,0.07)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <div style={{ display: 'flex', gap: 10 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ minWidth: 68, height: 88, borderRadius: 16, background: 'rgba(255,255,255,0.02)', animation: 'pulse 2s ease-in-out infinite', flexShrink: 0 }} />
          ))}
        </div>
        <div style={{ height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.02)', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>
    );
  }

  const selectedForecast = forecast?.[selectedDay];
  const { avgCloud, visibility, bestWindow, status } = selectedForecast
    ? getDayStats(selectedForecast)
    : { avgCloud: null, visibility: null, bestWindow: null, status: 'Skip' as const };

  const visiblePlanets = [...(planets ?? [])]
    .filter(p => p.altitude > -5)
    .sort((a, b) => b.altitude - a.altitude)
    .slice(0, 5);

  const locationLabel = location.city
    ? `${location.city}${location.country ? `, ${location.country}` : ''}`
    : 'Global';

  const selectedLabel = selectedDay === 0
    ? 'Tonight'
    : selectedDay === 1
    ? 'Tomorrow'
    : formatDay(forecast[selectedDay]?.date ?? '', selectedDay);

  const bestTarget = visiblePlanets.find(p => p.altitude > 20) ?? null;

  const SC = {
    Go: {
      color: '#34d399',
      glow: 'rgba(52,211,153,0.35)',
      glowFaint: 'rgba(52,211,153,0.12)',
      border: 'rgba(52,211,153,0.22)',
      bg: 'rgba(52,211,153,0.06)',
      nebula: 'radial-gradient(ellipse at 15% 40%, rgba(52,211,153,0.13) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(56,240,255,0.05) 0%, transparent 50%)',
      icon: '✦', label: 'GO',
    },
    Maybe: {
      color: '#FFD166',
      glow: 'rgba(255,209,102,0.35)',
      glowFaint: 'rgba(255,209,102,0.1)',
      border: 'rgba(255,209,102,0.18)',
      bg: 'rgba(255,209,102,0.05)',
      nebula: 'radial-gradient(ellipse at 15% 40%, rgba(255,209,102,0.10) 0%, transparent 60%)',
      icon: '◑', label: 'MAYBE',
    },
    Skip: {
      color: 'rgba(148,163,184,0.65)',
      glow: 'rgba(0,0,0,0)',
      glowFaint: 'rgba(0,0,0,0)',
      border: 'rgba(255,255,255,0.07)',
      bg: 'rgba(255,255,255,0.02)',
      nebula: 'none',
      icon: '✕', label: 'SKIP',
    },
  }[status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <style>{`
        @keyframes skyFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroEnter {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes statusPulse {
          0%, 100% { text-shadow: 0 0 8px ${SC.glowFaint}; }
          50%       { text-shadow: 0 0 22px ${SC.glow}; }
        }
        @keyframes heroBorderPulse {
          0%, 100% { box-shadow: 0 0 0 0 transparent; }
          50%       { box-shadow: 0 0 28px 2px ${SC.glowFaint}; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sky-hero, .sky-status, .sky-planet { animation: none !important; }
        }
      `}</style>

      {/* ── HERO CARD ── */}
      <div
        className="sky-hero"
        style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: 22,
          background: SC.bg,
          border: `1px solid ${SC.border}`,
          padding: '22px 20px 18px',
          transition: 'background 0.5s, border-color 0.5s, box-shadow 0.5s',
          animation: 'heroEnter 0.4s cubic-bezier(0.22,1,0.36,1) both, heroBorderPulse 4s ease-in-out 1s infinite',
        }}
      >
        {/* Atmospheric nebula bg */}
        <div style={{ position: 'absolute', inset: 0, background: SC.nebula, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Left block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Big status */}
            <div
              className="sky-status"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 34, fontWeight: 800, lineHeight: 1,
                color: SC.color,
                letterSpacing: '-0.01em',
                animation: status !== 'Skip' ? 'statusPulse 3.5s ease-in-out infinite' : 'none',
              }}
            >
              {SC.icon} {SC.label}
            </div>
            {/* Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>
                {selectedLabel}
              </span>
              {visibility && (
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                  {visibility} conditions
                </span>
              )}
              {bestWindow ? (
                <span style={{ color: SC.color, fontSize: 11, fontWeight: 600, opacity: 0.85 }}>
                  Window {bestWindow}
                </span>
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>No clear window</span>
              )}
            </div>
            {/* Location */}
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 3 }}>
              <span>📍</span>{locationLabel}
            </span>
          </div>

          {/* Right: clarity gauge */}
          {avgCloud !== null && <ClarityGauge cloudCover={avgCloud} color={SC.color} />}
        </div>

        {/* Best target strip — only on observable nights */}
        {bestTarget && status !== 'Skip' && (
          <div style={{
            position: 'relative', marginTop: 16, paddingTop: 14,
            borderTop: `1px solid ${SC.border}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: `${SC.color}15`,
              border: `1px solid ${SC.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, color: SC.color,
            }}>
              {PLANET_SYMBOL[bestTarget.key] ?? '✦'}
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, margin: '0 0 2px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                Best target tonight
              </p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>
                {bestTarget.key.charAt(0).toUpperCase() + bestTarget.key.slice(1)}
                <span style={{ color: SC.color, marginLeft: 8, fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
                  {Math.round(bestTarget.altitude)}° alt
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── PLANET RING GRID ── */}
      {(visiblePlanets.length > 0 || planetsLoading) && (
        <div style={{
          display: 'flex', gap: 8,
          overflowX: 'auto', scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 4, paddingTop: 2,
        }}>
          {planetsLoading ? (
            [0, 1, 2, 3].map(i => (
              <div key={i} style={{
                minWidth: 68, height: 88, borderRadius: 14, flexShrink: 0,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
            ))
          ) : (
            visiblePlanets.map((p, i) => (
              <div
                key={p.key}
                className="sky-planet"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 14,
                  padding: '12px 10px 10px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <PlanetCard planet={p} index={i} />
              </div>
            ))
          )}
        </div>
      )}

      {/* ── 7-DAY STRIP ── */}
      {forecast.length > 0 && (
        <div style={{
          display: 'flex', gap: 5,
          overflowX: 'auto', scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}>
          {forecast.slice(0, 7).map((day, i) => {
            const badge = dayBadge(day);
            const { avgCloud: dc } = getDayStats(day);
            const isSelected = i === selectedDay;
            const bs =
              badge === 'Go'
                ? { color: '#34d399',              border: 'rgba(52,211,153,0.3)',  activeBg: 'rgba(52,211,153,0.08)' }
              : badge === 'Maybe'
                ? { color: '#FFD166',              border: 'rgba(255,209,102,0.25)', activeBg: 'rgba(255,209,102,0.07)' }
              : { color: 'rgba(148,163,184,0.5)', border: 'rgba(255,255,255,0.07)', activeBg: 'rgba(255,255,255,0.03)' };

            return (
              <button
                key={day.date}
                onClick={() => selectDay(i, day.date)}
                style={{
                  flex: '0 0 auto', minWidth: 56, cursor: 'pointer',
                  background: isSelected ? bs.activeBg : 'rgba(255,255,255,0.015)',
                  border: `1px solid ${isSelected ? bs.border : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: 13,
                  padding: '10px 6px 9px',
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  outline: 'none',
                  boxShadow: isSelected ? `0 0 14px ${bs.color}22` : 'none',
                  transition: 'all 0.22s ease',
                }}
              >
                <span style={{
                  color: isSelected ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)',
                  fontSize: 10, fontWeight: 600,
                  transition: 'color 0.2s',
                }}>
                  {formatDay(day.date, i)}
                </span>

                {/* Cloud fill bar */}
                {dc !== null && (
                  <div style={{ width: '75%', height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.round(100 - dc)}%`,
                      borderRadius: 1,
                      background: bs.color,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                )}

                <span style={{
                  color: bs.color,
                  fontSize: 10, fontWeight: 700,
                  background: isSelected ? `${bs.color}18` : 'transparent',
                  border: `1px solid ${isSelected ? bs.border : 'transparent'}`,
                  padding: '2px 7px', borderRadius: 999,
                  transition: 'all 0.2s',
                }}>
                  {badge}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
