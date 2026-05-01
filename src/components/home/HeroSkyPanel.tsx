'use client';

/**
 * Hero subject — a single, large, slowly-breathing Moon.
 * No chrome, no panel, no telemetry overload. One specimen on black.
 */

export default function HeroSkyPanel() {
  return (
    <div className="relative w-full max-w-[460px] mx-auto select-none">
      <style jsx>{`
        @keyframes moon-breathe {
          0%, 100% { transform: scale(1)    translateY(0); }
          50%      { transform: scale(1.012) translateY(-2px); }
        }
        @keyframes moon-twinkle {
          0%, 100% { opacity: var(--o, 0.5); }
          50%      { opacity: calc(var(--o, 0.5) * 0.35); }
        }
        .moon-breathe { animation: moon-breathe 8s ease-in-out infinite; transform-origin: center; }
        .twinkle      { animation: moon-twinkle 5s   ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .moon-breathe, .twinkle { animation: none !important; }
        }
      `}</style>

      <svg viewBox="0 0 460 480" className="w-full h-auto block" fill="none">
        <defs>
          <radialGradient id="moon-body" cx="58%" cy="40%" r="65%">
            <stop offset="0%"   stopColor="#F5F0E6" />
            <stop offset="40%"  stopColor="#D8CFBE" />
            <stop offset="78%"  stopColor="#8E8676" />
            <stop offset="100%" stopColor="#1F1B14" />
          </radialGradient>
          <linearGradient id="terminator" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.85" />
            <stop offset="22%"  stopColor="#000" stopOpacity="0.55" />
            <stop offset="38%"  stopColor="#000" stopOpacity="0.18" />
            <stop offset="55%"  stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="earthshine" cx="20%" cy="55%" r="55%">
            <stop offset="0%"   stopColor="#3B4358" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#3B4358" stopOpacity="0" />
          </radialGradient>
          <clipPath id="moon-clip">
            <circle cx="230" cy="220" r="160" />
          </clipPath>
        </defs>

        {/* faint background stars — far from the subject */}
        <g fill="#FFFFFF">
          {[
            { cx:  40, cy:  60, r: 0.8, o: 0.55, d: 0.0 },
            { cx: 410, cy:  90, r: 0.7, o: 0.5,  d: 1.2 },
            { cx:  60, cy: 380, r: 0.6, o: 0.45, d: 2.1 },
            { cx: 420, cy: 420, r: 0.7, o: 0.55, d: 0.6 },
            { cx: 220, cy:  18, r: 0.5, o: 0.4,  d: 2.7 },
            { cx:  18, cy: 220, r: 0.5, o: 0.4,  d: 1.5 },
            { cx: 442, cy: 240, r: 0.5, o: 0.4,  d: 3.2 },
          ].map((s, i) => (
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

        <g className="moon-breathe">
          {/* base body */}
          <circle cx="230" cy="220" r="160" fill="url(#moon-body)" />

          {/* maria + craters, clipped to the disk */}
          <g clipPath="url(#moon-clip)" opacity="0.85">
            {/* Mare Imbrium (upper left) */}
            <ellipse cx="195" cy="160" rx="32" ry="22" fill="#3F3A2E" opacity="0.45" />
            {/* Mare Serenitatis (upper center-right) */}
            <ellipse cx="258" cy="170" rx="22" ry="20" fill="#3A3528" opacity="0.55" />
            {/* Mare Tranquillitatis (right) */}
            <ellipse cx="288" cy="208" rx="26" ry="22" fill="#3D3729" opacity="0.5" />
            {/* Mare Fecunditatis (lower right) */}
            <ellipse cx="304" cy="248" rx="18" ry="22" fill="#3A3528" opacity="0.4" />
            {/* Mare Nubium / Humorum (lower center) */}
            <ellipse cx="220" cy="282" rx="28" ry="18" fill="#3C3629" opacity="0.42" />
            {/* Oceanus Procellarum (left side) */}
            <ellipse cx="170" cy="230" rx="22" ry="44" fill="#3D3729" opacity="0.4" transform="rotate(-12 170 230)" />

            {/* Tycho — bright crater with subtle ray */}
            <circle cx="222" cy="305" r="3.5" fill="#F5F0E6" opacity="0.55" />
            <circle cx="222" cy="305" r="6"   fill="#F5F0E6" opacity="0.12" />

            {/* Copernicus */}
            <circle cx="208" cy="218" r="2.8" fill="#F5F0E6" opacity="0.4" />
            <circle cx="208" cy="218" r="4.5" fill="#F5F0E6" opacity="0.10" />

            {/* small crater field */}
            <circle cx="270" cy="140" r="1.6" fill="#1F1B14" opacity="0.5" />
            <circle cx="320" cy="180" r="1.2" fill="#1F1B14" opacity="0.5" />
            <circle cx="180" cy="280" r="1.4" fill="#1F1B14" opacity="0.45" />
            <circle cx="252" cy="232" r="1.0" fill="#1F1B14" opacity="0.4" />
            <circle cx="295" cy="278" r="1.4" fill="#1F1B14" opacity="0.45" />
            <circle cx="240" cy="118" r="1.2" fill="#1F1B14" opacity="0.4" />

            {/* terminator on the left edge — waxing gibbous */}
            <rect x="70" y="60" width="120" height="320" fill="url(#terminator)" />

            {/* earthshine on the dark sliver */}
            <rect x="70" y="60" width="80" height="320" fill="url(#earthshine)" />

            {/* limb darkening — soft inner shadow ring */}
            <circle cx="230" cy="220" r="160" fill="none" stroke="#000" strokeWidth="14" opacity="0.18" />
          </g>

          {/* outer ghost ring */}
          <circle cx="230" cy="220" r="160.5" stroke="#1F2740" strokeWidth="1" fill="none" />
        </g>

        {/* single label — bottom right */}
        <g style={{ fontFamily: 'var(--font-mono)' }}>
          <line x1="230" y1="395" x2="230" y2="412" stroke="#3A4256" strokeWidth="1" />
          <text
            x="230"
            y="432"
            textAnchor="middle"
            fontSize="10"
            letterSpacing="0.28em"
            fill="#6B7280"
          >
            WAXING GIBBOUS
          </text>
          <text
            x="230"
            y="454"
            textAnchor="middle"
            fontSize="10"
            letterSpacing="0.18em"
            fill="#9BA3B4"
          >
            87% · ALT 42° · TONIGHT
          </text>
        </g>
      </svg>
    </div>
  );
}
