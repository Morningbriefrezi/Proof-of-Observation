'use client';


const PLANETS: { id: string; label: string; cx: number; cy: number; r: number; color: string }[] = [
  { id: 'jup', label: 'JUP', cx: 158, cy:  92, r: 3.4, color: '#FFD166' },
  { id: 'sat', label: 'SAT', cx: 220, cy: 138, r: 3.0, color: '#E0B86C' },
  { id: 'mar', label: 'MAR', cx:  88, cy: 154, r: 2.6, color: '#D97757' },
  { id: 'ven', label: 'VEN', cx: 196, cy:  76, r: 3.2, color: '#F5F5F0' },
];

const STARS: { cx: number; cy: number; r: number; o: number }[] = [
  { cx:  72, cy:  64, r: 0.7, o: 0.6 },
  { cx: 116, cy:  44, r: 0.5, o: 0.4 },
  { cx: 184, cy:  60, r: 0.6, o: 0.5 },
  { cx: 244, cy: 102, r: 0.7, o: 0.6 },
  { cx:  60, cy: 124, r: 0.5, o: 0.4 },
  { cx: 142, cy: 168, r: 0.6, o: 0.5 },
  { cx: 232, cy: 188, r: 0.5, o: 0.4 },
  { cx:  96, cy: 200, r: 0.7, o: 0.5 },
  { cx: 176, cy: 132, r: 0.4, o: 0.35 },
  { cx: 208, cy:  44, r: 0.5, o: 0.45 },
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
        @keyframes stellar-sweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes stellar-tick {
          0%, 92%, 100% { opacity: 1; }
          94%, 98%      { opacity: 0.55; }
        }
        @keyframes stellar-twinkle {
          0%, 100% { opacity: var(--o, 0.5); }
          50%      { opacity: calc(var(--o, 0.5) * 0.4); }
        }
        .live-dot   { animation: stellar-pulse 1.8s ease-in-out infinite; }
        .sweep-arm  { animation: stellar-sweep 14s linear infinite; transform-origin: 152px 124px; }
        .tick-num   { animation: stellar-tick 4s steps(1, end) infinite; }
        .twinkle    { animation: stellar-twinkle 4.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .live-dot, .sweep-arm, .tick-num, .twinkle { animation: none !important; }
        }
      `}</style>

      {/* outer frame — single panel, no nested cards */}
      <div className="relative bg-[#0D1322] border border-white/[0.07] rounded-[14px] overflow-hidden">

        {/* status strip */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 bg-[#10B981] rounded-full live-dot" />
              <span className="relative bg-[#10B981] rounded-full w-1.5 h-1.5" />
            </span>
            <span
              className="text-[10px] font-semibold tracking-[0.18em] text-[#10B981] uppercase"
            >
              Live
            </span>
            <span className="w-px h-3 bg-white/10 mx-1" />
            <span
              className="text-[10px] font-medium tracking-[0.16em] text-[#9BA3B4] uppercase"
            >
              Tonight · Kazbegi
            </span>
          </div>
          <span
            className="text-[10px] tracking-[0.14em] text-[#6B7280] uppercase tick-num"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            21:42
          </span>
        </div>

        {/* sky dome */}
        <div className="relative px-5 pt-5 pb-3">
          <svg viewBox="0 0 304 248" className="w-full h-auto" fill="none">
            {/* faint horizon grid */}
            <g stroke="#1B2238" strokeWidth="1">
              <line x1="0"   y1="124" x2="304" y2="124" />
              <line x1="152" y1="0"   x2="152" y2="248" />
            </g>

            {/* concentric altitude rings (90° / 60° / 30°) */}
            <g stroke="#1F2740" strokeWidth="1" fill="none">
              <circle cx="152" cy="124" r="116" strokeDasharray="2 4" opacity="0.55" />
              <circle cx="152" cy="124" r="78"  strokeDasharray="2 4" opacity="0.4" />
              <circle cx="152" cy="124" r="40"  strokeDasharray="2 4" opacity="0.3" />
            </g>

            {/* cardinal markers */}
            <g
              fill="#4A5269"
              fontSize="8"
              fontWeight="600"
              letterSpacing="0.15em"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <text x="152" y="10"  textAnchor="middle">N</text>
              <text x="298" y="127" textAnchor="end">E</text>
              <text x="152" y="244" textAnchor="middle">S</text>
              <text x="6"   y="127" textAnchor="start">W</text>
            </g>

            {/* faint background stars */}
            <g fill="#FFFFFF">
              {STARS.map((s, i) => (
                <circle
                  key={i}
                  cx={s.cx}
                  cy={s.cy}
                  r={s.r}
                  className="twinkle"
                  style={{ ['--o' as string]: s.o, animationDelay: `${(i * 0.4) % 4}s` } as React.CSSProperties}
                />
              ))}
            </g>

            {/* radar sweep arm — wedge of brass, very subtle */}
            <g className="sweep-arm">
              <defs>
                <linearGradient id="sweep-fade" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFD166" stopOpacity="0.18" />
                  <stop offset="60%" stopColor="#FFD166" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#FFD166" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M152 124 L268 124 A116 116 0 0 0 261 91 Z"
                fill="url(#sweep-fade)"
              />
              <line
                x1="152"
                y1="124"
                x2="268"
                y2="124"
                stroke="#FFD166"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
            </g>

            {/* planet markers — labeled, mono */}
            {PLANETS.map((p) => (
              <g key={p.id}>
                <circle cx={p.cx} cy={p.cy} r={p.r + 4} fill={p.color} fillOpacity="0.08" />
                <circle cx={p.cx} cy={p.cy} r={p.r} fill={p.color} />
                <text
                  x={p.cx + p.r + 5}
                  y={p.cy + 3}
                  fontSize="8"
                  fill="#9BA3B4"
                  letterSpacing="0.12em"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {p.label}
                </text>
              </g>
            ))}

            {/* zenith crosshair */}
            <g stroke="#2A3251" strokeWidth="1" opacity="0.7">
              <line x1="146" y1="124" x2="158" y2="124" />
              <line x1="152" y1="118" x2="152" y2="130" />
              <circle cx="152" cy="124" r="2" fill="#2A3251" />
            </g>
          </svg>
        </div>

        {/* verdict */}
        <div className="px-5 pt-2 pb-5 border-t border-white/[0.06]">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <div
                className="text-[10px] font-semibold tracking-[0.22em] text-[#6B7280] uppercase mb-1"
              >
                Verdict
              </div>
              <div
                className="text-[44px] leading-none text-white font-medium"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
              >
                Go.
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-[10px] font-semibold tracking-[0.22em] text-[#6B7280] uppercase mb-1.5"
              >
                Confidence
              </div>
              <div
                className="text-[18px] text-[#FFD166] tabular-nums"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                87<span className="text-[#9BA3B4] text-[14px]">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* metric strip */}
        <div className="grid grid-cols-4 border-t border-white/[0.06]">
          {[
            { label: 'Cloud',    val: '4',    unit: '%',    tone: '#10B981' },
            { label: 'Moon',     val: '12',   unit: '%',    tone: '#9BA3B4' },
            { label: 'Seeing',   val: '2.1',  unit: '"',    tone: '#FFD166' },
            { label: 'Transp.',  val: '8',    unit: '/10',  tone: '#FFD166' },
          ].map((m, i) => (
            <div
              key={m.label}
              className={`px-4 py-3 ${i < 3 ? 'border-r border-white/[0.06]' : ''}`}
            >
              <div
                className="text-[9px] font-semibold tracking-[0.2em] text-[#6B7280] uppercase mb-1.5"
              >
                {m.label}
              </div>
              <div className="flex items-baseline gap-0.5">
                <span
                  className="text-[16px] tabular-nums"
                  style={{ fontFamily: 'var(--font-mono)', color: m.tone }}
                >
                  {m.val}
                </span>
                <span
                  className="text-[10px] text-[#6B7280]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {m.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* footer ticker */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-[#0A0F1C]">
          <span
            className="text-[10px] font-semibold tracking-[0.2em] text-[#6B7280] uppercase"
          >
            Next clear window
          </span>
          <span
            className="text-[11px] tabular-nums text-[#E5E7EB]"
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
          >
            21:42 → 03:18
          </span>
        </div>
      </div>

      {/* tiny attribution under panel */}
      <div
        className="mt-3 flex items-center justify-between px-1 text-[10px] tracking-[0.16em] text-[#4A5269] uppercase"
      >
        <span style={{ fontFamily: 'var(--font-mono)' }}>Open-Meteo · Astronomy-Engine</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>v1.0</span>
      </div>
    </div>
  );
}
