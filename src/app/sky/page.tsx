// src/app/sky/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSkyData } from '@/lib/use-sky-data';
import { useLocation } from '@/lib/location';
import { ObservationTimeline } from '@/components/sky/ObservationTimeline';
import { LocationFallbackBanner } from '@/components/sky/LocationFallbackBanner';
import { DirectionHero } from '@/components/sky/finder/DirectionHero';
import { SkyMap } from '@/components/sky/finder/SkyMap';
import { BodyTable } from '@/components/sky/finder/BodyTable';
import { ARFinder } from '@/components/sky/finder/ARFinder';
import type { FinderResponse, ObjectId, SkyObject } from '@/components/sky/finder/types';
import './sky.css';

const FALLBACK_COORDS = { lat: 41.6941, lon: 44.8337 };

export default function SkyPage() {
  const { location } = useLocation();
  const tPage = useTranslations('sky.page');
  const tHeader = useTranslations('sky.header');
  const tErrors = useTranslations('sky.errors');

  const initialCoords = useMemo(
    () => ({ lat: location.lat, lon: location.lon, city: location.city }),
    [location.lat, location.lon, location.city],
  );
  const sky = useSkyData(initialCoords);

  const [finder, setFinder] = useState<FinderResponse | null>(null);
  const [finderLoading, setFinderLoading] = useState(true);
  const [finderError, setFinderError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<ObjectId | null>(null);
  const [arOpen, setArOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // Tick the clock every minute so the live readout stays current.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const fetchFinder = useCallback(async () => {
    setFinderLoading(true);
    setFinderError(null);
    try {
      const res = await fetch(`/api/sky/finder?lat=${location.lat}&lon=${location.lon}`);
      if (!res.ok) throw new Error('fetch failed');
      const data: FinderResponse = await res.json();
      setFinder(data);
      const visible = data.objects
        .filter((o) => o.visible && o.id !== 'sun')
        .sort((a, b) => a.magnitude - b.magnitude);
      setActiveId((prev) => prev ?? (visible[0]?.id ?? null));
    } catch {
      setFinderError(tErrors('fetchFailed'));
    } finally {
      setFinderLoading(false);
    }
  }, [location.lat, location.lon, tErrors]);

  useEffect(() => {
    fetchFinder();
  }, [fetchFinder]);

  // Bodies for the chart and table — exclude Sun at night, include otherwise.
  // The decision is "is the sun above the horizon" (handled in the API).
  const tableObjects = useMemo<SkyObject[]>(() => {
    if (!finder) return [];
    const sun = finder.objects.find((o) => o.id === 'sun');
    const sunVisible = !!sun?.visible;
    return finder.objects.filter((o) => (o.id === 'sun' ? sunVisible : true));
  }, [finder]);

  // AR gets every body that's currently above the horizon, including Sun.
  const arBodies = useMemo<SkyObject[]>(() => {
    if (!finder) return [];
    return finder.objects.filter((o) => o.visible);
  }, [finder]);

  const visibleSorted = useMemo<SkyObject[]>(() => {
    return tableObjects
      .filter((o) => o.visible)
      .sort((a, b) => b.altitude - a.altitude);
  }, [tableObjects]);

  const activeObject = useMemo(() => {
    if (!finder || !activeId) return null;
    return finder.objects.find((o) => o.id === activeId) ?? null;
  }, [finder, activeId]);

  const handleSelect = useCallback((id: ObjectId) => {
    setActiveId(id);
  }, []);

  const verdict = useMemo(() => {
    if (!finder) return null;
    const visibleCount = visibleSorted.length;
    if (visibleCount === 0) {
      // Find the next body to rise.
      const next = finder.objects
        .filter((o) => !o.visible && o.riseTime)
        .sort((a, b) => (a.riseTime ?? '').localeCompare(b.riseTime ?? ''))[0];
      if (next?.riseTime) {
        const t = new Date(next.riseTime);
        const hh = String(t.getHours()).padStart(2, '0');
        const mm = String(t.getMinutes()).padStart(2, '0');
        return tHeader('nextRise', { object: next.name, time: `${hh}:${mm}` });
      }
      return tHeader('nothingUp');
    }
    const highest = visibleSorted[0];
    const brightest = [...visibleSorted].sort((a, b) => a.magnitude - b.magnitude)[0];
    if (highest.id === brightest.id) {
      return tHeader('oneStandout', {
        count: visibleCount,
        object: highest.name,
        alt: Math.round(highest.altitude),
        compass: highest.compassDirection,
      });
    }
    return tHeader('twoStandouts', {
      count: visibleCount,
      bright: brightest.name,
      high: highest.name,
      alt: Math.round(highest.altitude),
    });
  }, [finder, visibleSorted, tHeader]);

  const dateLabel = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const conditionsLabel =
    finder?.conditions
      ? `${tHeader(`conditions.${finder.conditions.quality.toLowerCase()}`)} · ${finder.conditions.cloudCoverPct}% ${tHeader('clouds')}`
      : null;

  const fallbackUsed =
    location.source === 'default' &&
    location.lat === FALLBACK_COORDS.lat &&
    location.lon === FALLBACK_COORDS.lon;

  const darkWindowLabel = useMemo(() => {
    const dw = sky.timeline.darkWindow;
    if (!dw) return null;
    const fmt = (iso: string) => {
      const d = new Date(iso);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };
    return `${fmt(dw.start)} → ${fmt(dw.end)}`;
  }, [sky.timeline.darkWindow]);

  return (
    <div className="sky-page-v2 sky-v3">
      <div className="sky-v3__container">
        <LocationFallbackBanner />

        {/* === Header === */}
        <header className="sky-v3__head">
          <div className="sky-v3__head-left">
            <p className="sky-v3__eyebrow">{tHeader('eyebrow')}</p>
            <h1 className="sky-v3__title">{tHeader('title')}</h1>
            <p className="sky-v3__meta">
              <span>{location.city ?? '—'}</span>
              <span aria-hidden>·</span>
              <span>{dateLabel}</span>
              <span aria-hidden>·</span>
              <span className="sky-v3__meta-time">{timeLabel}</span>
              {sky.location && (
                <>
                  <span aria-hidden>·</span>
                  <span>Bortle {sky.location.bortle}</span>
                </>
              )}
            </p>
            {conditionsLabel && <p className="sky-v3__conditions">{conditionsLabel}</p>}
          </div>
          <div className="sky-v3__head-right">
            {verdict && <p className="sky-v3__verdict">{verdict}</p>}
            <button
              type="button"
              className="sky-v3__ar"
              onClick={() => setArOpen(true)}
              disabled={arBodies.length === 0}
            >
              {tHeader('openAr')}
            </button>
          </div>
        </header>

        {fallbackUsed && finder && (
          <div className="sky-v3__fallback">
            <span>{tErrors('locationFallback')}</span>
            <button type="button" onClick={fetchFinder}>{tErrors('useMyLocation')}</button>
          </div>
        )}

        {finderError && (
          <div className="sky-v3__error">
            <span>{finderError}</span>
            <button type="button" onClick={fetchFinder}>{tErrors('retry')}</button>
          </div>
        )}

        {finderLoading && !finder && (
          <div className="sky-v3__loading">{tPage('detectingLocation')}</div>
        )}

        {/* === Chart + Table === */}
        {finder && !finderError && (
          <>
            <section className="sky-v3__split">
              <div className="sky-v3__map-wrap">
                <SkyMap objects={tableObjects} activeId={activeId} onSelect={handleSelect} />
                <p className="sky-v3__map-caption">{tHeader('mapCaption')}</p>
              </div>
              <div className="sky-v3__table-wrap">
                <BodyTable objects={tableObjects} activeId={activeId} onSelect={handleSelect} />
              </div>
            </section>

            {activeObject && (
              <section className="sky-v3__active">
                <DirectionHero object={activeObject} />
              </section>
            )}
          </>
        )}

        {/* === Timeline === */}
        <section className="sky-v3__timeline">
          <div className="sky-v3__timeline-head">
            <h2 className="sky-v3__h2">{tPage('tonightTimeline')}</h2>
            <span className="sky-v3__timeline-meta">
              <span>{tPage('darkWindow')}</span>
              <span className="times">{darkWindowLabel ?? '—'}</span>
            </span>
          </div>
          <ObservationTimeline data={sky.timeline} />
        </section>
      </div>

      {arOpen && arBodies.length > 0 && (
        <ARFinder
          objects={arBodies}
          observerLat={location.lat}
          observerLon={location.lon}
          onClose={() => setArOpen(false)}
        />
      )}
    </div>
  );
}
