'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';
import { useAppState } from '@/hooks/useAppState';
import { usePrivy } from '@privy-io/react-auth';
import { useTranslations } from 'next-intl';
import { useLocation } from '@/lib/location';
import { SKY_MISSIONS, computeMissionStates } from '@/lib/mission-catalog';
import MissionSkymap from '@/components/sky/MissionSkymap';
import PrimeMissionHero from '@/components/sky/PrimeMissionHero';
import MissionRosterRow from '@/components/sky/MissionRosterRow';
import QuizStrip from '@/components/sky/QuizStrip';
import PageTransition from '@/components/ui/PageTransition';
import PageContainer from '@/components/layout/PageContainer';
import { MissionIcon } from '@/components/shared/PlanetIcons';
import { TelescopeIcon, StarTokenIcon, DifficultyDots } from '@/components/icons/CelestialIcons';
import { MISSIONS } from '@/lib/constants';
import { QUIZZES, type QuizDef } from '@/lib/quizzes';

const ObservationLog = dynamic(() => import('@/components/sky/ObservationLog'), { ssr: false });
const RewardsSection = dynamic(() => import('@/components/sky/RewardsSection'), { ssr: false });
const QuizActive = dynamic(() => import('@/components/sky/QuizActive'), { ssr: false });

const SKY_TO_OBSERVE_ID: Record<string, string> = {
  jupiter: 'jupiter',
  moon: 'moon',
  saturn: 'saturn',
  pleiades: 'pleiades',
  orion_nebula: 'orion',
  andromeda: 'andromeda',
  double_cluster: 'free-observation',
  mars: 'free-observation',
  ring_nebula: 'free-observation',
  crab_nebula: 'crab',
};

const OBSERVE_TO_SKY_ID: Record<string, string> = {
  jupiter: 'jupiter',
  moon: 'moon',
  saturn: 'saturn',
  pleiades: 'pleiades',
  orion: 'orion_nebula',
  andromeda: 'andromeda',
  crab: 'crab_nebula',
};

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return m;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function MissionsPage() {
  const router = useRouter();
  const { state } = useAppState();
  const { authenticated, login } = usePrivy();
  const t = useTranslations('missions');
  const { location } = useLocation();

  const [activeQuiz, setActiveQuiz] = useState<QuizDef | null>(null);
  const [cloudCoverPct, setCloudCoverPct] = useState(12);
  const [now, setNow] = useState(new Date());
  const [skyConditions, setSkyConditions] = useState<{ cloudCover: number; visibility: string; verified: boolean } | null>(null);
  const [isNight, setIsNight] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const h = new Date().getHours();
    setIsNight(h >= 18 || h < 5);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch(`/api/sky/verify?lat=${location.lat}&lon=${location.lon}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.cloudCover != null) {
          setCloudCoverPct(d.cloudCover);
          setSkyConditions({ cloudCover: d.cloudCover, visibility: d.visibility, verified: d.verified });
          if (d.verified) setIsNight(true);
        }
      })
      .catch(() => {});
  }, [location.lat, location.lon]);

  const completedIds = useMemo(() => {
    const done = state.completedMissions.filter((m) => m.status === 'completed').map((m) => m.id);
    return done.map((id) => OBSERVE_TO_SKY_ID[id] ?? id);
  }, [state.completedMissions]);

  const missionStates = useMemo(
    () => computeMissionStates(SKY_MISSIONS, { completedIds, cloudCoverPct }),
    [completedIds, cloudCoverPct]
  );

  const primeState = missionStates.find((m) => m.isPrime);
  const primeMission = primeState
    ? SKY_MISSIONS.find((m) => m.id === primeState.id)!
    : SKY_MISSIONS[0];

  const doneCount = missionStates.filter((m) => m.isDone).length;
  const readyCount = missionStates.filter((m) => !m.isDone && !m.isCloudy).length;
  const cloudyCount = missionStates.filter((m) => m.isCloudy).length;

  const handleStart = (missionId: string) => {
    if (!authenticated) {
      login();
      return;
    }
    const observeId = SKY_TO_OBSERVE_ID[missionId] ?? missionId;
    router.push(`/observe/${observeId}`);
  };

  const handlePlayQuiz = () => {
    if (!authenticated) {
      login();
      return;
    }
    const q = QUIZZES.find((q) => q.id === 'solar-system') ?? QUIZZES[0];
    if (q) setActiveQuiz(q);
  };

  const cityLabel = location.city || (location.country === 'GE' ? 'Tbilisi' : location.country || 'Earth');
  const condLabel = cloudCoverPct < 30 ? 'CLEAR' : cloudCoverPct < 60 ? 'PARTIAL' : 'CLOUDY';

  if (!authenticated) {
    return (
      <PageContainer variant="wide" className="py-3 sm:py-6 animate-page-enter flex flex-col gap-4">
        <div
          className="rounded-2xl p-5 sm:p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(15,31,61,0.5))',
            border: '1px solid rgba(99,102,241,0.1)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
            >
              <TelescopeIcon size={28} animate />
              <span
                className="absolute -top-1 -right-1 text-[10px] leading-none"
                style={{ color: '#FFD166', textShadow: '0 0 6px rgba(255,209,102,0.6)' }}
              >
                ✦
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                {t('title')}
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">{t('subtitle')}</p>
            </div>
            <button
              onClick={login}
              className="flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #FFD166, #CC9A33)', color: '#0a0a0a' }}
            >
              {t('signIn')}
            </button>
          </div>
        </div>

        <div>
          <p className="text-slate-600 text-[11px] uppercase tracking-widest mb-3">
            {t('availableMissions')}
          </p>
          <div className="flex flex-col gap-2.5">
            {MISSIONS.map((mission) => (
              <div
                key={mission.id}
                className="relative flex items-center gap-4 rounded-2xl px-4 py-3.5 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="absolute inset-0 bg-[#070B14]/40 backdrop-blur-[1px] z-10 flex items-center justify-end pr-4">
                  <Lock size={13} className="text-slate-600" />
                </div>
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <MissionIcon id={mission.id} size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-400 text-sm font-semibold">{mission.name}</p>
                  <p className="text-slate-600 text-xs mt-0.5 line-clamp-1">{mission.desc}</p>
                  <div className="mt-1.5">
                    <DifficultyDots
                      level={
                        mission.difficulty === 'Beginner'
                          ? 1
                          : mission.difficulty === 'Intermediate'
                          ? 2
                          : mission.difficulty === 'Expert'
                          ? 4
                          : 3
                      }
                    />
                  </div>
                </div>
                <span
                  className="text-[#FFD166]/40 text-xs font-bold flex-shrink-0 flex items-center gap-0.5"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  +{mission.stars}
                  <StarTokenIcon size={11} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-slate-600 text-[11px] uppercase tracking-widest mb-3">{t('tonightsSky')}</p>
          {skyConditions ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${skyConditions.verified ? 'bg-[#34d399] animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-white text-sm font-medium">
                  {skyConditions.verified ? t('goodConditions') : t('cloudyTonight')}
                </span>
              </div>
              <div className="flex gap-3 text-xs text-slate-500 flex-shrink-0">
                <span>{skyConditions.cloudCover}% cloud</span>
                <span>{skyConditions.visibility}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isNight ? 'bg-[#34d399] animate-pulse' : 'bg-slate-700'}`} />
              {isNight ? (
                <span className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              ) : (
                <span className="text-slate-500 text-sm">Come back after sunset to observe</span>
              )}
            </div>
          )}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageTransition>
      <>
        {activeQuiz && <QuizActive quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />}

        <PageContainer variant="wide" className="py-2 flex flex-col gap-3" style={{ fontFamily: 'var(--font-display)' }}>
          <BackButton />

          <div className="missions-v3">
            {/* header */}
            <div className="header-row">
              <h1 className="h1">Missions tonight</h1>
              <div className="kicker">
                LIVE · {formatTime(now)} · <span className="brass">{condLabel}</span> · {cityLabel.toUpperCase()}
              </div>
            </div>

            {/* prime hero */}
            <PrimeMissionHero
              mission={primeMission}
              bestViewingTime="22:14"
              elevation="64° SE"
              onStart={() => handleStart(primeMission.id)}
              variant={isMobile ? 'mobile' : 'desktop'}
            />

            {/* two-column section */}
            <div className="desktop-grid">
              <div className="col">
                <div className="col-section-head">
                  <div className="col-title">Live sky</div>
                  <div className="kicker">Bortle 6 · Moon 62%</div>
                </div>
                <MissionSkymap
                  missions={missionStates}
                  skyMissions={SKY_MISSIONS}
                  location={{ lat: location.lat, lon: location.lon, label: cityLabel }}
                  currentTime={now}
                  cloudCoverPct={cloudCoverPct}
                  onMissionClick={handleStart}
                  variant={isMobile ? 'mobile' : 'desktop'}
                />
              </div>
              <div className="col">
                <div className="col-section-head">
                  <div className="col-title">All 10 missions</div>
                  <div className="kicker">
                    <span className="green">{doneCount} DONE</span> ·{' '}
                    <span className="brass">{readyCount} READY</span> · {cloudyCount} CLOUDED
                  </div>
                </div>
                <div className="roster">
                  {missionStates.map((mstate) => {
                    const mission = SKY_MISSIONS.find((m) => m.id === mstate.id)!;
                    return (
                      <MissionRosterRow
                        key={mstate.id}
                        mission={mission}
                        state={mstate}
                        onClick={() => handleStart(mstate.id)}
                        compact={isMobile}
                      />
                    );
                  })}
                </div>
                <QuizStrip
                  question="How many Galilean moons does Jupiter have?"
                  rewardStars={10}
                  onPlay={handlePlayQuiz}
                  compact={isMobile}
                />
              </div>
            </div>
          </div>

          <RewardsSection />
          <ObservationLog />
        </PageContainer>

        <style jsx>{`
          .missions-v3 {
            display: flex;
            flex-direction: column;
            gap: 22px;
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            flex-wrap: wrap;
          }
          .h1 {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-weight: 500;
            font-size: 36px;
            line-height: 1;
            color: #F5F1E8;
            margin: 0;
          }
          .kicker {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            color: #7A7868;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          }
          .kicker .brass { color: #FFD166; }
          .kicker .green { color: #34D399; }

          .desktop-grid {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            gap: 22px;
          }
          .col { min-width: 0; }
          .col-section-head {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 12px;
            gap: 12px;
          }
          .col-title {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-weight: 500;
            font-size: 20px;
            color: #F5F1E8;
          }
          .roster {
            display: flex;
            flex-direction: column;
          }

          @media (max-width: 1023px) {
            .desktop-grid { grid-template-columns: 1fr; gap: 18px; }
            .h1 { font-size: 32px; }
          }
        `}</style>
      </>
    </PageTransition>
  );
}
