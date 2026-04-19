export default function AndromedaNode({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.65)} viewBox="0 0 44 28" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="an-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE3A3" stopOpacity="0.6" />
          <stop offset="0.4" stopColor="#B48CE0" stopOpacity="0.28" />
          <stop offset="0.85" stopColor="#3A2A5C" stopOpacity="0.1" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="an-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF5D1" />
          <stop offset="0.5" stopColor="#FFD166" />
          <stop offset="1" stopColor="#CC8833" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <g transform="translate(22 14) rotate(-22)">
        <ellipse cx="0" cy="0" rx="20" ry="6.5" fill="url(#an-halo)" />
        <ellipse cx="0" cy="0" rx="14" ry="3.2" fill="#D9C4FF" opacity="0.18" />
        <path d="M -16 0.5 Q -4 -1 0 0 Q 4 1 16 -0.5" stroke="#FFD9A8" strokeWidth="0.4" fill="none" opacity="0.6" />
        <ellipse cx="0" cy="0" rx="4.5" ry="1.8" fill="url(#an-core)" />
        <circle cx="0" cy="0" r="1.2" fill="#FFFFFF" opacity="0.9" />
        {/* companion dwarfs */}
        <circle cx="-11" cy="-3.5" r="1.1" fill="#F0E0C0" opacity="0.7" />
        <circle cx="8" cy="3" r="0.8" fill="#F0E0C0" opacity="0.6" />
      </g>
    </svg>
  );
}
