import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { configPDA, marketPDA, vaultPDA, positionPDA } from "./pdas";
import type { StellarMarketsProgram } from "./client";
import { PROGRAM_ID } from "./client";
import type { MarketSide } from "./types";

const sideEnum = (side: MarketSide) => (side === "yes" ? { yes: {} } : { no: {} });

export async function initialize(
  program: StellarMarketsProgram,
  admin: PublicKey,
  feeRecipient: PublicKey,
  mint: PublicKey,
  maxFeeBps = 0,
): Promise<TransactionSignature> {
  const [config] = configPDA(PROGRAM_ID);
  return program.methods
    .initialize(feeRecipient, maxFeeBps)
    .accountsStrict({
      admin,
      config,
      tokenMint: mint,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}

export interface CreateMarketParams {
  question: string;
  resolutionTime: Date;
  feeAmount?: number;
}

export interface CreateMarketResult {
  txSignature: TransactionSignature;
  marketId: number;
  marketPda: PublicKey;
  vaultPda: PublicKey;
}

export async function createMarket(
  program: StellarMarketsProgram,
  authority: PublicKey,
  mint: PublicKey,
  authorityTokenAccount: PublicKey,
  feeRecipientTokenAccount: PublicKey,
  params: CreateMarketParams,
): Promise<CreateMarketResult> {
  const [config] = configPDA(PROGRAM_ID);
  const cfg = await program.account.config.fetch(config);
  const nextId = BigInt(cfg.marketCounter.toString()) + BigInt(1);
  const [market] = marketPDA(PROGRAM_ID, nextId);
  const [vault] = vaultPDA(PROGRAM_ID, nextId);

  const txSignature = await program.methods
    .createMarket(
      params.question,
      new BN(Math.floor(params.resolutionTime.getTime() / 1000)),
      new BN(params.feeAmount ?? 0),
    )
    .accountsStrict({
      creator: authority,
      config,
      market,
      marketVault: vault,
      tokenMint: mint,
      creatorTokenAccount: authorityTokenAccount,
      feeRecipientTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return {
    txSignature,
    marketId: Number(nextId),
    marketPda: market,
    vaultPda: vault,
  };
}

export async function placeBet(
  program: StellarMarketsProgram,
  user: PublicKey,
  mint: PublicKey,
  marketId: number,
  side: MarketSide,
  amount: number,
): Promise<TransactionSignature> {
  const [config] = configPDA(PROGRAM_ID);
  const [market] = marketPDA(PROGRAM_ID, marketId);
  const [vault] = vaultPDA(PROGRAM_ID, marketId);
  const [position] = positionPDA(PROGRAM_ID, marketId, user);
  const userAta = await getAssociatedTokenAddress(mint, user, false);

  return program.methods
    .placeBet(new BN(marketId), sideEnum(side), new BN(amount))
    .accountsStrict({
      bettor: user,
      config,
      market,
      marketVault: vault,
      userPosition: position,
      bettorTokenAccount: userAta,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}

export async function resolveMarket(
  program: StellarMarketsProgram,
  admin: PublicKey,
  marketId: number,
  outcome: MarketSide,
): Promise<TransactionSignature> {
  const [config] = configPDA(PROGRAM_ID);
  const [market] = marketPDA(PROGRAM_ID, marketId);
  return program.methods
    .resolveMarket(new BN(marketId), sideEnum(outcome))
    .accountsStrict({
      admin,
      config,
      market,
    })
    .rpc();
}

export async function cancelMarket(
  program: StellarMarketsProgram,
  admin: PublicKey,
  marketId: number,
): Promise<TransactionSignature> {
  const [config] = configPDA(PROGRAM_ID);
  const [market] = marketPDA(PROGRAM_ID, marketId);
  return program.methods
    .cancelMarket(new BN(marketId))
    .accountsStrict({
      admin,
      config,
      market,
    })
    .rpc();
}

export async function claimWinnings(
  program: StellarMarketsProgram,
  user: PublicKey,
  mint: PublicKey,
  marketId: number,
): Promise<TransactionSignature> {
  const [market] = marketPDA(PROGRAM_ID, marketId);
  const [vault] = vaultPDA(PROGRAM_ID, marketId);
  const [position] = positionPDA(PROGRAM_ID, marketId, user);
  const userAta = await getAssociatedTokenAddress(mint, user, false);

  return program.methods
    .claimWinnings(new BN(marketId))
    .accountsStrict({
      user,
      market,
      marketVault: vault,
      userPosition: position,
      userTokenAccount: userAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
}

export { anchor };
