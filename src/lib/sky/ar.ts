// AR pointing math: turns raw DeviceOrientationEvent angles into the sky
// direction the back of the phone is aimed at.

export interface SkyPointing {
  azimuth: number;   // 0 = north, increases clockwise
  altitude: number;  // -90 = down, 0 = horizon, +90 = zenith
}

// Reasonable defaults for a modern phone rear camera in portrait.
// FOV varies by device; if a refinement is ever needed, surface it as a
// per-device override rather than a runtime calibration.
export const DEFAULT_HORIZONTAL_FOV = 65;
export const DEFAULT_VERTICAL_FOV = 50;

// "On target" threshold in degrees — both axes must be within this band.
export const ON_TARGET_DEG = 3;

/**
 * Convert raw device orientation angles to the (azimuth, altitude) the back
 * of the device is pointing at, assuming the user holds the phone in
 * portrait with the screen facing them.
 *
 * - On iOS Safari, prefer `webkitCompassHeading` (absolute, 0 = magnetic N).
 * - On Android Chrome with `event.absolute === true`, use `alpha` directly,
 *   inverted because alpha increases counter-clockwise as the device top
 *   rotates (so 0=north needs a sign flip to match clockwise compass).
 * - Altitude: when beta = 90 the phone is upright with the back pointing at
 *   the horizon (alt 0); beta = 180 → back points up (alt +90); beta = 0 →
 *   back points down (alt -90).
 */
export function deviceToSkyPointing(
  alpha: number | null,
  beta: number | null,
  _gamma: number | null,
  webkitCompassHeading: number | null,
): SkyPointing {
  let azimuth: number;
  if (webkitCompassHeading !== null && !isNaN(webkitCompassHeading)) {
    azimuth = webkitCompassHeading;
  } else if (alpha !== null && !isNaN(alpha)) {
    azimuth = (360 - alpha) % 360;
  } else {
    azimuth = 0;
  }
  azimuth = ((azimuth % 360) + 360) % 360;

  const b = beta ?? 90;
  const altitude = Math.max(-90, Math.min(90, b - 90));

  return { azimuth, altitude };
}

/** Signed shortest difference between two compass directions, in degrees. */
export function shortestAzDelta(targetAz: number, fromAz: number): number {
  return ((targetAz - fromAz + 540) % 360) - 180;
}

/** Compass heading → 8-point cardinal label. */
export function azimuthToCardinal(az: number): 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' {
  const n = ((az % 360) + 360) % 360;
  if (n >= 337.5 || n < 22.5) return 'N';
  if (n < 67.5) return 'NE';
  if (n < 112.5) return 'E';
  if (n < 157.5) return 'SE';
  if (n < 202.5) return 'S';
  if (n < 247.5) return 'SW';
  if (n < 292.5) return 'W';
  return 'NW';
}
