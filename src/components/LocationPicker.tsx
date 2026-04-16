'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, ChevronDown, Navigation, Check, X, Search } from 'lucide-react'
import { useLocation, getRegionForCountry, type UserLocation, type Region } from '@/lib/location'

const REGION_LABELS: Record<Region, string> = {
  caucasus: 'Caucasus',
  north_america: 'Americas',
  south_america: 'Americas',
  europe: 'Europe',
  asia: 'Asia',
  global: 'Global',
}

type PresetCity = UserLocation & { flag: string; nameEn: string }

const CITY_PRESETS: { region: Region; label: string; cities: PresetCity[] }[] = [
  {
    region: 'caucasus',
    label: 'Caucasus',
    cities: [
      { region: 'caucasus', country: 'GE', city: 'Tbilisi',  lat: 41.7151, lon: 44.8271,  source: 'manual', flag: '🇬🇪', nameEn: 'Tbilisi' },
      { region: 'caucasus', country: 'AM', city: 'Yerevan',  lat: 40.1872, lon: 44.5152,  source: 'manual', flag: '🇦🇲', nameEn: 'Yerevan' },
      { region: 'caucasus', country: 'AZ', city: 'Baku',     lat: 40.4093, lon: 49.8671,  source: 'manual', flag: '🇦🇿', nameEn: 'Baku' },
      { region: 'caucasus', country: 'TR', city: 'Istanbul', lat: 41.0082, lon: 28.9784,  source: 'manual', flag: '🇹🇷', nameEn: 'Istanbul' },
    ],
  },
  {
    region: 'north_america',
    label: 'Americas',
    cities: [
      { region: 'north_america', country: 'US', city: 'New York',     lat: 40.7128,  lon: -74.006,   source: 'manual', flag: '🇺🇸', nameEn: 'New York' },
      { region: 'north_america', country: 'US', city: 'Los Angeles',  lat: 34.0522,  lon: -118.2437, source: 'manual', flag: '🇺🇸', nameEn: 'Los Angeles' },
      { region: 'north_america', country: 'US', city: 'Chicago',      lat: 41.8781,  lon: -87.6298,  source: 'manual', flag: '🇺🇸', nameEn: 'Chicago' },
      { region: 'north_america', country: 'US', city: 'Houston',      lat: 29.7604,  lon: -95.3698,  source: 'manual', flag: '🇺🇸', nameEn: 'Houston' },
      { region: 'north_america', country: 'CA', city: 'Toronto',      lat: 43.6532,  lon: -79.3832,  source: 'manual', flag: '🇨🇦', nameEn: 'Toronto' },
      { region: 'north_america', country: 'CA', city: 'Vancouver',    lat: 49.2827,  lon: -123.1207, source: 'manual', flag: '🇨🇦', nameEn: 'Vancouver' },
      { region: 'south_america', country: 'BR', city: 'São Paulo',    lat: -23.5505, lon: -46.6333,  source: 'manual', flag: '🇧🇷', nameEn: 'São Paulo' },
      { region: 'south_america', country: 'AR', city: 'Buenos Aires', lat: -34.6037, lon: -58.3816,  source: 'manual', flag: '🇦🇷', nameEn: 'Buenos Aires' },
    ],
  },
  {
    region: 'europe',
    label: 'Europe',
    cities: [
      { region: 'europe', country: 'DE', city: 'Berlin',    lat: 52.52,   lon: 13.405,  source: 'manual', flag: '🇩🇪', nameEn: 'Berlin' },
      { region: 'europe', country: 'FR', city: 'Paris',     lat: 48.8566, lon: 2.3522,  source: 'manual', flag: '🇫🇷', nameEn: 'Paris' },
      { region: 'europe', country: 'GB', city: 'London',    lat: 51.5074, lon: -0.1278, source: 'manual', flag: '🇬🇧', nameEn: 'London' },
      { region: 'europe', country: 'IT', city: 'Rome',      lat: 41.9028, lon: 12.4964, source: 'manual', flag: '🇮🇹', nameEn: 'Rome' },
      { region: 'europe', country: 'ES', city: 'Madrid',    lat: 40.4168, lon: -3.7038, source: 'manual', flag: '🇪🇸', nameEn: 'Madrid' },
      { region: 'europe', country: 'NL', city: 'Amsterdam', lat: 52.3676, lon: 4.9041,  source: 'manual', flag: '🇳🇱', nameEn: 'Amsterdam' },
      { region: 'europe', country: 'PL', city: 'Warsaw',    lat: 52.2297, lon: 21.0122, source: 'manual', flag: '🇵🇱', nameEn: 'Warsaw' },
      { region: 'europe', country: 'SE', city: 'Stockholm', lat: 59.3293, lon: 18.0686, source: 'manual', flag: '🇸🇪', nameEn: 'Stockholm' },
      { region: 'europe', country: 'UA', city: 'Kyiv',      lat: 50.4501, lon: 30.5234, source: 'manual', flag: '🇺🇦', nameEn: 'Kyiv' },
    ],
  },
  {
    region: 'asia',
    label: 'Asia',
    cities: [
      { region: 'asia', country: 'JP', city: 'Tokyo',     lat: 35.6762, lon: 139.6503, source: 'manual', flag: '🇯🇵', nameEn: 'Tokyo' },
      { region: 'asia', country: 'KR', city: 'Seoul',     lat: 37.5665, lon: 126.9780, source: 'manual', flag: '🇰🇷', nameEn: 'Seoul' },
      { region: 'asia', country: 'CN', city: 'Beijing',   lat: 39.9042, lon: 116.4074, source: 'manual', flag: '🇨🇳', nameEn: 'Beijing' },
      { region: 'asia', country: 'IN', city: 'Mumbai',    lat: 19.0760, lon: 72.8777,  source: 'manual', flag: '🇮🇳', nameEn: 'Mumbai' },
      { region: 'asia', country: 'IN', city: 'Delhi',     lat: 28.6139, lon: 77.2090,  source: 'manual', flag: '🇮🇳', nameEn: 'Delhi' },
      { region: 'asia', country: 'SG', city: 'Singapore', lat: 1.3521,  lon: 103.8198, source: 'manual', flag: '🇸🇬', nameEn: 'Singapore' },
      { region: 'asia', country: 'TH', city: 'Bangkok',   lat: 13.7563, lon: 100.5018, source: 'manual', flag: '🇹🇭', nameEn: 'Bangkok' },
      { region: 'asia', country: 'ID', city: 'Jakarta',   lat: -6.2088, lon: 106.8456, source: 'manual', flag: '🇮🇩', nameEn: 'Jakarta' },
      { region: 'asia', country: 'PH', city: 'Manila',    lat: 14.5995, lon: 120.9842, source: 'manual', flag: '🇵🇭', nameEn: 'Manila' },
    ],
  },
]

export default function LocationPicker({ compact = false }: { compact?: boolean }) {
  const { location, setLocation } = useLocation()
  const [open, setOpen] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => searchRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      setSearch('')
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleGPS = useCallback(() => {
    if (!navigator.geolocation || gpsLoading) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`)
          const data = await res.json()
          const countryCode = (data.address?.country_code ?? '').toUpperCase()
          const city = data.address?.city || data.address?.town || data.address?.state || ''
          setLocation({ region: getRegionForCountry(countryCode), country: countryCode, city, lat, lon, source: 'gps' })
        } catch { /* ignore */ }
        setGpsLoading(false)
        setOpen(false)
      },
      () => { setGpsLoading(false); setOpen(false) },
      { timeout: 8000 }
    )
  }, [gpsLoading, setLocation])

  function handlePreset(p: UserLocation) {
    setLocation(p)
    setOpen(false)
  }

  const filtered = search.trim()
    ? CITY_PRESETS.map(group => ({
        ...group,
        cities: group.cities.filter(c =>
          c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
          c.country.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(g => g.cities.length > 0)
    : CITY_PRESETS

  const label = location.city || REGION_LABELS[location.region]
  const isActive = (p: UserLocation) => p.city === location.city && p.country === location.country

  return (
    <>
      <style>{`
        @keyframes loc-ping {
          0% { transform: scale(0.7); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes loc-panel-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes loc-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .loc-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 9999px;
          padding: ${compact ? '7px 14px' : '9px 16px'};
          background: rgba(20, 184, 166, 0.08);
          border: 1.5px solid rgba(20, 184, 166, 0.35);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .loc-pill:hover {
          background: rgba(20, 184, 166, 0.14);
          border-color: rgba(20, 184, 166, 0.6);
          transform: translateY(-1px);
        }
        .loc-pill:active { transform: translateY(0); }
        .loc-city-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: transparent;
          border: 1.5px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background 0.12s, border-color 0.12s;
        }
        .loc-city-btn:hover { background: rgba(255,255,255,0.05); }
        .loc-city-btn.active {
          background: rgba(20, 184, 166, 0.1);
          border-color: rgba(20, 184, 166, 0.3);
        }
        .loc-gps-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 11px 16px;
          background: rgba(20, 184, 166, 0.08);
          border: 1.5px solid rgba(20, 184, 166, 0.3);
          border-radius: 12px;
          color: #14b8a6;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          letter-spacing: 0.01em;
        }
        .loc-gps-btn:hover:not(:disabled) {
          background: rgba(20, 184, 166, 0.15);
          border-color: rgba(20, 184, 166, 0.5);
        }
        .loc-gps-btn:disabled { opacity: 0.5; cursor: default; }
        .loc-search-input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s;
        }
        .loc-search-input:focus {
          border-color: rgba(20, 184, 166, 0.5);
        }
        .loc-search-input::placeholder { color: rgba(255,255,255,0.3); }
        .loc-city-list::-webkit-scrollbar { width: 4px; }
        .loc-city-list::-webkit-scrollbar-track { background: transparent; }
        .loc-city-list::-webkit-scrollbar-thumb { background: rgba(20,184,166,0.25); border-radius: 2px; }
        @keyframes loc-spin { to { transform: rotate(360deg); } }
        .loc-spinning { animation: loc-spin 0.8s linear infinite; }
      `}</style>

      {/* Trigger pill */}
      <button className="loc-pill" onClick={() => setOpen(true)}>
        <div style={{ position: 'relative', width: 16, height: 16, flexShrink: 0 }}>
          <div style={{
            position: 'absolute', inset: -2, borderRadius: '50%',
            background: 'rgba(20,184,166,0.35)',
            animation: 'loc-ping 2.4s ease-out infinite',
            pointerEvents: 'none',
          }} />
          <MapPin size={15} color={location.source === 'gps' ? '#14b8a6' : 'rgba(20,184,166,0.85)'} style={{ position: 'relative', zIndex: 1 }} />
        </div>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 600, letterSpacing: '0.01em' }}>
          {label}
        </span>
        <ChevronDown size={12} color="rgba(20,184,166,0.6)"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Full-screen overlay + panel */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            animation: 'loc-overlay-in 0.18s ease-out forwards',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          {/* Backdrop blur */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(5, 8, 20, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }} />

          {/* Panel */}
          <div
            style={{
              position: 'relative', zIndex: 1,
              width: '100%', maxWidth: 400,
              maxHeight: 'calc(100vh - 64px)',
              background: 'linear-gradient(160deg, rgba(15,20,40,0.98) 0%, rgba(10,14,30,0.99) 100%)',
              border: '1.5px solid rgba(20,184,166,0.25)',
              borderRadius: 20,
              boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(20,184,166,0.08), inset 0 1px 0 rgba(20,184,166,0.1)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              animation: 'loc-panel-in 0.22s cubic-bezier(0.34,1.4,0.64,1) forwards',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'rgba(20,184,166,0.12)',
                  border: '1.5px solid rgba(20,184,166,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <MapPin size={15} color="#14b8a6" />
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                    Sky location
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0, marginTop: 2 }}>
                    Affects forecasts and marketplace
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              >
                <X size={14} color="rgba(255,255,255,0.5)" />
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: '14px 16px 10px', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  ref={searchRef}
                  className="loc-search-input"
                  type="text"
                  placeholder="Search city…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* City list */}
            <div className="loc-city-list" style={{ flex: 1, overflowY: 'auto', padding: '0 16px', minHeight: 0 }}>
              {filtered.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '24px 0', margin: 0 }}>
                  No cities found
                </p>
              ) : (
                filtered.map(group => (
                  <div key={group.label} style={{ marginBottom: 8 }}>
                    <p style={{
                      color: 'rgba(20,184,166,0.6)', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      margin: '12px 4px 4px',
                    }}>
                      {group.label}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {group.cities.map(p => {
                        const active = isActive(p)
                        return (
                          <button
                            key={`${p.city}-${p.country}`}
                            className={`loc-city-btn${active ? ' active' : ''}`}
                            onClick={() => handlePreset(p)}
                          >
                            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{p.flag}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ color: active ? '#14b8a6' : 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500 }}>
                                {p.city}
                              </span>
                              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginLeft: 8 }}>
                                {p.country}
                              </span>
                            </div>
                            {active && <Check size={14} color="#14b8a6" style={{ flexShrink: 0 }} />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
              <div style={{ height: 8 }} />
            </div>

            {/* GPS button */}
            <div style={{ padding: '10px 16px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <button className="loc-gps-btn" onClick={handleGPS} disabled={gpsLoading}>
                <Navigation size={14} className={gpsLoading ? 'loc-spinning' : ''} />
                {gpsLoading ? 'Detecting location…' : 'Use my GPS location'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
