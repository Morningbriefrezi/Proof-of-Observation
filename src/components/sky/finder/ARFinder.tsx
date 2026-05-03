'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { Telescope, X } from 'lucide-react';
import { PlanetIcon } from './PlanetIcon';
import {
  DEFAULT_HORIZONTAL_FOV,
  DEFAULT_VERTICAL_FOV,
  ON_TARGET_DEG,
  azimuthToCardinal,
  deviceToSkyPointing,
  shortestAzDelta,
  type SkyPointing,
} from '@/lib/sky/ar';
import { CONSTELLATION_LINES, positionStars, type PositionedStar } from '@/lib/sky/stars';
import type { SkyObject } from './types';
import './ARFinder.css';

interface ARFinderProps {
  objects: SkyObject[];
  observerLat: number;
  observerLon: number;
  onClose: () => void;
}

type Phase = 'permission' | 'denied' | 'ar' | 'noSensors';

interface Orientation {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  heading: number | null;
  accuracy: number | null;
  absolute: boolean;
}

const INITIAL_ORIENTATION: Orientation = {
  alpha: null,
  beta: 90,
  gamma: 0,
  heading: null,
  accuracy: null,
  absolute: false,
};

const COMPASS_TICKS = [
  { deg: 0,   label: 'N',  cardinal: true },
  { deg: 30,  label: '30', cardinal: false },
  { deg: 45,  label: 'NE', cardinal: false },
  { deg: 60,  label: '60', cardinal: false },
  { deg: 90,  label: 'E',  cardinal: true },
  { deg: 120, label: '120',cardinal: false },
  { deg: 135, label: 'SE', cardinal: false },
  { deg: 150, label: '150',cardinal: false },
  { deg: 180, label: 'S',  cardinal: true },
  { deg: 210, label: '210',cardinal: false },
  { deg: 225, label: 'SW', cardinal: false },
  { deg: 240, label: '240',cardinal: false },
  { deg: 270, label: 'W',  cardinal: true },
  { deg: 300, label: '300',cardinal: false },
  { deg: 315, label: 'NW', cardinal: false },
  { deg: 330, label: '330',cardinal: false },
];

const COMPASS_VISIBLE_DEG = 80;

// Low-pass smoothing factor for orientation. Values near 1 = jumpy & responsive,
// values near 0 = smooth but laggy. 0.25 strikes a balance for ~30 Hz events.
const SMOOTH_ALPHA = 0.25;

type DeviceOrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export function ARFinder({ objects, observerLat, observerLon, onClose }: ARFinderProps) {
  const t = useTranslations('sky.ar');

  const [phase, setPhase] = useState<Phase>('permission');
  const [orientation, setOrientation] = useState<Orientation>(INITIAL_ORIENTATION);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [viewport, setViewport] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 360,
    h: typeof window !== 'undefined' ? window.innerHeight : 640,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const smoothedRef = useRef<{ az: number; alt: number; init: boolean }>({
    az: 0,
    alt: 0,
    init: false,
  });

  // Stars are computed once when AR opens. They drift ~0.25°/min — plenty
  // accurate for a phone-AR session lasting a few minutes.
  const stars = useMemo<PositionedStar[]>(() => {
    if (phase !== 'ar') return [];
    return positionStars(observerLat, observerLon, new Date());
  }, [phase, observerLat, observerLon]);

  const starById = useMemo(() => {
    const map = new Map<string, PositionedStar>();
    stars.forEach((s) => map.set(s.id, s));
    return map;
  }, [stars]);

  // Lock body scroll while overlay is open.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Detect missing DeviceOrientationEvent up-front (desktop).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof DeviceOrientationEvent === 'undefined') {
      setPhase('noSensors');
    }
  }, []);

  // Track viewport for FOV → pixel math.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  // Stop camera on unmount.
  useEffect(() => {
    return () => {
      const s = streamRef.current;
      if (s) s.getTracks().forEach((trk) => trk.stop());
      streamRef.current = null;
    };
  }, []);

  // Subscribe to orientation events while in AR phase.
  useEffect(() => {
    if (phase !== 'ar') return;
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') return;

    let received = false;
    const handle = (e: DeviceOrientationEvent) => {
      received = true;
      const heading =
        typeof (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading === 'number'
          ? (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading
          : null;
      const accuracy =
        typeof (e as unknown as { webkitCompassAccuracy?: number }).webkitCompassAccuracy === 'number'
          ? (e as unknown as { webkitCompassAccuracy: number }).webkitCompassAccuracy
          : null;
      setOrientation({
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma,
        heading,
        accuracy,
        absolute: !!e.absolute,
      });
    };

    window.addEventListener('deviceorientation', handle as EventListener, true);
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handle as EventListener, true);
    }

    const noSensorTimer = window.setTimeout(() => {
      if (!received) setPhase('noSensors');
    }, 2500);

    return () => {
      window.removeEventListener('deviceorientation', handle as EventListener, true);
      if ('ondeviceorientationabsolute' in window) {
        window.removeEventListener('deviceorientationabsolute', handle as EventListener, true);
      }
      window.clearTimeout(noSensorTimer);
    };
  }, [phase]);

  const startCamera = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setHasCamera(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      const v = videoRef.current;
      if (v) {
        v.srcObject = stream;
        try { await v.play(); } catch { /* autoplay deferred */ }
      }
      setHasCamera(true);
    } catch {
      setHasCamera(false);
    }
  }, []);

  const handleEnable = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const ctor =
        typeof DeviceOrientationEvent !== 'undefined'
          ? (DeviceOrientationEvent as DeviceOrientationConstructor)
          : null;
      const reqPerm = ctor?.requestPermission;
      if (typeof reqPerm === 'function') {
        try {
          const result = await reqPerm.call(ctor);
          if (result !== 'granted') { setPhase('denied'); return; }
        } catch {
          setPhase('denied');
          return;
        }
      }
    }
    setPhase('ar');
    setTimeout(() => { void startCamera(); }, 0);
  }, [startCamera]);

  const handleClose = useCallback(() => {
    const s = streamRef.current;
    if (s) s.getTracks().forEach((trk) => trk.stop());
    streamRef.current = null;
    onClose();
  }, [onClose]);

  if (phase === 'permission') {
    return (
      <div className="ar-overlay">
        <div className="ar-card-stage">
          <div className="ar-card">
            <div className="ar-card__icon"><Telescope size={20} /></div>
            <h2 className="ar-card__title">{t('title')}</h2>
            <p className="ar-card__body">{t('permissionBody')}</p>
            <p className="ar-card__body">{t('permissionInstructions')}</p>
            <ul className="ar-card__list">
              <li>{t('permissionItems.camera')}</li>
              <li>{t('permissionItems.motion')}</li>
              <li>{t('permissionItems.location')}</li>
            </ul>
            <div className="ar-card__actions">
              <button
                type="button"
                className="ar-card__btn ar-card__btn--primary"
                onClick={handleEnable}
              >
                {t('enable')}
              </button>
              <button
                type="button"
                className="ar-card__btn ar-card__btn--ghost"
                onClick={onClose}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'denied') {
    return (
      <div className="ar-overlay">
        <div className="ar-card-stage">
          <div className="ar-card">
            <div className="ar-card__icon"><Telescope size={20} /></div>
            <h2 className="ar-card__title">{t('denied.title')}</h2>
            <p className="ar-card__body">{t('denied.body')}</p>
            <div className="ar-card__actions">
              <button
                type="button"
                className="ar-card__btn ar-card__btn--primary"
                onClick={() => setPhase('permission')}
              >
                {t('denied.tryAgain')}
              </button>
              <button
                type="button"
                className="ar-card__btn ar-card__btn--ghost"
                onClick={onClose}
              >
                {t('denied.useHorizonInstead')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'noSensors') {
    return (
      <div className="ar-overlay">
        <div className="ar-card-stage">
          <div className="ar-card">
            <div className="ar-card__icon"><Telescope size={20} /></div>
            <h2 className="ar-card__title">{t('title')}</h2>
            <p className="ar-card__body">{t('fallbacks.noSensors')}</p>
            <div className="ar-card__actions">
              <button
                type="button"
                className="ar-card__btn ar-card__btn--primary"
                onClick={onClose}
              >
                {t('denied.useHorizonInstead')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ARLive
      objects={objects}
      stars={stars}
      starById={starById}
      orientation={orientation}
      smoothedRef={smoothedRef}
      hasCamera={hasCamera}
      videoRef={videoRef}
      viewport={viewport}
      onClose={handleClose}
    />
  );
}

interface ARLiveProps {
  objects: SkyObject[];
  stars: PositionedStar[];
  starById: Map<string, PositionedStar>;
  orientation: Orientation;
  smoothedRef: React.MutableRefObject<{ az: number; alt: number; init: boolean }>;
  hasCamera: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  viewport: { w: number; h: number };
  onClose: () => void;
}

function ARLive({
  objects,
  stars,
  starById,
  orientation,
  smoothedRef,
  hasCamera,
  videoRef,
  viewport,
  onClose,
}: ARLiveProps) {
  const t = useTranslations('sky.ar');

  // Low-pass filter device pointing. Azimuth uses circular smoothing so we
  // don't average across the 0/360 wrap.
  const phoneAim: SkyPointing = useMemo(() => {
    const raw = deviceToSkyPointing(
      orientation.alpha,
      orientation.beta,
      orientation.gamma,
      orientation.heading,
    );
    const s = smoothedRef.current;
    if (!s.init) {
      s.az = raw.azimuth;
      s.alt = raw.altitude;
      s.init = true;
    } else {
      const dAz = shortestAzDelta(raw.azimuth, s.az);
      s.az = ((s.az + SMOOTH_ALPHA * dAz) % 360 + 360) % 360;
      s.alt = s.alt + SMOOTH_ALPHA * (raw.altitude - s.alt);
    }
    return { azimuth: s.az, altitude: s.alt };
  }, [orientation, smoothedRef]);

  const hFov = DEFAULT_HORIZONTAL_FOV;
  const vFov = DEFAULT_VERTICAL_FOV;

  const project = useCallback(
    (az: number, alt: number) => {
      const dAz = shortestAzDelta(az, phoneAim.azimuth);
      const dAlt = alt - phoneAim.altitude;
      const screenX = (dAz / hFov) * viewport.w + viewport.w / 2;
      const screenY = -(dAlt / vFov) * viewport.h + viewport.h / 2;
      return { dAz, dAlt, screenX, screenY };
    },
    [phoneAim, hFov, vFov, viewport],
  );

  const bodies = useMemo(() => {
    return objects.map((o) => {
      const { dAz, dAlt, screenX, screenY } = project(o.azimuth, o.altitude);
      const onScreen = Math.abs(dAz) <= hFov * 0.6 && Math.abs(dAlt) <= vFov * 0.6;
      const angularDist = Math.sqrt(dAz * dAz + dAlt * dAlt);
      const focused = angularDist < ON_TARGET_DEG;
      return { obj: o, screenX, screenY, dAz, dAlt, angularDist, onScreen, focused };
    });
  }, [objects, project, hFov, vFov]);

  // Sort bodies so the focused one renders last (highest z-order).
  const bodiesSortedForRender = useMemo(() => {
    return bodies.slice().sort((a, b) => Number(a.focused) - Number(b.focused));
  }, [bodies]);

  const positionedStars = useMemo(() => {
    return stars
      .filter((s) => s.altitude > -2) // a touch below horizon for atmospheric refraction
      .map((s) => {
        const { dAz, dAlt, screenX, screenY } = project(s.azimuth, s.altitude);
        const onScreen = Math.abs(dAz) <= hFov * 0.55 && Math.abs(dAlt) <= vFov * 0.55;
        return { star: s, screenX, screenY, onScreen };
      });
  }, [stars, project, hFov, vFov]);

  // The body whose angular distance from screen-center is smallest. This is
  // what we display in the center readout.
  const nearestBody = useMemo(() => {
    let best: typeof bodies[number] | null = null;
    for (const b of bodies) {
      if (b.obj.altitude < 0) continue;
      if (!best || b.angularDist < best.angularDist) best = b;
    }
    return best;
  }, [bodies]);

  const horizonY = (phoneAim.altitude / vFov) * viewport.h + viewport.h / 2;
  const cardinal = azimuthToCardinal(phoneAim.azimuth);
  const compassPxPerDeg = viewport.w / COMPASS_VISIBLE_DEG;

  const tilt = orientation.beta ?? 90;
  let hint: string;
  if (nearestBody && nearestBody.angularDist < ON_TARGET_DEG) {
    hint = t('found', { object: nearestBody.obj.name });
  } else if (tilt < 30) {
    hint = t('liftPhone');
  } else {
    hint = t('panAround');
  }

  // Constellation segments — only render if both endpoints are on-screen.
  const constellationSegments = useMemo(() => {
    const out: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (const [aId, bId] of CONSTELLATION_LINES) {
      const a = starById.get(aId);
      const b = starById.get(bId);
      if (!a || !b) continue;
      if (a.altitude < -1 || b.altitude < -1) continue;
      const pa = project(a.azimuth, a.altitude);
      const pb = project(b.azimuth, b.altitude);
      const aOn = Math.abs(pa.dAz) <= hFov * 0.6 && Math.abs(pa.dAlt) <= vFov * 0.6;
      const bOn = Math.abs(pb.dAz) <= hFov * 0.6 && Math.abs(pb.dAlt) <= vFov * 0.6;
      if (!aOn && !bOn) continue;
      out.push({ x1: pa.screenX, y1: pa.screenY, x2: pb.screenX, y2: pb.screenY });
    }
    return out;
  }, [starById, project, hFov, vFov]);

  return (
    <div className="ar-overlay" role="dialog" aria-modal="true" aria-label={t('title')}>
      {hasCamera ? (
        <video
          ref={videoRef}
          className="ar-overlay__camera"
          autoPlay
          playsInline
          muted
        />
      ) : (
        <div className="ar-overlay__starfield" />
      )}

      {/* Constellation lines — drawn under everything else so stars sit on top */}
      <svg
        className="ar-constellations"
        width={viewport.w}
        height={viewport.h}
        viewBox={`0 0 ${viewport.w} ${viewport.h}`}
      >
        {constellationSegments.map((seg, i) => (
          <line
            key={i}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={1}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Stars */}
      <div className="ar-overlay__layer">
        {positionedStars.map(({ star, screenX, screenY, onScreen }) => {
          if (!onScreen) return null;
          // size: brightest stars 4px, faintest 1.5px
          const size = Math.max(1.5, 4 - star.mag * 0.6);
          const opacity = Math.max(0.45, 1 - star.mag * 0.18);
          return (
            <div
              key={star.id}
              className="ar-star"
              style={{
                left: screenX,
                top: screenY,
                width: size,
                height: size,
                opacity,
              }}
              title={star.name}
            />
          );
        })}
      </div>

      {/* Horizon line */}
      <div
        className="ar-horizon-line"
        style={{ top: Math.max(-1, Math.min(viewport.h + 1, horizonY)) }}
      >
        <span className="ar-horizon-line__label">{t('horizon')}</span>
      </div>

      {/* Bodies */}
      <div className="ar-overlay__layer">
        {bodiesSortedForRender.map(({ obj, screenX, screenY, onScreen, focused }) => {
          if (!onScreen) return null;
          return (
            <div
              key={obj.id}
              className={`ar-body ${focused ? 'ar-body--focused' : ''}`}
              style={{
                left: screenX,
                top: screenY,
                opacity: focused ? 1 : 0.94,
              }}
            >
              <div className="ar-body__icon">
                <PlanetIcon
                  id={obj.id}
                  size={focused ? 56 : 40}
                  phase={obj.phase}
                  glow={true}
                />
                <div className="ar-body__crosshair" />
              </div>
              <div className="ar-body__label">{obj.name}</div>
              <div className="ar-body__coords">
                ALT {Math.round(obj.altitude)}° · AZ {Math.round(obj.azimuth)}°
              </div>
            </div>
          );
        })}
      </div>

      {/* Center reticle */}
      <div className="ar-center-reticle" aria-hidden="true">
        <span className="ar-center-reticle__h" />
        <span className="ar-center-reticle__v" />
        <span className="ar-center-reticle__dot" />
      </div>

      {/* Center readout */}
      <div className="ar-center-readout">
        <div className="ar-center-readout__line">
          <span>ALT</span>
          <strong>{phoneAim.altitude >= 0 ? '+' : ''}{phoneAim.altitude.toFixed(1)}°</strong>
          <span>·</span>
          <span>AZ</span>
          <strong>{phoneAim.azimuth.toFixed(1)}°</strong>
        </div>
        {nearestBody && nearestBody.angularDist < hFov * 0.5 && (
          <div className="ar-center-readout__nearest">
            {t('centeredOn')}{' '}
            <strong>{nearestBody.obj.name}</strong>
            <span> · {nearestBody.angularDist.toFixed(1)}° {t('off')}</span>
          </div>
        )}
      </div>

      {/* No-camera banner */}
      {!hasCamera && (
        <div className="ar-bottom-hint" style={{ bottom: 'auto', top: 70 }}>
          {t('fallbacks.noCamera')}
        </div>
      )}

      {/* Compass strip */}
      <div className="ar-compass-strip" aria-hidden="true">
        <div className="ar-compass-strip__inner">
          <div className="ar-compass-strip__center" />
          {COMPASS_TICKS.flatMap((tick) => {
            return [-360, 0, 360].map((wrap) => {
              const delta = shortestAzDelta(tick.deg + wrap, phoneAim.azimuth);
              if (Math.abs(delta) > COMPASS_VISIBLE_DEG / 2 + 5) return null;
              const x = viewport.w / 2 + delta * compassPxPerDeg;
              return (
                <div
                  key={`${tick.label}-${wrap}`}
                  className={`ar-compass-tick ${tick.cardinal ? 'ar-compass-tick--cardinal' : ''}`}
                  style={{ left: x }}
                >
                  <span className="ar-compass-tick__mark" />
                  <span>{tick.label}</span>
                </div>
              );
            });
          })}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="ar-bottom-hint">{hint}</div>

      {/* Top bar */}
      <div className="ar-overlay__topbar">
        <div>
          <div className="ar-topbar__title">{t('title')}</div>
          <div className="ar-topbar__heading">
            {cardinal} · {Math.round(phoneAim.azimuth)}°
          </div>
        </div>
        <button
          type="button"
          className="ar-topbar__btn"
          aria-label={t('close')}
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
