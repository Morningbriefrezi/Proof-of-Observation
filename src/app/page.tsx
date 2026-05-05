import Link from 'next/link';
import type { ReactElement } from 'react';
import { MISSIONS } from '@/lib/constants';
import HeroSkyPanel from '@/components/home/HeroSkyPanelLazy';

const HERO_MISSION_IDS = ['moon', 'jupiter', 'pleiades', 'orion', 'saturn', 'andromeda', 'crab'] as const;

const MISSION_LABEL: Record<string, { name: string; meta: string }> = {
  moon:      { name: 'The Moon',      meta: 'Naked eye · beginner' },
  jupiter:   { name: 'Jupiter',       meta: 'Galilean moons' },
  pleiades:  { name: 'Pleiades',      meta: 'Star cluster · easy' },
  orion:     { name: 'Orion Nebula',  meta: 'Deep sky · medium' },
  saturn:    { name: 'Saturn',        meta: 'Ring system' },
  andromeda: { name: 'Andromeda',     meta: 'Deep sky · hard' },
  crab:      { name: 'Crab Nebula',   meta: 'Supernova · expert' },
};

const MISSION_ICONS: Record<string, ReactElement> = {
  moon: (
    <path d="M22 16a8 8 0 11-12-7 6 6 0 0012 7z" />
  ),
  jupiter: (
    <>
      <circle cx="16" cy="16" r="9" />
      <ellipse cx="16" cy="16" rx="14" ry="3" transform="rotate(-15 16 16)" />
    </>
  ),
  pleiades: (
    <>
      <circle cx="10" cy="10" r="2" />
      <circle cx="20" cy="8"  r="1.5" />
      <circle cx="14" cy="14" r="1.5" />
      <circle cx="22" cy="16" r="2" />
      <circle cx="9"  cy="20" r="1.5" />
      <circle cx="18" cy="22" r="1.5" />
      <circle cx="24" cy="22" r="1" />
    </>
  ),
  orion: (
    <>
      <path d="M4 16c4-8 12-10 16-6s2 12-4 14-12-4-12-8z" />
      <circle cx="14" cy="14" r="2" />
      <circle cx="20" cy="18" r="1.5" />
    </>
  ),
  saturn: (
    <>
      <circle cx="16" cy="16" r="7" />
      <ellipse cx="16" cy="16" rx="14" ry="4" transform="rotate(-20 16 16)" />
    </>
  ),
  andromeda: (
    <>
      <ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(-25 16 16)" />
      <ellipse cx="16" cy="16" rx="6"  ry="3" transform="rotate(-25 16 16)" />
      <circle cx="16" cy="16" r="1.5" />
    </>
  ),
  crab: (
    <>
      <path d="M6 16c2-6 8-9 12-7s5 9 0 13-12-1-12-6z" />
      <path d="M10 12c2 1 4 0 5-2M22 14c-1 2-3 3-5 2" />
    </>
  ),
};

const HERO_MISSIONS = HERO_MISSION_IDS.map((id) => {
  const m = MISSIONS.find((x) => x.id === id);
  const label = MISSION_LABEL[id];
  return {
    id,
    name: label.name,
    meta: label.meta,
    stars: m?.stars ?? 0,
  };
});

const TILE_BRASS = 'bg-[rgba(255,209,102,0.08)] border-[rgba(255,209,102,0.2)]';
const TILE_PURPLE = 'bg-[rgba(176,127,232,0.08)] border-[rgba(176,127,232,0.2)]';
const TILE_TEAL = 'bg-[rgba(56,240,255,0.08)] border-[rgba(56,240,255,0.2)]';

const STROKE_BRASS = '#FFD166';
const STROKE_PURPLE = '#B07FE8';
const STROKE_TEAL = '#38F0FF';

function IconTile({ tone, children }: { tone: 'brass' | 'purple' | 'teal'; children: React.ReactNode }) {
  const cls = tone === 'brass' ? TILE_BRASS : tone === 'purple' ? TILE_PURPLE : TILE_TEAL;
  return (
    <div className={`w-14 h-14 ${cls} border rounded-xl flex items-center justify-center mb-6 mx-auto md:mx-0`}>
      {children}
    </div>
  );
}

function StrokeIcon({ tone, children }: { tone: 'brass' | 'purple' | 'teal'; children: React.ReactNode }) {
  const stroke = tone === 'brass' ? STROKE_BRASS : tone === 'purple' ? STROKE_PURPLE : STROKE_TEAL;
  return (
    <svg
      className="w-7 h-7"
      stroke={stroke}
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 32 32"
    >
      {children}
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[14px] font-semibold tracking-[0.22em] uppercase text-[#FFD166] mb-6">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[28px] md:text-[60px] font-extrabold leading-[1.1] md:leading-[1.05] tracking-[-0.02em] text-white mb-5 md:mb-7">
      {children}
    </h2>
  );
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] md:text-[20px] leading-[1.55] text-[#9BA3B4] max-w-[680px] mx-auto">
      {children}
    </p>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[18px] md:text-[22px] font-bold text-white mb-3 md:mb-4">{children}</div>;
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="text-[14px] md:text-[15px] leading-[1.65] text-[#9BA3B4]">{children}</div>;
}

function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black/40 border-l-2 border-[#8B5CF6] rounded px-4 py-3 mb-3 font-mono text-[12px] text-[#B8BFD0] leading-[1.5] last:mb-0">
      <span className="text-[#10B981] mr-2">&gt;</span>
      {children}
    </div>
  );
}

function StarSparkle({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="#FFD166">
      <path d="M6 1l1.5 3.5L11 5l-2.5 2L9 10.5 6 8.5 3 10.5l.5-3.5L1 5l3.5-.5z" />
    </svg>
  );
}

/* ─── How It Works: phone-frame mockups ───────────────────────────── */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[230px] md:w-[260px] aspect-[9/19.5] rounded-[38px] bg-[#05070D] p-[6px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]">
      <div className="absolute -inset-[1px] rounded-[39px] ring-1 ring-white/[0.04] pointer-events-none" />
      <div className="relative h-full w-full rounded-[32px] bg-gradient-to-b from-[#0B0E17] to-[#0F1424] overflow-hidden">
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-[20px] w-[78px] rounded-full bg-black z-20" />
        <div className="flex items-center justify-between px-5 pt-2 text-[9px] font-mono text-white/50 relative z-10">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1 rounded-[1px] bg-white/40" />
            <span className="w-3 h-1.5 rounded-[1px] border border-white/40" />
          </span>
        </div>
        <div className="px-3 pt-6 pb-4 h-full">{children}</div>
      </div>
    </div>
  );
}

function HowStep({
  title,
  caption,
  screen,
}: {
  title: string;
  caption: string;
  screen: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {screen}
      <div className="mt-7 md:mt-8 text-white text-[18px] md:text-[20px] font-semibold tracking-[-0.01em]">
        {title}
      </div>
      <div className="mt-2 text-[#9BA3B4] text-[13.5px] md:text-[14.5px] leading-[1.55] max-w-[260px]">
        {caption}
      </div>
    </div>
  );
}

function SigninScreen() {
  return (
    <PhoneFrame>
      <div className="flex flex-col items-center pt-6">
        <div className="w-9 h-9 rounded-full bg-[#FFD166]/15 border border-[#FFD166]/30 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#FFD166" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" />
            <ellipse cx="12" cy="12" rx="10" ry="4" />
          </svg>
        </div>
        <div className="mt-3 text-white text-[12px] font-semibold tracking-wide">STELLAR</div>
        <div className="mt-5 text-white text-[13px] font-medium">Sign in</div>
        <div className="mt-1 text-white/50 text-[10px]">Wallet appears silently</div>

        <div className="mt-5 w-full bg-white/[0.04] border border-white/10 rounded-[10px] px-3 py-2.5 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="#9BA3B4" strokeWidth="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <span className="text-white/80 text-[10.5px]">rezi@astroman.ge</span>
        </div>

        <div className="mt-2 w-full rounded-[10px] bg-[#FFD166] text-[#0B0E17] text-[11px] font-bold py-2.5 text-center">
          Continue
        </div>

        <div className="mt-4 w-full rounded-[10px] border border-[#14B8A6]/25 bg-[#14B8A6]/[0.06] px-3 py-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
          <span className="text-[#5EEAD4] text-[9.5px] font-mono uppercase tracking-wider">
            Wallet ready
          </span>
        </div>

        <div className="mt-2 text-white/35 text-[9px]">No seed phrase. No extension.</div>
      </div>
    </PhoneFrame>
  );
}

function ShootScreen() {
  return (
    <PhoneFrame>
      <div className="flex flex-col pt-3">
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-[10px] font-mono uppercase tracking-wider">Tonight</span>
          <span className="flex items-center gap-1 text-[#5EEAD4] text-[9px] font-mono uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" /> Clear
          </span>
        </div>

        <div className="mt-2 relative aspect-square w-full rounded-[14px] overflow-hidden bg-gradient-to-br from-[#0F1424] via-[#1A1F3A] to-[#0B0E17]">
          {[
            { l: '14%', t: '22%', s: 1.5 },
            { l: '70%', t: '18%', s: 1 },
            { l: '32%', t: '60%', s: 1.2 },
            { l: '80%', t: '70%', s: 0.9 },
            { l: '50%', t: '40%', s: 0.8 },
            { l: '22%', t: '80%', s: 1 },
            { l: '60%', t: '85%', s: 0.9 },
          ].map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/80"
              style={{ left: s.l, top: s.t, width: s.s * 2, height: s.s * 2 }}
            />
          ))}
          <div
            className="absolute rounded-full"
            style={{
              left: '46%',
              top: '44%',
              width: 28,
              height: 28,
              background:
                'radial-gradient(circle, rgba(255,209,102,0.85) 0%, rgba(255,209,102,0.25) 60%, transparent 100%)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-[#FFD166]/60" />
            <div className="absolute w-20 h-20 rounded-full border border-[#FFD166]/25" />
          </div>
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/50 text-[#FFD166] text-[8.5px] font-mono uppercase tracking-wider">
            Jupiter · 38°
          </div>
        </div>

        <div className="mt-3 rounded-[10px] bg-white/[0.04] border border-white/10 p-2.5">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-white/50">
            <span>Sky</span><span>Moon</span><span>Seeing</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-white">
            <span>Clear</span><span>14%</span><span>Good</span>
          </div>
        </div>

        <div className="mt-3 mx-auto w-12 h-12 rounded-full bg-white border-[3px] border-[#FFD166] shadow-[0_0_0_3px_rgba(255,209,102,0.2)]" />
      </div>
    </PhoneFrame>
  );
}

function RedeemScreen() {
  return (
    <PhoneFrame>
      <div className="flex flex-col pt-3">
        <div className="text-white/60 text-[10px] font-mono uppercase tracking-wider">Your Stars</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-white text-[28px] font-bold leading-none">2,840</span>
          <StarSparkle className="w-3.5 h-3.5" />
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[#5EEAD4] text-[9.5px] font-mono">
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 8l3-3 2 2 3-4" />
          </svg>
          +120 this week
        </div>

        <div className="mt-4 text-white/60 text-[9.5px] font-mono uppercase tracking-wider">
          Redeem at Astroman
        </div>

        <div className="mt-2 rounded-[12px] bg-white/[0.04] border border-white/10 overflow-hidden">
          <div className="aspect-[16/10] bg-gradient-to-br from-[#1A1F3A] to-[#0B0E17] relative flex items-center justify-center">
            <svg viewBox="0 0 64 40" className="w-20 h-12" fill="none" stroke="#FFD166" strokeWidth="1.4" strokeLinecap="round">
              <rect x="6" y="14" width="40" height="8" rx="1" />
              <rect x="44" y="11" width="14" height="14" rx="1" />
              <path d="M26 22v8M18 30h16" />
              <circle cx="51" cy="18" r="1.2" fill="#FFD166" />
            </svg>
          </div>
          <div className="px-2.5 py-2">
            <div className="text-white text-[11px] font-medium leading-tight">Celestron AstroMaster</div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[#FFD166] text-[10.5px] font-mono">2,400 ★</span>
              <span className="text-white/40 text-[9px] line-through font-mono">₾ 480</span>
            </div>
          </div>
        </div>

        <div className="mt-2 rounded-[10px] bg-[#FFD166] text-[#0B0E17] text-[11px] font-bold py-2 text-center">
          Redeem
        </div>
      </div>
    </PhoneFrame>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[#0A1735] text-white -mt-14 pt-14 overflow-x-hidden">

      {/* ============================================================
          HERO
         ============================================================ */}
      <section className="relative px-4 md:px-8 pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden">
        {/* radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 70% 50%, rgba(255, 209, 102, 0.10) 0%, transparent 50%), radial-gradient(circle at 30% 60%, rgba(176, 127, 232, 0.08) 0%, transparent 50%)',
          }}
        />
        {/* faint star field */}
        <svg
          className="absolute inset-0 pointer-events-none opacity-50 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 700"
        >
          <g fill="#FFFFFF">
            <circle cx="100"  cy="80"  r="0.8" opacity="0.6" />
            <circle cx="240"  cy="160" r="1.2" opacity="0.8" />
            <circle cx="380"  cy="60"  r="0.6" opacity="0.5" />
            <circle cx="520"  cy="220" r="1.4" opacity="0.7" />
            <circle cx="700"  cy="90"  r="0.8" opacity="0.6" />
            <circle cx="880"  cy="180" r="1.0" opacity="0.7" />
            <circle cx="1050" cy="120" r="0.6" opacity="0.5" />
            <circle cx="60"   cy="320" r="1.0" opacity="0.6" />
            <circle cx="200"  cy="420" r="0.6" opacity="0.4" />
            <circle cx="340"  cy="500" r="1.2" opacity="0.7" />
            <circle cx="480"  cy="380" r="0.8" opacity="0.5" />
            <circle cx="620"  cy="540" r="1.4" opacity="0.8" />
            <circle cx="780"  cy="440" r="0.6" opacity="0.5" />
            <circle cx="940"  cy="500" r="1.0" opacity="0.6" />
            <circle cx="1100" cy="380" r="0.8" opacity="0.5" />
            <circle cx="160"  cy="600" r="0.8" opacity="0.6" />
            <circle cx="420"  cy="660" r="0.6" opacity="0.4" />
            <circle cx="700"  cy="640" r="1.0" opacity="0.6" />
            <circle cx="1020" cy="640" r="0.8" opacity="0.5" />
          </g>
        </svg>

        <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 md:gap-15 items-center">
          <div>
            <h1 className="text-[36px] md:text-[72px] font-extrabold leading-[1.05] md:leading-[1] tracking-[-0.025em] text-white mb-5 md:mb-8">
              Find every{' '}
              <span className="bg-gradient-to-r from-[#B07FE8] to-[#38F0FF] bg-clip-text text-transparent">
                planet
              </span>
              . Earn rewards.
            </h1>

            <p className="text-[15px] md:text-[18px] leading-[1.65] text-[#9BA3B4] mb-7 md:mb-9 max-w-[480px]">
              Real-time sky positions from your location. Photograph what you find, redeem Stars for telescopes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-[460px]">
              <Link
                href="/missions"
                className="flex-1 inline-flex items-center justify-center px-8 py-[18px] bg-[#FFD166] text-[#0A0E1A] font-bold text-[15px] tracking-[0.01em] rounded-[12px] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_10px_30px_-12px_rgba(255,209,102,0.55)] ring-1 ring-[#E8B84A]/60 hover:bg-[#FFDA85] active:translate-y-[0.5px] transition-all no-underline"
              >
                Start observing
              </Link>
              <Link
                href="/sky"
                className="flex-1 inline-flex items-center justify-center px-8 py-[18px] bg-[#161C2D] text-white font-bold text-[15px] tracking-[0.01em] rounded-[12px] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 hover:bg-[#1B2236] hover:ring-white/15 active:translate-y-[0.5px] transition-all no-underline"
              >
                See tonight&apos;s sky
              </Link>
            </div>
          </div>

          {/* hero instrument panel */}
          <div className="hidden md:flex relative items-center justify-center">
            <HeroSkyPanel />
          </div>
        </div>

        {/* brand partners — backed by Astroman + 30K customers */}
        <div className="relative max-w-[1200px] mx-auto mt-14 md:mt-24">
          {/* header row: eyebrow + 30K stat + partner count */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-10 mb-7 md:mb-9 pb-6 md:pb-8 border-b border-white/[0.07]">
            <div className="max-w-[640px]">
              <div className="text-[10.5px] md:text-[11px] uppercase tracking-[0.22em] text-[#9BA3B4] mb-3">
                Backed by Georgia&apos;s largest astronomy retailer
              </div>
              <div className="flex items-baseline gap-3 md:gap-4">
                <span className="font-mono text-[36px] md:text-[56px] font-bold leading-none text-white tracking-tight tabular-nums">30,000+</span>
                <span className="text-[15px] md:text-[18px] text-[#9BA3B4] leading-tight pb-1">
                  Astroman customers
                </span>
              </div>
              <div className="text-[13px] md:text-[14px] text-[#6B7385] mt-2.5 leading-[1.55]">
                Eight years of trust on astroman.ge. Redeem Stars for real gear from the brands they already buy.
              </div>
            </div>

            <div className="flex md:flex-col md:items-end gap-3 md:gap-1.5 md:text-right">
              <div className="text-[10.5px] md:text-[11px] uppercase tracking-[0.22em] text-[#9BA3B4] order-2 md:order-1">
                Brand partners
              </div>
              <div className="font-mono text-[28px] md:text-[40px] font-bold leading-none text-white tabular-nums order-1 md:order-2">
                04
              </div>
            </div>
          </div>

          {/* logo wall */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0">
            {/* Astroman — serif, observatory feel */}
            <div className="flex items-center justify-center md:border-r md:border-white/[0.06] md:px-4 py-4 md:py-3 group">
              <span
                className="text-white/65 group-hover:text-white transition-colors duration-300 leading-none whitespace-nowrap"
                style={{
                  fontFamily: '"Source Serif 4", Georgia, serif',
                  fontSize: 'clamp(20px, 2.4vw, 26px)',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                }}
              >
                ASTROMAN
              </span>
            </div>

            {/* Bresser — bold engineering wordmark with star mark */}
            <div className="flex items-center justify-center md:border-r md:border-white/[0.06] md:px-4 py-4 md:py-3 group">
              <span
                className="inline-flex items-baseline gap-1.5 text-white/65 group-hover:text-white transition-colors duration-300 leading-none whitespace-nowrap"
                style={{
                  fontFamily: '"Public Sans", system-ui, sans-serif',
                  fontSize: 'clamp(20px, 2.4vw, 26px)',
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                }}
              >
                BRESSER
                <svg
                  viewBox="0 0 12 12"
                  className="w-[9px] h-[9px] md:w-[11px] md:h-[11px] self-start mt-[3px]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 0l1.5 4.2L12 4.6l-3.5 2.9L9.7 12 6 9.4 2.3 12l1.2-4.5L0 4.6l4.5-.4z" />
                </svg>
              </span>
            </div>

            {/* Celestron — dynamic italic */}
            <div className="flex items-center justify-center md:border-r md:border-white/[0.06] md:px-4 py-4 md:py-3 group">
              <span
                className="text-white/65 group-hover:text-white transition-colors duration-300 leading-none whitespace-nowrap"
                style={{
                  fontFamily: '"Public Sans", system-ui, sans-serif',
                  fontSize: 'clamp(20px, 2.4vw, 26px)',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  letterSpacing: '-0.015em',
                }}
              >
                CELESTRON
              </span>
            </div>

            {/* Levenhuk — wide tracking modern geometric */}
            <div className="flex items-center justify-center md:px-4 py-4 md:py-3 group">
              <span
                className="text-white/65 group-hover:text-white transition-colors duration-300 leading-none whitespace-nowrap"
                style={{
                  fontFamily: '"Public Sans", system-ui, sans-serif',
                  fontSize: 'clamp(20px, 2.4vw, 26px)',
                  fontWeight: 300,
                  letterSpacing: '0.24em',
                }}
              >
                LEVENHUK
              </span>
            </div>
          </div>

          {/* footer note */}
          <div className="mt-7 md:mt-9 pt-5 md:pt-6 border-t border-white/[0.07] flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
            <div className="text-[12px] md:text-[13px] text-[#6B7385] tracking-[0.01em]">
              Official retail partners · stocked at Astroman Tbilisi
            </div>
            <div className="flex items-center gap-2 text-[11px] md:text-[12px] text-[#9BA3B4] uppercase tracking-[0.18em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]" aria-hidden="true" />
              Live inventory
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
         ============================================================ */}
      <section className="px-4 md:px-8 py-14 md:py-[120px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <Eyebrow>Get Started</Eyebrow>
            <SectionTitle>How It Works</SectionTitle>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            <HowStep
              title="Sign in"
              caption="Email login. Wallet appears silently."
              screen={<SigninScreen />}
            />
            <HowStep
              title="Shoot the sky"
              caption="Phone, DSLR, or telescope. We verify the night."
              screen={<ShootScreen />}
            />
            <HowStep
              title="Earn &amp; redeem"
              caption="Stars for every observation. Spend at Astroman."
              screen={<RedeemScreen />}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          THREE PILLARS
         ============================================================ */}
      <section className="px-4 md:px-8 pb-14 md:pb-[120px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="brass">
                <StrokeIcon tone="brass">
                  <path d="M5 27l8-8M11 21l-2 6-2-1-3 3M22 6l4 4M19 9l4 4M16 12l-2 2 4 4 2-2M22 6l-9 9 4 4 9-9" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Observe with you</CardTitle>
              <CardBody>
                Photograph the Moon, Jupiter, Saturn, the Andromeda Galaxy — through any lens you have.
                Claude verifies your image, Open-Meteo verifies the sky, the chain seals the discovery.{' '}
                <em className="not-italic text-white italic">Any camera. Real photos. Real proof.</em>
              </CardBody>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="purple">
                <StrokeIcon tone="purple">
                  <circle cx="16" cy="16" r="12" />
                  <circle cx="16" cy="16" r="6" />
                  <circle cx="16" cy="16" r="1.5" fill="#B07FE8" />
                  <path d="M16 1v3M16 28v3M1 16h3M28 16h3" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Plans with you</CardTitle>
              <CardBody>
                7-day sky forecast, planet visibility tracker, ASTRA AI companion. Know what&apos;s up,
                when the sky is clear, and where to point — phone, binoculars, or telescope.
              </CardBody>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="teal">
                <StrokeIcon tone="teal">
                  <path d="M16 3l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Rewards your sky time</CardTitle>
              <CardBody>
                Stars for every verified observation, every quiz, every mission. Redeem at Astroman for
                telescopes, binoculars, or accessories — Bresser, Levenhuk, Celestron.
              </CardBody>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SKY MISSIONS SHOWCASE
         ============================================================ */}
      <section className="px-4 md:px-8 py-14 md:py-[120px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <Eyebrow>Sky Missions</Eyebrow>
            <SectionTitle>
              Seven targets,
              <br />
              one telescope.
            </SectionTitle>
            <SectionSub>
              From the Moon to the Crab Nebula. Each verified observation mints a compressed NFT to your wallet,
              earns Stars, and unlocks rewards.
            </SectionSub>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {HERO_MISSIONS.map((m) => (
              <Link
                key={m.id}
                href={`/missions/${m.id}`}
                className="block bg-[#11172A] border border-white/[0.06] rounded-[14px] p-5 hover:border-white/[0.12] hover:-translate-y-0.5 transition-all no-underline text-center md:text-left"
              >
                <svg
                  className="w-10 h-10 mb-4 mx-auto md:mx-0"
                  stroke="#FFD166"
                  fill="none"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 32 32"
                >
                  {MISSION_ICONS[m.id]}
                </svg>
                <div className="text-white text-[16px] font-bold mb-1.5">{m.name}</div>
                <div className="text-[#9BA3B4] text-[12px] mb-4">{m.meta}</div>
                <div className="text-[#FFD166] font-bold text-[14px] font-mono inline-flex items-center gap-1">
                  <StarSparkle />
                  +{m.stars}
                </div>
              </Link>
            ))}
            <Link
              href="/missions"
              className="block bg-gradient-to-b from-[rgba(255,209,102,0.06)] to-[#11172A] border border-[rgba(255,209,102,0.2)] rounded-[14px] p-5 hover:border-[rgba(255,209,102,0.4)] hover:-translate-y-0.5 transition-all no-underline text-center md:text-left"
            >
              <svg
                className="w-10 h-10 mb-4 mx-auto md:mx-0"
                stroke="#FFD166"
                fill="none"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 32 32"
              >
                <path d="M5 27l8-8M11 21l-2 6-2-1-3 3M22 6l4 4M19 9l4 4" />
                <path d="M16 12l-2 2 4 4 2-2M22 6l-9 9 4 4 9-9" />
              </svg>
              <div className="text-[#FFD166] text-[16px] font-bold mb-1.5">All seven</div>
              <div className="text-[#9BA3B4] text-[12px] mb-4">Reward: free telescope</div>
              <div className="text-[#FFD166] font-bold text-[14px] font-mono">View →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          CAPABILITIES
         ============================================================ */}
      <section className="px-4 md:px-8 py-14 md:py-[120px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <Eyebrow>Capabilities</Eyebrow>
            <SectionTitle>Everything in one app.</SectionTitle>
            <SectionSub>
              A full astronomy companion built on the most consumer-friendly chain in crypto.
            </SectionSub>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="brass">
                <StrokeIcon tone="brass">
                  <path d="M3 18c4-6 8-9 13-9s9 3 13 9" />
                  <path d="M3 18c4 6 8 9 13 9s9-3 13-9" />
                  <circle cx="16" cy="18" r="3" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>7-day sky forecast</CardTitle>
              <CardBody>
                Cloud cover, visibility, moon phase. Each night rated Go / Maybe / Skip — synced to your
                location via Open-Meteo.
              </CardBody>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="purple">
                <StrokeIcon tone="purple">
                  <circle cx="16" cy="16" r="13" />
                  <circle cx="16" cy="16" r="6" />
                  <circle cx="22" cy="11" r="1" fill="#B07FE8" />
                  <circle cx="10" cy="20" r="0.8" fill="#B07FE8" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Planet tracker</CardTitle>
              <CardBody>
                Live altitude and rise/set times for every planet plus the Moon, calculated on your device
                with astronomy-engine.
              </CardBody>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="teal">
                <StrokeIcon tone="teal">
                  <rect x="6" y="6" width="20" height="20" rx="4" />
                  <circle cx="12" cy="14" r="1.5" />
                  <circle cx="20" cy="14" r="1.5" />
                  <path d="M12 20c1 1.5 2.5 2.5 4 2.5s3-1 4-2.5" />
                  <path d="M16 2v4M9 4l2 3M23 4l-2 3" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>ASTRA AI companion</CardTitle>
              <CardBody>
                Claude-powered. Tells you what&apos;s visible from your location, the best night this week,
                and what you can capture with whatever&apos;s in your hand.
              </CardBody>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="brass">
                <StrokeIcon tone="brass">
                  <circle cx="16" cy="16" r="12" />
                  <path d="M9 16l5 5 9-9" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Discovery attestations</CardTitle>
              <CardBody>
                Each verified observation is sealed as a compressed NFT on Solana via Bubblegum. Permanent,
                gasless, yours forever.
              </CardBody>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="purple">
                <StrokeIcon tone="purple">
                  <path d="M16 3l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Stars rewards</CardTitle>
              <CardBody>
                Earn for missions, quizzes, observations. Track on-chain as a real SPL token. Redeem at
                Astroman for real gear.
              </CardBody>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="teal">
                <StrokeIcon tone="teal">
                  <circle cx="9" cy="22" r="3" />
                  <circle cx="22" cy="22" r="3" />
                  <path d="M3 8h4l2.5 11h12L25 11H10" />
                  <path d="M25 11l1-4" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Optics marketplace</CardTitle>
              <CardBody>
                Telescopes, binoculars, accessories. Real inventory at Astroman.ge — Georgia&apos;s first
                astronomy store. Stars convert to discounts and free gear.
              </CardBody>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          REAL OBSERVERS
         ============================================================ */}
      <section className="px-4 md:px-8 py-14 md:py-[120px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <Eyebrow>Real Observers</Eyebrow>
            <SectionTitle>
              What stargazers
              <br />
              are doing.
            </SectionTitle>
            <SectionSub>
              From clear-night alerts to deep-sky planning — Stellar fits how astronomers actually work.
            </SectionSub>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="brass">
                <StrokeIcon tone="brass">
                  <path d="M3 22c0-7 6-13 13-13s13 6 13 13" />
                  <circle cx="16" cy="22" r="2" />
                  <path d="M16 22V9M11 13l5-4 5 4" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Sky Forecaster</CardTitle>
              <Prompt>&quot;Alert me at 6pm when tonight is a clear-sky &lsquo;Go&rsquo;&quot;</Prompt>
              <Prompt>&quot;Show me the next 3 dark-sky windows in Kazbegi&quot;</Prompt>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="purple">
                <StrokeIcon tone="purple">
                  <circle cx="16" cy="16" r="12" />
                  <path d="M16 4l4 8h-8z" fill="rgba(176,127,232,0.3)" />
                  <circle cx="16" cy="16" r="4" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Planet Hunter</CardTitle>
              <Prompt>&quot;When can I see Saturn&apos;s rings tilt this year?&quot;</Prompt>
              <Prompt>&quot;Track Jupiter&apos;s 4 moons for the next two weeks&quot;</Prompt>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="teal">
                <StrokeIcon tone="teal">
                  <path d="M5 25l9-9M11 19l-2 6-2-1-3 3M22 4l4 4M19 7l4 4M16 10l-2 2 4 4 2-2M22 4l-9 9 4 4 9-9" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Mission Collector</CardTitle>
              <Prompt>&quot;What&apos;s left to complete the &lsquo;All Seven&rsquo; reward?&quot;</Prompt>
              <Prompt>&quot;Which missions can I shoot with just my phone?&quot;</Prompt>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="brass">
                <StrokeIcon tone="brass">
                  <rect x="6" y="6" width="20" height="20" rx="4" />
                  <circle cx="12" cy="14" r="1.5" />
                  <circle cx="20" cy="14" r="1.5" />
                  <path d="M12 20c1 1.5 2.5 2.5 4 2.5s3-1 4-2.5" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>ASTRA Sessions</CardTitle>
              <Prompt>&quot;What can I photograph with my phone tonight?&quot;</Prompt>
              <Prompt>&quot;How do I find Andromeda by star-hopping?&quot;</Prompt>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="purple">
                <StrokeIcon tone="purple">
                  <path d="M16 3l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Stars Stacker</CardTitle>
              <Prompt>&quot;How many Stars until the next rank?&quot;</Prompt>
              <Prompt>&quot;Burn 100 Stars for a 1₾ discount on this telescope&quot;</Prompt>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 text-center md:text-left">
              <IconTile tone="teal">
                <StrokeIcon tone="teal">
                  <circle cx="9" cy="22" r="3" />
                  <circle cx="22" cy="22" r="3" />
                  <path d="M3 8h4l2.5 11h12L25 11H10" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Gear Redeemer</CardTitle>
              <Prompt>&quot;Show telescopes I can buy with 4500 Stars&quot;</Prompt>
              <Prompt>&quot;Reserve Bresser 76/300 at Astroman, Tbilisi&quot;</Prompt>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          DISTRIBUTION (ASTROMAN)
         ============================================================ */}
      <section className="px-4 md:px-8 py-14 md:py-[120px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <Eyebrow>The Distribution</Eyebrow>
            <SectionTitle>Built on top of Astroman.</SectionTitle>
            <SectionSub>Stellar runs anywhere, but it was made on top of one shop in particular.</SectionSub>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 md:min-h-[240px] text-center md:text-left">
              <IconTile tone="brass">
                <StrokeIcon tone="brass">
                  <path d="M5 11h22l-2 14H7zM10 11V7a6 6 0 0112 0v4" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Astroman.ge</CardTitle>
              <CardBody>
                60K+ social followers, real telescope inventory, physical Tbilisi store. The audience already
                exists, the logistics already work.
              </CardBody>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 md:min-h-[240px] text-center md:text-left">
              <IconTile tone="purple">
                <StrokeIcon tone="purple">
                  <circle cx="11" cy="13" r="5" />
                  <circle cx="21" cy="13" r="5" />
                  <path d="M5 27c0-3 2.5-6 6-6s6 3 6 6M15 27c0-3 2.5-6 6-6s6 3 6 6" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Bresser · Levenhuk · Celestron</CardTitle>
              <CardBody>
                Three telescope-brand revenue-share partnerships. 20% commission on every unit sold through
                the loop. No upfront inventory.
              </CardBody>
            </div>
            <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] p-5 md:p-9 md:min-h-[240px] text-center md:text-left">
              <IconTile tone="teal">
                <StrokeIcon tone="teal">
                  <path d="M16 3a8 8 0 018 8c0 6-8 16-8 16s-8-10-8-16a8 8 0 018-8z" />
                  <circle cx="16" cy="11" r="3" />
                </StrokeIcon>
              </IconTile>
              <CardTitle>Real margins, real inventory</CardTitle>
              <CardBody>
                Stars redeem for actual telescopes the user picks up in store. No drop-shipping promises, no
                fake economy, no devnet hand-waving.
              </CardBody>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          COMPARISON
         ============================================================ */}
      <section className="px-4 md:px-8 py-14 md:py-[120px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <Eyebrow>The Difference</Eyebrow>
            <SectionTitle>
              Generic astronomy app
              <br />
              vs Stellar
            </SectionTitle>
            <SectionSub>
              Plenty of apps show you the night sky. Only one closes the loop from sky to telescope to
              discovery.
            </SectionSub>
          </div>

          <div className="bg-[#11172A] border border-white/[0.06] rounded-[18px] overflow-hidden md:overflow-x-auto">
            <table className="w-full border-collapse md:min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left text-white text-[12px] md:text-[18px] font-bold py-3 md:py-6 px-2 md:px-8 border-b border-white/[0.06] w-[28%] md:w-[30%]">
                    Feature
                  </th>
                  <th className="text-left text-white text-[12px] md:text-[18px] font-bold py-3 md:py-6 px-2 md:px-8 border-b border-white/[0.06]">
                    Generic
                    <span className="hidden md:inline"> astronomy app</span>
                  </th>
                  <th className="text-left text-white text-[12px] md:text-[18px] font-bold py-3 md:py-6 px-2 md:px-8 border-b border-white/[0.06] border-l-[3px] border-l-[#8B5CF6] bg-[rgba(139,92,246,0.06)]">
                    Stellar
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Sky forecast',           ['check', 'Cloud cover, basic'],                             ['check', 'Open-Meteo · 7-day with sky quality scoring']],
                  ['Planet tracker',         ['check', 'Static charts'],                                  ['check', 'Live altitude, rise/set, location-aware']],
                  ['AI sky companion',       ['x',     null],                                             ['check', 'ASTRA — Claude-powered with tool calling']],
                  ['Verified observations',  ['x',     null],                                             ['check', 'Photo + sky oracle + on-chain attestation']],
                  ['Mission system',         ['x',     null],                                             ['check', '7 progressive targets · easy to expert']],
                  ['Real reward redemption', ['x',     null],                                             ['check', 'Stars → telescopes at Astroman, Tbilisi']],
                  ['Wallet onboarding',      ['x',     'No wallet involved'],                             ['check', 'Email login, embedded wallet, no seed phrase']],
                  ['On-chain proof of discovery', ['x', null],                                            ['check', 'Compressed NFTs via Bubblegum, gasless']],
                  ['Distribution channel',   ['x',     'App-store cold start'],                           ['check', 'Astroman: 60K+ astronomy customers']],
                ].map(([feature, them, us], i, arr) => {
                  const isLast = i === arr.length - 1;
                  const [themMark, themText] = them as [string, string | null];
                  const [usMark, usText] = us as [string, string];
                  return (
                    <tr key={feature as string}>
                      <td className={`py-3 md:py-[22px] px-2 md:px-8 text-white font-medium text-[12px] md:text-[16px] ${isLast ? '' : 'border-b border-white/[0.06]'}`}>
                        {feature}
                      </td>
                      <td className={`py-3 md:py-[22px] px-2 md:px-8 text-[#9BA3B4] text-[12px] md:text-[16px] ${isLast ? '' : 'border-b border-white/[0.06]'}`}>
                        {themMark === 'check' ? (
                          <span className="text-[#10B981] mr-1.5 md:mr-2.5 font-bold">✓</span>
                        ) : (
                          <span className="text-[#EF4444] mr-1.5 md:mr-2.5 font-bold">✗</span>
                        )}
                        <span className="hidden md:inline">{themText && <em className="not-italic italic">{themText}</em>}</span>
                      </td>
                      <td className={`py-3 md:py-[22px] px-2 md:px-8 text-white text-[12px] md:text-[16px] border-l-[3px] border-l-[#8B5CF6] bg-[rgba(139,92,246,0.04)] ${isLast ? '' : 'border-b border-white/[0.06]'}`}>
                        {usMark === 'check' ? (
                          <span className="text-[#10B981] mr-1.5 md:mr-2.5 font-bold">✓</span>
                        ) : (
                          <span className="text-[#EF4444] mr-1.5 md:mr-2.5 font-bold">✗</span>
                        )}
                        {usText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================
          VISION
         ============================================================ */}
      <section className="relative px-4 md:px-8 py-16 md:py-[140px] text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(176,127,232,0.10) 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-6 mb-8">
            <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 32 32" fill="none" stroke="#FFD166" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 27l8-8M11 21l-2 6-2-1-3 3M22 4l4 4M19 7l4 4M16 10l-2 2 4 4 2-2M22 4l-9 9 4 4 9-9" />
            </svg>
            <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 32 32" fill="none" stroke="#38F0FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 16h22M19 8l8 8-8 8" />
            </svg>
            <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 32 32" fill="none" stroke="#B07FE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="6" width="20" height="20" rx="4" />
              <path d="M11 14l5-3 5 3v6l-5 3-5-3z" />
            </svg>
          </div>
          <h2 className="text-[32px] md:text-[64px] font-bold mb-6 md:mb-10 leading-none bg-gradient-to-r from-[#B07FE8] to-[#38F0FF] bg-clip-text text-transparent">
            The Vision
          </h2>
          <p className="text-[15px] md:text-[20px] leading-[1.6] text-[#9BA3B4] max-w-[720px] mx-auto mb-7 md:mb-8">
            Anyone with a smartphone and a sky above them can become an observer.
            <strong className="text-white font-semibold"> Astroman is the shop. Stellar is the night sky&apos;s companion app.</strong>{' '}
            Together they make stargazing a tracked, rewarded, on-chain practice — and turn casual sky-gazers into real telescope owners over time.
          </p>
          <div className="text-[16px] md:text-[18px] text-white">
            Stellar is{' '}
            <span className="bg-gradient-to-r from-[#B07FE8] to-[#38F0FF] bg-clip-text text-transparent font-bold">
              the on-chain layer for the night sky
            </span>
            .
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
         ============================================================ */}
      <section className="px-6 md:px-8 py-20 md:py-[120px] text-center">
        <div className="max-w-[1200px] mx-auto">
          <Eyebrow>Get Started</Eyebrow>
          <h2 className="text-[28px] md:text-[60px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white mb-5 md:mb-8">
            The sky is open.
            <br />
            Take your first observation.
          </h2>
          <p className="text-[15px] md:text-[20px] leading-[1.6] text-[#9BA3B4] max-w-[640px] mx-auto mb-8 md:mb-12">
            Sign in with email. Your wallet appears silently. Step outside with the phone you already have,
            check tonight&apos;s sky, ask ASTRA what&apos;s visible — start with whichever speaks to you.
          </p>
          <div className="inline-flex flex-wrap gap-3.5 justify-center">
            <Link
              href="/missions"
              className="inline-flex items-center gap-2.5 px-9 py-4.5 bg-[#FFD166] text-[#0A0E1A] font-semibold text-[17px] rounded-xl hover:bg-[#FFE08A] transition-colors no-underline"
              style={{ paddingTop: 18, paddingBottom: 18 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Start observing
            </Link>
            <Link
              href="/sky"
              className="inline-flex items-center gap-2.5 px-9 bg-[rgba(255,209,102,0.10)] text-[#FFD166] font-semibold text-[17px] rounded-xl border border-[rgba(255,209,102,0.30)] hover:bg-[rgba(255,209,102,0.18)] transition-colors no-underline"
              style={{ paddingTop: 18, paddingBottom: 18 }}
            >
              Tonight&apos;s sky →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
