// AR pointing math: turns DeviceOrientationEvent angles into the sky
// direction the back of the phone is aimed at.

export interface SkyPointing {
  azimuth: number;   // 0 = north, increases clockwise
  altitude: number;  // -90 = down, 0 = horizon, +90 = zenith
}

// Effective on-screen FOV after a portrait phone's rear camera is rendered
// with `object-fit: cover`. The lens is wide (~60°), but in portrait we crop
// the horizontal sides to fill a tall screen, so the visible horizontal FOV
// shrinks to roughly a third of the screen height. Vertical stays close to
// the lens's native vertical FOV. These are conservative defaults that work
// reasonably across iPhone and modern Android.
export const DEFAULT_HORIZONTAL_FOV = 38;
export const DEFAULT_VERTICAL_FOV = 60;

// Distance below which a body is considered "centered" by the user.
export const ON_TARGET_DEG = 4;

/**
 * Convert raw device orientation angles to the (azimuth, altitude) the back
 * of the device is pointing at, assuming the user holds the phone in
 * portrait with the screen facing them.
 */
export function deviceToSkyPointing(
  alpha: number | null,
  beta: number | null,
  _gamma: number | null,
  webkitCompassHeading: number | null,
): SkyPointing {
  let azimuth: number;
  if (webkitCompassHeading !== null && !isNaN(webkitCompassHeading)) {
    // iOS: webkitCompassHeading is 0 = magnetic north, increasing clockwise
    azimuth = webkitCompassHeading;
  } else if (alpha !== null && !isNaN(alpha)) {
    // Android `deviceorientationabsolute`: alpha is 0 when device top points
    // north, increases counter-clockwise → invert.
    azimuth = (360 - alpha) % 360;
  } else {
    azimuth = 0;
  }
  azimuth = ((azimuth % 360) + 360) % 360;

  // beta=0 → screen flat face up, back of phone points down → alt -90
  // beta=90 → phone upright, back points at horizon → alt 0
  // beta=180 → phone tilted backward, back points up → alt +90
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
