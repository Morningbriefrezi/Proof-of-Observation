export interface SkyScoreInput {
  cloudCover: number        // 0–100 percent
  visibility: number        // meters
  humidity: number          // 0–100 percent
  windSpeed: number         // m/s
  moonIllumination?: number // 0–100 percent (optional)
  bortle?: number           // 1–9 (optional)
}

export interface SkyScoreFactor {
  label: string
  value: number       // 0–100 subscale
  weight: number      // 0–1
  description: string
}

export interface SkyScoreResult {
  score: number
  grade: 'Exceptional' | 'Excellent' | 'Good' | 'Fair' | 'Poor'
  emoji: string
  color: string       // CSS custom property string, e.g. 'var(--success)'
  factors: SkyScoreFactor[]
}

export function calculateSkyScore(input: SkyScoreInput): SkyScoreResult {
  const factors: SkyScoreFactor[] = []

  // 1. Cloud factor (weight 0.40)
  const cloudValue = input.cloudCover < 10
    ? 100
    : input.cloudCover > 80
      ? 0
      : Math.round(Math.max(0, 100 - input.cloudCover * 1.25))
  const cloudDesc = input.cloudCover < 20
    ? 'Clear skies'
    : input.cloudCover < 50
      ? 'Partially cloudy'
      : 'Mostly cloudy'
  factors.push({ label: 'Cloud Cover', value: cloudValue, weight: 0.40, description: cloudDesc })

  // 2. Visibility factor (weight 0.20)
  let visValue: number
  let visDesc: string
  if (input.visibility > 30000) { visValue = 100; visDesc = 'Excellent' }
  else if (input.visibility > 20000) { visValue = 85; visDesc = 'Good' }
  else if (input.visibility > 10000) { visValue = 65; visDesc = 'Fair' }
  else if (input.visibility > 5000) { visValue = 35; visDesc = 'Poor' }
  else { visValue = 10; visDesc = 'Very poor' }
  factors.push({ label: 'Visibility', value: visValue, weight: 0.20, description: visDesc })

  // 3. Humidity factor (weight 0.15)
  const humValue = Math.max(0, Math.round(100 - Math.max(0, input.humidity - 30) * 1.4))
  const humDesc = input.humidity < 30
    ? 'Dry air — good'
    : input.humidity < 60
      ? 'Moderate humidity'
      : 'High humidity'
  factors.push({ label: 'Humidity', value: humValue, weight: 0.15, description: humDesc })

  // 4. Wind factor (weight 0.10)
  let windValue: number
  let windDesc: string
  if (input.windSpeed < 3) { windValue = 100; windDesc = 'Calm' }
  else if (input.windSpeed < 8) { windValue = 80; windDesc = 'Light breeze' }
  else if (input.windSpeed < 15) { windValue = 50; windDesc = 'Moderate' }
  else if (input.windSpeed < 25) { windValue = 20; windDesc = 'Windy' }
  else { windValue = 5; windDesc = 'Very windy' }
  factors.push({ label: 'Wind', value: windValue, weight: 0.10, description: windDesc })

  // 5. Moon factor (weight 0.10, optional)
  let moonWeight = 0
  if (input.moonIllumination !== undefined) {
    const moonValue = Math.round(100 - input.moonIllumination)
    const moonDesc = input.moonIllumination < 20
      ? 'New moon — dark sky'
      : input.moonIllumination < 60
        ? 'Partial moon'
        : 'Full moon — bright'
    moonWeight = 0.10
    factors.push({ label: 'Moon', value: moonValue, weight: 0.10, description: moonDesc })
  }

  // 6. Bortle factor (weight 0.05, optional)
  let bortleWeight = 0
  if (input.bortle !== undefined) {
    const bortleValue = Math.round(Math.max(0, Math.min(100, (10 - input.bortle) * 12.5)))
    const bortleDesc = `Bortle ${input.bortle} — ${input.bortle <= 3 ? 'Dark sky' : input.bortle <= 6 ? 'Suburban sky' : 'Urban sky'}`
    bortleWeight = 0.05
    factors.push({ label: 'Light Pollution', value: bortleValue, weight: 0.05, description: bortleDesc })
  }

  // Redistribute skipped weights proportionally
  const skippedWeight = (moonWeight === 0 ? 0.10 : 0) + (bortleWeight === 0 ? 0.05 : 0)
  if (skippedWeight > 0) {
    const activeFactors = factors.filter(f => f.label !== 'Moon' && f.label !== 'Light Pollution')
    const totalActiveWeight = activeFactors.reduce((s, f) => s + f.weight, 0)
    for (const f of activeFactors) {
      f.weight = f.weight + skippedWeight * (f.weight / totalActiveWeight)
    }
  }

  // Final score
  const weighted = factors.reduce((sum, f) => sum + f.value * f.weight, 0)
  const score = Math.min(100, Math.max(0, Math.round(weighted)))

  let grade: SkyScoreResult['grade']
  let emoji: string
  let color: string

  if (score >= 90) { grade = 'Exceptional'; emoji = '✨'; color = 'var(--success)' }
  else if (score >= 70) { grade = 'Excellent'; emoji = '⭐'; color = 'var(--success)' }
  else if (score >= 50) { grade = 'Good'; emoji = '👍'; color = 'var(--accent)' }
  else if (score >= 30) { grade = 'Fair'; emoji = '🌤️'; color = 'var(--warning)' }
  else { grade = 'Poor'; emoji = '☁️'; color = 'var(--error)' }

  return { score, grade, emoji, color, factors }
}

export function skyScoreGrade(score: number): SkyScoreResult['grade'] {
  if (score >= 90) return 'Exceptional'
  if (score >= 70) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 30) return 'Fair'
  return 'Poor'
}

export function visibilityToMeters(visibilityStr: string): number {
  const map: Record<string, number> = {
    Excellent: 30000,
    Good: 15000,
    Fair: 7000,
    Poor: 3000,
  }
  return map[visibilityStr] ?? (parseInt(visibilityStr) || 10000)
}
