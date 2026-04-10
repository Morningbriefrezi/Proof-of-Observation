import { Body, Observer, Equator, Horizon, MoonPhase } from 'astronomy-engine';
import type { ObservationTarget } from '@/lib/types';

function getMoonPhaseName(angle: number): string {
  if (angle < 22.5 || angle >= 337.5) return 'New Moon';
  if (angle < 67.5) return 'Waxing Crescent';
  if (angle < 112.5) return 'First Quarter';
  if (angle < 157.5) return 'Waxing Gibbous';
  if (angle < 202.5) return 'Full Moon';
  if (angle < 247.5) return 'Waning Gibbous';
  if (angle < 292.5) return 'Last Quarter';
  return 'Waning Crescent';
}

function getBodyAltitude(body: Body, lat: number, lon: number, date: Date): number {
  const observer = new Observer(lat, lon, 0);
  const eq = Equator(body, date, observer, true, true);
  const horiz = Horizon(date, observer, eq.ra, eq.dec, 'normal');
  return horiz.altitude;
}

async function getCurrentCloudCover(lat: number, lon: number): Promise<number> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=cloud_cover`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return 30; // assume moderate if API fails
    const data = await res.json();
    return data.current?.cloud_cover ?? 30;
  } catch {
    return 30;
  }
}

const PLANET_BODIES: Record<string, Body> = {
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
};

export async function checkObjectVisibility(params: {
  target: ObservationTarget;
  identifiedObject: string;
  lat: number;
  lon: number;
  timestamp: Date;
}): Promise<{ objectVisible: boolean; expectedAltitude?: number; expectedPhase?: string }> {
  const { target, identifiedObject, lat, lon, timestamp } = params;

  try {
    if (target === 'moon') {
      const altitude = getBodyAltitude(Body.Moon, lat, lon, timestamp);
      const phaseAngle = MoonPhase(timestamp);
      const expectedPhase = getMoonPhaseName(phaseAngle);
      return {
        objectVisible: altitude > 0,
        expectedAltitude: Math.round(altitude * 10) / 10,
        expectedPhase,
      };
    }

    if (target === 'planet') {
      const name = identifiedObject.toLowerCase();
      const body = Object.entries(PLANET_BODIES).find(([key]) => name.includes(key))?.[1];
      if (body) {
        const altitude = getBodyAltitude(body, lat, lon, timestamp);
        return {
          objectVisible: altitude > 5,
          expectedAltitude: Math.round(altitude * 10) / 10,
        };
      }
      return { objectVisible: true };
    }

    if (target === 'stars' || target === 'constellation') {
      const cloudCover = await getCurrentCloudCover(lat, lon);
      return { objectVisible: cloudCover < 60 };
    }

    if (target === 'deep_sky') {
      const cloudCover = await getCurrentCloudCover(lat, lon);
      return { objectVisible: cloudCover < 30 };
    }

    // unknown
    return { objectVisible: true };
  } catch (err) {
    console.error('[astronomy-check] Error:', err);
    return { objectVisible: true };
  }
}
