'use client';

import {
  MoonIcon,
  JupiterIcon,
  SaturnIcon,
  OrionNebulaIcon,
  PleiadesIcon,
  AndromedaIcon,
  CrabNebulaIcon,
  NightSkyIcon,
  TelescopeIcon,
} from '@/components/icons/CelestialIcons';

export { MoonIcon, JupiterIcon, SaturnIcon, OrionNebulaIcon as NebulaIcon, PleiadesIcon };

export function MissionIcon({ id, size = 40, animate }: { id: string; size?: number; animate?: boolean }) {
  const props = { size, animate };
  switch (id) {
    case 'moon':             return <MoonIcon {...props}/>;
    case 'jupiter':          return <JupiterIcon {...props}/>;
    case 'saturn':           return <SaturnIcon {...props}/>;
    case 'orion':            return <OrionNebulaIcon {...props}/>;
    case 'pleiades':         return <PleiadesIcon {...props}/>;
    case 'andromeda':        return <AndromedaIcon {...props}/>;
    case 'crab':             return <CrabNebulaIcon {...props}/>;
    case 'free-observation': return <NightSkyIcon {...props}/>;
    default:                 return <TelescopeIcon {...props}/>;
  }
}
