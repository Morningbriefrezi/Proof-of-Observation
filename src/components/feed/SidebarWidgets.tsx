'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MarketPreview {
  id: string
  question: string
  yesOdds: number
  volumeStars: number
  category: 'solar' | 'comet' | 'aurora' | 'mission' | 'discovery' | 'weather' | 'seti' | 'neo' | 'prize'
}

interface ShopPreview {
  id: string
  name: string
  priceGel: number
  imageUrl: string
  starsOffer?: { stars: number; label: string }
}

const CATEGORY_GLYPH: Record<MarketPreview['category'], string> = {
  solar: '☀', comet: '☄', aurora: '⚡', mission: '◎', discovery: '✦',
  weather: '◐', seti: '⌬', neo: '◉', prize: '✧',
}

const CATEGORY_BG: Partial<Record<MarketPreview['category'], string>> = {
  solar: 'radial-gradient(circle, rgba(255,209,102,0.25), rgba(244,114,182,0.1))',
  comet: 'radial-gradient(circle, rgba(56,240,255,0.25), rgba(132,101,203,0.1))',
  aurora: 'radial-gradient(circle, rgba(52,211,153,0.25), rgba(56,240,255,0.1))',
}

function fmtVolume(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return n.toString()
}

export function MarketsWidget() {
  const [markets, setMarkets] = useState<MarketPreview[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/feed/markets-preview').then(r => r.json()).then((d: MarketPreview[]) => {
      if (Array.isArray(d)) setMarkets(d)
    }).catch(() => {})
  }, [])

  if (markets.length === 0) return null

  return (
    <div className="side-section">
      <div className="side-label">
        Live Markets
        <Link href="/markets" className="side-label-link">All markets →</Link>
      </div>
      <div className="markets-card">
        {markets.map(m => (
          <button
            key={m.id}
            className="market-row"
            onClick={() => router.push('/markets')}
          >
            <div className="market-icon" style={{ background: CATEGORY_BG[m.category] ?? 'radial-gradient(circle, rgba(56,240,255,0.18), rgba(132,101,203,0.06))' }}>
              {CATEGORY_GLYPH[m.category]}
            </div>
            <div className="market-body">
              <div className="market-question">{m.question}</div>
              <div className="market-meta">
                <span className="market-odds">YES {m.yesOdds}%</span>
                <span className="market-volume">{fmtVolume(m.volumeStars)} ✦ vol</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export function ShopWidget() {
  const [products, setProducts] = useState<ShopPreview[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/feed/shop-preview').then(r => r.json()).then((d: ShopPreview[]) => {
      if (Array.isArray(d)) setProducts(d)
    }).catch(() => {})
  }, [])

  if (products.length === 0) return null

  return (
    <div className="side-section">
      <div className="side-label">
        From Astroman
        <Link href="/marketplace" className="side-label-link">Browse all →</Link>
      </div>
      <div className="shop-card">
        {products.map(p => (
          <button
            key={p.id}
            className="shop-product"
            onClick={() => router.push(`/marketplace?product=${encodeURIComponent(p.id)}`)}
          >
            <div className="shop-img" style={{ backgroundImage: `url(${p.imageUrl})` }} />
            <div className="shop-info">
              <div className="shop-name">{p.name}</div>
              <div className="shop-price">
                <span className="shop-price-gel">{p.priceGel} ₾</span>
                {p.starsOffer && <span className="shop-price-stars">{p.starsOffer.label}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
