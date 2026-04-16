import { NextRequest, NextResponse } from 'next/server';
import { Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!,
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let claims;
  try {
    claims = await privy.verifyAuthToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amountSOL, label, orderId } = await req.json();

  const merchantWallet = process.env.NEXT_PUBLIC_MERCHANT_WALLET;
  if (!merchantWallet) {
    return NextResponse.json({ error: 'Merchant wallet not configured' }, { status: 503 });
  }

  let recipient: PublicKey;
  try {
    recipient = new PublicKey(merchantWallet);
  } catch {
    return NextResponse.json({ error: 'Invalid merchant wallet address' }, { status: 503 });
  }

  if (typeof amountSOL !== 'number' || amountSOL <= 0) {
    return NextResponse.json({ error: 'amountSOL must be a positive number' }, { status: 400 });
  }

  // Generate a unique reference key so we can confirm this specific payment
  const reference = Keypair.generate().publicKey;

  const url = encodeURL({
    recipient,
    amount: new BigNumber(amountSOL),
    reference,
    label: label ?? 'Stellarr',
    memo: orderId ?? undefined,
    message: `Order ${orderId ?? ''} — Stellarr`,
  });

  return NextResponse.json({
    url: url.toString(),
    reference: reference.toBase58(),
    orderId,
    userAddress: claims.userId,
  });
}
