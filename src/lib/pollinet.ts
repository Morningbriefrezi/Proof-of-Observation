import type { PollinetStatus } from './types';

export function getPollinetStatus(): PollinetStatus {
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
  if (online) return { online: true, mode: 'direct', peers: 0, label: 'Direct to Solana', icon: '🟢' };
  const peers = Math.floor(Math.random() * 3) + 1;
  return { online: false, mode: 'mesh', peers, label: `Pollinet Mesh (${peers} peers)`, icon: '📡' };
}
