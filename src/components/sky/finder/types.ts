import type { CatalogDifficulty, CatalogInstrument, CatalogType } from '@/lib/sky/catalog';

/**
 * Object identifier. Was a closed union over the 9 planet/sun/moon keys;
 * now widened to a string so the catalog can grow (stars, DSOs, comets, …).
 * Keep one canonical alias here so imports stay stable.
 */
export type ObjectId = string;

export interface SkyObject {
  id: ObjectId;
  name: string;
  altitude: number;
  azimuth: number;
  magnitude: number;
  visible: boolean;
  nakedEye: boolean;
  compassDirection: string;
  fistsAboveHorizon: number;
  riseTime: string | null;
  setTime: string | null;
  /** Moon-only — illumination phase 0..1, null otherwise. */
  phase: number | null;

  /** Catalog metadata. Required for every object the finder returns. */
  type: CatalogType;
  difficulty: CatalogDifficulty;
  instrument: CatalogInstrument;
  /** English short constellation name (e.g. 'Lyra'). May be empty for sun. */
  constellation: string;
  /** True when this body is always above the horizon at the observer's latitude. */
  circumpolar?: boolean;
  /** For star-hop hints — id of a brighter, easier neighbor. */
  hopFromId?: string;
}

export interface TwilightTimes {
  civilDusk: string | null;
  nauticalDusk: string | null;
  astronomicalDusk: string | null;
  astronomicalDawn: string | null;
  nauticalDawn: string | null;
  civilDawn: string | null;
}

export interface FinderResponse {
  observerLocation: { lat: number; lon: number; name: string | null };
  generatedAt: string;
  conditions: {
    cloudCoverPct: number;
    quality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    summary: string;
  };
  objects: SkyObject[];
  twilight?: TwilightTimes;
}
