import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { isValidEmail } from '@/lib/validate';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase().slice(0, 500) : '';
  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ ok: true });
  }

  try {
    await db.execute(
      sql`INSERT INTO email_subscribers (email, created_at) VALUES (${cleanEmail}, now()) ON CONFLICT (email) DO NOTHING`
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }
}
