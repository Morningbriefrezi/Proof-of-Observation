export default function MoonNode({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mn" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#EEEAE1" />
          <stop offset="1" stopColor="#6A665C" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="12" fill="url(#mn)" />
      <path d="M 16 4 A 12 12 0 0 1 16 28 A 7 12 0 0 0 16 4" fill="#030612" opacity="0.55" />
      <circle cx="13" cy="12" r="1.5" fill="#8A857A" opacity="0.5" />
      <circle cx="18" cy="18" r="1" fill="#8A857A" opacity="0.4" />
    </svg>
  );
}
