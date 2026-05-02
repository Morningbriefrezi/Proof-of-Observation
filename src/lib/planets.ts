import {
  Body,
  Observer,
  Equator,
  Horizon,
  Illumination,
  SearchRiseSet,
  SearchHourAngle,
  Constellation,
} from 'astronomy-engine';

export interface PlanetInfo {
  key: string;
  name: string;
  altitude: number;
  azimuth: number;
  azimuthDir: string;
  rise: Date | string | null;
  transit: Date | string | null;
  set: Date | string | null;
  magnitude: number;
  visible: boolean;
  constellation?: string;
}

const BODIES: { body: Body; key: string }[] = [
  { body: Body.Moon,    key: 'moon' },
  { body: Body.Mercury, key: 'mercury' },
  { body: Body.Venus,   key: 'venus' },
  { body: Body.Mars,    key: 'mars' },
  { body: Body.Jupiter, key: 'jupiter' },
  { body: Body.Saturn,  key: 'saturn' },
];

const AZ_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

function azDir(az: number): string {
  return AZ_DIRS[Math.round(az / 45) % 8];
}

function fmtTime(d: Date | null): Date | null {
  return d;
}

/**
 * Sample each planet across a window (typically tonight's astronomical dark
 * window) and return its peak altitude/azimuth during that window. Planets
 * that never get above the horizon during the window still appear in the
 * results so callers can decide whether to filter them out.
 *
 * `transit` in the returned data is overwritten with the *peak time during
 * the window* — this is what UIs label as "peak HH:MM tonight".
 */
export function getWindowPlanets(
  lat: number,
  lng: number,
  windowStart: Date,
  windowEnd: Date,
  samples: number = 9,
): PlanetInfo[] {
  if (samples < 2 || windowEnd.getTime() <= windowStart.getTime()) {
    return getVisiblePlanets(lat, lng, windowStart);
  }
  const step = (windowEnd.getTime() - windowStart.getTime()) / (samples - 1);
  const best = new Map<string, { info: PlanetInfo; peakAt: Date }>();
  for (let i = 0; i < samples; i++) {
    const t = new Date(windowStart.getTime() + step * i);
    const planets = getVisiblePlanets(lat, lng, t);
    for (const p of planets) {
      const prev = best.get(p.key);
      if (!prev || p.altitude > prev.info.altitude) {
        best.set(p.key, { info: p, peakAt: t });
      }
    }
  }
  return Array.from(best.values())
    .map(({ info, peakAt }) => ({
      ...info,
      transit: peakAt,
      visible: info.altitude > 0,
    }))
    .sort((a, b) => b.altitude - a.altitude);
}

export function getVisiblePlanets(lat: number, lng: number, date: Date): PlanetInfo[] {
  const observer = new Observer(lat, lng, 0);

  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);

  return BODIES.flatMap(({ body, key }) => {
    try {
      const eq    = Equator(body, date, observer, true, true);
      const horiz = Horizon(date, observer, eq.ra, eq.dec, 'normal');

      let magnitude = 0;
      try { magnitude = Illumination(body, date).mag; } catch { /* ignore */ }

      // Anchor rise/set searches at `date` (not midnight) so the pair is
      // coherent relative to "now": for a planet currently up, set is the
      // upcoming set and rise is the next rise after that. For one below
      // the horizon, rise is the upcoming rise and set is the set that
      // follows. Either way, callers get a usable next-event timestamp.
      let rise: Date | null = null;
      let set: Date | null = null;
      try { rise = SearchRiseSet(body, observer, +1, date, 1)?.date ?? null; } catch { /* ignore */ }
      try { set  = SearchRiseSet(body, observer, -1, date, 1)?.date ?? null; } catch { /* ignore */ }

      let transit: Date | null = null;
      try {
        transit = SearchHourAngle(body, observer, 0, midnight, +1).time.date;
      } catch { /* ignore */ }

      let constellation: string | undefined;
      try { constellation = Constellation(eq.ra, eq.dec)?.name; } catch { /* ignore */ }

      return [{
        key,
        name:        key.charAt(0).toUpperCase() + key.slice(1),
        altitude:    Math.round(horiz.altitude * 10) / 10,
        azimuth:     Math.round(horiz.azimuth),
        azimuthDir:  azDir(horiz.azimuth),
        rise,
        transit,
        set,
        magnitude:   Math.round(magnitude * 10) / 10,
        visible:     horiz.altitude > 0,
        constellation,
      }];
    } catch (err) {
      console.warn(`[planets] skipping ${key}:`, err instanceof Error ? err.message : err);
      return [];
    }
  }).sort((a, b) => b.altitude - a.altitude);
}
