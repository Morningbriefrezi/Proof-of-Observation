'use client';

import { useState } from 'react';
import { Satellite } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { usePrivy } from '@privy-io/react-auth';
import { useLocale } from 'next-intl';
import StatsBar from '@/components/sky/StatsBar';
import MissionList from '@/components/sky/MissionList';
import MissionActive from '@/components/sky/MissionActive';
import ObservationLog from '@/components/sky/ObservationLog';
import RewardsSection from '@/components/sky/RewardsSection';
import QuizActive from '@/components/sky/QuizActive';
import { QUIZZES } from '@/lib/quizzes';
import type { Mission } from '@/lib/types';
import type { QuizDef } from '@/lib/quizzes';

export default function MissionsPage() {
  const { state } = useAppState();
  const { authenticated, login } = usePrivy();
  const locale = useLocale() === 'ka' ? 'ka' : 'en';
  const [activeQuiz, setActiveQuiz] = useState<QuizDef | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-page-enter">
        <div className="max-w-sm w-full text-center">
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(56,240,255,0.05), rgba(15,31,61,0.5))',
              border: '1px solid rgba(56,240,255,0.1)',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(56,240,255,0.08)', border: '1px solid rgba(56,240,255,0.15)' }}
            >
              <Satellite size={26} className="text-[#38F0FF]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Sky Missions
            </h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Observe the Moon, Jupiter, Saturn, Orion Nebula and more. Earn real rewards.
            </p>
            <button
              onClick={login}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #FFD166, #CC9A33)', color: '#070B14' }}
            >
              Sign In to Start →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {activeMission && <MissionActive mission={activeMission} onClose={() => setActiveMission(null)} />}
      {activeQuiz && <QuizActive quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />}

      <div className="max-w-2xl mx-auto px-4 py-3 sm:py-6 animate-page-enter flex flex-col gap-3">

        <section>
          <div className="flex items-center gap-2 mb-3">
            <Satellite size={16} strokeWidth={1.5} className="text-[#38F0FF]" />
            <h1 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
              Missions
            </h1>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            <span className="text-[11px] text-slate-600">
              {new Date().getHours() >= 18 || new Date().getHours() < 5
                ? '🟢 Sky conditions: Good for observing tonight'
                : '☀️ Daytime — come back after sunset'}
            </span>
          </div>

          <StatsBar />
        </section>

        <MissionList onStart={setActiveMission} />

        {/* Quiz Missions */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Knowledge Quizzes</h2>
          <div className="flex flex-col gap-2.5">
            {QUIZZES.map(quiz => {
              const bestResult = [...(state.completedQuizzes ?? [])]
                .filter(r => r.quizId === quiz.id)
                .sort((a, b) => b.score - a.score)[0];
              const pct = bestResult ? Math.round((bestResult.score / bestResult.total) * 100) : null;

              return (
                <div
                  key={quiz.id}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{quiz.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-snug">{quiz.title[locale]}</p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-snug line-clamp-1">{quiz.description[locale]}</p>
                    {bestResult && (
                      <p className="text-[#FFD166] text-[11px] font-bold mt-1">
                        Best: {bestResult.score}/{bestResult.total} · +{bestResult.stars} ✦
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    {pct !== null && (
                      <span className="text-[10px] text-slate-500">{pct}%</span>
                    )}
                    <button
                      onClick={() => setActiveQuiz(quiz)}
                      className="px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95 hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #FFD166, #CC9A33)', color: '#070B14' }}
                    >
                      {bestResult ? 'Retry' : 'Start'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <RewardsSection />
        <ObservationLog />
      </div>
    </>
  );
}
