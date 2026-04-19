export default function MoonNode({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mn-body" cx="0.35" cy="0.3" r="0.78">
          <stop offset="0" stopColor="#F6F2E5" />
          <stop offset="0.55" stopColor="#CBC3B0" />
          <stop offset="1" stopColor="#443F35" />
        </radialGradient>
        <radialGradient id="mn-glow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0.55" stopColor="#F6F2E5" stopOpacity="0" />
          <stop offset="0.82" stopColor="#F6F2E5" stopOpacity="0.14" />
          <stop offset="1" stopColor="#F6F2E5" stopOpacity="0" />
        </radialGradient>
        <clipPath id="mn-clip"><circle cx="16" cy="16" r="12" /></clipPath>
      </defs>
      <circle cx="16" cy="16" r="15.5" fill="url(#mn-glow)" />
      <circle cx="16" cy="16" r="12" fill="url(#mn-body)" />
      <g clipPath="url(#mn-clip)">
        {/* maria */}
        <ellipse cx="12" cy="11" rx="3.4" ry="2.2" fill="#6E6856" opacity="0.45" />
        <ellipse cx="19" cy="13" rx="2.6" ry="1.6" fill="#5F5846" opacity="0.55" />
        <ellipse cx="14" cy="20" rx="4" ry="2.4" fill="#706A58" opacity="0.45" />
        {/* craters */}
        <circle cx="21" cy="20" r="1.3" fill="#3A3528" opacity="0.55" />
        <circle cx="21" cy="20" r="0.55" fill="#EEE6D0" opacity="0.5" />
        <circle cx="10" cy="16" r="0.9" fill="#3A3528" opacity="0.45" />
        <circle cx="18" cy="9" r="0.7" fill="#3A3528" opacity="0.5" />
        {/* terminator shadow for dimensionality */}
        <path d="M 16 3 A 13 13 0 0 1 16 29 A 6 13 0 0 0 16 3" fill="#04060E" opacity="0.28" />
      </g>
      <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.4" />
    </svg>
  );
}
