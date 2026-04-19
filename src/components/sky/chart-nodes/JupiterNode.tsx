export default function JupiterNode({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="jn-body" cx="0.38" cy="0.35" r="0.72">
          <stop offset="0" stopColor="#FBE6BC" />
          <stop offset="0.35" stopColor="#E5B578" />
          <stop offset="0.75" stopColor="#9A6438" />
          <stop offset="1" stopColor="#3D1F10" />
        </radialGradient>
        <radialGradient id="jn-spot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#D94A2A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7A2410" stopOpacity="0" />
        </radialGradient>
        <clipPath id="jn-clip"><circle cx="18" cy="18" r="14" /></clipPath>
      </defs>
      <circle cx="18" cy="18" r="14" fill="url(#jn-body)" />
      <g clipPath="url(#jn-clip)" opacity="0.85">
        <path d="M 4 13 Q 18 11.5 32 13.5" stroke="#C99663" strokeWidth="0.9" fill="none" opacity="0.55" />
        <path d="M 4 16 Q 18 14.4 32 16.5" stroke="#7F4A22" strokeWidth="1.2" fill="none" opacity="0.75" />
        <path d="M 4 20 Q 18 18.6 32 20.5" stroke="#8A5028" strokeWidth="1.4" fill="none" opacity="0.7" />
        <path d="M 4 23 Q 18 21.6 32 23.5" stroke="#6A3818" strokeWidth="1" fill="none" opacity="0.55" />
        <ellipse cx="13" cy="20.5" rx="3" ry="1.3" fill="url(#jn-spot)" />
      </g>
      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.5" />
    </svg>
  );
}
