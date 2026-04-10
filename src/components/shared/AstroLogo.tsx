interface AstroLogoProps {
  heightClass?: string;
  className?: string;
}

export default function AstroLogo({ heightClass = 'h-8', className = '' }: AstroLogoProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg viewBox="0 0 20 20" fill="none" className={heightClass} style={{ width: 'auto' }}>
        <circle cx="10" cy="10" r="3" fill="#34d399" />
        <circle cx="10" cy="10" r="7" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.4" />
        <line x1="10" y1="1" x2="10" y2="5" stroke="#34d399" strokeWidth="1.5" />
        <line x1="10" y1="15" x2="10" y2="19" stroke="#34d399" strokeWidth="1.5" />
        <line x1="1" y1="10" x2="5" y2="10" stroke="#34d399" strokeWidth="1.5" />
        <line x1="15" y1="10" x2="19" y2="10" stroke="#34d399" strokeWidth="1.5" />
      </svg>
      <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', color: 'white', fontFamily: 'Georgia, serif' }}>
        STELLAR
      </span>
    </div>
  );
}
