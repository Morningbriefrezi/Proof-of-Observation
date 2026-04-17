export default function PleiadesNode({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pn" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#B8D4FF" stopOpacity="0.6" />
          <stop offset="1" stopColor="#B8D4FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="16" fill="url(#pn)" />
      <circle cx="18" cy="16" r="1.6" fill="#fff" />
      <circle cx="14" cy="19" r="1.3" fill="#fff" />
      <circle cx="22" cy="20" r="1.3" fill="#fff" />
      <circle cx="16" cy="22" r="1" fill="#fff" />
      <circle cx="20" cy="14" r="1" fill="#fff" />
      <circle cx="12" cy="15" r="0.8" fill="#fff" />
      <circle cx="24" cy="16" r="0.9" fill="#fff" />
    </svg>
  );
}
