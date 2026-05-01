'use client';

/**
 * Hero scene — real photograph of M31 (Adam Evans / CC BY 2.0) with a
 * white refractor telescope (Sky-Watcher Esprit style) aimed at it. A
 * photon travels down the sight line from the galaxy core to the
 * eyepiece every 6s.
 */

const STARS: { cx: number; cy: number; r: number; o: number; d: number }[] = [
  { cx:  40, cy:  44, r: 0.9, o: 0.75, d: 0.0 },
  { cx: 392, cy:  68, r: 0.8, o: 0.65, d: 1.4 },
  { cx: 320, cy:  32, r: 0.5, o: 0.5,  d: 2.7 },
  { cx: 422, cy: 156, r: 0.7, o: 0.6,  d: 2.1 },
  { cx:  30, cy: 224, r: 0.6, o: 0.5,  d: 3.4 },
  { cx: 248, cy:  18, r: 0.4, o: 0.4,  d: 1.8 },
  { cx: 184, cy: 320, r: 0.5, o: 0.45, d: 0.4 },
  { cx:  64, cy: 376, r: 0.7, o: 0.55, d: 2.5 },
  { cx: 444, cy:  18, r: 0.5, o: 0.45, d: 3.0 },
  { cx: 462, cy: 392, r: 0.5, o: 0.45, d: 2.9 },
  { cx: 274, cy:  78, r: 0.4, o: 0.4,  d: 0.2 },
];

export default function HeroSkyPanel() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto select-none">
      <style jsx>{`
        @keyframes hero-twinkle {
          0%, 100% { opacity: var(--o, 0.5); }
          50%      { opacity: calc(var(--o, 0.5) * 0.35); }
        }
        @keyframes hero-track {
          0%, 100% { transform: rotate(-44.6deg); }
          50%      { transform: rotate(-45.4deg); }
        }
        @keyframes hero-photon {
          0%   { transform: translate(150px, 168px); opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 1; }
          100% { transform: translate(355px, 358px); opacity: 0; }
        }
        @keyframes hero-photon-trail {
          0%   { transform: translate(150px, 168px); opacity: 0; }
          12%  { opacity: 0.5; }
          92%  { opacity: 0.5; }
          100% { transform: translate(355px, 358px); opacity: 0; }
        }
        @keyframes hero-reticle {
          0%, 88%, 100% { opacity: 0.45; }
          92%, 96%      { opacity: 1; }
        }
        @keyframes hero-finder-led {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 0.4; }
        }

        .star    { animation: hero-twinkle 5s ease-in-out infinite; }
        .scope   { animation: hero-track 8s ease-in-out infinite;
                   transform-origin: 360px 400px; transform-box: view-box; }
        .photon  { animation: hero-photon 6s ease-in infinite;
                   transform-box: view-box; }
        .photon-trail-a { animation: hero-photon-trail 6s ease-in infinite;
                          animation-delay: 0.3s; transform-box: view-box; }
        .photon-trail-b { animation: hero-photon-trail 6s ease-in infinite;
                          animation-delay: 0.6s; transform-box: view-box; }
        .reticle { animation: hero-reticle 4s ease-in-out infinite; }
        .led     { animation: hero-finder-led 2.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .star, .scope, .photon, .photon-trail-a, .photon-trail-b,
          .reticle, .led { animation: none !important; }
        }
      `}</style>

      <svg viewBox="0 0 480 480" className="w-full h-auto block" fill="none">
        <defs>
          {/* radial mask to soften the photo's rectangular edges */}
          <radialGradient id="andromeda-mask" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFF" stopOpacity="1" />
            <stop offset="55%"  stopColor="#FFF" stopOpacity="0.95" />
            <stop offset="80%"  stopColor="#FFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
          </radialGradient>
          <mask id="andromeda-fade" maskUnits="userSpaceOnUse">
            <ellipse cx="150" cy="168" rx="220" ry="125" fill="url(#andromeda-mask)" />
          </mask>

          {/* ─── White refractor materials ─────────────────────────── */}
          {/* glossy white tube — cylindrical shading */}
          <linearGradient id="tube-white" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#5A5C66" />
            <stop offset="12%"  stopColor="#A8ABB5" />
            <stop offset="32%"  stopColor="#E8E9ED" />
            <stop offset="50%"  stopColor="#FBFBFD" />
            <stop offset="68%"  stopColor="#E2E4E8" />
            <stop offset="88%"  stopColor="#9A9CA5" />
            <stop offset="100%" stopColor="#3F4148" />
          </linearGradient>
          {/* mount head — slightly different white tone */}
          <linearGradient id="mount-white" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7C7E88" />
            <stop offset="50%"  stopColor="#F0F1F4" />
            <stop offset="100%" stopColor="#5A5C66" />
          </linearGradient>
          {/* red anodized — saddle + ring clamps */}
          <linearGradient id="anodized-red" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7A1A1F" />
            <stop offset="50%"  stopColor="#D43A42" />
            <stop offset="100%" stopColor="#6E141A" />
          </linearGradient>
          {/* chrome — focuser knobs, counterweight bar */}
          <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#D8DAE0" />
            <stop offset="50%"  stopColor="#9094A0" />
            <stop offset="100%" stopColor="#42454D" />
          </linearGradient>
          {/* objective lens — deep multi-coated optic */}
          <radialGradient id="objective-lens" cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor="#3B5A78" stopOpacity="0.85" />
            <stop offset="40%"  stopColor="#15263A" />
            <stop offset="80%"  stopColor="#070C16" />
            <stop offset="100%" stopColor="#020409" />
          </radialGradient>
          {/* brass rim */}
          <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7A5520" />
            <stop offset="50%"  stopColor="#FFD166" />
            <stop offset="100%" stopColor="#5C3F18" />
          </linearGradient>
          {/* tripod leg */}
          <linearGradient id="tripod-leg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#15181F" />
            <stop offset="50%"  stopColor="#3F4248" />
            <stop offset="100%" stopColor="#15181F" />
          </linearGradient>
          {/* black anodized — tube rings, focuser body */}
          <linearGradient id="anodized-black" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#0A0C12" />
            <stop offset="50%"  stopColor="#222530" />
            <stop offset="100%" stopColor="#0A0C12" />
          </linearGradient>
        </defs>

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

        {/* faint horizon line */}
        <line x1="20" y1="446" x2="460" y2="446" stroke="#1B2238" strokeWidth="1" strokeDasharray="2 6" opacity="0.55" />

        {/* ═══════════════ ANDROMEDA PHOTO ═══════════════ */}
        <g mask="url(#andromeda-fade)">
          <image
            href="/hero/andromeda.jpg"
            x="-60"
            y="20"
            width="420"
            height="276"
            preserveAspectRatio="xMidYMid slice"
            opacity="0.92"
          />
        </g>

        {/* reticle around galaxy core */}
        <g className="reticle" stroke="#FFD166" strokeWidth="0.9" strokeOpacity="0.5" transform="translate(150 168)">
          <path d="M -38 -16 L -46 -16 L -46 -8" />
          <path d="M  38 -16 L  46 -16 L  46 -8" />
          <path d="M -38  16 L -46  16 L -46  8" />
          <path d="M  38  16 L  46  16 L  46  8" />
        </g>

        {/* M31 label */}
        <g style={{ fontFamily: 'var(--font-mono)' }}>
          <line x1="288" y1="118" x2="304" y2="106" stroke="#3A4256" strokeWidth="1" strokeOpacity="0.7" />
          <text x="308" y="100" fontSize="9" fill="#6B7280" letterSpacing="0.22em">M31</text>
          <text x="308" y="114" fontSize="9" fill="#9BA3B4" letterSpacing="0.14em">ANDROMEDA</text>
          <text x="308" y="126" fontSize="8" fill="#4A5269" letterSpacing="0.18em">2.5 Mly · MAG 3.4</text>
        </g>

        {/* sight line — eyepiece → galaxy */}
        <line
          x1="151" y1="170"
          x2="354" y2="356"
          stroke="#FFD166"
          strokeWidth="0.8"
          strokeDasharray="2 5"
          strokeOpacity="0.32"
        />

        {/* photon trail */}
        <circle r="1.4" cx="0" cy="0" fill="#FFD166" opacity="0.55" className="photon-trail-b" />
        <circle r="1.8" cx="0" cy="0" fill="#FFD166" opacity="0.75" className="photon-trail-a" />
        <circle r="2.4" cx="0" cy="0" fill="#FFE9B4" className="photon" />

        {/* ═══════════════ WHITE REFRACTOR ═══════════════ */}
        {/* Tripod */}
        <g>
          <path d="M 312 462 L 358 402" stroke="url(#tripod-leg)" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M 408 462 L 362 402" stroke="url(#tripod-leg)" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M 360 464 L 360 400" stroke="url(#tripod-leg)" strokeWidth="3.4" strokeLinecap="round" />
          {/* leg locks */}
          <rect x="304" y="430" width="6.5" height="3.5" rx="0.8" fill="#FFD166" opacity="0.65" transform="rotate(-50 307 432)" />
          <rect x="408" y="430" width="6.5" height="3.5" rx="0.8" fill="#FFD166" opacity="0.65" transform="rotate(50 411 432)" />
          {/* feet */}
          <ellipse cx="312" cy="462" rx="3" ry="1.6" fill="#0A0C12" />
          <ellipse cx="408" cy="462" rx="3" ry="1.6" fill="#0A0C12" />
          <ellipse cx="360" cy="464" rx="3" ry="1.6" fill="#0A0C12" />
          {/* accessory tray */}
          <ellipse cx="360" cy="438" rx="24" ry="3.8" fill="#15181F" stroke="#3F4248" strokeWidth="0.7" />
          <ellipse cx="360" cy="437" rx="24" ry="1.4" fill="#2A2D36" />
          {/* tripod top platform */}
          <rect x="346" y="396" width="28" height="6" rx="1" fill="#15181F" />
          <rect x="344" y="394" width="32" height="3" fill="#0A0C12" />
        </g>

        {/* GEM mount — white with red accents */}
        <g>
          {/* RA axis housing — large white cylinder seen from side */}
          <rect x="346" y="378" width="28" height="20" rx="3" fill="url(#mount-white)" stroke="#3F4248" strokeWidth="0.5" />
          {/* RA polar scope cap (front-facing little black cylinder) */}
          <circle cx="360" cy="392" r="3" fill="#0A0C12" stroke="#3F4248" strokeWidth="0.5" />
          <circle cx="360" cy="392" r="1.2" fill="#FFD166" opacity="0.55" />
          {/* RA setting circle */}
          <rect x="346" y="376" width="28" height="3" fill="#0A0C12" />
          <rect x="346" y="375.2" width="28" height="0.8" fill="#FFD166" opacity="0.4" />

          {/* Dec axis housing — smaller white block on top */}
          <rect x="350" y="364" width="20" height="14" rx="2" fill="url(#mount-white)" stroke="#3F4248" strokeWidth="0.5" />
          <rect x="350" y="362" width="20" height="2.2" fill="#0A0C12" />
          <circle cx="360" cy="372" r="3" fill="#0A0C12" />
          <circle cx="360" cy="372" r="1.2" fill="#D43A42" />

          {/* small red logo accent */}
          <rect x="350" y="384" width="3" height="3" rx="0.3" fill="url(#anodized-red)" />
        </g>

        {/* Counterweight bar + weight (rotates with the scope) */}
        <g className="scope">
          <line x1="360" y1="372" x2="396" y2="408"
                stroke="url(#chrome)" strokeWidth="2.6" strokeLinecap="round" />
          {/* weight */}
          <circle cx="398" cy="410" r="7.5" fill="#0A0C12" stroke="#3F4248" strokeWidth="0.7" />
          <circle cx="398" cy="410" r="4"   fill="#22253A" />
          <circle cx="398" cy="410" r="1"   fill="#FFD166" opacity="0.7" />

          {/* TUBE assembly — rotated to point at galaxy */}
          <g transform="rotate(-45 360 372)">
            {/* saddle plate (red anodized) */}
            <rect x="346" y="358" width="28" height="6" rx="1" fill="url(#anodized-red)" />
            <rect x="346" y="358" width="28" height="1.2" fill="#FFFFFF" opacity="0.25" />

            {/* main white tube */}
            <rect x="350" y="218" width="20" height="138" rx="2" fill="url(#tube-white)" />
            {/* tube highlights — thin specular bands */}
            <rect x="356" y="220" width="1.2" height="134" fill="#FFFFFF" opacity="0.55" />
            <rect x="362" y="220" width="0.8" height="134" fill="#FFFFFF" opacity="0.35" />

            {/* tube rings (two black anodized with red clamps) */}
            <rect x="345" y="238" width="30" height="8" rx="1.2" fill="url(#anodized-black)" />
            <rect x="345" y="238" width="30" height="1.4" fill="#FFFFFF" opacity="0.18" />
            {/* red clamp screw on ring 1 */}
            <rect x="358" y="234" width="4" height="4" rx="0.6" fill="url(#anodized-red)" />
            <circle cx="360" cy="232" r="1.2" fill="#FFD166" opacity="0.65" />

            <rect x="345" y="328" width="30" height="8" rx="1.2" fill="url(#anodized-black)" />
            <rect x="345" y="328" width="30" height="1.4" fill="#FFFFFF" opacity="0.18" />
            <rect x="358" y="324" width="4" height="4" rx="0.6" fill="url(#anodized-red)" />
            <circle cx="360" cy="322" r="1.2" fill="#FFD166" opacity="0.65" />

            {/* dew shield — slightly wider, white */}
            <rect x="346" y="194" width="28" height="26" rx="3" fill="url(#tube-white)" />
            {/* dew shield highlight */}
            <rect x="354" y="196" width="1.4" height="22" fill="#FFFFFF" opacity="0.55" />
            <rect x="360" y="196" width="1" height="22" fill="#FFFFFF" opacity="0.3" />
            {/* dew shield trim ring */}
            <rect x="345" y="218" width="30" height="2" fill="#0A0C12" />
            <rect x="345" y="217.4" width="30" height="0.8" fill="url(#brass)" opacity="0.7" />

            {/* objective cell */}
            <rect x="345" y="190" width="30" height="6" rx="2.5" fill="#0A0C12" />
            {/* objective lens */}
            <circle cx="360" cy="192" r="11.5" fill="url(#objective-lens)" stroke="url(#brass)" strokeWidth="1.6" />
            {/* multi-coating tint hint */}
            <circle cx="360" cy="192" r="9" fill="none" stroke="#5A8FB8" strokeWidth="0.4" strokeOpacity="0.5" />
            {/* lens glint */}
            <circle cx="356" cy="188" r="2" fill="#A8C9E5" opacity="0.55" />
            <circle cx="357" cy="187" r="0.7" fill="#FFFFFF" opacity="0.85" />

            {/* rear cell */}
            <rect x="345" y="356" width="30" height="6" rx="1.5" fill="#0A0C12" />
            <rect x="345" y="355.4" width="30" height="0.8" fill="url(#brass)" opacity="0.6" />

            {/* focuser body */}
            <rect x="370" y="346" width="14" height="12" rx="1" fill="url(#anodized-black)" />
            {/* focuser drawtube */}
            <rect x="382" y="350" width="9" height="4" fill="#15181F" stroke="#3F4248" strokeWidth="0.4" />
            {/* focuser knobs (chrome, large) */}
            <circle cx="385" cy="346" r="2.2" fill="url(#chrome)" stroke="#0A0C12" strokeWidth="0.4" />
            <circle cx="385" cy="358" r="2.2" fill="url(#chrome)" stroke="#0A0C12" strokeWidth="0.4" />
            <circle cx="385" cy="346" r="0.8" fill="#0A0C12" />
            <circle cx="385" cy="358" r="0.8" fill="#0A0C12" />
            {/* fine focus knob */}
            <circle cx="378" cy="346" r="1.4" fill="url(#chrome)" stroke="#0A0C12" strokeWidth="0.3" />

            {/* eyepiece */}
            <rect x="391" y="349" width="9" height="6" rx="0.5" fill="#15181F" stroke="url(#brass)" strokeWidth="0.6" />
            <rect x="400" y="347" width="6" height="10" rx="0.6" fill="#0A0C12" />
            <circle cx="403" cy="352" r="2.4" fill="#020409" stroke="#3F4248" strokeWidth="0.5" />
            <rect x="406" y="349" width="2.5" height="6" rx="0.4" fill="#0A0C12" />

            {/* finder scope (small white tube above main) */}
            <rect x="335" y="240" width="7" height="64" rx="2" fill="url(#tube-white)" />
            <rect x="338.5" y="242" width="0.8" height="60" fill="#FFFFFF" opacity="0.5" />
            {/* finder objective */}
            <circle cx="338.6" cy="238" r="3.4" fill="url(#objective-lens)" stroke="url(#brass)" strokeWidth="0.7" />
            {/* finder eyepiece */}
            <rect x="336.8" y="304" width="3.5" height="7" rx="0.4" fill="#0A0C12" stroke="url(#brass)" strokeWidth="0.4" />
            {/* finder mount brackets (red shoes) */}
            <rect x="342" y="246" width="4.5" height="3" rx="0.4" fill="url(#anodized-red)" />
            <rect x="342" y="298" width="4.5" height="3" rx="0.4" fill="url(#anodized-red)" />
            {/* red-dot finder LED */}
            <circle cx="338.6" cy="313" r="1.2" fill="#EF4444" className="led" />
          </g>
        </g>

        {/* tiny stamps / credit */}
        <g style={{ fontFamily: 'var(--font-mono)' }}>
          <text x="20" y="468" fontSize="8" fill="#3A4256" letterSpacing="0.2em">
            41.7°N 44.8°E · 21:42
          </text>
          <text x="460" y="468" fontSize="7.5" fill="#3A4256" letterSpacing="0.16em" textAnchor="end">
            M31 PHOTO · ADAM EVANS · CC BY 2.0
          </text>
        </g>
      </svg>
    </div>
  );
}
