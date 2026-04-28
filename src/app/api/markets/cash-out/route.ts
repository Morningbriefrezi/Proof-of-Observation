import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import bs58 from 'bs58';
import { eq, and } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { marketCashouts } from '@/lib/schema';
import { getServerProgram } from '@/lib/markets/server-program';
import { getMarket, getUserPositionsRaw } from '@/lib/markets/queries';
import { awardStarsRateLimit, checkRateLimit } from '@/lib/rate-limit';

export const maxDuration = 60;

const REFUND_BPS = 7000; // 70% of stake refunded; 30% forfeited as exit fee

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!,
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: 'Auth required' }, { status: 401 });
  }
  try {
    await privy.verifyAuthToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 });
  }

  let body: { walletAddress?: unknown; marketId?: unknown; side?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { walletAddress, marketId, side } = body;

  let userPk: PublicKey;
  try {
    userPk = new PublicKey(walletAddress as string);
  } catch {
    return NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 });
  }

  if (typeof marketId !== 'number' || !Number.isInteger(marketId) || marketId < 1) {
    return NextResponse.json({ error: 'Invalid marketId' }, { status: 400 });
  }
  if (side !== 'yes' && side !== 'no') {
    return NextResponse.json({ error: 'Invalid side' }, { status: 400 });
  }

  const { success } = await checkRateLimit(awardStarsRateLimit, walletAddress as string);
  if (!success) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  }

  // Already cashed out?
  const existing = await db
    .select()
    .from(marketCashouts)
    .where(
      and(
        eq(marketCashouts.wallet, walletAddress as string),
        eq(marketCashouts.marketId, marketId),
        eq(marketCashouts.side, side),
      ),
    )
    .limit(1);
  if (existing.length > 0) {
    return NextResponse.json(
      { error: 'Already cashed out', cashout: existing[0] },
      { status: 409 },
    );
  }

  // Verify on-chain position + market state.
  let stake = 0;
  try {
    const { program } = getServerProgram();
    const market = await getMarket(program, marketId);
    if (!market) {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 });
    }
    if (market.resolved || market.cancelled) {
      return NextResponse.json(
        { error: 'Market already resolved — claim instead of cashing out' },
        { status: 400 },
      );
    }
    if (Date.now() >= market.resolutionTime.getTime()) {
      return NextResponse.json(
        { error: 'Market locked — too late to cash out' },
        { status: 400 },
      );
    }

    const raws = await getUserPositionsRaw(program, userPk);
    const pos = raws.find((r) => r.marketId === marketId);
    if (!pos) {
      return NextResponse.json({ error: 'No position on this market' }, { status: 404 });
    }
    if (pos.claimed) {
      return NextResponse.json({ error: 'Position already claimed' }, { status: 400 });
    }
    stake = side === 'yes' ? pos.yesBet : pos.noBet;
    if (stake < 1) {
      return NextResponse.json({ error: 'No stake on this side' }, { status: 404 });
    }
  } catch (err) {
    console.error('[cash-out] verify failed', err);
    return NextResponse.json(
      { error: 'Could not verify position' },
      { status: 500 },
    );
  }

  const refund = Math.floor((stake * REFUND_BPS) / 10000);
  if (refund < 1) {
    return NextResponse.json(
      { error: 'Stake too small to cash out' },
      { status: 400 },
    );
  }

  // Reserve the slot atomically. The unique index on (wallet, marketId, side)
  // makes this race-safe.
  let cashoutId: string;
  try {
    const inserted = await db
      .insert(marketCashouts)
      .values({
        wallet: walletAddress as string,
        marketId,
        side,
        originalStake: stake,
        refundedAmount: refund,
      })
      .returning({ id: marketCashouts.id });
    cashoutId = inserted[0].id;
  } catch (err) {
    if ((err as { code?: string })?.code === '23505') {
      return NextResponse.json({ error: 'Already cashed out' }, { status: 409 });
    }
    throw err;
  }

  // Mint refund Stars from treasury → user.
  const mintAddress = process.env.STARS_TOKEN_MINT;
  const privateKeyB58 = process.env.FEE_PAYER_PRIVATE_KEY;
  if (!mintAddress || !privateKeyB58) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 503 });
  }

  try {
    const feePayer = Keypair.fromSecretKey(bs58.decode(privateKeyB58));
    const mintPk = new PublicKey(mintAddress);
    const connection = new Connection(
      process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
      'confirmed',
    );
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      feePayer,
      mintPk,
      userPk,
    );
    const sig = await mintTo(
      connection,
      feePayer,
      mintPk,
      ata.address,
      feePayer,
      BigInt(refund),
    );
    await db
      .update(marketCashouts)
      .set({ refundTx: sig })
      .where(eq(marketCashouts.id, cashoutId));

    return NextResponse.json({
      success: true,
      refunded: refund,
      stake,
      forfeit: stake - refund,
      txId: sig,
    });
  } catch (err) {
    // Roll back the slot so the user can retry.
    try {
      await db.delete(marketCashouts).where(eq(marketCashouts.id, cashoutId));
    } catch {}
    const message = err instanceof Error ? err.message : String(err);
    console.error('[cash-out] mint failed', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
