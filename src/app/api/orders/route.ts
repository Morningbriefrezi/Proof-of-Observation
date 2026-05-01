import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { PrivyClient } from '@privy-io/server-auth';
import { eq, desc, and } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { orders, users } from '@/lib/schema';
import { isValidPublicKey } from '@/lib/validate';
import { getStarsBalance } from '@/lib/solana';

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!,
);

async function authenticate(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    const claims = await privy.verifyAuthToken(token);
    return claims.userId;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const privyId = await authenticate(req);
  if (!privyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const {
    productId, productName, productImage, dealerId,
    paymentMethod, amountSol, amountStars, amountFiat, currency,
    walletAddress,
    shipping,
  } = body as {
    productId?: string; productName?: string; productImage?: string; dealerId?: string;
    paymentMethod?: 'sol' | 'stars';
    amountSol?: number; amountStars?: number; amountFiat?: number; currency?: string;
    walletAddress?: string;
    shipping?: { name?: string; phone?: string; address?: string; city?: string; country?: string; notes?: string };
  };

  const method: 'sol' | 'stars' = paymentMethod === 'stars' ? 'stars' : 'sol';

  if (!productId || !productName || !dealerId) {
    return NextResponse.json({ error: 'productId, productName, dealerId required' }, { status: 400 });
  }
  if (typeof amountFiat !== 'number' || amountFiat <= 0) {
    return NextResponse.json({ error: 'amountFiat must be a positive number' }, { status: 400 });
  }
  if (!currency) return NextResponse.json({ error: 'currency required' }, { status: 400 });
  if (!walletAddress || !isValidPublicKey(walletAddress)) {
    return NextResponse.json({ error: 'Valid walletAddress required' }, { status: 400 });
  }
  if (method === 'sol' && (typeof amountSol !== 'number' || amountSol <= 0)) {
    return NextResponse.json({ error: 'amountSol must be a positive number' }, { status: 400 });
  }
  if (method === 'stars' && (typeof amountStars !== 'number' || amountStars <= 0 || !Number.isInteger(amountStars))) {
    return NextResponse.json({ error: 'amountStars must be a positive integer' }, { status: 400 });
  }
  const s = shipping ?? {};
  for (const k of ['name', 'phone', 'address', 'city', 'country'] as const) {
    if (!s[k] || typeof s[k] !== 'string' || (s[k] as string).trim().length === 0) {
      return NextResponse.json({ error: `shipping.${k} required` }, { status: 400 });
    }
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  // STARS PAYMENT: verify on-chain balance against pending+paid stars orders, then mark paid immediately.
  if (method === 'stars') {
    const required = amountStars as number;
    let onChainBalance = 0;
    try { onChainBalance = await getStarsBalance(walletAddress); } catch { onChainBalance = 0; }
    const existing = await db
      .select({ amount: orders.amountStars })
      .from(orders)
      .where(and(eq(orders.walletAddress, walletAddress), eq(orders.paymentMethod, 'stars')));
    const alreadyRedeemed = existing.reduce((sum, r) => sum + (r.amount ?? 0), 0);
    const available = onChainBalance - alreadyRedeemed;
    if (available < required) {
      return NextResponse.json(
        { error: `Not enough stars. You have ${Math.max(0, available)}, need ${required}.`, available, required },
        { status: 400 },
      );
    }

    const referenceStr = `stars-${randomUUID()}`;
    const inserted = await db
      .insert(orders)
      .values({
        privyId, walletAddress, productId, productName,
        productImage: productImage ?? null, dealerId,
        paymentMethod: 'stars',
        amountSol: 0,
        amountStars: required,
        amountFiat,
        currency,
        paymentReference: referenceStr,
        status: 'paid',
        paidAt: new Date(),
        shippingName: (s.name as string).trim(),
        shippingPhone: (s.phone as string).trim(),
        shippingAddress: (s.address as string).trim(),
        shippingCity: (s.city as string).trim(),
        shippingCountry: (s.country as string).trim(),
        shippingNotes: s.notes ? s.notes.trim() : null,
      })
      .returning();
    const order = inserted[0];
    return NextResponse.json({
      orderId: order.id,
      paymentMethod: 'stars',
      amountStars: required,
      amountFiat,
      currency,
      status: 'paid',
    });
  }

  // SOL PAYMENT: generate Solana Pay reference + URL, persist as pending.
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

  const reference = Keypair.generate().publicKey;
  const referenceStr = reference.toBase58();

  const inserted = await db
    .insert(orders)
    .values({
      privyId, walletAddress, productId, productName,
      productImage: productImage ?? null, dealerId,
      paymentMethod: 'sol',
      amountSol: amountSol as number,
      amountStars: 0,
      amountFiat,
      currency,
      paymentReference: referenceStr,
      status: 'pending',
      shippingName: (s.name as string).trim(),
      shippingPhone: (s.phone as string).trim(),
      shippingAddress: (s.address as string).trim(),
      shippingCity: (s.city as string).trim(),
      shippingCountry: (s.country as string).trim(),
      shippingNotes: s.notes ? s.notes.trim() : null,
    })
    .returning();

  const order = inserted[0];

  const url = encodeURL({
    recipient,
    amount: new BigNumber(amountSol as number),
    reference,
    label: productName,
    memo: order.id,
    message: `Stellarr · ${productName}`,
  });

  return NextResponse.json({
    orderId: order.id,
    paymentMethod: 'sol',
    reference: referenceStr,
    url: url.toString(),
    amountSol,
    amountFiat,
    currency,
    status: 'pending',
  });
}

export async function GET(req: NextRequest) {
  const privyId = await authenticate(req);
  if (!privyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const walletAddress = req.nextUrl.searchParams.get('walletAddress');
  if (!walletAddress || !isValidPublicKey(walletAddress)) {
    return NextResponse.json({ error: 'Valid walletAddress required' }, { status: 400 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ orders: [] });

  // Verify wallet ownership
  const userRows = await db
    .select({ walletAddress: users.walletAddress })
    .from(users)
    .where(eq(users.privyId, privyId))
    .limit(1);
  if (userRows.length > 0 && userRows[0].walletAddress && userRows[0].walletAddress !== walletAddress) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.walletAddress, walletAddress))
      .orderBy(desc(orders.createdAt))
      .limit(50);
    return NextResponse.json({ orders: rows });
  } catch (err) {
    console.error('[orders/list]', err);
    return NextResponse.json({ orders: [] });
  }
}

