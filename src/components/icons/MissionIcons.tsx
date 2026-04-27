import React from 'react';

export interface MissionIconProps {
  size?: number;
  className?: string;
}

function Base({
  size = 16,
  className,
  children,
}: MissionIconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function MoonIcon(props: MissionIconProps) {
  return (
    <Base {...props}>
      <path
        d="M14.5 11.2A5.5 5.5 0 1 1 8.8 5.5a4.5 4.5 0 0 0 5.7 5.7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </Base>
  );
}

export function PlanetIcon(props: MissionIconProps) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5.4 7.6c-.5.4-.9.9-.9 1.4 0 1.7 4 3 8 1.7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </Base>
  );
}

export function RingedPlanetIcon(props: MissionIconProps) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.2" />
      <ellipse
        cx="10"
        cy="10"
        rx="6.5"
        ry="2"
        transform="rotate(-18 10 10)"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
    </Base>
  );
}

export function NebulaIcon(props: MissionIconProps) {
  return (
    <Base {...props}>
      <path
        d="M10 4v3M10 13v3M4 10h3M13 10h3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="10" r="1.6" fill="currentColor" />
      <path
        d="M5.2 5.2l1.6 1.6M13.2 13.2l1.6 1.6M5.2 14.8l1.6-1.6M13.2 6.8l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </Base>
  );
}

export function ClusterIcon(props: MissionIconProps) {
  return (
    <Base {...props}>
      <circle cx="6" cy="7" r="1" fill="currentColor" />
      <circle cx="10" cy="5.5" r="1" fill="currentColor" />
      <circle cx="14" cy="7" r="1" fill="currentColor" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" />
      <circle cx="12" cy="11.5" r="1" fill="currentColor" />
      <circle cx="9.5" cy="14.5" r="1" fill="currentColor" />
      <circle cx="13" cy="14" r="0.7" fill="currentColor" opacity="0.6" />
    </Base>
  );
}

export function GalaxyIcon(props: MissionIconProps) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="1.4" fill="currentColor" />
      <path
        d="M10 4c3 0 5.5 2.7 5.5 5.5s-3 4-5.5 4-5-2-5-4 2-5.5 5-5.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M10 16c-3 0-5.5-2.7-5.5-5.5s3-4 5.5-4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </Base>
  );
}

export function SupernovaIcon(props: MissionIconProps) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="1.6" fill="currentColor" />
      <path
        d="M10 2.5v3.5M10 14v3.5M2.5 10h3.5M14 10h3.5M4.7 4.7l2.5 2.5M12.8 12.8l2.5 2.5M4.7 15.3l2.5-2.5M12.8 7.2l2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </Base>
  );
}

export function TelescopeMissionIcon(props: MissionIconProps) {
  return (
    <Base {...props}>
      <path
        d="M3.5 9.5l8-3 1.2 3.4-8 3z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 12.5l1.5 4.5M9 11.5l1.8 5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="14.5" cy="6" r="1.4" stroke="currentColor" strokeWidth="1" />
    </Base>
  );
}

export function NightSkyIcon(props: MissionIconProps) {
  return (
    <Base {...props}>
      <path
        d="M3 14c2-3 4-3 6.5-1.5C12 14 14 13 17 11"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="6" cy="6" r="0.7" fill="currentColor" />
      <circle cx="11" cy="5" r="0.7" fill="currentColor" />
      <circle cx="15" cy="7.5" r="0.7" fill="currentColor" />
      <circle cx="8.5" cy="9" r="0.5" fill="currentColor" opacity="0.6" />
    </Base>
  );
}

export function TargetIcon(props: MissionIconProps) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </Base>
  );
}

type IconComp = React.FC<MissionIconProps>;

const MISSION_ICONS: Record<string, IconComp> = {
  demo: TargetIcon,
  'quick-jupiter': PlanetIcon,
  'quick-saturn': RingedPlanetIcon,
  'free-observation': NightSkyIcon,
  moon: MoonIcon,
  jupiter: PlanetIcon,
  saturn: RingedPlanetIcon,
  orion: NebulaIcon,
  pleiades: ClusterIcon,
  andromeda: GalaxyIcon,
  crab: SupernovaIcon,
};

export function getMissionIcon(missionId: string): IconComp {
  return MISSION_ICONS[missionId] ?? TelescopeMissionIcon;
}
