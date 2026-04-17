export default function MercuryNode({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mcn" cx="0.4" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#C9BFA8" />
          <stop offset="1" stopColor="#4A4238" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="8" fill="url(#mcn)" />
    </svg>
  );
}
