import { NextResponse } from 'next/server';
import { LOCATIONS } from '@/lib/darksky-locations';

export async function GET() {
  return NextResponse.json(
    { locations: LOCATIONS },
    { headers: { 'Cache-Control': 'public, max-age=3600' } }
  );
}
