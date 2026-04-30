// src/components/sky/SkyHero.tsx
'use client';

import type { ObservationScore } from '@/lib/use-sky-data';

interface SkyHeroProps {
  score: ObservationScore | null;
  location: { city: string; lat: number; lon: number; bortle: number } | null;
  loading?: boolean;
}

export function SkyHero({ score, location, loading }: SkyHeroProps) {
  if (loading || !score || !location) {
    return (
      <section className="hero" style={{ minHeight: 92 }}>
        <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>Loading sky conditions…</div>
      </section>
    );
  }

  const today = new Date();
  const dateLabel = today.toLocaleDateString([], {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  });

  // Score ring math: circumference = 2π × r (r=36) ≈ 226
  const circumference = 226;
  const dashOffset = circumference * (1 - score.score / 100);

  const pulseColor =
    score.score >= 75 ? 'var(--green)' : score.score >= 50 ? 'var(--amber)' : 'var(--rose)';

  return (
    <section className="hero">
      <div className="score-ring">
        <svg viewBox="0 0 80 80">
          <circle className="track" cx="40" cy="40" r="36" />
          <circle
            className="fill"
            cx="40"
            cy="40"
            r="36"
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        <div className="score-num">
          <span className="n">{score.score}</span>
          <span className="d">/100</span>
        </div>
      </div>

      <div className="hero-body">
        <h1>
          <span className="pulse" style={{ background: pulseColor }} />
          {score.headline}
        </h1>
        <p>{score.summary}</p>
      </div>

      <div className="hero-meta">
        <div className="loc">
          <span className="city">{location.city}</span>
          {location.lat.toFixed(2)}°N · {location.lon.toFixed(2)}°E · Bortle {location.bortle}
        </div>
        <div className="date">{dateLabel}</div>
      </div>
    </section>
  );
}
