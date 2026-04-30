// Live Bortle class lookup driven by the World Atlas 2015 (Falchi et al.)
// VIIRS-derived raster served by lightpollutionmap.info. Falls back to the
// static DarkSky catalog if the upstream is unreachable or returns an
// unexpected shape.

import { LOCATIONS } from './darksky-locations';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // light pollution barely changes day-to-day
const cache = new Map<string, { bortle: number; at: number }>();

function key(lat: number, lon: number): string {
  // ~1 km grid is plenty — light pollution doesn't change at meter scale.
  return `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function staticBortle(lat: number, lon: number): number {
  let minDist = Infinity;
  let nearest = 5;
  for (const loc of LOCATIONS) {
    const d = haversineKm(lat, lon, loc.lat, loc.lon);
    if (d < minDist) { minDist = d; nearest = loc.bortle; }
  }
  return minDist <= 50 ? nearest : 5;
}

// Falchi 2016 ratio of artificial → natural sky brightness, mapped to Bortle.
function ratioToBortle(ratio: number): number {
  if (ratio < 0.01) return 1;
  if (ratio < 0.09) return 2;
  if (ratio < 0.5)  return 3;
  if (ratio < 1)    return 4;
  if (ratio < 3)    return 5;
  if (ratio < 9)    return 6;
  if (ratio < 18)   return 7;
  if (ratio < 27)   return 8;
  return 9;
}

async function fetchLiveRatio(lat: number, lon: number): Promise<number | null> {
  const url = `https://www.lightpollutionmap.info/QueryRaster/?ql=wa_2015&qt=point&qd=${lon},${lat}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    const value = Number(text);
    return isFinite(value) && value >= 0 ? value : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function estimateBortle(lat: number, lon: number): Promise<number> {
  const k = key(lat, lon);
  const hit = cache.get(k);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.bortle;

  const ratio = await fetchLiveRatio(lat, lon);
  const bortle = ratio !== null ? ratioToBortle(ratio) : staticBortle(lat, lon);
  cache.set(k, { bortle, at: Date.now() });
  return bortle;
}
