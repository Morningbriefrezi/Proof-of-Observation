import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { findReference } from '@solana/pay';

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference');
  if (!reference) {
    return NextResponse.json({ confirmed: false, error: 'reference required' }, { status: 400 });
  }

  let referenceKey: PublicKey;
  try {
    referenceKey = new PublicKey(reference);
  } catch {
    return NextResponse.json({ confirmed: false, error: 'invalid reference' }, { status: 400 });
  }

  const rpcUrl = process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com';
  const connection = new Connection(rpcUrl, 'confirmed');

  try {
    const sig = await findReference(connection, referenceKey, { finality: 'confirmed' });
    return NextResponse.json({ confirmed: true, signature: sig.signature });
  } catch {
    // findTransactionSignature throws if not found — this is expected while waiting
    return NextResponse.json({ confirmed: false });
  }
}
