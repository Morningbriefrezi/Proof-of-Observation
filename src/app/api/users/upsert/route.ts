// Run in Neon SQL editor before using this route:
// CREATE TABLE IF NOT EXISTS public.users (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   privy_id text UNIQUE NOT NULL,
//   email text,
//   wallet_address text,
//   username text,
//   created_at timestamptz DEFAULT now(),
//   updated_at timestamptz DEFAULT now()
// );

import { NextRequest, NextResponse } from 'next/server'
import { PrivyClient } from '@privy-io/server-auth'
import { getDb } from '@/lib/db'
import { users } from '@/lib/schema'

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!,
)

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  let verifiedPrivyId: string
  try {
    const claims = await privy.verifyAuthToken(token)
    verifiedPrivyId = claims.userId
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { privyId, email, walletAddress } = await req.json()

  // Ensure users can only upsert their own record
  if (privyId !== verifiedPrivyId) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  if (!privyId) {
    return NextResponse.json({ success: false, error: 'privyId required' }, { status: 400 })
  }

  const db = getDb()
  if (!db) {
    return NextResponse.json({ success: false, error: 'no db' })
  }

  const [user] = await db
    .insert(users)
    .values({ privyId, email: email ?? null, walletAddress: walletAddress ?? null })
    .onConflictDoUpdate({
      target: users.privyId,
      set: { email: email ?? null, walletAddress: walletAddress ?? null, updatedAt: new Date() },
    })
    .returning()

  return NextResponse.json({ success: true, user })
}
