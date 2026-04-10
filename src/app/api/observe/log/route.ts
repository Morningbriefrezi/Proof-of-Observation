import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { observationLog } from '@/lib/schema'
import { and, eq, gte, sum } from 'drizzle-orm'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import bs58 from 'bs58'

// Max stars per confidence level — mirrors /api/observe/verify reward table
const MAX_STARS_BY_CONFIDENCE: Record<string, number> = {
  high: 80,
  medium: 40,
  low: 15,
  rejected: 0,
}
const DAILY_STARS_CAP = 500

async function awardStarsOnChain(
  recipientAddress: string,
  amount: number,
  reason: string
): Promise<void> {
  const mintAddress = process.env.STARS_TOKEN_MINT
  const privateKeyB58 = process.env.FEE_PAYER_PRIVATE_KEY
  if (!mintAddress || !privateKeyB58) return

  const feePayerKeypair = Keypair.fromSecretKey(bs58.decode(privateKeyB58))
  const connection = new Connection(
    process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
    'confirmed'
  )
  const recipientKey = new PublicKey(recipientAddress)
  const mintKey = new PublicKey(mintAddress)

  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    feePayerKeypair,
    mintKey,
    recipientKey
  )
  await mintTo(connection, feePayerKeypair, mintKey, ata.address, feePayerKeypair, BigInt(amount))
  console.log('[observe/log] Awarded', amount, 'stars to', recipientAddress, 'for', reason)
}

export async function POST(req: NextRequest) {
  let body: {
    wallet?: string
    target?: string
    stars?: number
    confidence?: string
    mintTx?: string | null
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ logged: false })
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ logged: false })
  }

  const wallet = body.wallet ?? ''
  const confidence = body.confidence ?? 'unknown'

  // Server-side cap: clamp claimed stars to the max allowed for this confidence level
  const maxAllowed = MAX_STARS_BY_CONFIDENCE[confidence] ?? 0
  const stars = Math.min(Math.max(body.stars ?? 0, 0), maxAllowed)

  try {
    // Rate limit: check total stars awarded to this wallet today
    let todayStars = 0
    if (wallet) {
      const startOfDay = new Date()
      startOfDay.setUTCHours(0, 0, 0, 0)
      const rows = await db
        .select({ total: sum(observationLog.stars) })
        .from(observationLog)
        .where(
          and(
            eq(observationLog.wallet, wallet),
            gte(observationLog.createdAt, startOfDay)
          )
        )

      todayStars = Number(rows[0]?.total ?? 0)
    }

    const starsToAward = todayStars + stars > DAILY_STARS_CAP
      ? Math.max(DAILY_STARS_CAP - todayStars, 0)
      : stars

    await db.insert(observationLog).values({
      wallet,
      target: body.target ?? '',
      stars: starsToAward,
      confidence,
      mintTx: body.mintTx ?? null,
    })

    // Award tokens on-chain (non-blocking — log still succeeds even if this fails)
    if (wallet && starsToAward > 0) {
      awardStarsOnChain(wallet, starsToAward, `observation: ${body.target}`).catch(err =>
        console.error('[observe/log] Star award failed:', err)
      )
    }

    return NextResponse.json({ logged: true, starsAwarded: starsToAward })
  } catch (err) {
    console.error('[observe/log]', err)
    return NextResponse.json({ logged: false })
  }
}
