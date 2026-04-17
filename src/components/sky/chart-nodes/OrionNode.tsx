export default function OrionNode({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="on" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF8FB8" stopOpacity="0.7" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <ellipse cx="15" cy="15" rx="14" ry="10" fill="url(#on)" />
      <circle cx="15" cy="15" r="1.5" fill="#fff" />
      <circle cx="12" cy="13" r="1" fill="#fff" opacity="0.7" />
      <circle cx="18" cy="17" r="1" fill="#fff" opacity="0.7" />
    </svg>
  );
}
