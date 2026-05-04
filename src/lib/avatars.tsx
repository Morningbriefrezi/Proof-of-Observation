import type { CSSProperties, ReactNode } from 'react';

export type AvatarId =
  | 'planet'
  | 'telescope'
  | 'moon'
  | 'star'
  | 'comet'
  | 'galaxy'
  | 'earth'
  | 'ufo'
  | 'initial';

type IconProps = { size: number; tint: string };
type IconComponent = (props: IconProps) => ReactNode;

type AvatarDef = {
  id: AvatarId;
  label: string;
  glyph: string;
  Icon: IconComponent;
  tint: string;
  glow: string;
};

const STROKE = 1.7;

function SaturnIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <radialGradient id="sat-body" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#FFE7A8" />
          <stop offset="55%" stopColor={tint} />
          <stop offset="100%" stopColor="#8A5A0E" />
        </radialGradient>
      </defs>
      <ellipse cx="12" cy="12" rx="10" ry="2.6" transform="rotate(-18 12 12)" stroke={tint} strokeWidth={STROKE} strokeOpacity="0.85" />
      <circle cx="12" cy="12" r="4.4" fill="url(#sat-body)" />
      <path d="M9.4 10.6c1.4-0.5 3.4-0.4 4.7 0.2" stroke="#fff" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="12" cy="12" rx="10" ry="2.6" transform="rotate(-18 12 12)" stroke="#fff" strokeOpacity="0.18" strokeWidth="0.7" />
      <circle cx="3.2" cy="6" r="0.5" fill="#fff" fillOpacity="0.7" />
      <circle cx="20.5" cy="18" r="0.5" fill="#fff" fillOpacity="0.6" />
    </svg>
  );
}

function TelescopeIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <linearGradient id="scope-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tint} />
          <stop offset="100%" stopColor="#5A7CB0" />
        </linearGradient>
      </defs>
      <path d="M4.5 12l9-4.2 2.4 5.2-9 4.2z" fill="url(#scope-body)" stroke={tint} strokeWidth={STROKE} strokeLinejoin="round" />
      <path d="M5.7 13.4l8.4-3.9" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.9" />
      <path d="M14.7 8.3l3 1.4" stroke={tint} strokeWidth={STROKE} strokeLinecap="round" />
      <path d="M9.5 16.7L11 20M7 16.2L8.5 19.5M11 20h-3" stroke={tint} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18.4" cy="6.3" r="1.6" fill={tint} />
      <circle cx="18.4" cy="6.3" r="0.6" fill="#fff" fillOpacity="0.85" />
      <circle cx="20.8" cy="3.5" r="0.4" fill="#fff" fillOpacity="0.7" />
      <path d="M20 2.5l0.6 0.6M21.4 3.4l0.6-0.5" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  );
}

function CrescentIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <radialGradient id="moon-body" cx="0.35" cy="0.35" r="0.8">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor={tint} stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <path d="M16.8 4.3a8.2 8.2 0 1 0 3.1 12A6.6 6.6 0 0 1 16.8 4.3z" fill="url(#moon-body)" stroke={tint} strokeWidth={STROKE} strokeLinejoin="round" />
      <circle cx="12.8" cy="9.2" r="0.7" fill={tint} fillOpacity="0.35" />
      <circle cx="14.2" cy="13.5" r="0.5" fill={tint} fillOpacity="0.3" />
      <circle cx="16.5" cy="11" r="0.4" fill={tint} fillOpacity="0.25" />
      <circle cx="4.5" cy="5" r="0.45" fill={tint} fillOpacity="0.7" />
      <path d="M3.7 4.4l0.6 0.6M4.9 5.6l0.6-0.5" stroke={tint} strokeOpacity="0.45" strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  );
}

function NovaIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <radialGradient id="nova-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="50%" stopColor={tint} />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#nova-core)" opacity="0.45" />
      <path d="M12 3L13.6 10.4L21 12L13.6 13.6L12 21L10.4 13.6L3 12L10.4 10.4Z" fill={tint} stroke="#fff" strokeOpacity="0.4" strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M5.5 18.5l1.6-1.6M16.9 7.1l1.6-1.6" stroke={tint} strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.6" fill="#fff" />
    </svg>
  );
}

function CometIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <radialGradient id="comet-head" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="60%" stopColor={tint} />
          <stop offset="100%" stopColor={tint} stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id="comet-tail" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint} stopOpacity="0.85" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M16 8L4.5 19.5" stroke="url(#comet-tail)" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M14 6.5L3.5 17" stroke="url(#comet-tail)" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <path d="M17.5 9.5L7 19.5" stroke="url(#comet-tail)" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      <circle cx="17" cy="7" r="3.4" fill="url(#comet-head)" />
      <circle cx="17" cy="7" r="1.4" fill="#fff" />
      <circle cx="3.5" cy="7" r="0.5" fill="#fff" fillOpacity="0.7" />
      <circle cx="20" cy="18" r="0.45" fill="#fff" fillOpacity="0.6" />
    </svg>
  );
}

function NebulaIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <radialGradient id="neb-cloud" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor={tint} stopOpacity="0.85" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="neb-cloud2" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#FFB3D9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFB3D9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="9" cy="13" rx="6" ry="4" fill="url(#neb-cloud)" />
      <ellipse cx="15" cy="11" rx="5" ry="3.4" fill="url(#neb-cloud2)" />
      <ellipse cx="12" cy="14" rx="4" ry="2.6" fill="url(#neb-cloud)" opacity="0.7" />
      <circle cx="6" cy="6" r="0.8" fill="#fff" />
      <circle cx="18" cy="7" r="0.6" fill="#fff" fillOpacity="0.85" />
      <circle cx="20" cy="17" r="0.55" fill="#fff" fillOpacity="0.8" />
      <circle cx="4.5" cy="18" r="0.45" fill="#fff" fillOpacity="0.7" />
      <circle cx="12" cy="4" r="0.5" fill="#fff" fillOpacity="0.85" />
      <path d="M5.4 5.4l0.5 0.5M6.6 6.6l0.5-0.5" stroke="#fff" strokeOpacity="0.6" strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  );
}

function OrbitIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <radialGradient id="orbit-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor={tint} />
        </radialGradient>
      </defs>
      <ellipse cx="12" cy="12" rx="9.5" ry="3.6" transform="rotate(-25 12 12)" stroke={tint} strokeWidth={STROKE} strokeOpacity="0.85" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.6" transform="rotate(25 12 12)" stroke={tint} strokeWidth={STROKE} strokeOpacity="0.55" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.6" stroke={tint} strokeWidth="0.9" strokeOpacity="0.3" strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="2.4" fill="url(#orbit-core)" />
      <circle cx="20.5" cy="9" r="1.1" fill={tint} />
      <circle cx="20.5" cy="9" r="0.4" fill="#fff" />
      <circle cx="3.2" cy="14" r="0.7" fill={tint} fillOpacity="0.75" />
    </svg>
  );
}

function ConstellationIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <radialGradient id="con-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="60%" stopColor={tint} />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M4.5 7.5L9 12l3.5-3 4 5.5 3-7" stroke={tint} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.55" />
      <circle cx="4.5" cy="7.5" r="2" fill="url(#con-glow)" opacity="0.6" />
      <circle cx="9" cy="12" r="2.4" fill="url(#con-glow)" opacity="0.7" />
      <circle cx="12.5" cy="9" r="2" fill="url(#con-glow)" opacity="0.55" />
      <circle cx="16.5" cy="14.5" r="2.2" fill="url(#con-glow)" opacity="0.65" />
      <circle cx="19.5" cy="7.5" r="2.2" fill="url(#con-glow)" opacity="0.6" />
      <circle cx="4.5" cy="7.5" r="1.1" fill="#fff" />
      <circle cx="9" cy="12" r="1.4" fill="#fff" />
      <circle cx="12.5" cy="9" r="1.1" fill="#fff" />
      <circle cx="16.5" cy="14.5" r="1.2" fill="#fff" />
      <circle cx="19.5" cy="7.5" r="1.2" fill="#fff" />
      <circle cx="3" cy="19" r="0.4" fill="#fff" fillOpacity="0.6" />
      <circle cx="21" cy="20" r="0.4" fill="#fff" fillOpacity="0.5" />
    </svg>
  );
}

export const AVATARS: AvatarDef[] = [
  { id: 'initial',   label: 'Initial',       glyph: 'A',  Icon: NovaIcon,          tint: '#FFE4A0', glow: 'rgba(255, 228, 160, 0.18)' },
  { id: 'planet',    label: 'Saturn',        glyph: '◯',  Icon: SaturnIcon,        tint: '#FFD166', glow: 'rgba(255, 209, 102, 0.22)' },
  { id: 'telescope', label: 'Telescope',     glyph: '◭',  Icon: TelescopeIcon,     tint: '#9BB8E8', glow: 'rgba(155, 184, 232, 0.22)' },
  { id: 'moon',      label: 'Crescent',      glyph: '☾',  Icon: CrescentIcon,      tint: '#E8ECF4', glow: 'rgba(232, 236, 244, 0.18)' },
  { id: 'star',      label: 'Nova',          glyph: '✦',  Icon: NovaIcon,          tint: '#F59E0B', glow: 'rgba(245, 158, 11, 0.28)' },
  { id: 'comet',     label: 'Comet',         glyph: '⌁',  Icon: CometIcon,         tint: '#5EEAD4', glow: 'rgba(94, 234, 212, 0.24)' },
  { id: 'galaxy',    label: 'Nebula',        glyph: '✺',  Icon: NebulaIcon,        tint: '#E879A8', glow: 'rgba(232, 121, 168, 0.24)' },
  { id: 'earth',     label: 'Orbit',         glyph: '◎',  Icon: OrbitIcon,         tint: '#6EAACE', glow: 'rgba(110, 170, 206, 0.22)' },
  { id: 'ufo',       label: 'Constellation', glyph: '⁂',  Icon: ConstellationIcon, tint: '#FFD166', glow: 'rgba(255, 209, 102, 0.24)' },
];

export function avatarById(id: string | null | undefined): AvatarDef {
  return AVATARS.find(a => a.id === id) ?? AVATARS[0];
}

type AvatarProps = {
  avatarId?: string | null;
  initial?: string;
  size?: number;
  style?: CSSProperties;
  children?: ReactNode;
};

export function Avatar({ avatarId, initial = '✦', size = 72, style }: AvatarProps) {
  const def = avatarById(avatarId ?? 'initial');
  const isInitial = def.id === 'initial';
  const iconSize = Math.round(size * 0.62);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(120% 120% at 30% 25%, ${def.glow}, var(--stl-bg-deep) 70%)`,
        border: '1px solid var(--stl-border-regular)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -10px 24px rgba(0,0,0,0.32)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      {isInitial ? (
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            fontSize: Math.round(size * 0.42),
            color: 'var(--stl-text-bright)',
            lineHeight: 1,
            textShadow: `0 0 18px ${def.glow}`,
          }}
        >
          {initial}
        </span>
      ) : (
        <def.Icon size={iconSize} tint={def.tint} />
      )}
    </div>
  );
}
