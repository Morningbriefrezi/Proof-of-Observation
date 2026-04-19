export default function SaturnNode({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.62)} viewBox="0 0 40 26" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sn-body" cx="0.38" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#FBE7BD" />
          <stop offset="0.5" stopColor="#D9A965" />
          <stop offset="1" stopColor="#5A391A" />
        </radialGradient>
        <linearGradient id="sn-ring" x1="0" x2="1">
          <stop offset="0" stopColor="#9A7940" stopOpacity="0" />
          <stop offset="0.15" stopColor="#E5C483" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#F5DBA2" stopOpacity="0.95" />
          <stop offset="0.85" stopColor="#C99E56" stopOpacity="0.85" />
          <stop offset="1" stopColor="#9A7940" stopOpacity="0" />
        </linearGradient>
        <clipPath id="sn-planetclip"><circle cx="20" cy="13" r="7" /></clipPath>
      </defs>
      {/* back half of ring */}
      <g transform="rotate(-18 20 13)">
        <ellipse cx="20" cy="13" rx="18" ry="3.2" fill="none" stroke="url(#sn-ring)" strokeWidth="1.6" />
        <ellipse cx="20" cy="13" rx="15" ry="2.4" fill="none" stroke="url(#sn-ring)" strokeWidth="0.9" opacity="0.65" />
      </g>
      {/* planet body */}
      <circle cx="20" cy="13" r="7" fill="url(#sn-body)" />
      <g clipPath="url(#sn-planetclip)" opacity="0.6">
        <path d="M 13 11 Q 20 10 27 11.4" stroke="#B7814A" strokeWidth="0.6" fill="none" />
        <path d="M 13 13.5 Q 20 12.6 27 13.8" stroke="#8A5928" strokeWidth="0.8" fill="none" />
        <path d="M 13 15.5 Q 20 14.7 27 15.8" stroke="#A36D35" strokeWidth="0.6" fill="none" />
      </g>
      {/* front half of ring */}
      <g transform="rotate(-18 20 13)">
        <path d="M 2 13.5 Q 20 19 38 13.5" stroke="url(#sn-ring)" strokeWidth="1.4" fill="none" />
        <path d="M 5 13.2 Q 20 17 35 13.2" stroke="url(#sn-ring)" strokeWidth="0.7" fill="none" opacity="0.7" />
      </g>
    </svg>
  );
}
