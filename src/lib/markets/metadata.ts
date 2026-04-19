import seedJson from "../../data/seed_markets.json";
import bindingsJson from "../../data/market-id-bindings.json";
import type {
  Market,
  MarketMetadata,
  MarketOnChain,
  MarketStatus,
  SeedMarketsFile,
} from "./types";
import { getAllMarkets } from "./queries";
import type { StellarMarketsProgram } from "./client";

function readBindings(): Record<string, number> {
  return bindingsJson as Record<string, number>;
}

function parseSeed(): MarketMetadata[] {
  const file = seedJson as unknown as SeedMarketsFile;
  const bindings = readBindings();
  return file.markets.map((m) => ({
    id: m.id,
    marketId: bindings[m.id] ?? null,
    title: m.title,
    category: m.category,
    closeTime: new Date(m.close_time),
    resolutionTime: new Date(m.resolution_time),
    resolutionSource: m.resolution_source,
    yesCondition: m.YES_condition,
    whyInteresting: m.why_interesting,
    uiDescription: m.ui_description,
  }));
}

export function loadSeedMarkets(): MarketMetadata[] {
  return parseSeed();
}

export function findMetadataBySlug(slug: string): MarketMetadata | null {
  return parseSeed().find((m) => m.id === slug) ?? null;
}

export function findMetadataByMarketId(marketId: number): MarketMetadata | null {
  return parseSeed().find((m) => m.marketId === marketId) ?? null;
}

export function getAllBindings(): Record<string, number> {
  return readBindings();
}

function deriveStatus(meta: MarketMetadata, on: MarketOnChain, now: Date): MarketStatus {
  if (on.cancelled) return "cancelled";
  if (on.resolved) return "resolved";
  if (now >= meta.closeTime) return "locked";
  return "open";
}

export async function getFullMarkets(
  program: StellarMarketsProgram,
): Promise<Market[]> {
  const seed = parseSeed();
  const onChain = await getAllMarkets(program);
  const onChainById = new Map<number, MarketOnChain>(
    onChain.map((m) => [m.marketId, m]),
  );
  const now = new Date();
  const out: Market[] = [];
  for (const meta of seed) {
    if (meta.marketId === null) continue;
    const on = onChainById.get(meta.marketId);
    if (!on) continue;
    const total = on.yesPool + on.noPool;
    const impliedYesOdds = total === 0 ? 0.5 : on.yesPool / total;
    out.push({
      metadata: meta,
      onChain: on,
      impliedYesOdds,
      impliedNoOdds: 1 - impliedYesOdds,
      timeToClose: meta.closeTime.getTime() - now.getTime(),
      timeToResolve: meta.resolutionTime.getTime() - now.getTime(),
      status: deriveStatus(meta, on, now),
    });
  }
  return out;
}
