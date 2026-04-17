export default function MarsNode({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mrn" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#F4A074" />
          <stop offset="1" stopColor="#6B2413" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#mrn)" />
      <ellipse cx="10" cy="9" rx="2" ry="1" fill="#7A2912" opacity="0.5" />
    </svg>
  );
}
