'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cloud, Moon as MoonIcon, Clock, Eye } from 'lucide-react'

type Forecast = Array<{ date: string; hours: Array<{ cloudCover: number }> }>
type SunMoon = {
  sunSet: string | null
  sunRise: string | null
  illuminationPct: number
  astronomicalDuskStart: string | null
  astronomicalDawnEnd: string | null
}
type Planet = { name: string; altitude: number; visible: boolean }

interface Props { lat: number; lon: number; cityLabel: string }

function fmtTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function avgCloud(hours: Array<{ cloudCover: number }>): number {
  if (!hours.length) return 100
  const sum = hours.reduce((s, h) => s + h.cloudCover, 0)
  return Math.round(sum / hours.length)
}

function badgeClass(cloud: number): 'go' | 'maybe' | 'skip' {
  if (cloud < 30) return 'go'
  if (cloud <= 60) return 'maybe'
  return 'skip'
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function SkyWidget({ lat, lon, cityLabel }: Props) {
  const [forecast, setForecast] = useState<Forecast>([])
  const [sunMoon, setSunMoon] = useState<SunMoon | null>(null)
  const [planets, setPlanets] = useState<Planet[]>([])

  useEffect(() => {
    const q = `lat=${lat}&lng=${lon}`
    Promise.allSettled([
      fetch(`/api/sky/forecast?${q}`).then(r => r.json()).then((d: Forecast) => setForecast(Array.isArray(d) ? d : [])),
      fetch(`/api/sky/sun-moon?${q}`).then(r => r.json()).then(setSunMoon).catch(() => {}),
      fetch(`/api/sky/planets?${q}`).then(r => r.json()).then((d: Planet[]) => setPlanets(Array.isArray(d) ? d : [])),
    ])
  }, [lat, lon])

  const tonightHours = forecast[0]?.hours.slice(18, 24) ?? []
  const tonightCloud = avgCloud(tonightHours)
  const condition: 'go' | 'maybe' | 'skip' = badgeClass(tonightCloud)
  const conditionText = condition === 'go' ? 'Excellent observing' : condition === 'maybe' ? 'Patchy clouds tonight' : 'Mostly cloudy'
  const conditionColor = condition === 'go' ? 'var(--green)' : condition === 'maybe' ? 'var(--brass)' : 'var(--red)'

  const moonPct = sunMoon ? Math.round(sunMoon.illuminationPct ?? 0) : null
  const window = sunMoon?.astronomicalDuskStart && sunMoon?.astronomicalDawnEnd
    ? `${sunMoon.astronomicalDuskStart} → ${sunMoon.astronomicalDawnEnd}`
    : sunMoon?.sunSet
      ? `${fmtTime(sunMoon.sunSet)} → ${fmtTime(sunMoon.sunRise)}`
      : '—'

  const visiblePlanets = planets
    .filter(p => p.altitude > 10 && p.name !== 'Sun' && p.name !== 'Moon')
    .slice(0, 2)
    .map(p => p.name)
    .join(' · ') || '—'

  const next7 = forecast.slice(0, 7).map((day, i) => {
    const d = new Date(day.date)
    const eveningHours = day.hours.slice(18, 24)
    const cloud = avgCloud(eveningHours.length ? eveningHours : day.hours)
    return { name: DAY_LABELS[d.getDay()] ?? `D${i}`, badge: badgeClass(cloud) }
  })

  return (
    <div className="side-section">
      <div className="side-label">
        Tonight · {cityLabel}
        <Link href="/sky" className="side-label-link">Full sky →</Link>
      </div>
      <div className="sky-card">
        <div className="sky-condition">
          <div className="sky-condition-dot" style={{ background: conditionColor, boxShadow: `0 0 12px ${conditionColor}` }} />
          <div className="sky-condition-text">{conditionText}</div>
        </div>
        <div className="sky-row">
          <span className="sky-row-label"><Cloud size={12} /> Cloud cover</span>
          <span className={`sky-row-val ${condition}`}>{tonightCloud}% · {condition === 'go' ? 'clear' : condition === 'maybe' ? 'mixed' : 'cloudy'}</span>
        </div>
        <div className="sky-row">
          <span className="sky-row-label"><MoonIcon size={12} /> Moon</span>
          <span className="sky-row-val">{moonPct != null ? `${moonPct}% illuminated` : '—'}</span>
        </div>
        <div className="sky-row">
          <span className="sky-row-label"><Clock size={12} /> Best window</span>
          <span className="sky-row-val">{window}</span>
        </div>
        <div className="sky-row">
          <span className="sky-row-label"><Eye size={12} /> Visible now</span>
          <span className="sky-row-val">{visiblePlanets}</span>
        </div>
        {next7.length > 0 && (
          <div className="sky-mini-forecast">
            {next7.map((d, i) => (
              <div className="forecast-day" key={`${d.name}-${i}`}>
                <div className="forecast-day-name">{d.name}</div>
                <div className={`forecast-day-badge ${d.badge}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
