export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'voucher' | 'product' | 'experience';
  value: string;
  requirement: 'single' | 'set' | 'rank';
  requiredMissions?: string[];
  requiredRank?: string;
  requiredCount?: number;
  icon: string;
  claimed: boolean;
  code?: string;
}

export const REWARDS: Reward[] = [
  {
    id: 'first-light',
    name: 'First Light',
    description: '10% off your next purchase at astroman.ge',
    type: 'discount',
    value: '10%',
    requirement: 'single',
    requiredCount: 1,
    icon: '🎫',
    claimed: false,
    code: 'FIRSTLIGHT10',
  },
  {
    id: 'moon-reward',
    name: 'Lunar Explorer',
    description: 'Free Moon Lamp (15cm) — collect at Astroman store',
    type: 'product',
    value: '85 GEL',
    requirement: 'single',
    requiredMissions: ['moon'],
    icon: '🌕',
    claimed: false,
    code: 'MOONLAMP-POO',
  },
  {
    id: 'jupiter-reward',
    name: 'Gas Giant Hunter',
    description: '500 loyalty points on club.astroman.ge',
    type: 'voucher',
    value: '500 pts',
    requirement: 'single',
    requiredMissions: ['jupiter'],
    icon: '🪐',
    claimed: false,
    code: 'JUPITER500',
  },
  {
    id: 'beginner-set',
    name: 'Beginner Sky Set',
    description: 'Complete Moon + Jupiter + Pleiades → Free Star Projector Basic',
    type: 'product',
    value: '75 GEL',
    requirement: 'set',
    requiredMissions: ['moon', 'jupiter', 'pleiades'],
    icon: '🌟',
    claimed: false,
    code: 'SKYSET-BASIC',
  },
  {
    id: 'deep-sky-set',
    name: 'Deep Sky Explorer Set',
    description: 'Complete Orion Nebula + Saturn → 20% off any telescope',
    type: 'discount',
    value: '20%',
    requirement: 'set',
    requiredMissions: ['orion', 'saturn'],
    icon: '✨',
    claimed: false,
    code: 'DEEPSKY20',
  },
  {
    id: 'complete-all',
    name: 'Cosmos Master Collection',
    description: 'Complete ALL 5 missions → Free Custom Star Map (framed, 180 GEL value)',
    type: 'product',
    value: '180 GEL',
    requirement: 'set',
    requiredMissions: ['moon', 'jupiter', 'orion', 'saturn', 'pleiades'],
    icon: '🏆',
    claimed: false,
    code: 'COSMOS-MASTER',
  },
  {
    id: 'observer-rank',
    name: 'Observer Badge',
    description: 'Reach Observer rank → 15% off binoculars at astroman.ge',
    type: 'discount',
    value: '15%',
    requirement: 'rank',
    requiredRank: 'Observer',
    icon: '⭐',
    claimed: false,
    code: 'OBSERVER15',
  },
  {
    id: 'pathfinder-rank',
    name: 'Pathfinder Badge',
    description: 'Reach Pathfinder rank → Free Galaxy Projector Pro',
    type: 'product',
    value: '150 GEL',
    requirement: 'rank',
    requiredRank: 'Pathfinder',
    icon: '🧭',
    claimed: false,
    code: 'PATHFINDER-PRO',
  },
];

export function getRank(sightings: number): { name: string; icon: string } {
  if (sightings >= 5) return { name: 'Cosmos Master', icon: '🌌' };
  if (sightings >= 3) return { name: 'Pathfinder', icon: '🧭' };
  if (sightings >= 1) return { name: 'Observer', icon: '⭐' };
  return { name: 'Stargazer', icon: '👁️' };
}

export function getUnlockedRewards(
  completedMissionIds: string[],
  rank: string
): (Reward & { unlocked: boolean; progress: number })[] {
  return REWARDS.map(reward => {
    let unlocked = false;
    let progress = 0;

    if (reward.requirement === 'single' && reward.requiredCount) {
      unlocked = completedMissionIds.length >= reward.requiredCount;
      progress = Math.min(completedMissionIds.length / reward.requiredCount, 1);
    }

    if (reward.requirement === 'single' && reward.requiredMissions) {
      unlocked = reward.requiredMissions.every(id => completedMissionIds.includes(id));
      progress = unlocked ? 1 : 0;
    }

    if (reward.requirement === 'set' && reward.requiredMissions) {
      const completed = reward.requiredMissions.filter(id => completedMissionIds.includes(id)).length;
      progress = completed / reward.requiredMissions.length;
      unlocked = completed === reward.requiredMissions.length;
    }

    if (reward.requirement === 'rank') {
      const rankOrder = ['Stargazer', 'Observer', 'Pathfinder', 'Cosmos Master'];
      const currentRankIndex = rankOrder.indexOf(rank);
      const requiredRankIndex = rankOrder.indexOf(reward.requiredRank || '');
      unlocked = currentRankIndex >= requiredRankIndex;
      progress = unlocked ? 1 : currentRankIndex / requiredRankIndex;
    }

    return { ...reward, unlocked, progress };
  });
}

// Get mission IDs that feed into a specific reward
export const MISSION_REWARD_HINTS: Record<string, string> = {
  moon: 'Unlocks: Lunar Explorer (Free Moon Lamp)',
  jupiter: 'Unlocks: Gas Giant Hunter (500 loyalty pts)',
  orion: 'Part of: Deep Sky Explorer Set (20% off telescope)',
  saturn: 'Part of: Deep Sky Explorer Set (20% off telescope)',
  pleiades: 'Part of: Beginner Sky Set (Free Star Projector)',
};
