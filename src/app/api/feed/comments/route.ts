import { NextRequest, NextResponse } from 'next/server'
import { and, desc, eq, lt, sql } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { feedPosts, feedComments } from '@/lib/schema'

export async function POST(req: NextRequest) {
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  let body: { postId?: string; authorWallet?: string; authorName?: string | null; body?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const postId = body.postId
  const authorWallet = body.authorWallet
  const text = (body.body ?? '').trim()
  if (!postId || !authorWallet) {
    return NextResponse.json({ error: 'postId and authorWallet required' }, { status: 400 })
  }
  if (text.length < 1 || text.length > 500) {
    return NextResponse.json({ error: 'Comment must be 1–500 characters' }, { status: 400 })
  }

  const [comment] = await db
    .insert(feedComments)
    .values({ postId, authorWallet, authorName: body.authorName ?? null, body: text })
    .returning()

  await db
    .update(feedPosts)
    .set({ commentCount: sql`${feedPosts.commentCount} + 1` })
    .where(eq(feedPosts.id, postId))

  return NextResponse.json({ ...comment, createdAt: comment.createdAt.toISOString() })
}

export async function GET(req: NextRequest) {
  const db = getDb()
  if (!db) return NextResponse.json({ comments: [], nextCursor: null })

  const sp = req.nextUrl.searchParams
  const postId = sp.get('postId')
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  const limit = Math.min(50, Math.max(1, parseInt(sp.get('limit') ?? '20', 10) || 20))
  const before = sp.get('before')

  const conds = [eq(feedComments.postId, postId)]
  if (before) {
    const d = new Date(before)
    if (!isNaN(d.getTime())) conds.push(lt(feedComments.createdAt, d))
  }

  const rows = await db
    .select()
    .from(feedComments)
    .where(and(...conds))
    .orderBy(desc(feedComments.createdAt))
    .limit(limit + 1)

  const hasMore = rows.length > limit
  const sliced = hasMore ? rows.slice(0, limit) : rows

  return NextResponse.json({
    comments: sliced.slice().reverse().map(c => ({ ...c, createdAt: c.createdAt.toISOString() })),
    nextCursor: hasMore ? sliced[sliced.length - 1].createdAt.toISOString() : null,
  })
}
