import { CELESTIAL_ICONS } from '@/components/sky/CelestialIcons';

export interface SkyMission {
  id: string;
  name: string;
  iconKey: keyof typeof CELESTIAL_ICONS;
  stars: number;
  type: 'planet' | 'moon' | 'cluster' | 'nebula' | 'galaxy';
  defaultSkyPosition: { top: string; left: string };
  description: string;
}

export const SKY_MISSIONS: SkyMission[] = [
  { id: 'jupiter',        name: 'Jupiter',             iconKey: 'jupiter',        stars: 75,  type: 'planet',  defaultSkyPosition: { top: '46%', left: '32%' }, description: 'Gas giant · 4 Galilean moons' },
  { id: 'moon',           name: 'The Moon',            iconKey: 'moon',           stars: 50,  type: 'moon',    defaultSkyPosition: { top: '55%', left: '72%' }, description: 'Our nearest neighbor' },
  { id: 'saturn',         name: 'Saturn',              iconKey: 'saturn',         stars: 100, type: 'planet',  defaultSkyPosition: { top: '62%', left: '22%' }, description: 'Ringed giant' },
  { id: 'pleiades',       name: 'Pleiades · M45',      iconKey: 'pleiades',       stars: 60,  type: 'cluster', defaultSkyPosition: { top: '22%', left: '58%' }, description: 'Seven Sisters star cluster' },
  { id: 'orion_nebula',   name: 'Orion Nebula · M42',  iconKey: 'orion_nebula',   stars: 100, type: 'nebula',  defaultSkyPosition: { top: '64%', left: '65%' }, description: 'Stellar nursery in Orion' },
  { id: 'andromeda',      name: 'Andromeda · M31',     iconKey: 'andromeda',      stars: 175, type: 'galaxy',  defaultSkyPosition: { top: '78%', left: '85%' }, description: '2.5 million light-years away' },
  { id: 'double_cluster', name: 'Double Cluster',      iconKey: 'double_cluster', stars: 80,  type: 'cluster', defaultSkyPosition: { top: '15%', left: '82%' }, description: 'Twin open clusters in Perseus' },
  { id: 'mars',           name: 'Mars',                iconKey: 'mars',           stars: 75,  type: 'planet',  defaultSkyPosition: { top: '72%', left: '10%' }, description: 'The Red Planet' },
  { id: 'ring_nebula',    name: 'Ring Nebula · M57',   iconKey: 'ring_nebula',    stars: 140, type: 'nebula',  defaultSkyPosition: { top: '86%', left: '48%' }, description: 'Planetary nebula in Lyra' },
  { id: 'crab_nebula',    name: 'Crab Nebula · M1',    iconKey: 'crab_nebula',    stars: 250, type: 'nebula',  defaultSkyPosition: { top: '44%', left: '14%' }, description: 'Supernova remnant in Taurus' },
];

export interface MissionRuntimeState {
  id: string;
  visible: boolean;
  isPrime: boolean;
  isDone: boolean;
  isCloudy: boolean;
  altitude?: number;
  visibilityLabel: string;
  skyPosition: { top: string; left: string };
}

const VISIBILITY_LABELS: Record<string, string> = {
  jupiter: 'HIGH',
  moon: 'HIGH',
  saturn: 'ALT 42°',
  pleiades: 'HIGH',
  orion_nebula: 'ALT 38°',
  andromeda: 'LOW NE',
  double_cluster: 'OVERHEAD',
  mars: 'ALT 28°',
  ring_nebula: 'RISING',
  crab_nebula: 'ALT 50°',
};

const CLOUDY_SECTOR = new Set(['mars', 'crab_nebula']);

export function computeMissionStates(
  missions: SkyMission[],
  opts: {
    completedIds: string[];
    cloudCoverPct: number;
    primeId?: string;
  }
): MissionRuntimeState[] {
  const { completedIds, cloudCoverPct, primeId } = opts;

  const baseStates = missions.map((m) => {
    const isCloudy = cloudCoverPct > 40 && CLOUDY_SECTOR.has(m.id);
    const isDone = completedIds.includes(m.id);
    const visible = !isCloudy;
    let visibilityLabel = VISIBILITY_LABELS[m.id] ?? 'VISIBLE';
    if (isDone) visibilityLabel = 'SEALED';
    else if (isCloudy) visibilityLabel = 'CLOUDED';

    return {
      id: m.id,
      visible,
      isPrime: false,
      isDone,
      isCloudy,
      visibilityLabel,
      skyPosition: m.defaultSkyPosition,
    };
  });

  let resolvedPrimeId = primeId;
  if (!resolvedPrimeId) {
    const jupiter = baseStates.find((s) => s.id === 'jupiter');
    if (jupiter && jupiter.visible && !jupiter.isDone) {
      resolvedPrimeId = 'jupiter';
    } else {
      const candidates = baseStates
        .map((s) => ({ state: s, mission: missions.find((m) => m.id === s.id)! }))
        .filter(({ state, mission }) => state.visible && !state.isDone && mission.id !== 'crab_nebula')
        .sort((a, b) => b.mission.stars - a.mission.stars);
      resolvedPrimeId = candidates[0]?.mission.id;
    }
  }

  return baseStates.map((s) => ({
    ...s,
    isPrime: s.id === resolvedPrimeId && !s.isDone && !s.isCloudy,
  }));
}
