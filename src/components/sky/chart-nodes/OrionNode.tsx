export default function OrionNode({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="on-neb" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0" stopColor="#FFAEC8" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="#8A5DC0" stopOpacity="0.15" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="on-star" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.4" stopColor="#E4ECFF" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="on-red" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD6B0" />
          <stop offset="0.5" stopColor="#FF8A5C" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <ellipse cx="18" cy="18" rx="17" ry="17" fill="url(#on-neb)" />
      {/* connecting lines */}
      <g stroke="rgba(255,255,255,0.18)" strokeWidth="0.35" fill="none">
        <path d="M 9 7 L 13 16 L 18 18 L 23 20 L 27 29" />
        <path d="M 13 16 L 23 20" />
        <path d="M 14 17 L 22 19" />
      </g>
      {/* Betelgeuse (red) */}
      <circle cx="9" cy="7" r="2.6" fill="url(#on-red)" />
      <circle cx="9" cy="7" r="1" fill="#FFB88A" />
      {/* Rigel (blue-white) */}
      <circle cx="27" cy="29" r="2.6" fill="url(#on-star)" />
      <circle cx="27" cy="29" r="1" fill="#FFFFFF" />
      {/* Belt: Alnitak, Alnilam, Mintaka */}
      <circle cx="13" cy="16" r="1.6" fill="url(#on-star)" />
      <circle cx="13" cy="16" r="0.6" fill="#FFFFFF" />
      <circle cx="18" cy="18" r="1.8" fill="url(#on-star)" />
      <circle cx="18" cy="18" r="0.7" fill="#FFFFFF" />
      <circle cx="23" cy="20" r="1.6" fill="url(#on-star)" />
      <circle cx="23" cy="20" r="0.6" fill="#FFFFFF" />
      {/* Sword (nebula hint) */}
      <ellipse cx="19.5" cy="22.5" rx="1.2" ry="2.2" fill="#FF99CC" opacity="0.55" />
      <circle cx="19.5" cy="22.5" r="0.7" fill="#FFDDEE" />
      {/* Shoulder pair */}
      <circle cx="23" cy="12" r="0.9" fill="#E4ECFF" />
      <circle cx="14" cy="24" r="0.9" fill="#E4ECFF" />
    </svg>
  );
}
