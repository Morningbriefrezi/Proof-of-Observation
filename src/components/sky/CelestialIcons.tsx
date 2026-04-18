import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

const svgProps = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 48 48',
  className,
  xmlns: 'http://www.w3.org/2000/svg',
});

export const JupiterIcon: React.FC<IconProps> = ({ size = 48, className }) => (
  <svg {...svgProps(size, className)}>
    <defs>
      <radialGradient id="ci-jupiter-grad" cx="35%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#FFE9C4" />
        <stop offset="40%" stopColor="#E8A87C" />
        <stop offset="75%" stopColor="#B56C3C" />
        <stop offset="100%" stopColor="#3E1E0A" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="16" fill="url(#ci-jupiter-grad)" />
    <ellipse cx="24" cy="17" rx="15" ry="1.4" fill="#8B4A24" opacity="0.55" />
    <ellipse cx="24" cy="21" rx="15.5" ry="1.2" fill="#F5D29A" opacity="0.3" />
    <ellipse cx="24" cy="27" rx="15.5" ry="1.3" fill="#8B4A24" opacity="0.55" />
    <ellipse cx="24" cy="31" rx="15" ry="1.2" fill="#F5D29A" opacity="0.3" />
    <ellipse cx="19" cy="28" rx="3.5" ry="2" fill="#A3330E" opacity="0.8" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 48, className }) => (
  <svg {...svgProps(size, className)}>
    <defs>
      <radialGradient id="ci-moon-grad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#FFFBF0" />
        <stop offset="55%" stopColor="#D4CDB8" />
        <stop offset="100%" stopColor="#6B6555" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="16" fill="url(#ci-moon-grad)" />
    <circle cx="18" cy="19" r="2.4" fill="#8B8068" opacity="0.45" />
    <circle cx="29" cy="21" r="1.6" fill="#8B8068" opacity="0.4" />
    <circle cx="22" cy="30" r="2" fill="#8B8068" opacity="0.5" />
    <circle cx="30" cy="29" r="1.3" fill="#8B8068" opacity="0.4" />
  </svg>
);

export const SaturnIcon: React.FC<IconProps> = ({ size = 48, className }) => (
  <svg {...svgProps(size, className)}>
    <defs>
      <radialGradient id="ci-saturn-grad" cx="35%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#FFE8B8" />
        <stop offset="55%" stopColor="#D4A858" />
        <stop offset="100%" stopColor="#5C3D18" />
      </radialGradient>
      <linearGradient id="ci-saturn-ring" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FFE0A0" stopOpacity="0" />
        <stop offset="50%" stopColor="#FFE0A0" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFE0A0" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g transform="rotate(-18 24 24)">
      <ellipse cx="24" cy="24" rx="22" ry="4.5" fill="none" stroke="url(#ci-saturn-ring)" strokeWidth="2" />
    </g>
    <circle cx="24" cy="24" r="11" fill="url(#ci-saturn-grad)" />
  </svg>
);

export const PleiadesIcon: React.FC<IconProps> = ({ size = 48, className }) => (
  <svg {...svgProps(size, className)}>
    <defs>
      <radialGradient id="ci-pleiades-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4A6FB5" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#4A6FB5" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="20" fill="url(#ci-pleiades-grad)" />
    <circle cx="18" cy="19" r="2.2" fill="#FFFFFF" />
    <circle cx="27" cy="17" r="1.8" fill="#FFFFFF" />
    <circle cx="31" cy="24" r="2.5" fill="#FFFFFF" />
    <circle cx="22" cy="27" r="1.6" fill="#FFFFFF" />
    <circle cx="28" cy="30" r="2" fill="#FFFFFF" />
    <circle cx="16" cy="28" r="1.4" fill="#FFFFFF" />
  </svg>
);

export const OrionNebulaIcon: React.FC<IconProps> = ({ size = 48, className }) => (
  <svg {...svgProps(size, className)}>
    <defs>
      <radialGradient id="ci-orion-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFB3C7" />
        <stop offset="55%" stopColor="#9B59B6" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#9B59B6" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="24" cy="24" rx="20" ry="16" fill="url(#ci-orion-grad)" />
    <circle cx="20" cy="22" r="1.2" fill="#FFFFFF" />
    <circle cx="27" cy="20" r="1" fill="#FFFFFF" />
    <circle cx="25" cy="27" r="1.4" fill="#FFFFFF" />
    <circle cx="30" cy="26" r="0.9" fill="#FFFFFF" />
  </svg>
);

export const AndromedaIcon: React.FC<IconProps> = ({ size = 48, className }) => (
  <svg {...svgProps(size, className)}>
    <defs>
      <radialGradient id="ci-andromeda-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFE9C4" />
        <stop offset="55%" stopColor="#C4A474" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#C4A474" stopOpacity="0" />
      </radialGradient>
    </defs>
    <g transform="rotate(-25 24 24)">
      <ellipse cx="24" cy="24" rx="22" ry="6" fill="url(#ci-andromeda-grad)" />
    </g>
    <circle cx="24" cy="24" r="2" fill="#FFFFFF" />
  </svg>
);

export const DoubleClusterIcon: React.FC<IconProps> = ({ size = 48, className }) => (
  <svg {...svgProps(size, className)}>
    <defs>
      <radialGradient id="ci-dc-left" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#B8D0FF" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#B8D0FF" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ci-dc-right" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD6A0" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#FFD6A0" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="24" r="10" fill="url(#ci-dc-left)" />
    <circle cx="32" cy="24" r="10" fill="url(#ci-dc-right)" />
    <circle cx="14" cy="22" r="1.2" fill="#FFFFFF" />
    <circle cx="18" cy="24" r="1.6" fill="#FFFFFF" />
    <circle cx="16" cy="27" r="1.1" fill="#FFFFFF" />
    <circle cx="30" cy="22" r="1.2" fill="#FFFFFF" />
    <circle cx="34" cy="24" r="1.5" fill="#FFFFFF" />
    <circle cx="32" cy="27" r="1.1" fill="#FFFFFF" />
  </svg>
);

export const MarsIcon: React.FC<IconProps> = ({ size = 48, className }) => (
  <svg {...svgProps(size, className)}>
    <defs>
      <radialGradient id="ci-mars-grad" cx="35%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#FF8555" />
        <stop offset="55%" stopColor="#B4412A" />
        <stop offset="100%" stopColor="#3E1408" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="16" fill="url(#ci-mars-grad)" />
    <ellipse cx="19" cy="22" rx="4" ry="2" fill="#7A2810" opacity="0.45" />
    <ellipse cx="28" cy="28" rx="3.5" ry="1.8" fill="#7A2810" opacity="0.5" />
  </svg>
);

export const RingNebulaIcon: React.FC<IconProps> = ({ size = 48, className }) => (
  <svg {...svgProps(size, className)}>
    <defs>
      <radialGradient id="ci-ring-grad" cx="50%" cy="50%" r="50%">
        <stop offset="30%" stopColor="#6DCFC4" stopOpacity="0" />
        <stop offset="45%" stopColor="#6DCFC4" stopOpacity="0.8" />
        <stop offset="65%" stopColor="#8465CB" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#8465CB" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="18" fill="url(#ci-ring-grad)" />
    <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />
  </svg>
);

export const CrabNebulaIcon: React.FC<IconProps> = ({ size = 48, className }) => (
  <svg {...svgProps(size, className)}>
    <defs>
      <radialGradient id="ci-crab-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF8A8A" stopOpacity="0.8" />
        <stop offset="55%" stopColor="#B84A9F" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#B84A9F" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="24" cy="24" rx="18" ry="12" fill="url(#ci-crab-grad)" />
  </svg>
);

export const CELESTIAL_ICONS: Record<string, React.FC<IconProps>> = {
  jupiter: JupiterIcon,
  moon: MoonIcon,
  saturn: SaturnIcon,
  pleiades: PleiadesIcon,
  orion_nebula: OrionNebulaIcon,
  andromeda: AndromedaIcon,
  double_cluster: DoubleClusterIcon,
  mars: MarsIcon,
  ring_nebula: RingNebulaIcon,
  crab_nebula: CrabNebulaIcon,
};
