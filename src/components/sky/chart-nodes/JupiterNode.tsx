export default function JupiterNode({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="jn" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#F4D9A8" />
          <stop offset="0.5" stopColor="#D8A574" />
          <stop offset="1" stopColor="#6B3E1A" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="14" fill="url(#jn)" />
      <ellipse cx="18" cy="15" rx="13" ry="1.3" fill="#6B3E1A" opacity="0.35" />
      <ellipse cx="18" cy="19" rx="14" ry="1.2" fill="#6B3E1A" opacity="0.45" />
      <ellipse cx="18" cy="23" rx="12" ry="1.3" fill="#6B3E1A" opacity="0.35" />
      <ellipse cx="14" cy="21" rx="2.5" ry="1.2" fill="#8B3A1E" opacity="0.7" />
    </svg>
  );
}
