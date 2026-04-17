export default function SaturnNode({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.67)} viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sn" cx="0.4" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#F5E0B2" />
          <stop offset="1" stopColor="#6A4420" />
        </radialGradient>
      </defs>
      <ellipse cx="18" cy="12" rx="16" ry="3" fill="none" stroke="#D4B078" strokeWidth="1" opacity="0.75" />
      <circle cx="18" cy="12" r="7" fill="url(#sn)" />
      <ellipse cx="18" cy="12" rx="16" ry="3" fill="none" stroke="#D4B078" strokeWidth="1" opacity="0.75" strokeDasharray="28 60" strokeDashoffset="-14" />
    </svg>
  );
}
