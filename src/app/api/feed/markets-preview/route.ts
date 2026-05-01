import { NextResponse } from 'next/server'

type MarketCategory =
  | 'solar' | 'comet' | 'aurora' | 'mission' | 'discovery'
  | 'weather' | 'seti' | 'neo' | 'prize'

interface MarketPreview {
  id: string
  question: string
  yesOdds: number
  volumeStars: number
  category: MarketCategory
}

// Static curated previews — the on-chain markets read needs an RPC connection
// + program decoding which is heavy for a sidebar widget. The hackathon-time
// markets are seeded; these mirror the on-chain titles closely enough to act
// as a teaser and link to /markets.
const PREVIEWS: MarketPreview[] = [
  { id: 'solar-flare-may-15',  question: 'Will an X-class solar flare hit before May 15?', yesOdds: 72, volumeStars: 820,  category: 'solar' },
  { id: 'c2025n1-naked-eye',   question: 'C/2025 N1 visible to naked eye in May?',         yesOdds: 41, volumeStars: 1200, category: 'comet' },
  { id: 'aurora-ge-week',      question: 'Aurora visible in Georgia this week?',           yesOdds: 18, volumeStars: 340,  category: 'aurora' },
]

export async function GET() {
  const sorted = [...PREVIEWS].sort((a, b) => b.volumeStars - a.volumeStars).slice(0, 3)
  return NextResponse.json(sorted, {
    headers: { 'Cache-Control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=900' },
  })
}
