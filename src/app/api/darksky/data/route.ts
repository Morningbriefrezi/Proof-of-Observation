import { NextResponse } from 'next/server';
import { LOCATIONS } from '@/lib/darksky-locations';

export async function GET() {
  const features = LOCATIONS.map(loc => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [loc.lon, loc.lat],
    },
    properties: {
      name: loc.name,
      nameKa: loc.nameKa,
      bortle: loc.bortle,
      sqm: loc.sqm,
      altitude: loc.altitude,
      notes: loc.notes,
    },
  }));

  return NextResponse.json(
    { type: 'FeatureCollection', features, count: features.length },
    { headers: { 'Cache-Control': 'public, max-age=3600' } }
  );
}
