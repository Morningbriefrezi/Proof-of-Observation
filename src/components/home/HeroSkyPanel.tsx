'use client';

/**
 * Observatory targeting view — single iconic subject (Saturn) rendered
 * inside a precision eyepiece, surrounded by RA/DEC/AZ/ALT telemetry,
 * with subject drift + periodic reticle lock.
 *
 * Brand rules: no glass, no glow, no decorative gradients. The radial
 * shading on Saturn is a photographic rendering, not a UI gradient.
 */

const STARS: { cx: number; cy: number; r: number; o: number; d: number }[] = [
  { cx:  46, cy:  58, r: 0.6, o: 0.55, d: 0   },
  { cx: 198, cy:  44, r: 0.7, o: 0.7,  d: 1.1 },
  { cx: 250, cy: 102, r: 0.5, o: 0.5,  d: 2.3 },
  { cx:  74, cy: 174, r: 0.6, o: 0.6,  d: 0.7 },
  { cx: 226, cy: 198, r: 0.7, o: 0.65, d: 1.8 },
  { cx: 132, cy:  28, r: 0.4, o: 0.4,  d: 3.0 },
  { cx:  30, cy: 124, r: 0.5, o: 0.5,  d: 2.7 },
  { cx: 270, cy: 154, r: 0.4, o: 0.4,  d: 0.4 },
];

export default function HeroSkyPanel() {
  return (
    <div
      className="relative w-full max-w-[460px] mx-auto select-none"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <style jsx>{`
        @keyframes stellar-pulse {
          0%, 100% { opacity: 0.95; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(0.85); }
        }
        @keyframes stellar-drift {
          0%   { transform: translate(-2.5px, 1px); }
          50%  { transform: translate( 2.5px, -1px); }
          100% { transform: translate(-2.5px, 1px); }
        }
        @keyframes stellar-roll {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes stellar-twinkle {
          0%, 100% { opacity: var(--o, 0.5); }
          50%      { opacity: calc(var(--o, 0.5) * 0.35); }
        }
        @keyframes stellar-lock {
          0%, 88%, 100% { stroke-opacity: 0.55; }
          90%           { stroke-opacity: 1;    }
          92%           { stroke-opacity: 0.55; }
          94%           { stroke-opacity: 1;    }
        }
        @keyframes stellar-tick {
          0%, 92%, 100% { opacity: 1; }
          94%, 98%      { opacity: 0.5; }
        }
        @keyframes stellar-bar {
          0%, 100% { transform: scaleX(0.85); }
          50%      { transform: scaleX(1); }
        }
        .live-dot     { animation: stellar-pulse  1.8s ease-in-out infinite; }
        .subject      { animation: stellar-drift  18s ease-in-out infinite; transform-origin: center; }
        .ring-roll    { animation: stellar-roll   140s linear     infinite; transform-origin: 152px 124px; }
        .reticle      { animation: stellar-lock   6s   ease-in-out infinite; }
        .twinkle      { animation: stellar-twinkle 4.6s ease-in-out infinite; }
        .tick-num     { animation: stellar-tick   4s steps(1, end) infinite; }
        .signal-bar   { animation: stellar-bar    3s ease-in-out infinite; transform-origin: left center; }
        @media (prefers-reduced-motion: reduce) {
          .live-dot, .subject, .ring-roll, .reticle, .twinkle,
          .tick-num, .signal-bar { animation: none !important; }
        }
      `}</style>

      <div className="relative bg-[#0D1322] border border-white/[0.07] rounded-[14px] overflow-hidden">

        {/* status strip */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 bg-[#10B981] rounded-full live-dot" />
              <span className="relative bg-[#10B981] rounded-full w-1.5 h-1.5" />
            </span>
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#10B981] uppercase">
              Tracking
            </span>
            <span className="w-px h-3 bg-white/10 mx-1" />
            <span className="text-[10px] font-medium tracking-[0.16em] text-[#9BA3B4] uppercase">
              KAZ-1 · 41.7°N 44.8°E
            </span>
          </div>
          <span
            className="text-[10px] tracking-[0.14em] text-[#6B7280] uppercase tick-num"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            21:42:08
          </span>
        </div>

        {/* eyepiece viewport */}
        <div className="relative px-6 pt-6 pb-4">
          <svg viewBox="0 0 304 248" className="w-full h-auto block" fill="none">
            <defs>
              {/* Saturn body — warm tan with subtle terminator */}
              <radialGradient id="saturn-body" cx="42%" cy="40%" r="62%">
                <stop offset="0%"   stopColor="#F2D9A8" />
                <stop offset="35%"  stopColor="#E5C28A" />
                <stop offset="70%"  stopColor="#B8895A" />
                <stop offset="100%" stopColor="#3E2C1C" />
              </radialGradient>
              {/* atmospheric band overlay */}
              <linearGradient id="saturn-bands" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#000" stopOpacity="0" />
                <stop offset="22%"  stopColor="#000" stopOpacity="0.10" />
                <stop offset="36%"  stopColor="#FFF" stopOpacity="0.05" />
                <stop offset="50%"  stopColor="#000" stopOpacity="0.18" />
                <stop offset="65%"  stopColor="#FFF" stopOpacity="0.04" />
                <stop offset="78%"  stopColor="#000" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </linearGradient>
              {/* viewport mask */}
              <clipPath id="eyepiece-clip">
                <circle cx="152" cy="124" r="92" />
              </clipPath>
            </defs>

            {/* viewport black background + interior */}
            <circle cx="152" cy="124" r="92" fill="#06080F" />

            {/* clipped scene */}
            <g clipPath="url(#eyepiece-clip)">
              {/* faint background star field */}
              <g fill="#FFFFFF">
                {STARS.map((s, i) => (
                  <circle
                    key={i}
                    cx={s.cx}
                    cy={s.cy}
                    r={s.r}
                    className="twinkle"
                    style={{
                      ['--o' as string]: s.o,
                      animationDelay: `${s.d}s`,
                    } as React.CSSProperties}
                  />
                ))}
              </g>

              {/* faint celestial-equator drift line */}
              <line
                x1="60" y1="138" x2="244" y2="110"
                stroke="#1F2740" strokeWidth="0.8" strokeDasharray="1 6" opacity="0.7"
              />

              {/* Saturn — drifting subject */}
              <g className="subject" transform="translate(152 124)">
                {/* back half of rings (behind body) */}
                <g transform="rotate(-14)">
                  <ellipse cx="0" cy="0" rx="62" ry="9.5" fill="none" stroke="#D9B886" strokeOpacity="0.55" strokeWidth="1.1" />
                  <ellipse cx="0" cy="0" rx="56" ry="8.6" fill="none" stroke="#C09866" strokeOpacity="0.50" strokeWidth="0.9" />
                  <ellipse cx="0" cy="0" rx="50" ry="7.7" fill="none" stroke="#9C7A4E" strokeOpacity="0.40" strokeWidth="0.6" />
                  {/* mask to keep only back arc visible */}
                  <rect x="-70" y="0" width="140" height="14" fill="#06080F" />
                </g>

                {/* planet body */}
                <ellipse cx="0" cy="0" rx="28" ry="26" fill="url(#saturn-body)" />
                <ellipse cx="0" cy="0" rx="28" ry="26" fill="url(#saturn-bands)" />
                {/* limb darkening + shadow side */}
                <ellipse cx="6" cy="2" rx="28" ry="26" fill="#000" opacity="0.18" />

                {/* front half of rings (in front of body) */}
                <g transform="rotate(-14)">
                  <ellipse cx="0" cy="0" rx="62" ry="9.5" fill="none" stroke="#D9B886" strokeOpacity="0.85" strokeWidth="1.4" />
                  <ellipse cx="0" cy="0" rx="56" ry="8.6" fill="none" stroke="#E8D2A6" strokeOpacity="0.7" strokeWidth="1.0" />
                  {/* Cassini Division */}
                  <ellipse cx="0" cy="0" rx="52.5" ry="8.1" fill="none" stroke="#06080F" strokeWidth="0.9" />
                  <ellipse cx="0" cy="0" rx="50" ry="7.7" fill="none" stroke="#B8895A" strokeOpacity="0.55" strokeWidth="0.7" />
                  {/* keep only front half */}
                  <rect x="-70" y="-14" width="140" height="14" fill="#06080F" />
                </g>

                {/* shadow of body cast on back of rings */}
                <ellipse cx="3" cy="0" rx="22" ry="22" fill="#06080F" opacity="0.28" transform="rotate(-14)" />
              </g>

              {/* reticle crosshairs */}
              <g className="reticle" stroke="#FFD166" strokeOpacity="0.55" strokeWidth="0.8">
                <line x1="60"  y1="124" x2="116" y2="124" />
                <line x1="188" y1="124" x2="244" y2="124" />
                <line x1="152" y1="48"  x2="152" y2="100" />
                <line x1="152" y1="148" x2="152" y2="200" />
                {/* corner brackets */}
                <path d="M118 86 L118 80 L124 80" />
                <path d="M186 86 L186 80 L180 80" />
                <path d="M118 162 L118 168 L124 168" />
                <path d="M186 162 L186 168 L180 168" />
              </g>
            </g>

            {/* viewport rim — bezel ticks */}
            <g className="ring-roll">
              {Array.from({ length: 60 }).map((_, i) => {
                const major = i % 5 === 0;
                const a = (i * 6) * (Math.PI / 180);
                const r1 = 92;
                const r2 = major ? 86 : 89;
                const x1 = 152 + r1 * Math.cos(a - Math.PI / 2);
                const y1 = 124 + r1 * Math.sin(a - Math.PI / 2);
                const x2 = 152 + r2 * Math.cos(a - Math.PI / 2);
                const y2 = 124 + r2 * Math.sin(a - Math.PI / 2);
                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={major ? '#3A4256' : '#252B40'}
                    strokeWidth={major ? 0.9 : 0.5}
                  />
                );
              })}
            </g>

            {/* viewport bezel ring */}
            <circle cx="152" cy="124" r="92" stroke="#1F2740" strokeWidth="1" fill="none" />
            <circle cx="152" cy="124" r="94.5" stroke="#11172A" strokeWidth="2.5" fill="none" />

            {/* corner labels — RA / DEC / ALT / AZ */}
            <g
              fontSize="8"
              letterSpacing="0.16em"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <text x="14"  y="20"  fill="#6B7280">RA</text>
              <text x="14"  y="32"  fill="#E5E7EB">20ʰ 31ᵐ</text>

              <text x="290" y="20"  fill="#6B7280" textAnchor="end">DEC</text>
              <text x="290" y="32"  fill="#E5E7EB" textAnchor="end">−18° 04′</text>

              <text x="14"  y="220" fill="#6B7280">ALT</text>
              <text x="14"  y="232" fill="#FFD166">24° 12′</text>

              <text x="290" y="220" fill="#6B7280" textAnchor="end">AZ</text>
              <text x="290" y="232" fill="#E5E7EB" textAnchor="end">142° SE</text>
            </g>

            {/* signal/lock indicator */}
            <g transform="translate(122 240)">
              <text x="0" y="0" fontSize="7" fill="#6B7280" letterSpacing="0.18em" style={{ fontFamily: 'var(--font-mono)' }}>
                LOCK
              </text>
              <g transform="translate(28 -5)">
                <rect x="0"  y="0" width="3" height="6" fill="#10B981" className="signal-bar" />
                <rect x="5"  y="0" width="3" height="6" fill="#10B981" />
                <rect x="10" y="0" width="3" height="6" fill="#10B981" />
                <rect x="15" y="0" width="3" height="6" fill="#10B981" opacity="0.3" />
              </g>
            </g>
          </svg>
        </div>

        {/* target / verdict band */}
        <div className="flex items-end justify-between gap-4 px-5 pt-1 pb-5 border-t border-white/[0.06]">
          <div>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-[#6B7280] uppercase mb-1">
              Target
            </div>
            <div
              className="text-[36px] leading-none text-white font-medium"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Saturn.
            </div>
          </div>
          <div className="text-right pb-1">
            <div className="text-[10px] font-semibold tracking-[0.22em] text-[#6B7280] uppercase mb-1.5">
              Verdict
            </div>
            <div className="flex items-baseline gap-1.5 justify-end">
              <span
                className="text-[12px] tracking-[0.2em] text-[#10B981] font-semibold uppercase"
              >
                Go
              </span>
              <span
                className="text-[16px] text-[#FFD166] tabular-nums"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                87<span className="text-[#9BA3B4] text-[12px]">%</span>
              </span>
            </div>
          </div>
        </div>

        {/* metric strip */}
        <div className="grid grid-cols-4 border-t border-white/[0.06]">
          {[
            { label: 'Mag',     val: '0.7',   unit: ''      },
            { label: 'Dist',    val: '1.34',  unit: 'AU'    },
            { label: 'Diam',    val: '18.3',  unit: '″'     },
            { label: 'Phase',   val: '99',    unit: '%'     },
          ].map((m, i) => (
            <div
              key={m.label}
              className={`px-4 py-3 ${i < 3 ? 'border-r border-white/[0.06]' : ''}`}
            >
              <div className="text-[9px] font-semibold tracking-[0.2em] text-[#6B7280] uppercase mb-1.5">
                {m.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[15px] tabular-nums text-white"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {m.val}
                </span>
                {m.unit && (
                  <span
                    className="text-[10px] text-[#6B7280]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {m.unit}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* footer ticker */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-[#0A0F1C]">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[#6B7280] uppercase">
            Transit
          </span>
          <span
            className="text-[11px] tabular-nums text-[#E5E7EB]"
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
          >
            21:42 → 03:18 · meridian 00:30
          </span>
        </div>
      </div>

      <div
        className="mt-3 flex items-center justify-between px-1 text-[10px] tracking-[0.16em] text-[#4A5269] uppercase"
      >
        <span style={{ fontFamily: 'var(--font-mono)' }}>JPL Horizons · Open-Meteo · Astronomy-Engine</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>v1.0</span>
      </div>
    </div>
  );
}
