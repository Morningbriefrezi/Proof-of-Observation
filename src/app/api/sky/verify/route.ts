import { NextRequest, NextResponse } from 'next/server';
import type { SkyVerification } from '@/lib/types';
import { LOCATIONS } from '@/lib/darksky-locations';

const CARDINALS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
function azimuthToCardinal(az: number): string {
  const normalized = ((az % 360) + 360) % 360;
  return CARDINALS[Math.round(normalized / 45) % 8];
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

// TODO: replace with a real light pollution map dataset (e.g. VIIRS DMSP).
// For now we snap to the nearest known DarkSky location within 50km, otherwise default to 5.
function estimateBortle(lat: number, lon: number): number {
  let minDist = Infinity;
  let nearest = 5;
  for (const loc of LOCATIONS) {
    const d = haversineKm(lat, lon, loc.lat, loc.lon);
    if (d < minDist) {
      minDist = d;
      nearest = loc.bortle;
    }
  }
  return minDist <= 50 ? nearest : 5;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon') ?? searchParams.get('lng');

  const lat = Number(latParam);
  const lon = Number(lonParam);

  if (!latParam || !lonParam || !isFinite(lat) || !isFinite(lon)) {
    return NextResponse.json({ error: 'lat and lon are required finite numbers' }, { status: 400 });
  }
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: 'lat must be -90 to 90, lon must be -180 to 180' }, { status: 400 });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=cloud_cover,visibility,relative_humidity_2m,temperature_2m,wind_speed_10m,wind_direction_10m&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = await res.json();
    const c = data.current;

    const cloudCover: number = c.cloud_cover ?? 15;
    const visMeters: number = c.visibility ?? 20000;
    const humidity: number = c.relative_humidity_2m ?? 50;
    const temperature: number = c.temperature_2m ?? 12;
    const windSpeed: number = c.wind_speed_10m ?? 5;
    const windDirDeg: number = c.wind_direction_10m ?? 270;
    const windDirection = azimuthToCardinal(windDirDeg);
    const bortleClass = estimateBortle(lat, lon);

    let visibility: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    if (visMeters > 20000 && cloudCover < 20) visibility = 'Excellent';
    else if (visMeters > 10000 && cloudCover < 50) visibility = 'Good';
    else if (visMeters > 5000 && cloudCover < 70) visibility = 'Fair';
    else visibility = 'Poor';

    let conditions: string;
    if (cloudCover < 10) conditions = `Clear skies, ${humidity}% humidity, ${temperature}°C, wind ${windSpeed} km/h`;
    else if (cloudCover < 30) conditions = `Mostly clear (${cloudCover}% clouds), ${humidity}% humidity, ${temperature}°C`;
    else if (cloudCover < 60) conditions = `Partly cloudy (${cloudCover}% clouds), visibility ${(visMeters / 1000).toFixed(1)} km`;
    else conditions = `Cloudy (${cloudCover}% cover), limited visibility`;

    const hourSlot = Math.floor(Date.now() / 3600000);
    const hashInput = `${Number(lat).toFixed(4)},${Number(lon).toFixed(4)},${cloudCover},${hourSlot}`;
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashInput));
    const oracleHash = '0x' + Array.from(new Uint8Array(hashBuffer)).slice(0, 20).map(b => b.toString(16).padStart(2, '0')).join('');

    const result: SkyVerification = {
      verified: cloudCover < 70,
      cloudCover,
      visibility,
      visibilityMeters: visMeters,
      conditions,
      humidity,
      temperature,
      windSpeed,
      windDirection,
      bortleClass,
      oracleHash,
      verifiedAt: new Date().toISOString(),
    };

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Weather service unavailable — please try again in a moment' },
      { status: 503 }
    );
  }
}
