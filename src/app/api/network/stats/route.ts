import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { observationLog } from '@/lib/schema';
import { LOCATIONS } from '@/lib/darksky-locations';

function estimateRegion(lat: number, lon: number): string {
  if (lat > 40 && lat < 44 && lon > 40 && lon < 47) return 'GE';
  if (lat > 35 && lat < 42 && lon > 25 && lon < 45) return 'TR';
  if (lat > 35 && lat < 72 && lon > -10 && lon < 40) return 'EU';
  if (lat > 25 && lat < 50 && lon > -130 && lon < -60) return 'US';
  if (lat < 0 && lon > -80 && lon < -30) return 'SA';
  return 'OTHER';
}

export async function GET() {
  const db = getDb();

  const bortleReadings = LOCATIONS.length;
  const darkSites = LOCATIONS.filter(l => l.bortle <= 3).length;

  const regionSet = new Set<string>();
  for (const loc of LOCATIONS) regionSet.add(estimateRegion(loc.lat, loc.lon));

  let observationCount = 0;
  let uniqueWallets = 0;

  if (db) {
    try {
      const rows = await db
        .select({
          wallet: observationLog.wallet,
          lat: observationLog.lat,
          lon: observationLog.lon,
        })
        .from(observationLog);

      observationCount = rows.length;
      uniqueWallets = new Set(rows.map(r => r.wallet)).size;

      for (const r of rows) {
        if (typeof r.lat === 'number' && typeof r.lon === 'number') {
          regionSet.add(estimateRegion(r.lat, r.lon));
        }
      }
    } catch (err) {
      console.error('[network/stats] observation_log query failed:', err);
    }
  }

  const observers = Math.max(uniqueWallets, 1);
  const dataPoints = bortleReadings + observationCount;
  const countries = Math.max(regionSet.size, 1);

  return NextResponse.json(
    {
      observers,
      dataPoints,
      darkSites,
      countries,
      lastUpdated: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    },
  );
}

