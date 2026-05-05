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

const STROKE = 1.1;

function SaturnIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="12" rx="10" ry="2.4" transform="rotate(-18 12 12)" stroke={tint} strokeWidth={STROKE} strokeOpacity="0.9" fill="none" />
      <circle cx="12" cy="12" r="4" fill={tint} fillOpacity="0.18" stroke={tint} strokeWidth={STROKE} />
      <path d="M9 11.6h6M9.6 13.2h4.8" stroke={tint} strokeOpacity="0.45" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  );
}

function TelescopeIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 13l9-4 1.6 3.6-9 4z" stroke={tint} strokeWidth={STROKE} strokeLinejoin="round" fill={tint} fillOpacity="0.12" />
      <path d="M14 9l3 1.4" stroke={tint} strokeWidth={STROKE} strokeLinecap="round" />
      <path d="M9 16.6L11 20M11 20H8.5" stroke={tint} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.4" cy="7.2" r="0.9" stroke={tint} strokeWidth={STROKE} fill="none" />
    </svg>
  );
}

function CrescentIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M16.4 4.6a8 8 0 1 0 3 11.6A6.4 6.4 0 0 1 16.4 4.6z" stroke={tint} strokeWidth={STROKE} strokeLinejoin="round" fill={tint} fillOpacity="0.14" />
      <circle cx="12.6" cy="9.4" r="0.55" fill={tint} fillOpacity="0.5" />
      <circle cx="14.2" cy="13.6" r="0.45" fill={tint} fillOpacity="0.4" />
      <circle cx="11.4" cy="13.8" r="0.35" fill={tint} fillOpacity="0.35" />
    </svg>
  );
}

function NovaIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="1.6" fill={tint} />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" stroke={tint} strokeWidth={STROKE} strokeLinecap="round" />
      <path d="M5.6 5.6l2.6 2.6M15.8 15.8l2.6 2.6M5.6 18.4l2.6-2.6M15.8 8.2l2.6-2.6" stroke={tint} strokeWidth="0.7" strokeOpacity="0.6" strokeLinecap="round" />
    </svg>
  );
}

function CometIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M17 7L5 19" stroke={tint} strokeWidth={STROKE} strokeLinecap="round" strokeOpacity="0.85" />
      <path d="M15.4 6.4L4.4 17.4" stroke={tint} strokeWidth="0.7" strokeLinecap="round" strokeOpacity="0.45" />
      <path d="M18.4 8.4L7 19.6" stroke={tint} strokeWidth="0.7" strokeLinecap="round" strokeOpacity="0.4" />
      <circle cx="17" cy="7" r="2.2" stroke={tint} strokeWidth={STROKE} fill={tint} fillOpacity="0.18" />
      <circle cx="17" cy="7" r="0.7" fill={tint} />
    </svg>
  );
}

function NebulaIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4.5c-2.4 0.6-4 2.2-4.4 4.4-0.4 2.2 0.6 4 2.4 4.6 1.4 0.45 2 1.4 1.6 2.6-0.4 1.2-1.8 1.9-3.4 1.5"
        stroke={tint}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 19.5c2.4-0.6 4-2.2 4.4-4.4 0.4-2.2-0.6-4-2.4-4.6-1.4-0.45-2-1.4-1.6-2.6 0.4-1.2 1.8-1.9 3.4-1.5"
        stroke={tint}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeOpacity="0.7"
        fill="none"
      />
      <circle cx="12" cy="12" r="1" fill={tint} />
      <circle cx="6" cy="6.4" r="0.45" fill={tint} fillOpacity="0.55" />
      <circle cx="18.4" cy="17.6" r="0.45" fill={tint} fillOpacity="0.55" />
    </svg>
  );
}

function OrbitIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="12" rx="9" ry="3.4" transform="rotate(-22 12 12)" stroke={tint} strokeWidth={STROKE} strokeOpacity="0.9" fill="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.4" transform="rotate(22 12 12)" stroke={tint} strokeWidth={STROKE} strokeOpacity="0.5" fill="none" />
      <circle cx="12" cy="12" r="2" fill={tint} fillOpacity="0.25" stroke={tint} strokeWidth={STROKE} />
      <circle cx="20.2" cy="9.2" r="0.85" fill={tint} />
    </svg>
  );
}

function ConstellationIcon({ size, tint }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 8L9 12L13 9.4L17 14.6L20 7.6" stroke={tint} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.55" fill="none" />
      <circle cx="5" cy="8" r="1" fill={tint} />
      <circle cx="9" cy="12" r="1.2" fill={tint} />
      <circle cx="13" cy="9.4" r="1" fill={tint} />
      <circle cx="17" cy="14.6" r="1.1" fill={tint} />
      <circle cx="20" cy="7.6" r="1.1" fill={tint} />
      <circle cx="3.5" cy="18" r="0.4" fill={tint} fillOpacity="0.55" />
      <circle cx="20" cy="18.6" r="0.4" fill={tint} fillOpacity="0.5" />
    </svg>
  );
}

export const AVATARS: AvatarDef[] = [
  { id: 'initial',   label: 'Initial',       glyph: '✦',  Icon: NovaIcon,          tint: '#E8E2D2', glow: 'rgba(232, 226, 210, 0.14)' },
  { id: 'planet',    label: 'Saturn',        glyph: '◯',  Icon: SaturnIcon,        tint: '#D4B886', glow: 'rgba(212, 184, 134, 0.16)' },
  { id: 'telescope', label: 'Telescope',     glyph: '◭',  Icon: TelescopeIcon,     tint: '#9BB1CC', glow: 'rgba(155, 177, 204, 0.16)' },
  { id: 'moon',      label: 'Crescent',      glyph: '☾',  Icon: CrescentIcon,      tint: '#D9D6CC', glow: 'rgba(217, 214, 204, 0.14)' },
  { id: 'star',      label: 'Nova',          glyph: '✦',  Icon: NovaIcon,          tint: '#D4AF6B', glow: 'rgba(212, 175, 107, 0.18)' },
  { id: 'comet',     label: 'Comet',         glyph: '⌁',  Icon: CometIcon,         tint: '#A4C8C2', glow: 'rgba(164, 200, 194, 0.16)' },
  { id: 'galaxy',    label: 'Nebula',        glyph: '✺',  Icon: NebulaIcon,        tint: '#C39AA2', glow: 'rgba(195, 154, 162, 0.16)' },
  { id: 'earth',     label: 'Orbit',         glyph: '◎',  Icon: OrbitIcon,         tint: '#90AABF', glow: 'rgba(144, 170, 191, 0.16)' },
  { id: 'ufo',       label: 'Constellation', glyph: '⁂',  Icon: ConstellationIcon, tint: '#D4C18C', glow: 'rgba(212, 193, 140, 0.16)' },
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
        background: 'var(--stl-bg-deep, #0B0E17)',
        border: '1px solid var(--stl-border-regular, rgba(255,255,255,0.10))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -10px 24px rgba(0,0,0,0.35)',
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
            fontWeight: 400,
            fontSize: Math.round(size * 0.42),
            color: 'var(--stl-text-bright, #E8E2D2)',
            lineHeight: 1,
            letterSpacing: '0.02em',
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
