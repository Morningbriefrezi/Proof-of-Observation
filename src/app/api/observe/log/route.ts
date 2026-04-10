import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { observationLog } from '@/lib/schema'

export async function POST(req: NextRequest) {
  let body: { wallet?: string; target?: string; stars?: number; confidence?: string; mintTx?: string | null }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ logged: false })
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ logged: false })
  }

  try {
    await db.insert(observationLog).values({
      wallet: body.wallet ?? '',
      target: body.target ?? '',
      stars: body.stars ?? 0,
      confidence: body.confidence ?? 'unknown',
      mintTx: body.mintTx ?? null,
    })
    return NextResponse.json({ logged: true })
  } catch (err) {
    console.error('[observe/log]', err)
    return NextResponse.json({ logged: false })
  }
}
