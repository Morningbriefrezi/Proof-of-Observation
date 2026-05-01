import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products'

interface ShopPreview {
  id: string
  name: string
  priceGel: number
  imageUrl: string
  starsOffer?: { stars: number; label: string }
}

export async function GET() {
  const telescope = PRODUCTS.find(p => p.category === 'telescope' && p.featured) ?? PRODUCTS.find(p => p.category === 'telescope')
  const moonLamp = PRODUCTS.find(p => p.category === 'moonlamp')
  const accessory = PRODUCTS.find(p => p.category === 'accessory')

  const out: ShopPreview[] = []
  if (telescope) {
    out.push({
      id: telescope.id,
      name: telescope.name.en,
      priceGel: telescope.priceGEL,
      imageUrl: telescope.image,
      starsOffer: { stars: 500, label: '500 ✦ for 20% off' },
    })
  }
  if (moonLamp) {
    out.push({
      id: moonLamp.id,
      name: moonLamp.name.en,
      priceGel: moonLamp.priceGEL,
      imageUrl: moonLamp.image,
      starsOffer: { stars: 250, label: '250 ✦ free' },
    })
  }
  if (accessory) {
    out.push({
      id: accessory.id,
      name: accessory.name.en,
      priceGel: accessory.priceGEL,
      imageUrl: accessory.image,
    })
  }

  return NextResponse.json(out, {
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600' },
  })
}
