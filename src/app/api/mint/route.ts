import { NextRequest, NextResponse } from 'next/server';
import { mintCompressedNFT } from '@/lib/mint-nft';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userAddress, target, timestampMs, lat, lon, cloudCover, oracleHash, stars } = body;

  if (!target || typeof target !== 'string' || target.length === 0) {
    return NextResponse.json({ error: 'target is required' }, { status: 400 });
  }
  if (typeof timestampMs !== 'number' || !isFinite(timestampMs) || timestampMs <= 0) {
    return NextResponse.json({ error: 'timestampMs must be a positive finite number' }, { status: 400 });
  }
  if (typeof cloudCover !== 'number' || cloudCover < 0 || cloudCover > 100) {
    return NextResponse.json({ error: 'cloudCover must be 0–100' }, { status: 400 });
  }
  if (cloudCover > 70) {
    return NextResponse.json({ error: 'Sky too cloudy', cloudCover }, { status: 400 });
  }
  if (typeof lat !== 'number' || !isFinite(lat) || lat < -90 || lat > 90) {
    return NextResponse.json({ error: 'lat must be -90 to 90' }, { status: 400 });
  }
  if (typeof lon !== 'number' || !isFinite(lon) || lon < -180 || lon > 180) {
    return NextResponse.json({ error: 'lon must be -180 to 180' }, { status: 400 });
  }
  if (typeof stars !== 'number' || !Number.isInteger(stars) || stars <= 0) {
    return NextResponse.json({ error: 'stars must be a positive integer' }, { status: 400 });
  }

  try {
    const { txId } = await mintCompressedNFT({ userAddress, target, timestampMs, lat, lon, cloudCover, oracleHash, stars });
    return NextResponse.json({ txId, explorerUrl: `https://explorer.solana.com/tx/${txId}?cluster=devnet` });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[mint] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
