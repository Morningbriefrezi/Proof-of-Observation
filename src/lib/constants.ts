import type { Mission } from './types';

export const ECOSYSTEM = {
  store: 'https://astroman.ge',
  club: 'https://club.astroman.ge',
  sky: 'https://sky.astroman.ge',
  app: '/',
};

export const SPONSORS = {
  farmhawk: 'https://farmhawk.ai',
  pollinet: 'https://github.com/pollinet/pollinet',
  scriptonia: 'https://scriptonia.xyz',
  cyreneai: 'https://cyreneai.com',
  superteam: 'https://superteam.fun',
  solana: 'https://solana.com',
};

export const MISSIONS: Mission[] = [
  { id: 'moon', name: 'The Moon', emoji: '🌕', difficulty: 'Beginner',
    stars: 50, type: 'naked_eye',
    desc: 'Observe the lunar surface. Identify at least 3 craters.',
    hint: 'Best viewed during first/last quarter for crater shadow detail.',
    context: 'lunar_surface_observation' },
  { id: 'jupiter', name: 'Jupiter', emoji: '🪐', difficulty: 'Beginner',
    stars: 75, type: 'telescope',
    desc: 'Locate Jupiter and observe its Galilean moons.',
    hint: "Look for the bright 'star' that doesn't twinkle.",
    context: 'gas_giant_galilean_moons' },
  { id: 'orion', name: 'Orion Nebula', emoji: '✨', difficulty: 'Intermediate',
    stars: 100, type: 'telescope',
    desc: "Find M42 in Orion's sword. Photograph the nebula.",
    hint: "Below the three belt stars — middle 'star' of the sword.",
    context: 'deep_sky_m42_nebula' },
  { id: 'saturn', name: 'Saturn', emoji: '🪐', difficulty: 'Intermediate',
    stars: 100, type: 'telescope',
    desc: "Observe Saturn's rings.",
    hint: "Even a small telescope shows rings. Yellowish 'star'.",
    context: 'ring_system_observation' },
  { id: 'pleiades', name: 'Pleiades (M45)', emoji: '💫', difficulty: 'Beginner',
    stars: 60, type: 'naked_eye',
    desc: 'Locate the Seven Sisters star cluster.',
    hint: 'Fuzzy patch to naked eye. Binoculars show dozens of stars.',
    context: 'open_cluster_m45_seven_sisters' },
];

export const TELESCOPE_BRANDS = ['Celestron', 'National Geographic', 'Meade', 'Sky-Watcher', 'Orion', 'Other'];

export const AGENT_META = {
  name: 'STELLAR Observer Agent',
  version: '1.0.0',
  platform: 'cyreneai',
  description: 'Autonomous sky observation verification agent',
  capabilities: ['capture', 'verify', 'mint'],
  oracle: 'farmhawk_v1',
  network: 'solana_devnet',
};

export const CONTEXT_ENGINE = {
  provider: 'scriptonia',
  version: '1.0',
  model: 'mission-context-v1',
  url: 'https://scriptonia.xyz',
};
