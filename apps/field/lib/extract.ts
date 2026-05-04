export type Extracted = {
  target: string | null;
  magnification: number | null;
  seeing: number | null;
  transparency: number | null;
};

const PLANETS = [
  'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune',
  'moon', 'sun', 'pluto',
];

const NAMED_DEEP_SKY: Array<{ pattern: RegExp; canonical: string }> = [
  { pattern: /\b(andromeda\s+galaxy|m\s*31)\b/i, canonical: 'M31 Andromeda' },
  { pattern: /\borion\s+nebula\b/i, canonical: 'M42 Orion Nebula' },
  { pattern: /\bpleiades\b|\bseven\s+sisters\b/i, canonical: 'M45 Pleiades' },
  { pattern: /\bring\s+nebula\b/i, canonical: 'M57 Ring Nebula' },
  { pattern: /\bdumbbell\s+nebula\b/i, canonical: 'M27 Dumbbell' },
  { pattern: /\bcrab\s+nebula\b/i, canonical: 'M1 Crab Nebula' },
  { pattern: /\bwhirlpool\s+galaxy\b/i, canonical: 'M51 Whirlpool' },
  { pattern: /\bsombrero\s+galaxy\b/i, canonical: 'M104 Sombrero' },
  { pattern: /\bpinwheel\s+galaxy\b/i, canonical: 'M101 Pinwheel' },
  { pattern: /\bbeehive\b|\bpraesepe\b/i, canonical: 'M44 Beehive' },
  { pattern: /\blagoon\s+nebula\b/i, canonical: 'M8 Lagoon' },
  { pattern: /\beagle\s+nebula\b/i, canonical: 'M16 Eagle' },
  { pattern: /\btrifid\s+nebula\b/i, canonical: 'M20 Trifid' },
  { pattern: /\bdouble\s+double\b/i, canonical: 'Epsilon Lyrae (Double Double)' },
  { pattern: /\balbireo\b/i, canonical: 'Albireo' },
  { pattern: /\bmizar\b/i, canonical: 'Mizar' },
  { pattern: /\bpolaris\b/i, canonical: 'Polaris' },
  { pattern: /\bvega\b/i, canonical: 'Vega' },
  { pattern: /\bbetelgeuse\b/i, canonical: 'Betelgeuse' },
  { pattern: /\brigel\b/i, canonical: 'Rigel' },
  { pattern: /\bantares\b/i, canonical: 'Antares' },
  { pattern: /\bregulus\b/i, canonical: 'Regulus' },
  { pattern: /\bcapella\b/i, canonical: 'Capella' },
  { pattern: /\barcturus\b/i, canonical: 'Arcturus' },
];

function extractCatalog(text: string): string | null {
  const messier = text.match(/\bM\s*([1-9]\d{0,2})\b/i);
  if (messier) {
    const n = parseInt(messier[1], 10);
    if (n >= 1 && n <= 110) return `M${n}`;
  }
  const ngc = text.match(/\bNGC\s*(\d{1,4})\b/i);
  if (ngc) return `NGC ${parseInt(ngc[1], 10)}`;
  const ic = text.match(/\bIC\s*(\d{1,4})\b/i);
  if (ic) return `IC ${parseInt(ic[1], 10)}`;
  const caldwell = text.match(/\b(?:caldwell|C)\s*(\d{1,3})\b/i);
  if (caldwell) {
    const n = parseInt(caldwell[1], 10);
    if (n >= 1 && n <= 109) return `C${n}`;
  }
  return null;
}

function extractPlanet(text: string): string | null {
  const lower = text.toLowerCase();
  for (const p of PLANETS) {
    const re = new RegExp(`\\b${p}\\b`);
    if (re.test(lower)) return p[0].toUpperCase() + p.slice(1);
  }
  return null;
}

function extractNamed(text: string): string | null {
  for (const entry of NAMED_DEEP_SKY) {
    if (entry.pattern.test(text)) return entry.canonical;
  }
  return null;
}

function extractMagnification(text: string): number | null {
  const m = text.match(/\b(\d{2,4})\s*x\b/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 20 && n <= 1000) return n;
  }
  return null;
}

function extractSeeing(text: string): number | null {
  const m = text.match(/\bseeing[^0-9]{0,8}(\d{1,2})\s*(?:\/|of|out\s+of)\s*10\b/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 0 && n <= 10) return n;
  }
  return null;
}

function extractTransparency(text: string): number | null {
  const m5 = text.match(/\btransparency[^0-9]{0,8}(\d)\s*(?:\/|of|out\s+of)\s*5\b/i);
  if (m5) {
    const n = parseInt(m5[1], 10);
    if (n >= 1 && n <= 5) return n;
  }
  const m10 = text.match(/\btransparency[^0-9]{0,8}(\d{1,2})\s*(?:\/|of|out\s+of)\s*10\b/i);
  if (m10) {
    const n = parseInt(m10[1], 10);
    if (n >= 0 && n <= 10) return Math.round((n / 10) * 5);
  }
  return null;
}

export function extractFromTranscript(text: string): Extracted {
  const target = extractCatalog(text) ?? extractNamed(text) ?? extractPlanet(text);
  return {
    target,
    magnification: extractMagnification(text),
    seeing: extractSeeing(text),
    transparency: extractTransparency(text),
  };
}
