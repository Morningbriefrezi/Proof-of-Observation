// Stellar deep-sky catalog.
//
// Source of truth for every fixed celestial target Stellar can guide a user
// to. Planets, Sun, and Moon are computed live by astronomy-engine in the
// finder API and aren't listed here — but their type/difficulty/instrument
// metadata IS, in `PLANET_META`, so the UI can treat them uniformly.
//
// Coordinates are J2000 RA (hours) / Dec (degrees). Precession and proper
// motion drift are well below the precision the user can perceive in a
// phone-finder context, so we ignore them.
//
// Naming: every entry has an `id` (lowercase ascii, slash-free, e.g. 'm31',
// 'sirius'). Display names + recognition copy live in i18n under
// `sky.catalog.<id>.name` / `.recognize` for EN + KA.

export type CatalogType =
  | 'planet'
  | 'star'
  | 'double'
  | 'cluster'
  | 'nebula'
  | 'galaxy'
  | 'moon'
  | 'sun';

export type CatalogDifficulty = 'easy' | 'medium' | 'hard';
export type CatalogInstrument = 'naked' | 'binoculars' | 'telescope';

/** Static catalog entry — anything with fixed RA/Dec. */
export interface CatalogTarget {
  id: string;
  type: CatalogType;
  difficulty: CatalogDifficulty;
  instrument: CatalogInstrument;
  /** J2000 right ascension in hours, 0..24. */
  ra: number;
  /** J2000 declination in degrees, -90..+90. */
  dec: number;
  /** Apparent visual magnitude. Lower = brighter. */
  magnitude: number;
  /** English short constellation name (e.g. 'Lyra'). */
  constellation: string;
  /** Optional anchor for star-hop hint: id of a brighter, easier-to-find body. */
  hopFromId?: string;
  /** Display fallback if i18n key is missing. */
  fallbackName: string;
}

/** Runtime metadata for the planets/sun/moon computed by astronomy-engine. */
export interface DynamicMeta {
  type: CatalogType;
  difficulty: CatalogDifficulty;
  instrument: CatalogInstrument;
  fallbackName: string;
}

export const PLANET_META: Record<string, DynamicMeta> = {
  sun:     { type: 'sun',    difficulty: 'easy',   instrument: 'naked',      fallbackName: 'Sun' },
  moon:    { type: 'moon',   difficulty: 'easy',   instrument: 'naked',      fallbackName: 'Moon' },
  venus:   { type: 'planet', difficulty: 'easy',   instrument: 'naked',      fallbackName: 'Venus' },
  jupiter: { type: 'planet', difficulty: 'easy',   instrument: 'naked',      fallbackName: 'Jupiter' },
  mars:    { type: 'planet', difficulty: 'easy',   instrument: 'naked',      fallbackName: 'Mars' },
  saturn:  { type: 'planet', difficulty: 'medium', instrument: 'naked',      fallbackName: 'Saturn' },
  mercury: { type: 'planet', difficulty: 'medium', instrument: 'naked',      fallbackName: 'Mercury' },
  uranus:  { type: 'planet', difficulty: 'hard',   instrument: 'binoculars', fallbackName: 'Uranus' },
  neptune: { type: 'planet', difficulty: 'hard',   instrument: 'telescope',  fallbackName: 'Neptune' },
};

/* ============================================================
   === Static targets — bright stars, doubles, DSOs           ===
   ============================================================ */

export const CATALOG: CatalogTarget[] = [
  /* === Easy: anchor stars every beginner can spot === */
  { id: 'polaris',    type: 'star',   difficulty: 'easy',   instrument: 'naked',
    ra: 2.530,  dec: 89.264,  magnitude: 1.97, constellation: 'Ursa Minor',
    fallbackName: 'Polaris' },
  { id: 'sirius',     type: 'star',   difficulty: 'easy',   instrument: 'naked',
    ra: 6.752,  dec: -16.716, magnitude: -1.46, constellation: 'Canis Major',
    fallbackName: 'Sirius' },
  { id: 'vega',       type: 'star',   difficulty: 'easy',   instrument: 'naked',
    ra: 18.616, dec: 38.784,  magnitude: 0.03, constellation: 'Lyra',
    fallbackName: 'Vega' },
  { id: 'arcturus',   type: 'star',   difficulty: 'easy',   instrument: 'naked',
    ra: 14.261, dec: 19.182,  magnitude: -0.05, constellation: 'Boötes',
    fallbackName: 'Arcturus' },
  { id: 'capella',    type: 'star',   difficulty: 'easy',   instrument: 'naked',
    ra: 5.278,  dec: 45.998,  magnitude: 0.08, constellation: 'Auriga',
    fallbackName: 'Capella' },
  { id: 'rigel',      type: 'star',   difficulty: 'easy',   instrument: 'naked',
    ra: 5.243,  dec: -8.202,  magnitude: 0.13, constellation: 'Orion',
    fallbackName: 'Rigel' },
  { id: 'betelgeuse', type: 'star',   difficulty: 'easy',   instrument: 'naked',
    ra: 5.919,  dec: 7.407,   magnitude: 0.50, constellation: 'Orion',
    fallbackName: 'Betelgeuse' },
  { id: 'procyon',    type: 'star',   difficulty: 'easy',   instrument: 'naked',
    ra: 7.655,  dec: 5.225,   magnitude: 0.34, constellation: 'Canis Minor',
    fallbackName: 'Procyon' },
  { id: 'aldebaran',  type: 'star',   difficulty: 'easy',   instrument: 'naked',
    ra: 4.598,  dec: 16.509,  magnitude: 0.85, constellation: 'Taurus',
    fallbackName: 'Aldebaran' },

  /* === Medium: requires darker sky or knowing a constellation === */
  { id: 'altair',     type: 'star',   difficulty: 'medium', instrument: 'naked',
    ra: 19.846, dec: 8.868,   magnitude: 0.77, constellation: 'Aquila',
    fallbackName: 'Altair' },
  { id: 'deneb',      type: 'star',   difficulty: 'medium', instrument: 'naked',
    ra: 20.690, dec: 45.280,  magnitude: 1.25, constellation: 'Cygnus',
    fallbackName: 'Deneb' },
  { id: 'antares',    type: 'star',   difficulty: 'medium', instrument: 'naked',
    ra: 16.490, dec: -26.432, magnitude: 0.96, constellation: 'Scorpius',
    fallbackName: 'Antares' },
  { id: 'spica',      type: 'star',   difficulty: 'medium', instrument: 'naked',
    ra: 13.420, dec: -11.161, magnitude: 0.98, constellation: 'Virgo',
    fallbackName: 'Spica' },
  { id: 'regulus',    type: 'star',   difficulty: 'medium', instrument: 'naked',
    ra: 10.139, dec: 11.967,  magnitude: 1.40, constellation: 'Leo',
    fallbackName: 'Regulus' },
  { id: 'pollux',     type: 'star',   difficulty: 'medium', instrument: 'naked',
    ra: 7.755,  dec: 28.026,  magnitude: 1.14, constellation: 'Gemini',
    fallbackName: 'Pollux' },
  { id: 'm45',        type: 'cluster', difficulty: 'medium', instrument: 'naked',
    ra: 3.792,  dec: 24.117,  magnitude: 1.6,  constellation: 'Taurus',
    fallbackName: 'Pleiades' },
  { id: 'm31',        type: 'galaxy', difficulty: 'medium', instrument: 'binoculars',
    ra: 0.712,  dec: 41.269,  magnitude: 3.4,  constellation: 'Andromeda',
    hopFromId: 'mirach',
    fallbackName: 'Andromeda Galaxy' },
  { id: 'm42',        type: 'nebula', difficulty: 'medium', instrument: 'binoculars',
    ra: 5.591,  dec: -5.391,  magnitude: 4.0,  constellation: 'Orion',
    hopFromId: 'rigel',
    fallbackName: 'Orion Nebula' },

  /* === Hard: telescope or binoculars + dark sky + a star-hop === */
  { id: 'mizar',      type: 'double', difficulty: 'hard',   instrument: 'naked',
    ra: 13.399, dec: 54.925,  magnitude: 2.27, constellation: 'Ursa Major',
    fallbackName: 'Mizar & Alcor' },
  { id: 'albireo',    type: 'double', difficulty: 'hard',   instrument: 'telescope',
    ra: 19.512, dec: 27.960,  magnitude: 3.05, constellation: 'Cygnus',
    hopFromId: 'deneb',
    fallbackName: 'Albireo' },
  { id: 'm13',        type: 'cluster', difficulty: 'hard',  instrument: 'binoculars',
    ra: 16.695, dec: 36.460,  magnitude: 5.8,  constellation: 'Hercules',
    hopFromId: 'vega',
    fallbackName: 'Hercules Cluster' },
  { id: 'm57',        type: 'nebula', difficulty: 'hard',   instrument: 'telescope',
    ra: 18.886, dec: 33.029,  magnitude: 8.8,  constellation: 'Lyra',
    hopFromId: 'vega',
    fallbackName: 'Ring Nebula' },
  { id: 'm27',        type: 'nebula', difficulty: 'hard',   instrument: 'telescope',
    ra: 19.994, dec: 22.721,  magnitude: 7.5,  constellation: 'Vulpecula',
    hopFromId: 'altair',
    fallbackName: 'Dumbbell Nebula' },
  { id: 'm51',        type: 'galaxy', difficulty: 'hard',   instrument: 'telescope',
    ra: 13.498, dec: 47.195,  magnitude: 8.4,  constellation: 'Canes Venatici',
    hopFromId: 'mizar',
    fallbackName: 'Whirlpool Galaxy' },
  { id: 'm81',        type: 'galaxy', difficulty: 'hard',   instrument: 'binoculars',
    ra: 9.926,  dec: 69.066,  magnitude: 6.9,  constellation: 'Ursa Major',
    hopFromId: 'polaris',
    fallbackName: 'Bode’s Galaxy' },
  { id: 'm104',       type: 'galaxy', difficulty: 'hard',   instrument: 'telescope',
    ra: 12.667, dec: -11.623, magnitude: 8.0,  constellation: 'Virgo',
    hopFromId: 'spica',
    fallbackName: 'Sombrero Galaxy' },
];

export const CATALOG_BY_ID = new Map(CATALOG.map((t) => [t.id, t]));

/* ============================================================
   === Coordinate math (RA/Dec → Az/Alt, rise/set, transit)   ===
   ============================================================ */

const DEG = Math.PI / 180;
const HOUR_TO_DEG = 15;
const SOLAR_TO_SIDEREAL = 1.0027379093;

function julianDate(d: Date): number {
  return d.getTime() / 86400000 + 2440587.5;
}

/** Greenwich Mean Sidereal Time, degrees. */
function gmst(d: Date): number {
  const jd = julianDate(d);
  const t = (jd - 2451545) / 36525;
  let g =
    280.46061837 +
    360.98564736629 * (jd - 2451545) +
    0.000387933 * t * t -
    (t * t * t) / 38710000;
  g = ((g % 360) + 360) % 360;
  return g;
}

/** Local Sidereal Time, degrees. */
function lstDeg(d: Date, lonDeg: number): number {
  return ((gmst(d) + lonDeg) % 360 + 360) % 360;
}

export interface AzAlt {
  azimuth: number;
  altitude: number;
}

export function raDecToAzAlt(
  raHours: number,
  decDeg: number,
  latDeg: number,
  lonDeg: number,
  date: Date,
): AzAlt {
  const lst = lstDeg(date, lonDeg);
  const haDeg = ((lst - raHours * HOUR_TO_DEG) % 360 + 540) % 360 - 180;
  const ha = haDeg * DEG;
  const dec = decDeg * DEG;
  const lat = latDeg * DEG;

  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const cosAlt = Math.cos(alt);
  const sinAz = -Math.cos(dec) * Math.sin(ha) / cosAlt;
  const cosAz = (Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) / (cosAlt * Math.cos(lat));
  let az = Math.atan2(sinAz, cosAz) / DEG;
  az = ((az % 360) + 360) % 360;

  return { azimuth: az, altitude: alt / DEG };
}

export interface RiseSet {
  /** Next rise after `now`, or null if circumpolar / never up. */
  rise: Date | null;
  /** Next set after `now`, or null if circumpolar / never up. */
  set: Date | null;
  /** Always-up (true) or never-up (false) at this latitude — undefined for normal targets. */
  circumpolar?: 'always' | 'never';
}

/**
 * Analytic rise/set for a fixed RA/Dec target. Treats refraction with a
 * standard −0.5667° horizon dip (matching astronomy-engine's 'normal' mode).
 * Uses a sidereal-day approximation (good to ~4 minutes per day, far below
 * what the finder UI shows).
 */
export function computeRiseSet(
  raHours: number,
  decDeg: number,
  latDeg: number,
  lonDeg: number,
  now: Date,
): RiseSet {
  const HORIZON_DIP_DEG = -0.5667;
  const dec = decDeg * DEG;
  const lat = latDeg * DEG;
  const h0 = HORIZON_DIP_DEG * DEG;

  const cosH = (Math.sin(h0) - Math.sin(lat) * Math.sin(dec)) / (Math.cos(lat) * Math.cos(dec));
  if (cosH < -1) return { rise: null, set: null, circumpolar: 'always' };
  if (cosH > 1)  return { rise: null, set: null, circumpolar: 'never' };

  const Hdeg = Math.acos(cosH) / DEG;          // hour-angle, degrees
  const Hh = Hdeg / HOUR_TO_DEG;               // hour-angle, hours

  const lst = lstDeg(now, lonDeg);
  // Current hour angle wrapped to (-12, +12] hours
  const haNowDeg = ((lst - raHours * HOUR_TO_DEG) % 360 + 540) % 360 - 180;
  const haNowH = haNowDeg / HOUR_TO_DEG;

  // Hours until each event (in sidereal hours, then converted to solar).
  // Rise occurs when HA = -Hh (target ascending through the horizon).
  // Set  occurs when HA = +Hh (descending).
  const wrap24 = (x: number) => ((x % 24) + 24) % 24;
  const dRiseSidereal = wrap24(-Hh - haNowH);
  const dSetSidereal  = wrap24( Hh - haNowH);

  const dRiseMs = (dRiseSidereal / SOLAR_TO_SIDEREAL) * 3600_000;
  const dSetMs  = (dSetSidereal  / SOLAR_TO_SIDEREAL) * 3600_000;

  return {
    rise: new Date(now.getTime() + dRiseMs),
    set:  new Date(now.getTime() + dSetMs),
  };
}
