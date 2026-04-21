'use client';

import { useState, useEffect, useMemo, useCallback, type ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/hooks/useAppState';
import { usePrivy } from '@privy-io/react-auth';
import { useLocale, useTranslations } from 'next-intl';
import { useLocation } from '@/lib/location';
import { getVisiblePlanets } from '@/lib/planets';
import { getChartDeepSky } from '@/lib/sky-chart';
import { getRank } from '@/lib/rewards';
import { MISSIONS } from '@/lib/constants';
import { QUIZZES } from '@/lib/quizzes';
import { PlanetViz } from '@/components/sky/PlanetViz';
import QuizActive from '@/components/sky/QuizActive';
import type { Mission } from '@/lib/types';
import type { QuizDef } from '@/lib/quizzes';
import SolarSystemIcon from '@/components/sky/quiz-icons/SolarSystemIcon';
import ConstellationsIcon from '@/components/sky/quiz-icons/ConstellationsIcon';
import TelescopeIconArt from '@/components/sky/quiz-icons/TelescopeIcon';
import CosmologyIcon from '@/components/sky/quiz-icons/CosmologyIcon';
import ExplorationIcon from '@/components/sky/quiz-icons/ExplorationIcon';

type Theme = 'light' | 'dark';
const THEME_KEY = 'stellar-missions-theme';

// Missions that appear in the grid (tied to sky-map-locatable targets).
const GRID_MISSION_IDS = ['moon', 'jupiter', 'saturn', 'pleiades', 'orion', 'andromeda'];

// All targets we render on the sky map (planets + deep sky).
const SKY_PLANET_KEYS = ['moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
const SKY_DEEP_KEYS = ['pleiades', 'orion', 'andromeda', 'crab'];

const TAGLINES: Record<string, string> = {
  moon:      'Terminator cuts sharp craters',
  jupiter:   'Four Galilean moons visible',
  saturn:    'Rings at their widest tilt',
  pleiades:  'Seven sisters, one glance',
  orion:     'Stellar nursery, 1,344 ly out',
  andromeda: 'Trillion suns, 2.5M ly away',
  crab:      'Ghost of a 1054 AD supernova',
  venus:     'Brightest object in the sky',
  mars:      'Rust-red and unmistakable',
  mercury:   'Low and fleeting — catch it fast',
};

const EQUIPMENT_LABEL: Record<string, string> = {
  moon:      'Naked eye',
  jupiter:   'Naked eye',
  saturn:    'Telescope',
  pleiades:  'Naked eye',
  orion:     'Telescope',
  andromeda: 'Binoculars',
  crab:      'Telescope',
};

type Difficulty = 'easy' | 'med' | 'hard';

function diffClass(d: Mission['difficulty']): Difficulty {
  if (d === 'Beginner') return 'easy';
  if (d === 'Intermediate') return 'med';
  return 'hard';
}

function diffLabel(d: Mission['difficulty']): string {
  if (d === 'Beginner') return 'Easy';
  if (d === 'Intermediate') return 'Medium';
  return 'Hard';
}

function missionTheme(id: string): string {
  if (GRID_MISSION_IDS.includes(id)) return id;
  return 'moon';
}

function getPlanetSize(key: string): 'small' | 'medium' {
  if (key === 'jupiter' || key === 'saturn' || key === 'moon') return 'medium';
  return 'small';
}

function getCardPlanetSize(key: string): 'small' | 'medium' {
  if (key === 'jupiter' || key === 'saturn') return 'medium';
  return 'medium';
}

function planetMapPosition(altitude: number, azimuth: number): { x: number; y: number } {
  // Azimuth: 0=N, 90=E, 180=S, 270=W. Map x: 0%=W edge, 50%=center/S, 100%=E edge.
  // Invert so north is center-top, south is center-bottom via altitude mapping.
  const x = ((azimuth + 180) % 360) / 360 * 100;
  const y = Math.max(0, 100 - (altitude / 90) * 78) + 6;
  return {
    x: Math.max(6, Math.min(94, x)),
    y: Math.max(8, Math.min(86, y)),
  };
}

interface QuizSpec {
  Icon: ComponentType<{ size?: number }>;
  reward: number;
  descEn: string;
  descKa: string;
}

const QUIZ_SPECS: Record<string, QuizSpec> = {
  'solar-system':      { Icon: SolarSystemIcon,    reward: 100, descEn: '10 questions · planets, moons, orbits',      descKa: '10 კითხვა · პლანეტები, მთვარეები, ორბიტები' },
  'constellations':    { Icon: ConstellationsIcon, reward: 100, descEn: '10 questions · stars, myths, sky patterns',    descKa: '10 კითხვა · ვარსკვლავები, მითები, ცის ფიგურები' },
  'telescopes':        { Icon: TelescopeIconArt,   reward: 100, descEn: '10 questions · optics, mounts, magnification', descKa: '10 კითხვა · ოპტიკა, სადგარები, გადიდება' },
  'universe':          { Icon: CosmologyIcon,      reward: 100, descEn: '10 questions · galaxies, cosmology, time',     descKa: '10 კითხვა · გალაქტიკები, კოსმოლოგია, დრო' },
  'space-exploration': { Icon: ExplorationIcon,    reward: 100, descEn: '10 questions · missions, probes, astronauts',  descKa: '10 კითხვა · მისიები, ზონდები, ასტრონავტები' },
};

export default function MissionsPage() {
  const router = useRouter();
  const { state } = useAppState();
  const { authenticated, login } = usePrivy();
  const locale = useLocale() === 'ka' ? 'ka' : 'en';
  const t = useTranslations('missions');
  const { location } = useLocation();

  const [theme, setTheme] = useState<Theme>('light');
  const [now, setNow] = useState<Date>(() => new Date());
  const [activeQuiz, setActiveQuiz] = useState<QuizDef | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark') setTheme('dark');
    } catch {}
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(THEME_KEY, next); } catch {}
      return next;
    });
  }, []);

  const lat = location.lat ?? 41.7151;
  const lon = location.lon ?? 44.8271;
  const cityLabel = location.city || 'Tbilisi';

  // Compute altitudes/azimuths for all sky targets.
  const skyPositions = useMemo(() => {
    const out: Record<string, { altitude: number; azimuth: number }> = {};
    const planets = getVisiblePlanets(lat, lon, now);
    for (const p of planets) {
      out[p.key] = { altitude: p.altitude, azimuth: p.azimuth };
    }
    const ds = getChartDeepSky(lat, lon, now, 200, 100, 180);
    for (const d of ds) {
      out[d.id] = { altitude: d.altitude, azimuth: d.azimuth };
    }
    return out;
  }, [lat, lon, now]);

  const gridMissions = useMemo(
    () => GRID_MISSION_IDS
      .map((id) => MISSIONS.find((m) => m.id === id))
      .filter((m): m is Mission => !!m),
    [],
  );

  const completedIds = useMemo(
    () => new Set(state.completedMissions.filter((m) => m.status === 'completed').map((m) => m.id)),
    [state.completedMissions],
  );

  const visibleCount = useMemo(
    () => gridMissions.filter((m) => (skyPositions[m.id]?.altitude ?? -90) > 0).length,
    [gridMissions, skyPositions],
  );

  const completedCount = useMemo(
    () => gridMissions.filter((m) => completedIds.has(m.id)).length,
    [gridMissions, completedIds],
  );

  const primeMission = useMemo(() => {
    const visible = gridMissions
      .filter((m) => !completedIds.has(m.id) || m.repeatable)
      .filter((m) => (skyPositions[m.id]?.altitude ?? -90) > 10);
    if (visible.length === 0) return null;
    visible.sort((a, b) => (skyPositions[b.id]?.altitude ?? -90) - (skyPositions[a.id]?.altitude ?? -90));
    return visible[0];
  }, [gridMissions, completedIds, skyPositions]);

  const sortedGrid = useMemo(() => {
    const withPos = gridMissions.map((m) => ({
      mission: m,
      altitude: skyPositions[m.id]?.altitude ?? -90,
    }));
    withPos.sort((a, b) => b.altitude - a.altitude);
    return withPos;
  }, [gridMissions, skyPositions]);

  const totalStars = useMemo(() => {
    const missionStars = state.completedMissions
      .filter((m) => m.status === 'completed')
      .reduce((sum, m) => {
        const mission = MISSIONS.find((x) => x.id === m.id);
        return sum + (mission?.stars ?? 0);
      }, 0);
    const quizStars = (state.completedQuizzes ?? []).reduce((sum, r) => sum + (r.stars ?? 0), 0);
    return missionStars + quizStars;
  }, [state.completedMissions, state.completedQuizzes]);

  const rank = useMemo(
    () => getRank(state.completedMissions.filter((m) => m.status === 'completed').length),
    [state.completedMissions],
  );

  const liveTime = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const dateLabel = now.toLocaleDateString([], { month: 'short', day: 'numeric' });

  const startMission = useCallback((m: Mission) => {
    router.push(`/observe/${m.id}`);
  }, [router]);

  const scrollToMission = useCallback((id: string) => {
    const node = document.getElementById(`mis-card-${id}`);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // ---- Map planets (visible only) ----
  const mapPlanets = useMemo(() => {
    const items: { id: string; key: string; x: number; y: number; missionId?: string }[] = [];
    for (const key of SKY_PLANET_KEYS) {
      const pos = skyPositions[key];
      if (!pos || pos.altitude <= -5) continue;
      const map = planetMapPosition(pos.altitude, pos.azimuth);
      const mission = MISSIONS.find((m) => m.id === key);
      items.push({
        id: key,
        key,
        x: map.x,
        y: map.y,
        missionId: mission?.id,
      });
    }
    for (const id of SKY_DEEP_KEYS) {
      const pos = skyPositions[id];
      if (!pos || pos.altitude <= -5) continue;
      const map = planetMapPosition(pos.altitude, pos.azimuth);
      const mission = MISSIONS.find((m) => m.id === id);
      items.push({
        id,
        key: id,
        x: map.x,
        y: map.y,
        missionId: mission?.id,
      });
    }
    return items;
  }, [skyPositions]);

  // ---- Auth gate variant ----
  if (!authenticated) {
    return (
      <div className={`missions-page ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="mis-stats-bar">
          <div className="mis-stats-left">
            <h1 className="mis-stats-title">{t('title')}</h1>
            <span className="mis-stats-meta">Sign in to start observing</span>
          </div>
          <div className="mis-stats-right">
            <button
              type="button"
              className="mis-theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            />
          </div>
        </div>

        <SkyMap
          mapPlanets={mapPlanets}
          liveTime={liveTime}
          dateLabel={dateLabel}
          cityLabel={cityLabel}
          onPlanetClick={() => undefined}
        />

        <div className="mis-content">
          <section className="mis-section">
            <div className="mis-auth-card">
              <h2 className="mis-auth-title">Sign in to start observing</h2>
              <p className="mis-auth-body">
                Complete sky missions to earn Stars and mint discovery NFTs on Solana.
              </p>
              <button type="button" className="mis-auth-btn" onClick={login}>
                Sign in with email
              </button>
              <p className="mis-auth-sub">Free · No wallet needed</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={`missions-page ${theme === 'dark' ? 'dark' : ''}`}>
      {activeQuiz && <QuizActive quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />}

      {/* Stats bar */}
      <div className="mis-stats-bar">
        <div className="mis-stats-left">
          <h1 className="mis-stats-title">Missions</h1>
          <span className="mis-stats-meta">
            {completedCount}/{gridMissions.length} completed · {visibleCount} visible tonight
          </span>
        </div>
        <div className="mis-stats-right">
          <span className="mis-rank-pill">{rank.name}</span>
          <span className="mis-stars-count">✦ {totalStars}</span>
          <button
            type="button"
            className="mis-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          />
        </div>
      </div>

      {/* Sky map — full-width, always dark */}
      <SkyMap
        mapPlanets={mapPlanets}
        liveTime={liveTime}
        dateLabel={dateLabel}
        cityLabel={cityLabel}
        onPlanetClick={(missionId) => missionId && scrollToMission(missionId)}
      />

      {/* Centered content */}
      <div className="mis-content">
        {/* Prime target */}
        {primeMission && (
          <section className="mis-section">
            <PrimeCard
              mission={primeMission}
              altitude={skyPositions[primeMission.id]?.altitude ?? null}
              onStart={() => startMission(primeMission)}
            />
          </section>
        )}

        {/* Mission grid */}
        <section className="mis-section">
          <div className="mis-section-head">
            <h2 className="mis-section-title">Missions tonight</h2>
            <span className="mis-section-meta">{visibleCount} visible</span>
          </div>
          <div className="mis-grid">
            {sortedGrid.map(({ mission, altitude }) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                above={altitude > 0}
                onClick={() => startMission(mission)}
              />
            ))}
          </div>
        </section>

        {/* Quizzes */}
        <section className="mis-section">
          <div className="mis-section-head">
            <h2 className="mis-section-title">Knowledge quizzes</h2>
            <span className="mis-section-meta">Earn stars while you wait for clear skies</span>
          </div>
          <div className="mis-quiz-list">
            {QUIZZES.map((quiz) => {
              const spec = QUIZ_SPECS[quiz.id];
              if (!spec) return null;
              const title = quiz.title[locale] ?? quiz.title.en;
              const desc = locale === 'ka' ? spec.descKa : spec.descEn;
              return (
                <button
                  type="button"
                  key={quiz.id}
                  className="mis-quiz-row"
                  onClick={() => setActiveQuiz(quiz)}
                >
                  <span className="mis-quiz-icon">
                    <spec.Icon size={16} />
                  </span>
                  <div className="mis-quiz-body">
                    <div className="mis-quiz-name">{title}</div>
                    <div className="mis-quiz-desc">{desc}</div>
                  </div>
                  <span className="mis-quiz-reward">+{spec.reward}</span>
                  <span className="mis-quiz-play" aria-hidden>
                    <PlayIcon />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

// ---- Sky map component ----

interface MapPlanet {
  id: string;
  key: string;
  x: number;
  y: number;
  missionId?: string;
}

function SkyMap({
  mapPlanets,
  liveTime,
  dateLabel,
  cityLabel,
  onPlanetClick,
}: {
  mapPlanets: MapPlanet[];
  liveTime: string;
  dateLabel: string;
  cityLabel: string;
  onPlanetClick: (missionId: string | undefined) => void;
}) {
  return (
    <div className="mis-skymap" role="region" aria-label="Night sky map">
      <div className="mis-skymap-milkyway" aria-hidden />
      <div className="mis-skymap-horizon" aria-hidden />

      <span className="mis-skymap-compass n">N</span>
      <span className="mis-skymap-compass s">S</span>
      <span className="mis-skymap-compass e">E</span>
      <span className="mis-skymap-compass w">W</span>

      <div className="mis-skymap-live">
        <span className="mis-skymap-live-dot" />
        <span>LIVE · {liveTime}</span>
      </div>
      <div className="mis-skymap-date">{dateLabel} · {cityLabel}</div>

      {mapPlanets.map((p) => (
        <button
          key={p.id}
          type="button"
          className="mis-skymap-planet"
          style={{ left: `${p.x}%`, top: `${p.y}%`, background: 'transparent', border: 0, padding: 0 }}
          onClick={() => onPlanetClick(p.missionId)}
          aria-label={p.key}
        >
          <PlanetViz name={p.key} size={getPlanetSize(p.key)} />
          <span className="mis-skymap-label">{p.key}</span>
        </button>
      ))}
    </div>
  );
}

// ---- Prime target card ----

function PrimeCard({
  mission,
  altitude,
  onStart,
}: {
  mission: Mission;
  altitude: number | null;
  onStart: () => void;
}) {
  const tag = TAGLINES[mission.id] ?? mission.desc;
  const altTxt = altitude != null ? ` · Alt ${Math.round(altitude)}°` : '';
  return (
    <div className="mis-prime">
      <div className="mis-prime-icon">
        <PlanetViz name={mission.id} size="medium" />
      </div>
      <div className="mis-prime-body">
        <div className="mis-prime-badge">Prime target tonight</div>
        <div className="mis-prime-name">{mission.name}</div>
        <div className="mis-prime-desc">{tag}{altTxt}</div>
      </div>
      <button type="button" className="mis-prime-cta" onClick={onStart}>
        Observe <span style={{ fontVariantNumeric: 'tabular-nums' }}>+{mission.stars}</span>
      </button>
    </div>
  );
}

// ---- Mission card ----

function MissionCard({
  mission,
  above,
  onClick,
}: {
  mission: Mission;
  above: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      id={`mis-card-${mission.id}`}
      className={`mis-card ${above ? '' : 'dim'}`}
      onClick={onClick}
      disabled={!above}
    >
      <div className={`mis-card-sky theme-${missionTheme(mission.id)}`}>
        <PlanetViz name={mission.id} size={getCardPlanetSize(mission.id)} />
      </div>
      <div className="mis-card-info">
        <div className="mis-card-row">
          <span className="mis-card-name">{mission.name}</span>
          <span className="mis-card-stars">+{mission.stars}</span>
        </div>
        <div className="mis-card-meta">
          <span className={`mis-diff ${diffClass(mission.difficulty)}`}>
            {diffLabel(mission.difficulty)}
          </span>
          <span className="mis-card-equip">
            {above ? (EQUIPMENT_LABEL[mission.id] ?? (mission.type === 'telescope' ? 'Telescope' : 'Naked eye')) : 'Below horizon'}
          </span>
        </div>
      </div>
    </button>
  );
}

function PlayIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 2L8 5L3 8V2Z" fill="currentColor" />
    </svg>
  );
}
