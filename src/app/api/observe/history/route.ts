import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { observationLog } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const walletAddress = req.nextUrl.searchParams.get('walletAddress')
  if (!walletAddress) {
    return NextResponse.json({ error: 'walletAddress required' }, { status: 400 })
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ observations: [] })
  }

  try {
    const observations = await db
      .select()
      .from(observationLog)
      .where(eq(observationLog.wallet, walletAddress))
      .orderBy(desc(observationLog.createdAt))
      .limit(50)
    return NextResponse.json({ observations })
  } catch (err) {
    console.error('[observe/history]', err)
    return NextResponse.json({ observations: [] })
  }
}
