export default function CrabNode({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cn-haze" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0" stopColor="#FFB8A0" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#A46EE0" stopOpacity="0.3" />
          <stop offset="0.75" stopColor="#3A2A5C" stopOpacity="0.12" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cn-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#C4E4FF" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#cn-haze)" />
      {/* filaments */}
      <g stroke="#FF9C6E" strokeWidth="0.45" fill="none" opacity="0.55">
        <path d="M 7 12 Q 12 14 16 13 Q 20 12 25 10" />
        <path d="M 6 17 Q 11 18 16 17 Q 22 16 26 19" />
        <path d="M 8 22 Q 13 20 16 22 Q 20 24 24 22" />
      </g>
      <g stroke="#7FD3FF" strokeWidth="0.35" fill="none" opacity="0.5">
        <path d="M 10 9 Q 14 14 18 10" />
        <path d="M 14 24 Q 18 19 22 24" />
      </g>
      {/* neutron star core */}
      <circle cx="16" cy="16" r="3.5" fill="url(#cn-core)" />
      <circle cx="16" cy="16" r="1.2" fill="#FFFFFF" />
    </svg>
  );
}
