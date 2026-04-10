'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { usePrivy } from '@privy-io/react-auth';
import { Illumination, Body } from 'astronomy-engine';
import { useLocation } from '@/hooks/useLocation';
import { getTonightTargets, DailyTarget } from '@/lib/daily-targets';
import { SkyDay } from '@/lib/sky-data';
import type { PlanetInfo } from '@/lib/planets';
import AstroLogo from '@/components/shared/AstroLogo';

type ObsState = 'go' | 'maybe' | 'skip';

const PLANET_EMOJIS: Record<string, string> = {
  moon: '🌕', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄',
};

const badgeStyles: Record<ObsState, string> = {
  go:    'bg-[#34d399]/20 text-[#34d399] border-[#34d399]/40',
  maybe: 'bg-[#FFD166]/20 text-[#FFD166] border-[#FFD166]/40',
  skip:  'bg-red-500/20 text-red-400 border-red-500/40',
};
const badgeLabel: Record<ObsState, string> = { go: '● GO', maybe: '◐ MAYBE', skip: '✕ SKIP' };
const statusWord: Record<ObsState, string> = { go: 'EXCELLENT', maybe: 'GOOD', skip: 'POOR' };
const statusColor: Record<ObsState, string> = { go: '#34d399', maybe: '#FFD166', skip: '#64748b' };

const cardGradient: Record<ObsState, React.CSSProperties> = {
  go:    { background: 'linear-gradient(135deg, #0B1E2E, #0F2A1A)', boxShadow: '0 0 60px rgba(52,211,153,0.06)' },
  maybe: { background: 'linear-gradient(135deg, #0B0E17, #1E1A0A)', boxShadow: '0 0 60px rgba(255,209,102,0.06)' },
  skip:  { background: 'linear-gradient(135deg, #0B0E17, #141418)' },
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy:   'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30',
  medium: 'bg-amber-400/10 text-amber-400 border border-amber-400/30',
  hard:   'bg-red-400/10 text-red-400 border border-red-400/30',
};

function eveningStats(hours: SkyDay['hours']): { state: ObsState; clearWindow: string } {
  const evening = hours.filter(h => {
    const hr = parseInt(h.time.slice(11, 13));
    return hr >= 19 && hr <= 23;
  });
  const pool = evening.length > 0 ? evening : hours;
  const best = pool.reduce((a, b) => a.cloudCover <= b.cloudCover ? a : b);
  const clear = pool.filter(h => h.cloudCover < 30);
  const clearWindow = clear.length > 0
    ? `${clear[0].time.slice(11, 16)}–${clear[clear.length - 1].time.slice(11, 16)}`
    : '';
  const state = best.cloudCover < 30 ? 'go' : best.cloudCover <= 60 ? 'maybe' : 'skip';
  return { state, clearWindow };
}

function moonPhaseEmoji(fraction: number): string {
  if (fraction < 0.06) return '🌑';
  if (fraction < 0.31) return '🌒';
  if (fraction < 0.44) return '🌓';
  if (fraction < 0.56) return '🌕';
  if (fraction < 0.69) return '🌖';
  if (fraction < 0.94) return '🌗';
  return '🌑';
}

export default function HomePage() {
  const t = useTranslations('home');
  const { user } = usePrivy();
  const router = useRouter();
  const { lat, lng, ready } = useLocation();

  const [obsState, setObsState] = useState<ObsState | null>(null);
  const [clearWindow, setClearWindow] = useState('');
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<DailyTarget | null>(null);
  const [planets, setPlanets] = useState<PlanetInfo[]>([]);
  const [moonIllum, setMoonIllum] = useState<number | null>(null);

  const load = useCallback(async (lat: number, lng: number) => {
    try {
      const [forecastRes, planetsRes, targets] = await Promise.all([
        fetch(`/api/sky/forecast?lat=${lat}&lng=${lng}`),
        fetch(`/api/sky/planets?lat=${lat}&lng=${lng}`),
        getTonightTargets(lat, lng),
      ]);
      const days = await forecastRes.json() as SkyDay[];
      const pl = await planetsRes.json() as PlanetInfo[];

      if (days.length) {
        const { state, clearWindow: cw } = eveningStats(days[0].hours);
        setObsState(state);
        setClearWindow(cw);
      }

      setPlanets(pl.filter(p => p.key !== 'moon' && p.altitude > 10));
      setTarget(targets[0] ?? null);

      try {
        const illum = Illumination(Body.Moon, new Date());
        setMoonIllum(illum.phase_fraction);
      } catch { /* omit if unavailable */ }
    } catch { /* show defaults */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (ready) load(lat, lng);
  }, [ready, lat, lng, load]);

  const state = obsState ?? 'maybe';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6 animate-page-enter">

      {/* Logo */}
      <div className="flex justify-center pt-2">
        <AstroLogo heightClass="h-8" />
      </div>

      {/* Section 1: Sky Status Card */}
      <div
        className="rounded-2xl p-5 border"
        style={loading ? { borderColor: 'rgba(255,255,255,0.08)' } : {
          ...cardGradient[state],
          borderColor: state === 'go'
            ? 'rgba(52,211,153,0.3)'
            : state === 'maybe'
            ? 'rgba(255,209,102,0.3)'
            : 'rgba(255,255,255,0.08)',
        }}
      >
        {loading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-3 bg-white/10 rounded w-1/4" />
            <div className="h-12 bg-white/10 rounded w-2/3" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-slate-500 text-xs tracking-wide mb-1">Tonight</p>
                <p className="text-5xl font-bold leading-none" style={{ color: statusColor[state] }}>
                  {statusWord[state]}
                </p>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border shrink-0 mt-1 ${badgeStyles[state]}`}>
                {badgeLabel[state]}
              </span>
            </div>

            <div className="mt-3">
              {state !== 'skip' && clearWindow ? (
                <p className="text-slate-300 text-sm">{t('bestViewing')} {clearWindow}</p>
              ) : state === 'skip' ? (
                <p className="text-slate-600 text-sm">{t('noWindow')}</p>
              ) : null}
            </div>

            {moonIllum !== null && (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                <span>{moonPhaseEmoji(moonIllum)}</span>
                <span>{Math.round(moonIllum * 100)}% illuminated</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Section 2: Featured Target */}
      <div>
        {loading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-3 bg-white/10 rounded w-1/4" />
            <div className="h-8 bg-white/10 rounded w-1/2" />
            <div className="h-3 bg-white/10 rounded w-3/4" />
            <div className="h-14 bg-white/10 rounded" />
          </div>
        ) : target ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-500 tracking-widest uppercase">{t('featuredTarget')}</p>
            <p className="text-2xl font-bold text-white">{target.emoji} {target.name}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[target.difficulty]}`}>
                {target.difficulty}
              </span>
              {target.altitude !== undefined && (
                <span className="text-xs text-slate-400">{target.altitude.toFixed(0)}° altitude</span>
              )}
            </div>
            <p className="text-sm text-slate-400">{target.description}</p>
            <button
              onClick={() => router.push('/observe')}
              className="w-full py-4 rounded-xl font-bold text-black text-base active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(to right, #FFD166, #CC9A33)' }}
            >
              Observe This →
            </button>
          </div>
        ) : (
          <Link href="/sky" className="block text-center text-slate-500 text-sm py-4">
            {t('noTargets')}
          </Link>
        )}
      </div>

      {/* Section 3: Also Visible Tonight */}
      {!loading && planets.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {planets.map(p => (
            <Link
              key={p.key}
              href="/sky"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 whitespace-nowrap hover:border-[#FFD166]/30 transition-all shrink-0"
            >
              <span>{PLANET_EMOJIS[p.key] ?? '✦'}</span>
              <span>{p.key.charAt(0).toUpperCase() + p.key.slice(1)}</span>
              <span className="text-slate-500">{p.altitude.toFixed(0)}°</span>
            </Link>
          ))}
        </div>
      )}

      {/* Section 4: Join Strip (logged-out only) */}
      {!user && (
        <div className="flex flex-col items-center gap-3 pb-4">
          <p className="text-xs text-slate-600 tracking-widest uppercase">{t('joinStrip')}</p>
          <Link
            href="/club"
            className="w-full text-center py-4 rounded-xl font-bold text-black text-base active:scale-[0.98] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #FFD166, #CC9A33)',
              boxShadow: '0 0 32px rgba(255,209,102,0.3), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            {t('joinCta')}
          </Link>
        </div>
      )}

    </div>
  );
}
