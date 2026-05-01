import { NextRequest, NextResponse } from 'next/server'
import { and, desc, eq, lt } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { feedPosts, feedReactions, feedComments, feedShares } from '@/lib/schema'

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const sp = req.nextUrl.searchParams
  const commentsLimit = Math.min(50, Math.max(1, parseInt(sp.get('commentsLimit') ?? '20', 10) || 20))
  const commentsBefore = sp.get('commentsBefore')

  const rows = await db.select().from(feedPosts).where(eq(feedPosts.id, id)).limit(1)
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const conds = [eq(feedComments.postId, id)]
  if (commentsBefore) {
    const d = new Date(commentsBefore)
    if (!isNaN(d.getTime())) conds.push(lt(feedComments.createdAt, d))
  }
  const comments = await db
    .select()
    .from(feedComments)
    .where(and(...conds))
    .orderBy(desc(feedComments.createdAt))
    .limit(commentsLimit + 1)

  const hasMore = comments.length > commentsLimit
  const sliced = hasMore ? comments.slice(0, commentsLimit) : comments

  return NextResponse.json({
    post: { ...rows[0], createdAt: rows[0].createdAt.toISOString() },
    comments: sliced.slice().reverse().map(c => ({ ...c, createdAt: c.createdAt.toISOString() })),
    nextCursor: hasMore ? sliced[sliced.length - 1].createdAt.toISOString() : null,
  })
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const wallet = req.nextUrl.searchParams.get('wallet')
  if (!wallet) return NextResponse.json({ error: 'wallet required' }, { status: 400 })

  const rows = await db.select().from(feedPosts).where(eq(feedPosts.id, id)).limit(1)
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (rows[0].authorWallet !== wallet) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await db.delete(feedReactions).where(eq(feedReactions.postId, id))
  await db.delete(feedComments).where(eq(feedComments.postId, id))
  await db.delete(feedShares).where(eq(feedShares.postId, id))
  await db.delete(feedPosts).where(eq(feedPosts.id, id))

  return NextResponse.json({ ok: true })
}
