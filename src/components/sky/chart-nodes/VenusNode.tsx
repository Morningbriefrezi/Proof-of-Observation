export default function VenusNode({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vn" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#FFF3D6" />
          <stop offset="1" stopColor="#C49A4A" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#vn)" />
    </svg>
  );
}
