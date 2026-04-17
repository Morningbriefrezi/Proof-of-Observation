export default function AndromedaNode({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.6)} viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="an" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD166" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="#8465CB" stopOpacity="0.4" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <g transform="translate(20 12) rotate(-22)">
        <ellipse cx="0" cy="0" rx="18" ry="5" fill="url(#an)" />
        <ellipse cx="0" cy="0" rx="6" ry="2" fill="#FFD166" opacity="0.65" />
      </g>
    </svg>
  );
}
