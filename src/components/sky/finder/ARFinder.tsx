'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ChevronUp, RefreshCw, Telescope, X } from 'lucide-react';
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
import type { ObjectId, SkyObject } from './types';
import './ARFinder.css';

interface ARFinderProps {
  objects: SkyObject[];
  initialTargetId: ObjectId;
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
  { deg: 45,  label: 'NE', cardinal: false },
  { deg: 90,  label: 'E',  cardinal: true },
  { deg: 135, label: 'SE', cardinal: false },
  { deg: 180, label: 'S',  cardinal: true },
  { deg: 225, label: 'SW', cardinal: false },
  { deg: 270, label: 'W',  cardinal: true },
  { deg: 315, label: 'NW', cardinal: false },
];

const COMPASS_VISIBLE_DEG = 90; // total span shown across the strip

// Detect the iOS-style requestPermission API once at runtime.
type DeviceOrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export function ARFinder({ objects, initialTargetId, onClose }: ARFinderProps) {
  const t = useTranslations('sky.ar');

  const orderedObjects = useMemo(
    () => objects.slice().sort((a, b) => a.magnitude - b.magnitude),
    [objects],
  );

  const [phase, setPhase] = useState<Phase>('permission');
  const [targetId, setTargetId] = useState<ObjectId>(initialTargetId);
  const [orientation, setOrientation] = useState<Orientation>(INITIAL_ORIENTATION);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [showCalibration, setShowCalibration] = useState<boolean>(false);
  const [showApproxBanner, setShowApproxBanner] = useState<boolean>(false);
  const [viewport, setViewport] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 360,
    h: typeof window !== 'undefined' ? window.innerHeight : 640,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const azHistoryRef = useRef<{ t: number; az: number }[]>([]);
  const calibShownAtRef = useRef<number | null>(null);
  const calibSuppressedRef = useRef<boolean>(false);
  const enteredArAtRef = useRef<number | null>(null);

  const target = useMemo<SkyObject | null>(() => {
    return orderedObjects.find((o) => o.id === targetId) ?? orderedObjects[0] ?? null;
  }, [orderedObjects, targetId]);

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Detect a desktop / sensorless environment up-front.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof DeviceOrientationEvent === 'undefined') {
      setPhase('noSensors');
    }
  }, []);

  // Track viewport size for FOV → pixel math.
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

  // Stop the camera on unmount.
  useEffect(() => {
    return () => {
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach((trk) => trk.stop());
      }
      streamRef.current = null;
    };
  }, []);

  // Subscribe to orientation events whenever we enter the AR phase.
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
      if (!e.absolute && heading === null) {
        setShowApproxBanner(true);
      }
    };

    const absoluteSupported = 'ondeviceorientationabsolute' in window;
    const eventName = absoluteSupported ? 'deviceorientationabsolute' : 'deviceorientation';
    window.addEventListener(eventName, handle as EventListener);
    enteredArAtRef.current = Date.now();

    const noSensorTimer = window.setTimeout(() => {
      if (!received) setPhase('noSensors');
    }, 2000);

    return () => {
      window.removeEventListener(eventName, handle as EventListener);
      window.clearTimeout(noSensorTimer);
    };
  }, [phase]);

  // Compass-jitter / accuracy-driven calibration nudge.
  useEffect(() => {
    if (phase !== 'ar' || calibSuppressedRef.current) return;
    const enteredAt = enteredArAtRef.current ?? Date.now();
    if (Date.now() - enteredAt < 10_000) return;

    // Track recent az samples
    if (orientation.heading !== null || orientation.alpha !== null) {
      const aim = deviceToSkyPointing(
        orientation.alpha,
        orientation.beta,
        orientation.gamma,
        orientation.heading,
      );
      const now = Date.now();
      azHistoryRef.current.push({ t: now, az: aim.azimuth });
      azHistoryRef.current = azHistoryRef.current.filter((s) => now - s.t < 2000);
    }

    if (orientation.accuracy !== null && orientation.accuracy > 50) {
      setShowCalibration(true);
      calibShownAtRef.current = Date.now();
      return;
    }

    const samples = azHistoryRef.current;
    if (samples.length > 8) {
      const azs = samples.map((s) => s.az);
      // Variance accounting for circular wrap by referencing each to the first sample.
      const ref = azs[0];
      const deltas = azs.map((a) => Math.abs(((a - ref + 540) % 360) - 180));
      const max = Math.max(...deltas);
      const min = Math.min(...deltas);
      if (max - min > 30) {
        setShowCalibration(true);
        calibShownAtRef.current = Date.now();
      }
    }
  }, [orientation, phase]);

  // Auto-dismiss calibration after 8s.
  useEffect(() => {
    if (!showCalibration) return;
    const id = window.setTimeout(() => setShowCalibration(false), 8000);
    return () => window.clearTimeout(id);
  }, [showCalibration]);

  const dismissCalibration = useCallback(() => {
    setShowCalibration(false);
    calibSuppressedRef.current = true;
  }, []);

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
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;
        try {
          await videoEl.play();
        } catch {
          // Autoplay may be deferred; the muted/playsInline attrs cover most cases.
        }
      }
      setHasCamera(true);
    } catch {
      setHasCamera(false);
    }
  }, []);

  const handleEnable = useCallback(async () => {
    // 1. iOS motion permission (must be from a user gesture)
    if (typeof window !== 'undefined') {
      const ctor = (typeof DeviceOrientationEvent !== 'undefined'
        ? (DeviceOrientationEvent as DeviceOrientationConstructor)
        : null);
      const reqPerm = ctor?.requestPermission;
      if (typeof reqPerm === 'function') {
        try {
          const result = await reqPerm.call(ctor);
          if (result !== 'granted') {
            setPhase('denied');
            return;
          }
        } catch {
          setPhase('denied');
          return;
        }
      }
    }

    // 2. Enter AR phase first so the <video> mounts; then start the camera.
    setPhase('ar');
    // Defer camera start one tick so the video element exists in the DOM.
    setTimeout(() => {
      void startCamera();
    }, 0);
  }, [startCamera]);

  const handleClose = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((trk) => trk.stop());
    }
    streamRef.current = null;
    onClose();
  }, [onClose]);

  const handleSwitch = useCallback(() => {
    if (orderedObjects.length < 2) return;
    setTargetId((current) => {
      const idx = orderedObjects.findIndex((o) => o.id === current);
      const next = orderedObjects[(idx + 1) % orderedObjects.length];
      return next.id;
    });
  }, [orderedObjects]);

  // ============= Render =============

  if (phase === 'permission') {
    return (
      <PermissionStage
        targetName={target?.name ?? ''}
        onEnable={handleEnable}
        onCancel={onClose}
      />
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
  const phoneAim: SkyPointing = deviceToSkyPointing(
    orientation.alpha,
    orientation.beta,
    orientation.gamma,
    orientation.heading,
  );

  const targetAz = target?.azimuth ?? 0;
  const targetAlt = target?.altitude ?? 0;
  const dAz = shortestAzDelta(targetAz, phoneAim.azimuth);
  const dAlt = targetAlt - phoneAim.altitude;

  const hFov = DEFAULT_HORIZONTAL_FOV;
  const vFov = DEFAULT_VERTICAL_FOV;
  const inViewX = Math.abs(dAz) <= hFov / 2;
  const inViewY = Math.abs(dAlt) <= vFov / 2;
  const onScreen = inViewX && inViewY;
  const onTarget = Math.abs(dAz) < ON_TARGET_DEG && Math.abs(dAlt) < ON_TARGET_DEG;

  // Reticle screen position
  const screenX = (dAz / hFov) * viewport.w + viewport.w / 2;
  const screenY = -(dAlt / vFov) * viewport.h + viewport.h / 2;

  // Horizon line: where altitude = 0 falls on screen given current device tilt
  const horizonY = (phoneAim.altitude / vFov) * viewport.h + viewport.h / 2;

  // Off-screen arrow position: pin to the screen edge in the direction of the target.
  const edgePadding = 32;
  let arrowStyle: CSSProperties = {};
  let arrowRotation = 0;
  let arrowHint = '';
  if (!onScreen) {
    if (targetAlt < 0) {
      // Below horizon entirely — arrow points down at center
      arrowStyle = {
        left: viewport.w / 2,
        top: viewport.h - edgePadding - 80,
        transform: 'translate(-50%, 0)',
      };
      arrowRotation = 180;
      arrowHint = t('belowHorizon', { object: target?.name ?? '' });
    } else {
      // Clamp the off-screen position to a screen edge based on the larger axis.
      const horizontalDominant = Math.abs(dAz) / hFov >= Math.abs(dAlt) / vFov;
      if (horizontalDominant) {
        // Pin to left or right edge
        const onRight = dAz > 0;
        const x = onRight ? viewport.w - edgePadding : edgePadding;
        // Vertical position follows target Y but clamped
        const y = Math.max(80, Math.min(viewport.h - 120, screenY));
        arrowStyle = { left: x, top: y, transform: 'translate(-50%, -50%)' };
        arrowRotation = onRight ? 90 : -90;
        const deg = Math.round(Math.abs(dAz) / 5) * 5;
        arrowHint = onRight
          ? t('turnRight', { deg })
          : t('turnLeft', { deg });
      } else {
        // Pin to top or bottom
        const onTop = dAlt > 0;
        const y = onTop ? edgePadding + 60 : viewport.h - edgePadding - 80;
        const x = Math.max(60, Math.min(viewport.w - 60, screenX));
        arrowStyle = { left: x, top: y, transform: 'translate(-50%, -50%)' };
        arrowRotation = onTop ? 0 : 180;
        const deg = Math.round(Math.abs(dAlt) / 5) * 5;
        arrowHint = onTop
          ? t('lookUp', { deg })
          : t('lookDown', { deg });
      }
    }
  }

  // Bottom hint copy
  let hintText: string;
  let hintTone: 'default' | 'found' = 'default';
  const tilt = orientation.beta ?? 90;
  const roll = Math.abs(orientation.gamma ?? 0);
  if (onTarget) {
    hintText = t('found', { object: target?.name ?? '' });
    hintTone = 'found';
  } else if (roll > 70) {
    hintText = t('holdUpright');
  } else if (tilt < 30) {
    hintText = t('liftPhone');
  } else if (onScreen) {
    hintText = t('almost');
  } else {
    hintText = t('turnHint');
  }

  // Compass strip rendering — each tick drifts left as phoneAz increases.
  const compassPxPerDeg = viewport.w / COMPASS_VISIBLE_DEG;

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
        style={{ top: Math.max(0, Math.min(viewport.h, horizonY)) }}
      />

      {/* Reticle or off-screen arrow */}
      <div className="ar-overlay__layer">
        {onScreen ? (
          <div
            className={`ar-reticle ${onTarget ? 'ar-reticle--found' : ''}`}
            style={{ left: screenX, top: screenY }}
          >
            <div className="ar-reticle__dot" />
            <div className="ar-reticle__label">{target?.name ?? ''}</div>
          </div>
        ) : (
          <div className="ar-arrow" style={arrowStyle}>
            <div
              className="ar-arrow__chevron"
              style={{ transform: `rotate(${arrowRotation}deg)` }}
            >
              <ChevronUp size={28} strokeWidth={2.4} />
            </div>
            {arrowHint && <div className="ar-arrow__hint">{arrowHint}</div>}
          </div>
        )}
      </div>

      {/* Approximate-compass banner */}
      {showApproxBanner && (
        <div className="ar-banner">{t('fallbacks.approximateCompass')}</div>
      )}
      {!hasCamera && (
        <div className="ar-banner" style={{ top: showApproxBanner ? undefined : undefined }}>
          {t('fallbacks.noCamera')}
        </div>
      )}

      {/* Compass strip */}
      <div className="ar-compass-strip" aria-hidden="true">
        <div className="ar-compass-strip__inner">
          {COMPASS_TICKS.flatMap((tick) => {
            // Render each tick at its angular offset from the device azimuth, plus
            // wrap copies at ±360° so labels enter/leave smoothly.
            const positions = [-360, 0, 360].map((wrap) => {
              const delta = shortestAzDelta(tick.deg + wrap, phoneAim.azimuth);
              const x = viewport.w / 2 + delta * compassPxPerDeg;
              if (x < -40 || x > viewport.w + 40) return null;
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
            return positions;
          })}
        </div>
      </div>

      {/* Bottom contextual hint */}
      <div className={`ar-bottom-hint ${hintTone === 'found' ? 'ar-bottom-hint--found' : ''}`}>
        {hintTone === 'found' && (
          <span style={{ color: 'var(--yes)' }}>✦</span>
        )}
        <span>{hintText}</span>
      </div>

      {/* Top bar */}
      <div className="ar-overlay__topbar">
        <div className="ar-topbar__left">
          <button
            type="button"
            className="ar-topbar__btn"
            aria-label={t('close')}
            onClick={handleClose}
          >
            <ArrowLeft size={18} />
          </button>
          {target && (
            <>
              <PlanetIcon id={target.id} size={26} phase={target.phase} glow={false} />
              <span className="ar-topbar__title">
                {t('tracking', { object: target.name })}
              </span>
            </>
          )}
        </div>
        <div className="ar-topbar__btns">
          {orderedObjects.length > 1 && (
            <button
              type="button"
              className="ar-topbar__btn"
              aria-label={t('switchObject')}
              onClick={handleSwitch}
            >
              <RefreshCw size={18} />
            </button>
          )}
          <button
            type="button"
            className="ar-topbar__btn"
            aria-label={t('close')}
            onClick={handleClose}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Calibration nudge */}
      {showCalibration && (
        <div className="ar-card-stage">
          <div className="ar-card">
            <div className="ar-card__icon"><RefreshCw size={20} /></div>
            <h2 className="ar-card__title">{t('calibration.title')}</h2>
            <p className="ar-card__body">{t('calibration.body')}</p>
            <div className="ar-card__actions">
              <button
                type="button"
                className="ar-card__btn ar-card__btn--primary"
                onClick={dismissCalibration}
              >
                {t('calibration.ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PermissionStageProps {
  targetName: string;
  onEnable: () => void;
  onCancel: () => void;
}

function PermissionStage({ targetName, onEnable, onCancel }: PermissionStageProps) {
  const t = useTranslations('sky.ar');
  return (
    <div className="ar-overlay">
      <div className="ar-card-stage">
        <div className="ar-card">
          <div className="ar-card__icon"><Telescope size={20} /></div>
          <h2 className="ar-card__title">{t('title')}</h2>
          <p className="ar-card__body">
            {t('permissionBody', { object: targetName })}
          </p>
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
              onClick={onEnable}
            >
              {t('enable')}
            </button>
            <button
              type="button"
              className="ar-card__btn ar-card__btn--ghost"
              onClick={onCancel}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
