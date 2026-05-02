'use client';

/**
 * Hero — a live cosmic orrery. Sun at center, six planets orbiting at
 * proportional speeds, faint dashed orbital paths, a zodiacal outer
 * ring with degree ticks, deep nebula vignette, twinkling starfield.
 */

const CX = 240;
const CY = 240;

// Orbit radii (visually calibrated, not to scale)
const ORBITS: { r: number; period: number; phase: number }[] = [
  { r:  46, period: 10,  phase:  20  }, // Mercury
  { r:  72, period: 16,  phase: 130  }, // Venus
  { r: 100, period: 22,  phase: 245  }, // Earth
  { r: 128, period: 30,  phase:  60  }, // Mars
  { r: 168, period: 50,  phase: 290  }, // Jupiter
  { r: 206, period: 80,  phase: 200  }, // Saturn
];

// Planet visual data
const PLANETS = [
  { name: 'Mercury', body: 1.6, color: '#A89888', glow: 0.18 },
  { name: 'Venus',   body: 3.0, color: '#E8C77C', glow: 0.22 },
  { name: 'Earth',   body: 3.4, color: '#5C8FCC', glow: 0.28 },
  { name: 'Mars',    body: 2.2, color: '#C56542', glow: 0.18 },
  { name: 'Jupiter', body: 6.4, color: '#D4A974', glow: 0.34 },
  { name: 'Saturn',  body: 5.4, color: '#E2C78A', glow: 0.30 },
];

const STARS: { cx: number; cy: number; r: number; o: number; d: number }[] = [
  { cx:  28, cy:  44, r: 0.8, o: 0.65, d: 0.0 },
  { cx: 444, cy:  68, r: 0.7, o: 0.6,  d: 1.4 },
  { cx: 130, cy:  18, r: 0.5, o: 0.5,  d: 2.7 },
  { cx: 372, cy:  18, r: 0.5, o: 0.45, d: 0.9 },
  { cx: 462, cy: 196, r: 0.7, o: 0.6,  d: 2.1 },
  { cx:  18, cy: 224, r: 0.6, o: 0.5,  d: 3.4 },
  { cx: 240, cy:  10, r: 0.4, o: 0.4,  d: 1.8 },
  { cx: 196, cy: 460, r: 0.5, o: 0.45, d: 0.4 },
  { cx:  44, cy: 392, r: 0.7, o: 0.55, d: 2.5 },
  { cx: 442, cy: 412, r: 0.5, o: 0.45, d: 1.1 },
  { cx: 460, cy: 312, r: 0.4, o: 0.4,  d: 2.3 },
  { cx:  20, cy: 332, r: 0.5, o: 0.45, d: 1.6 },
  { cx: 320, cy: 460, r: 0.5, o: 0.45, d: 2.9 },
  { cx:  64, cy: 112, r: 0.4, o: 0.4,  d: 0.2 },
];

export default function HeroSkyPanel() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto select-none">
      <style jsx>{`
        @keyframes orrery-orbit {
          from { transform: rotate(var(--from, 0deg)); }
          to   { transform: rotate(calc(var(--from, 0deg) + 360deg)); }
        }
        @keyframes orrery-moon {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orrery-sun {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.04); }
        }
        @keyframes orrery-twinkle {
          0%, 100% { opacity: var(--o, 0.5); }
          50%      { opacity: calc(var(--o, 0.5) * 0.4); }
        }
        @keyframes orrery-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orrery-ring-pulse {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 0.55; }
        }

        .orbit  {
          animation: orrery-orbit linear infinite;
          transform-origin: ${CX}px ${CY}px;
          transform-box: view-box;
        }
        .moon-spin {
          animation: orrery-moon 4s linear infinite;
          transform-origin: 0 0;
          transform-box: fill-box;
        }
        .sun-pulse  { animation: orrery-sun 4.5s ease-in-out infinite; transform-origin: ${CX}px ${CY}px; transform-box: view-box; }
        .star       { animation: orrery-twinkle 5s ease-in-out infinite; }
        .zodiac     {
          animation: orrery-spin 480s linear infinite;
          transform-origin: ${CX}px ${CY}px;
          transform-box: view-box;
        }
        .ring-pulse { animation: orrery-ring-pulse 6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .orbit, .moon-spin, .sun-pulse, .star,
          .zodiac, .ring-pulse { animation: none !important; }
        }
      `}</style>

      <svg viewBox="0 0 480 480" className="w-full h-auto block" fill="none">
        <defs>
          {/* deep nebula tint at the very center */}
          <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#2A1A4A" stopOpacity="0.45" />
            <stop offset="40%"  stopColor="#1A1430" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0A0E1A" stopOpacity="0" />
          </radialGradient>
          {/* sun core */}
          <radialGradient id="sun-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFCEC" />
            <stop offset="55%"  stopColor="#FFD166" />
            <stop offset="100%" stopColor="#A06A18" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sun-corona" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFD166" stopOpacity="0.35" />
            <stop offset="55%"  stopColor="#FFD166" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#FFD166" stopOpacity="0" />
          </radialGradient>
          {/* planet shading — used for each planet via filter */}
          {PLANETS.map((p, i) => (
            <radialGradient key={p.name} id={`planet-${i}`} cx="38%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="35%"  stopColor={p.color} />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </radialGradient>
          ))}
          {/* Saturn ring */}
          <linearGradient id="saturn-ring" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#9C7A4E" stopOpacity="0" />
            <stop offset="50%"  stopColor="#E8D2A6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9C7A4E" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* deep nebula glow center */}
        <circle cx={CX} cy={CY} r="240" fill="url(#nebula)" />

        {/* background stars */}
        <g fill="#FFFFFF">
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              className="star"
              style={{
                ['--o' as string]: s.o,
                animationDelay: `${s.d}s`,
              } as React.CSSProperties}
            />
          ))}
        </g>

        {/* zodiac outer ring — slowly rotating tick band */}
        <g className="zodiac">
          {/* outer thin circle */}
          <circle cx={CX} cy={CY} r="232" stroke="#1A2238" strokeWidth="0.6" />
          <circle cx={CX} cy={CY} r="222" stroke="#11172A" strokeWidth="0.5" />
          {/* 60 ticks — major every 5 (12 zodiac signs) */}
          {Array.from({ length: 72 }).map((_, i) => {
            const major = i % 6 === 0;
            const a = (i * 5) * (Math.PI / 180);
            const r1 = 232;
            const r2 = major ? 218 : 226;
            const x1 = CX + r1 * Math.cos(a - Math.PI / 2);
            const y1 = CY + r1 * Math.sin(a - Math.PI / 2);
            const x2 = CX + r2 * Math.cos(a - Math.PI / 2);
            const y2 = CY + r2 * Math.sin(a - Math.PI / 2);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={major ? '#3A4256' : '#1F2740'}
                strokeWidth={major ? 0.9 : 0.5}
              />
            );
          })}
          {/* zodiac glyphs — letters at 30° intervals */}
          <g style={{ fontFamily: 'var(--font-mono)' }} fill="#4A5269" fontSize="9" letterSpacing="0.18em">
            {['ARI','TAU','GEM','CNC','LEO','VIR','LIB','SCO','SGR','CAP','AQR','PSC'].map((sign, i) => {
              const a = (i * 30) * (Math.PI / 180);
              const r = 244;
              const x = CX + r * Math.cos(a - Math.PI / 2);
              const y = CY + r * Math.sin(a - Math.PI / 2) + 3;
              return <text key={sign} x={x} y={y} textAnchor="middle">{sign}</text>;
            })}
          </g>
        </g>

        {/* orbital paths — faint dashed */}
        <g stroke="#1F2740" fill="none" strokeWidth="0.6" strokeDasharray="1.5 4">
          {ORBITS.map((o, i) => (
            <circle key={i} cx={CX} cy={CY} r={o.r} />
          ))}
        </g>

        {/* sun corona + core */}
        <circle cx={CX} cy={CY} r="36" fill="url(#sun-corona)" className="sun-pulse" />
        <circle cx={CX} cy={CY} r="14" fill="url(#sun-core)" />
        <circle cx={CX} cy={CY} r="6" fill="#FFFCEC" />

        {/* planets */}
        {ORBITS.map((o, i) => {
          const p = PLANETS[i];
          const isEarth  = p.name === 'Earth';
          const isSaturn = p.name === 'Saturn';
          return (
            <g
              key={p.name}
              className="orbit"
              style={{
                ['--from' as string]: `${o.phase}deg`,
                animationDuration: `${o.period}s`,
              } as React.CSSProperties}
            >
              {/* planet sits at (CX + r, CY) — group rotation moves it around the sun */}
              <g transform={`translate(${CX + o.r} ${CY})`}>
                {/* glow halo */}
                <circle
                  cx="0" cy="0"
                  r={p.body * 2}
                  fill={p.color}
                  opacity={p.glow}
                />
                {/* Saturn rings — drawn before body so back arc shows behind */}
                {isSaturn && (
                  <g transform="rotate(-18)">
                    <ellipse cx="0" cy="0" rx={p.body * 2.6} ry={p.body * 0.7} fill="none" stroke="url(#saturn-ring)" strokeWidth="1.4" />
                    <ellipse cx="0" cy="0" rx={p.body * 2.2} ry={p.body * 0.6} fill="none" stroke="url(#saturn-ring)" strokeWidth="0.8" />
                  </g>
                )}
                {/* planet body */}
                <circle cx="0" cy="0" r={p.body} fill={`url(#planet-${i})`} />
                {/* Earth's moon */}
                {isEarth && (
                  <g className="moon-spin">
                    <circle cx="9" cy="0" r="1" fill="#C8C8D0" />
                  </g>
                )}
                {/* Saturn ring front arc — drawn after body */}
                {isSaturn && (
                  <g transform="rotate(-18)" clipPath="inset(50% 0 0 0)">
                    <ellipse cx="0" cy="0" rx={p.body * 2.6} ry={p.body * 0.7} fill="none" stroke="#E8D2A6" strokeOpacity="0.6" strokeWidth="1.2" />
                  </g>
                )}
              </g>
            </g>
          );
        })}

        {/* center crosshair — current epoch reference */}
        <g stroke="#3A4256" strokeWidth="0.6" opacity="0.55">
          <line x1={CX - 226} y1={CY} x2={CX - 218} y2={CY} />
          <line x1={CX + 218} y1={CY} x2={CX + 226} y2={CY} />
          <line x1={CX} y1={CY - 226} x2={CX} y2={CY - 218} />
          <line x1={CX} y1={CY + 218} x2={CX} y2={CY + 226} />
        </g>

        {/* today marker — small triangle pointing in at top of zodiac ring */}
        <g transform={`translate(${CX} ${CY - 232})`}>
          <path d="M 0 -6 L -3.5 1 L 3.5 1 Z" fill="#FFD166" opacity="0.85" />
          <line x1="0" y1="2" x2="0" y2="6" stroke="#FFD166" strokeWidth="0.8" opacity="0.5" />
        </g>

        {/* corner stamps */}
        <g style={{ fontFamily: 'var(--font-mono)' }}>
          <text x="20" y="28" fontSize="9" fill="#6B7280" letterSpacing="0.22em">ORRERY</text>
          <text x="20" y="44" fontSize="8" fill="#4A5269" letterSpacing="0.16em">2026 · MAY · 02</text>

          <text x="460" y="28" fontSize="9" fill="#6B7280" letterSpacing="0.22em" textAnchor="end">EPOCH J2000</text>
          <text x="460" y="44" fontSize="8" fill="#4A5269" letterSpacing="0.16em" textAnchor="end">HELIOCENTRIC</text>

          <text x="20" y="468" fontSize="8" fill="#3A4256" letterSpacing="0.2em">
            ☿ ♀ ♁ ♂ ♃ ♄
          </text>
          <text x="460" y="468" fontSize="8" fill="#3A4256" letterSpacing="0.2em" textAnchor="end">
            STELLAR · LIVE
          </text>
        </g>
      </svg>
    </div>
  );
}
