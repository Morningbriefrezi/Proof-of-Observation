export default function CrabNode({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cn" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#38F0FF" stopOpacity="0.7" />
          <stop offset="0.6" stopColor="#8465CB" stopOpacity="0.3" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="12" fill="url(#cn)" />
      <circle cx="14" cy="14" r="1.2" fill="#fff" />
    </svg>
  );
}
