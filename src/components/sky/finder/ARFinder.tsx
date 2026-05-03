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
import type { SkyObject } from './types';
import './ARFinder.css';

interface ARFinderProps {
  objects: SkyObject[];
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

type DeviceOrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export function ARFinder({ objects, onClose }: ARFinderProps) {
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

    // iOS exposes webkitCompassHeading on the regular `deviceorientation`
    // event (not `deviceorientationabsolute`, which it doesn't fire). Listen
    // to both so we catch whichever the platform delivers.
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
    // iOS motion permission must come from a user gesture.
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

  // === Renders for the non-AR phases ===

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

  // === AR live phase ===

  return (
    <ARLive
      objects={objects}
      orientation={orientation}
      hasCamera={hasCamera}
      videoRef={videoRef}
      viewport={viewport}
      onClose={handleClose}
    />
  );
}

interface ARLiveProps {
  objects: SkyObject[];
  orientation: Orientation;
  hasCamera: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  viewport: { w: number; h: number };
  onClose: () => void;
}

function ARLive({ objects, orientation, hasCamera, videoRef, viewport, onClose }: ARLiveProps) {
  const t = useTranslations('sky.ar');

  const phoneAim: SkyPointing = useMemo(
    () => deviceToSkyPointing(
      orientation.alpha,
      orientation.beta,
      orientation.gamma,
      orientation.heading,
    ),
    [orientation],
  );

  const hFov = DEFAULT_HORIZONTAL_FOV;
  const vFov = DEFAULT_VERTICAL_FOV;

  // For each body, compute on-screen position. Render only if within an
  // expanded FOV box (1.2× to allow gentle entry/exit fades).
  const bodies = useMemo(() => {
    return objects.map((o) => {
      const dAz = shortestAzDelta(o.azimuth, phoneAim.azimuth);
      const dAlt = o.altitude - phoneAim.altitude;
      const screenX = (dAz / hFov) * viewport.w + viewport.w / 2;
      const screenY = -(dAlt / vFov) * viewport.h + viewport.h / 2;
      const visibleX = Math.abs(dAz) <= hFov * 0.6;
      const visibleY = Math.abs(dAlt) <= vFov * 0.6;
      const onScreen = visibleX && visibleY;
      const focused = Math.abs(dAz) < ON_TARGET_DEG && Math.abs(dAlt) < ON_TARGET_DEG;
      return { obj: o, screenX, screenY, onScreen, focused, dAz, dAlt };
    });
  }, [objects, phoneAim, hFov, vFov, viewport]);

  const focusedBody = bodies.find((b) => b.focused) ?? null;

  const horizonY = (phoneAim.altitude / vFov) * viewport.h + viewport.h / 2;
  const cardinal = azimuthToCardinal(phoneAim.azimuth);

  const compassPxPerDeg = viewport.w / COMPASS_VISIBLE_DEG;

  const tilt = orientation.beta ?? 90;
  let hint: string;
  if (focusedBody) {
    hint = t('found', { object: focusedBody.obj.name });
  } else if (tilt < 30) {
    hint = t('liftPhone');
  } else {
    hint = t('panAround');
  }

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

      {/* Horizon line */}
      <div
        className="ar-horizon-line"
        style={{ top: Math.max(-1, Math.min(viewport.h + 1, horizonY)) }}
      >
        <span className="ar-horizon-line__label">{t('horizon')}</span>
      </div>

      {/* Bodies */}
      <div className="ar-overlay__layer">
        {bodies.map(({ obj, screenX, screenY, onScreen, focused }) => {
          if (!onScreen) return null;
          // Sun only above horizon — never label below
          return (
            <div
              key={obj.id}
              className={`ar-body ${focused ? 'ar-body--focused' : ''}`}
              style={{
                left: screenX,
                top: screenY,
                opacity: focused ? 1 : 0.92,
              }}
            >
              <div className="ar-body__icon">
                <PlanetIcon
                  id={obj.id}
                  size={focused ? 56 : 38}
                  phase={obj.phase}
                  glow={true}
                />
                <div className="ar-body__crosshair" />
              </div>
              <div className="ar-body__label">{obj.name}</div>
            </div>
          );
        })}
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
