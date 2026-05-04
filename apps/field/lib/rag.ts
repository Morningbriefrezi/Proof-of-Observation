import { qvac } from './qvac';
import corpusJson from '../rag/corpus/index.json';

export type RagSource =
  | 'messier'
  | 'constellation'
  | 'telescope-faq'
  | 'astroman'
  | 'observation-tips';

export type RagSeason = 'winter' | 'spring' | 'summer' | 'autumn' | 'all';
export type RagHemisphere = 'north' | 'south' | 'both';
export type RagInstrument = 'naked' | 'binocular' | '4inch' | '6inch' | '8inch' | '10inch';

export type RagChunk = {
  id: string;
  source: RagSource;
  title: string;
  text: string;
  embedding?: number[];
  magnitude?: number;
  season?: RagSeason;
  hemisphere?: RagHemisphere;
  instrument?: RagInstrument;
  keywords?: string[];
};

export type Citation = {
  id: string;
  source: RagSource;
  title: string;
};

export type RetrieveResult = {
  context: string;
  citations: Citation[];
};

const CHUNKS = corpusJson as RagChunk[];

const STOP = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'are', 'was', 'has', 'have', 'how', 'what',
  'when', 'where', 'why', 'which', 'who', 'should', 'could', 'would', 'will', 'there',
  'their', 'they', 'them', 'about', 'from', 'into', 'over', 'under', 'some', 'any', 'can',
  'tonight', 'today', 'tomorrow', 'now',
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function currentSeason(): RagSeason {
  const m = new Date().getMonth() + 1;
  if (m === 12 || m <= 2) return 'winter';
  if (m <= 5) return 'spring';
  if (m <= 8) return 'summer';
  return 'autumn';
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function keywordScore(chunk: RagChunk, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;
  const titleLower = chunk.title.toLowerCase();
  const textLower = chunk.text.toLowerCase();
  const tagSet = new Set((chunk.keywords ?? []).map((k) => k.toLowerCase()));

  let score = 0;
  for (const token of queryTokens) {
    if (titleLower.includes(token)) score += 3;
    if (tagSet.has(token)) score += 2;
    for (const tag of tagSet) {
      if (tag.includes(token) && tag !== token) {
        score += 1;
        break;
      }
    }
    if (textLower.includes(token)) score += 1;
  }
  return score / (queryTokens.length * 3);
}

function seasonBonus(chunk: RagChunk, season: RagSeason): number {
  if (!chunk.season) return 0;
  if (chunk.season === 'all') return 0.05;
  return chunk.season === season ? 0.15 : 0;
}

export async function retrieveContext(query: string, k = 3): Promise<RetrieveResult> {
  if (CHUNKS.length === 0 || query.trim().length === 0) {
    return { context: '', citations: [] };
  }

  const tokens = tokenize(query);
  const season = currentSeason();

  let cosineByChunk: Map<string, number> | null = null;
  if (qvac.hasEmbedder()) {
    const queryVec = await qvac.embed(query);
    if (queryVec) {
      cosineByChunk = new Map();
      for (const c of CHUNKS) {
        if (c.embedding && c.embedding.length === queryVec.length) {
          cosineByChunk.set(c.id, cosine(c.embedding, queryVec));
        }
      }
    }
  }

  const scored = CHUNKS.map((chunk) => {
    const kw = keywordScore(chunk, tokens);
    const cos = cosineByChunk?.get(chunk.id) ?? 0;
    const base = cosineByChunk ? cos * 0.7 + kw * 0.3 : kw;
    const score = base + seasonBonus(chunk, season);
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, k).filter((s) => s.score > 0.05);

  if (top.length === 0) {
    return { context: '', citations: [] };
  }

  const context = top
    .map((s) => `[${s.chunk.title}] ${s.chunk.text}`)
    .join('\n\n');

  const citations: Citation[] = top.map((s) => ({
    id: s.chunk.id,
    source: s.chunk.source,
    title: s.chunk.title,
  }));

  return { context, citations };
}
