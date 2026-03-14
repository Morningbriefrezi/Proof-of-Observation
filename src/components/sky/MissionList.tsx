'use client';

import { useState } from 'react';
import { MISSIONS } from '@/lib/constants';
import { useAppState } from '@/hooks/useAppState';
import type { Mission } from '@/lib/types';
import { CheckCircle2, Clock, Telescope, Eye, ChevronRight } from 'lucide-react';
import { MissionIcon } from '@/components/shared/PlanetIcons';
import MissionActive from './MissionActive';

const PLANET_COLORS: Record<string, string> = {
  moon:     '#D4D4E8',
  jupiter:  '#E8934A',
  orion:    '#7A5FFF',
  saturn:   '#FFD166',
  pleiades: '#38F0FF',
};

const VISIBILITY: Record<string, { label: string; color: string }> = {
  Beginner:     { label: 'Excellent', color: '#34d399' },
  Intermediate: { label: 'Good',      color: '#FFD166' },
  Advanced:     { label: 'Poor',      color: '#f87171' },
};

function DifficultyDots({ level, color }: { level: string; color: string }) {
  const filled = level === 'Beginner' ? 1 : level === 'Intermediate' ? 2 : 3;
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-colors"
          style={{ backgroundColor: i <= filled ? color : 'rgba(148,163,184,0.2)' }}
        />
      ))}
      <span className="text-[11px] text-slate-500 ml-0.5">{level}</span>
    </span>
  );
}

function MissionCard({
  mission, done, pending, onBegin,
}: {
  mission: Mission;
  done: boolean;
  pending: boolean;
  onBegin: () => void;
}) {
  const color = PLANET_COLORS[mission.id] ?? '#FFD166';
  const vis = VISIBILITY[mission.difficulty];

  return (
    <div
      className="relative overflow-hidden rounded-2xl group transition-all duration-300 cursor-default"
      style={{
        background: done
          ? 'linear-gradient(135deg, rgba(52,211,153,0.04), rgba(7,11,20,0.8))'
          : 'rgba(15,31,61,0.45)',
        border: `1px solid ${done ? 'rgba(52,211,153,0.2)' : `${color}18`}`,
        borderLeft: `3px solid ${done ? '#34d399' : color}`,
      }}
    >
      {/* Hover ambient glow */}
      {!done && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 80% at 10% 50%, ${color}0A 0%, transparent 70%)`,
          }}
        />
      )}

      <div className="relative flex items-center gap-3 sm:gap-4 px-4 py-4 sm:py-5">

        {/* Planet orb */}
        <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14">
          <div
            className="absolute inset-0 rounded-full blur-xl transition-opacity duration-300"
            style={{
              backgroundColor: color,
              opacity: done ? 0.1 : 0.18,
              transform: 'scale(1.4)',
            }}
          />
          <div
            className="relative w-full h-full rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${color}20, ${color}08)`,
              border: `1px solid ${color}20`,
            }}
          >
            <MissionIcon id={mission.id} size={34} />
            {done && (
              <div className="absolute inset-0 rounded-full bg-[#070B14]/60 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-[#34d399]" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-bold text-[15px] leading-tight ${done ? 'text-slate-400' : 'text-white'}`}>
              {mission.name}
            </h3>
            <span
              className="text-xs font-bold flex-shrink-0"
              style={{ color: done ? 'rgba(255,209,102,0.4)' : '#FFD166' }}
            >
              +{mission.stars} ✦
            </span>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed mb-2 line-clamp-1 hidden sm:block">
            {mission.desc}
          </p>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <DifficultyDots level={mission.difficulty} color={done ? '#64748b' : color} />
            <span className="text-slate-700 text-[10px]">·</span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              {mission.type === 'telescope'
                ? <Telescope size={10} />
                : <Eye size={10} />
              }
              {mission.type === 'telescope' ? 'Telescope' : 'Naked Eye'}
            </span>
            <span className="text-slate-700 text-[10px]">·</span>
            <span className="text-[11px] font-medium" style={{ color: done ? '#64748b' : vis.color }}>
              {vis.label}
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="flex-shrink-0 ml-1">
          {done ? (
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-8 h-8 rounded-full bg-[#34d399]/10 border border-[#34d399]/20 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-[#34d399]" />
              </div>
              <span className="text-[#34d399] text-[9px] font-medium tracking-wide uppercase">Done</span>
            </div>
          ) : pending ? (
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <Clock size={14} className="text-amber-400" />
              </div>
              <span className="text-amber-400 text-[9px] tracking-wide uppercase">Queued</span>
            </div>
          ) : (
            <button
              onClick={onBegin}
              className="group/btn flex items-center gap-1 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${color}25, ${color}10)`,
                border: `1px solid ${color}35`,
                color,
                boxShadow: `0 0 0 0 ${color}40`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${color}30`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${color}40`;
              }}
            >
              Begin
              <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MissionList() {
  const { state } = useAppState();
  const [active, setActive] = useState<Mission | null>(null);
  const completedIds = new Set(state.completedMissions.filter(m => m.status === 'completed').map(m => m.id));
  const pendingIds = new Set(state.completedMissions.filter(m => m.status === 'pending').map(m => m.id));

  return (
    <>
      {active && <MissionActive mission={active} onClose={() => setActive(null)} />}
      <div className="flex flex-col gap-2 mb-6">
        {MISSIONS.map(mission => (
          <MissionCard
            key={mission.id}
            mission={mission}
            done={completedIds.has(mission.id)}
            pending={pendingIds.has(mission.id)}
            onBegin={() => setActive(mission)}
          />
        ))}
      </div>
    </>
  );
}
