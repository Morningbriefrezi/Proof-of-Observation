import type { PollinetStatus, CompletedMission } from './types';

// Pollinet Integration
// Pollinet provides offline-first transaction relay for Solana.
// When the user is offline, observations are queued in IndexedDB.
// When connectivity returns, the queue is drained and transactions are submitted.
// This simulates Pollinet's mesh relay concept using browser-native offline capabilities.

const DB_NAME = 'stellar_pollinet';
const STORE_NAME = 'offline_queue';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function queueOfflineObservation(mission: CompletedMission): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ ...mission, queuedAt: Date.now() });
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    console.log('%c[Pollinet] 🟡 Status:', 'color: #34d399; font-weight: bold', 'Offline queue');
    console.log('[Pollinet] Queued observation:', mission.id);
  } catch (e) {
    console.error('[Pollinet] Failed to queue:', e);
  }
}

export async function getQueuedObservations(): Promise<CompletedMission[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function removeFromQueue(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    console.log('[Pollinet] Removed from queue:', id);
  } catch (e) {
    console.error('[Pollinet] Failed to remove:', e);
  }
}

export function getPollinetStatus(): PollinetStatus {
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true;

  if (online) {
    console.log('%c[Pollinet] 🟢 Status:', 'color: #34d399; font-weight: bold', 'Direct relay');
    return {
      online: true,
      mode: 'direct',
      peers: 0,
      label: 'Pollinet: Direct to Solana',
      icon: '🟢',
    };
  }

  return {
    online: false,
    mode: 'mesh',
    peers: 0,
    label: 'Pollinet: Offline — queuing locally',
    icon: '🟡',
  };
}

export function initPollinetSync(onProcess: (mission: CompletedMission) => Promise<void>): () => void {
  const handler = async () => {
    const queued = await getQueuedObservations();
    if (queued.length === 0) return;
    console.log(`[Pollinet] Back online — draining ${queued.length} queued observations`);
    for (const m of queued) {
      try {
        await onProcess(m);
        await removeFromQueue(m.id);
        console.log(`[Pollinet] Processed: ${m.id}`);
      } catch (e) {
        console.error(`[Pollinet] Failed to process ${m.id}:`, e);
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('online', handler);
    if (navigator.onLine) handler();
    return () => window.removeEventListener('online', handler);
  }
  return () => {};
}
