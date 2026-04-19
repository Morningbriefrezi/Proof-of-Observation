import {
  AnchorProvider,
  Idl,
  Program,
  Wallet,
  setProvider,
} from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import idlJson from "./idl.json";
import type { StellarMarkets } from "./stellar_markets";

export const PROGRAM_ID = new PublicKey(
  (idlJson as { address: string }).address,
);

export type StellarMarketsProgram = Program<StellarMarkets>;

export interface AnchorWalletLike {
  publicKey: PublicKey;
  signTransaction<T extends Transaction>(tx: T): Promise<T>;
  signAllTransactions<T extends Transaction>(txs: T[]): Promise<T[]>;
}

export function getProgram(
  wallet: AnchorWalletLike,
  connection: Connection,
): StellarMarketsProgram {
  const provider = new AnchorProvider(connection, wallet as unknown as Wallet, {
    commitment: "confirmed",
  });
  setProvider(provider);
  return new Program(idlJson as unknown as Idl, provider) as unknown as StellarMarketsProgram;
}

class ReadOnlyWallet implements AnchorWalletLike {
  readonly publicKey: PublicKey;
  constructor(public readonly keypair: Keypair) {
    this.publicKey = keypair.publicKey;
  }
  async signTransaction<T extends Transaction>(_tx: T): Promise<T> {
    throw new Error("ReadOnlyWallet cannot sign transactions");
  }
  async signAllTransactions<T extends Transaction>(_txs: T[]): Promise<T[]> {
    throw new Error("ReadOnlyWallet cannot sign transactions");
  }
}

export function getReadOnlyProgram(connection: Connection): StellarMarketsProgram {
  const wallet = new ReadOnlyWallet(Keypair.generate());
  const provider = new AnchorProvider(connection, wallet as unknown as Wallet, {
    commitment: "confirmed",
  });
  return new Program(idlJson as unknown as Idl, provider) as unknown as StellarMarketsProgram;
}
