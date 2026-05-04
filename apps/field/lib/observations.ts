import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, type Observation } from './supabase';

const QUEUE_KEY = 'stellar.field.observation-queue.v1';

export type DraftObservation = {
  user_id: string;
  target: string;
  notes: string;
  source: 'voice' | 'text';
  recorded_at?: string;
};

export type QueuedObservation = DraftObservation & {
  local_id: string;
  queued_at: string;
};

function uuid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function readQueue(): Promise<QueuedObservation[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeQueue(queue: QueuedObservation[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function getQueue(): Promise<QueuedObservation[]> {
  return readQueue();
}

export async function enqueue(draft: DraftObservation): Promise<QueuedObservation> {
  const queue = await readQueue();
  const item: QueuedObservation = {
    ...draft,
    recorded_at: draft.recorded_at ?? new Date().toISOString(),
    local_id: uuid(),
    queued_at: new Date().toISOString(),
  };
  queue.push(item);
  await writeQueue(queue);
  return item;
}

async function pushOne(item: QueuedObservation): Promise<Observation> {
  if (!supabase) throw new Error('Supabase not configured');
  const { local_id, queued_at, ...rest } = item;
  const { data, error } = await supabase
    .from('observations')
    .insert({ ...rest, recorded_at: rest.recorded_at ?? new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data as Observation;
}

export type SaveResult =
  | { status: 'synced'; observation: Observation }
  | { status: 'queued'; observation: QueuedObservation; reason: 'offline' | 'no-supabase' | 'error'; error?: string };

export async function saveObservation(draft: DraftObservation): Promise<SaveResult> {
  if (!supabase) {
    const queued = await enqueue(draft);
    return { status: 'queued', observation: queued, reason: 'no-supabase' };
  }
  try {
    const item: QueuedObservation = {
      ...draft,
      recorded_at: draft.recorded_at ?? new Date().toISOString(),
      local_id: uuid(),
      queued_at: new Date().toISOString(),
    };
    const observation = await pushOne(item);
    return { status: 'synced', observation };
  } catch (err: any) {
    const queued = await enqueue(draft);
    const offline = /network|fetch|TypeError|Failed to fetch/i.test(String(err?.message ?? ''));
    return {
      status: 'queued',
      observation: queued,
      reason: offline ? 'offline' : 'error',
      error: err?.message,
    };
  }
}

export async function flushQueue(): Promise<{ synced: number; failed: number }> {
  if (!supabase) return { synced: 0, failed: 0 };
  const queue = await readQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  const remaining: QueuedObservation[] = [];
  let synced = 0;
  let failed = 0;
  for (const item of queue) {
    try {
      await pushOne(item);
      synced += 1;
    } catch {
      remaining.push(item);
      failed += 1;
    }
  }
  await writeQueue(remaining);
  return { synced, failed };
}

export async function clearQueue(): Promise<void> {
  await writeQueue([]);
}
