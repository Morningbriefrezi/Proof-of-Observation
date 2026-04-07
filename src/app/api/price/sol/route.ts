import { NextResponse } from 'next/server';

export const revalidate = 60;

const GEL_PER_USD = 1 / 0.365; // 1 USD = ~2.74 GEL
const FALLBACK = { solPerGEL: 0.00135, solPrice: 137 };

export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return NextResponse.json(FALLBACK);

    const data = await res.json() as { solana?: { usd?: number } };
    const solPrice = data.solana?.usd;
    if (!solPrice) return NextResponse.json(FALLBACK);

    // solPerGEL = 1 / (solPrice * GEL_PER_USD)
    const solPerGEL = 1 / (solPrice * GEL_PER_USD);
    return NextResponse.json({ solPerGEL: +solPerGEL.toFixed(6), solPrice });
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
