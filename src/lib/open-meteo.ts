// Resilient Open-Meteo fetcher: one retry with backoff, then last-known-good cache.
// Cache lives for the lifetime of the serverless instance (per-region warm process)
// and bridges short upstream outages without serving wildly stale weather.

const MAX_AGE_MS = 6 * 60 * 60 * 1000 // 6 hours

interface CacheEntry {
  data: unknown
  at: number
}

const cache = new Map<string, CacheEntry>()

interface OpenMeteoOptions {
  /** Next.js fetch revalidate window in seconds */
  revalidate?: number
  /** Per-attempt network timeout, ms */
  timeoutMs?: number
}

async function attempt(url: string, opts: OpenMeteoOptions): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 5000)
  try {
    return await fetch(url, {
      signal: controller.signal,
      next: opts.revalidate ? { revalidate: opts.revalidate } : undefined,
    })
  } finally {
    clearTimeout(timer)
  }
}

export interface OpenMeteoResult<T> {
  data: T
  /** True when we served from last-known-good after live fetch failed */
  stale: boolean
  /** Age of the served data in ms when stale; 0 when live */
  staleMs: number
}

/**
 * Fetch JSON from Open-Meteo with one retry and a last-known-good fallback.
 * Throws only if both attempts fail AND no cached value exists for this URL.
 */
export async function fetchOpenMeteo<T = unknown>(
  url: string,
  opts: OpenMeteoOptions = {},
): Promise<OpenMeteoResult<T>> {
  let lastErr: unknown
  for (let i = 0; i < 2; i++) {
    try {
      const res = await attempt(url, opts)
      if (res.ok) {
        const data = (await res.json()) as T
        cache.set(url, { data, at: Date.now() })
        return { data, stale: false, staleMs: 0 }
      }
      lastErr = new Error(`Open-Meteo HTTP ${res.status}`)
    } catch (err) {
      lastErr = err
    }
    if (i === 0) await new Promise(r => setTimeout(r, 400))
  }

  const cached = cache.get(url)
  if (cached && Date.now() - cached.at < MAX_AGE_MS) {
    return { data: cached.data as T, stale: true, staleMs: Date.now() - cached.at }
  }

  throw lastErr instanceof Error ? lastErr : new Error('Open-Meteo unavailable')
}
