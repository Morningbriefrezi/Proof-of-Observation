import type { ObservationTarget } from '@/lib/types'
import { getVisiblePlanets } from '@/lib/planets'

export interface DailyTarget {
  id: string
  name: string
  target: ObservationTarget
  emoji: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  bonusStars: number
  available: boolean
  altitude?: number
}

const PLANET_EMOJIS: Record<string, string> = {
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
}

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 }

export async function getTonightTargets(lat: number, lon: number): Promise<DailyTarget[]> {
  const now = new Date()
  const planets = getVisiblePlanets(lat, lon, now)

  const targets: DailyTarget[] = []

  // Moon — always first
  const moonData = planets.find(p => p.key === 'moon')
  targets.push({
    id: 'moon',
    name: 'Moon',
    target: 'moon',
    emoji: '🌕',
    description: 'Photograph the Moon — any phase counts',
    difficulty: 'easy',
    bonusStars: 10,
    available: moonData ? moonData.altitude > 0 : true,
    altitude: moonData?.altitude,
  })

  // Visible planets (altitude > 10°)
  for (const planet of planets) {
    if (planet.key === 'moon') continue
    if (planet.altitude > 10) {
      const name = planet.key.charAt(0).toUpperCase() + planet.key.slice(1)
      targets.push({
        id: planet.key,
        name,
        target: 'planet',
        emoji: PLANET_EMOJIS[planet.key] ?? '🪐',
        description: `Capture ${name} — visible tonight at ${planet.altitude.toFixed(0)}° altitude`,
        difficulty: 'medium',
        bonusStars: 30,
        available: true,
        altitude: planet.altitude,
      })
    }
  }

  // Stars & Constellations — always available
  targets.push({
    id: 'stars',
    name: 'Stars & Constellations',
    target: 'stars',
    emoji: '✨',
    description: 'Photograph any star pattern or constellation',
    difficulty: 'easy',
    bonusStars: 15,
    available: true,
  })

  // Deep Sky Challenge
  targets.push({
    id: 'deep_sky',
    name: 'Deep Sky Object',
    target: 'deep_sky',
    emoji: '🌌',
    description: 'Capture a nebula, galaxy, or star cluster — telescope recommended',
    difficulty: 'hard',
    bonusStars: 80,
    available: true,
  })

  // Sort: available first, then by difficulty
  targets.sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1
    return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
  })

  return targets
}
