// src/app/api/sky/timeline/route.ts
// Returns hourly altitude predictions for each major sky target across the next 12 hours.
// Used by the Tonight's observation timeline section on /sky.

import { NextResponse } from 'next/server';
import {
  Body,
  Equator,
  Horizon,
  Observer,
  AstroTime,
  Search,
  // For deep sky objects we use J2000 RA/Dec from a static catalog
} from 'astronomy-engine';

// Static catalog for deep sky targets (RA in hours, Dec in degrees, J2000)
const DEEP_SKY = [
  { name: 'Orion (M42)', ra: 5.5881, dec: -5.3911, color: '#8465CB' },
  { name: 'Andromeda', ra: 0.7123, dec: 41.2692, color: '#5DCAA5' },
];

const PLANET_BODIES = [
  { name: 'Jupiter', body: Body.Jupiter, color: '#FFD166' },
  { name: 'Venus', body: Body.Venus, color: '#F0E5C0' },
  { name: 'Mars', body: Body.Mars, color: '#C84A2E' },
  { name: 'Saturn', body: Body.Saturn, color: '#D4A954' },
  { name: 'Mercury', body: Body.Mercury, color: '#A8A290' },
];

interface HourlyPoint {
  hour: string;       // ISO timestamp
  altitude: number;
}

interface Target {
  name: string;
  color: string;
  hourly: HourlyPoint[];
  peakTime: string | null;  // 'HH:mm' of max altitude in window, or 'setting'/'rising'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lon = parseFloat(searchParams.get('lon') ?? '');

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: 'lat and lon required' }, { status: 400 });
  }

  const observer = new Observer(lat, lon, 0);
  const start = new Date();
  // Snap to next whole hour
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);

  // 12 hourly slots
  const hours: Date[] = [];
  for (let i = 0; i < 12; i++) {
    const h = new Date(start);
    h.setHours(start.getHours() + i);
    hours.push(h);
  }

  const targets: Target[] = [];

  // Planets
  for (const { name, body, color } of PLANET_BODIES) {
    const hourly: HourlyPoint[] = hours.map((h) => {
      const time = new AstroTime(h);
      const equatorial = Equator(body, time, observer, true, true);
      const horizontal = Horizon(time, observer, equatorial.ra, equatorial.dec, 'normal');
      return { hour: h.toISOString(), altitude: horizontal.altitude };
    });
    targets.push({
      name,
      color,
      hourly,
      peakTime: findPeakTime(hourly),
    });
  }

  // Deep sky
  for (const { name, ra, dec, color } of DEEP_SKY) {
    const hourly: HourlyPoint[] = hours.map((h) => {
      const time = new AstroTime(h);
      const horizontal = Horizon(time, observer, ra, dec, 'normal');
      return { hour: h.toISOString(), altitude: horizontal.altitude };
    });
    targets.push({
      name,
      color,
      hourly,
      peakTime: findPeakTime(hourly),
    });
  }

  // Sort: targets that peak in the window first, then setting/rising
  targets.sort((a, b) => {
    const maxA = Math.max(...a.hourly.map((p) => p.altitude));
    const maxB = Math.max(...b.hourly.map((p) => p.altitude));
    return maxB - maxA;
  });

  return NextResponse.json(
    { targets, windowStart: hours[0].toISOString(), windowEnd: hours[hours.length - 1].toISOString() },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
      },
    }
  );
}

function findPeakTime(hourly: HourlyPoint[]): string | null {
  let maxAlt = -90;
  let maxIdx = -1;
  for (let i = 0; i < hourly.length; i++) {
    if (hourly[i].altitude > maxAlt) {
      maxAlt = hourly[i].altitude;
      maxIdx = i;
    }
  }

  if (maxAlt < 5) {
    // Object never rises above the horizon meaningfully in this window
    const first = hourly[0]?.altitude ?? -90;
    const last = hourly[hourly.length - 1]?.altitude ?? -90;
    if (first > 0 && last < 0) return 'setting';
    if (first < 0 && last > 0) return 'rising';
    return null;
  }

  // Find the precise peak by checking adjacent hours
  const peakHour = new Date(hourly[maxIdx].hour);
  return `peak ${peakHour.getHours().toString().padStart(2, '0')}:00`;
}
