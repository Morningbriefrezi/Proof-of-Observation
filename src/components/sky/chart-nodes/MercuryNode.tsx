export default function MercuryNode({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mcn-body" cx="0.36" cy="0.32" r="0.72">
          <stop offset="0" stopColor="#E4DCC6" />
          <stop offset="0.55" stopColor="#968A72" />
          <stop offset="1" stopColor="#302A22" />
        </radialGradient>
        <clipPath id="mcn-clip"><circle cx="12" cy="12" r="8" /></clipPath>
      </defs>
      <circle cx="12" cy="12" r="8" fill="url(#mcn-body)" />
      <g clipPath="url(#mcn-clip)" opacity="0.55">
        <circle cx="9" cy="10" r="1.1" fill="#423A2E" />
        <circle cx="9" cy="10" r="0.4" fill="#E4DCC6" opacity="0.7" />
        <circle cx="14.5" cy="13" r="0.8" fill="#423A2E" />
        <circle cx="11" cy="14.5" r="0.6" fill="#423A2E" />
        <circle cx="15" cy="9" r="0.55" fill="#423A2E" />
      </g>
      <circle cx="12" cy="12" r="8" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.4" />
    </svg>
  );
}
