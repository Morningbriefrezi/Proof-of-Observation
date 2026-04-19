import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { configPDA, marketPDA } from "./pdas";
import { PROGRAM_ID, type StellarMarketsProgram } from "./client";
import type {
  ConfigState,
  MarketOnChain,
  MarketOutcome,
  Position,
} from "./types";

function bnToNumber(value: BN | { toString(): string }): number {
  return Number(value.toString());
}

function decodeOutcome(state: { active?: object; resolved?: object; cancelled?: object }, outcome: { none?: object; yes?: object; no?: object }): MarketOutcome {
  if (state.cancelled) return "cancelled";
  if (!state.resolved) return "unresolved";
  if (outcome.yes) return "yes";
  if (outcome.no) return "no";
  return "unresolved";
}

interface RawMarket {
  id: BN;
  question: string;
  resolutionTime: BN;
  state: { active?: object; resolved?: object; cancelled?: object };
  winningOutcome: { none?: object; yes?: object; no?: object };
  yesPool: BN;
  noPool: BN;
  creator: PublicKey;
  configFeeRecipient: PublicKey;
}

interface RawConfig {
  admin: PublicKey;
  feeRecipient: PublicKey;
  tokenMint: PublicKey;
  tokenDecimals: number;
  maxFeeBps: number;
  marketCounter: BN;
  paused: boolean;
}

interface RawUserPosition {
  marketId: BN;
  user: PublicKey;
  yesBet: BN;
  noBet: BN;
  claimed: boolean;
}

function mapMarket(raw: RawMarket, mint: PublicKey): MarketOnChain {
  const yesPool = bnToNumber(raw.yesPool);
  const noPool = bnToNumber(raw.noPool);
  return {
    marketId: bnToNumber(raw.id),
    authority: raw.creator,
    question: raw.question,
    yesPool,
    noPool,
    totalStaked: yesPool + noPool,
    resolutionTime: new Date(bnToNumber(raw.resolutionTime) * 1000),
    resolved: !!raw.state.resolved,
    cancelled: !!raw.state.cancelled,
    outcome: decodeOutcome(raw.state, raw.winningOutcome),
    mint,
  };
}

export async function getConfig(
  program: StellarMarketsProgram,
): Promise<ConfigState | null> {
  const [pda] = configPDA(PROGRAM_ID);
  try {
    const cfg = (await program.account.config.fetch(pda)) as unknown as RawConfig;
    return {
      admin: cfg.admin,
      feeRecipient: cfg.feeRecipient,
      mint: cfg.tokenMint,
      tokenDecimals: cfg.tokenDecimals,
      maxFeeBps: cfg.maxFeeBps,
      nextMarketId: bnToNumber(cfg.marketCounter) + 1,
      paused: cfg.paused,
    };
  } catch {
    return null;
  }
}

export async function getMarket(
  program: StellarMarketsProgram,
  marketId: number,
): Promise<MarketOnChain | null> {
  const [pda] = marketPDA(PROGRAM_ID, marketId);
  try {
    const raw = (await program.account.market.fetch(pda)) as unknown as RawMarket;
    const cfg = await getConfig(program);
    if (!cfg) return null;
    return mapMarket(raw, cfg.mint);
  } catch {
    return null;
  }
}

export async function getAllMarkets(
  program: StellarMarketsProgram,
): Promise<MarketOnChain[]> {
  const cfg = await getConfig(program);
  if (!cfg) return [];
  const all = (await program.account.market.all()) as Array<{
    account: RawMarket;
  }>;
  return all
    .map((m) => mapMarket(m.account, cfg.mint))
    .sort((a, b) => a.marketId - b.marketId);
}

export interface UserPositionRaw {
  marketId: number;
  user: PublicKey;
  yesBet: number;
  noBet: number;
  claimed: boolean;
}

export async function getUserPositionsRaw(
  program: StellarMarketsProgram,
  user: PublicKey,
): Promise<UserPositionRaw[]> {
  // memcmp filter on the user pubkey field of UserPosition
  // Layout: 8 (discriminator) + 8 (market_id) + 32 (user) -> user starts at offset 16
  const all = (await program.account.userPosition.all([
    {
      memcmp: {
        offset: 16,
        bytes: user.toBase58(),
      },
    },
  ])) as Array<{ account: RawUserPosition }>;
  return all.map((p) => ({
    marketId: bnToNumber(p.account.marketId),
    user: p.account.user,
    yesBet: bnToNumber(p.account.yesBet),
    noBet: bnToNumber(p.account.noBet),
    claimed: p.account.claimed,
  }));
}

function projectedPayout(
  side: "yes" | "no",
  amount: number,
  market: MarketOnChain | null,
  claimed: boolean,
): number {
  if (claimed) return 0;
  if (!market) return 0;
  const sidePool = side === "yes" ? market.yesPool : market.noPool;
  const totalPool = market.yesPool + market.noPool;
  if (sidePool === 0 || totalPool === 0) return 0;

  if (market.cancelled) return amount;

  if (market.resolved) {
    if (market.outcome !== side) return 0;
    return Math.floor((amount / sidePool) * totalPool);
  }

  return Math.floor((amount / sidePool) * totalPool);
}

export async function getUserPositions(
  program: StellarMarketsProgram,
  user: PublicKey,
): Promise<Position[]> {
  const raws = await getUserPositionsRaw(program, user);
  if (raws.length === 0) return [];

  const marketIds = Array.from(new Set(raws.map((r) => r.marketId)));
  const markets = await Promise.all(
    marketIds.map((id) => getMarket(program, id)),
  );
  const marketById = new Map<number, MarketOnChain | null>(
    marketIds.map((id, idx) => [id, markets[idx]]),
  );

  const out: Position[] = [];
  for (const r of raws) {
    const m = marketById.get(r.marketId) ?? null;
    if (r.yesBet > 0) {
      out.push({
        user: r.user,
        marketId: r.marketId,
        side: "yes",
        amount: r.yesBet,
        claimed: r.claimed,
        projectedPayout: projectedPayout("yes", r.yesBet, m, r.claimed),
      });
    }
    if (r.noBet > 0) {
      out.push({
        user: r.user,
        marketId: r.marketId,
        side: "no",
        amount: r.noBet,
        claimed: r.claimed,
        projectedPayout: projectedPayout("no", r.noBet, m, r.claimed),
      });
    }
  }
  return out;
}
