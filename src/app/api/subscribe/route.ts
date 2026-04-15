import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ ok: true });
  }

  try {
    await db.execute(
      sql`INSERT INTO email_subscribers (email, created_at) VALUES (${email}, now()) ON CONFLICT (email) DO NOTHING`
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }
}
