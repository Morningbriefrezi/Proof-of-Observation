import { AnchorProvider, BN, Program, Wallet, setProvider } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import bs58 from "bs58";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import type { Idl } from "@coral-xyz/anchor";
import {
  configPDA,
  createMarket,
  marketPDA,
  placeBet,
  PROGRAM_ID,
  vaultPDA,
  type StellarMarketsProgram,
} from "../src/lib/markets";

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const RPC = process.env.SOLANA_RPC_URL!;
const STARS_MINT = new PublicKey(process.env.STARS_TOKEN_MINT!);
const FEE_PAYER_SK = bs58.decode(process.env.FEE_PAYER_PRIVATE_KEY!);

const IDL_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "stellar-markets-program",
  "target",
  "idl",
  "stellar_markets.json",
);

function explorer(sig: string): string {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
}

async function ensureAta(
  conn: Connection,
  payer: Keypair,
  owner: PublicKey,
  mint: PublicKey,
): Promise<PublicKey> {
  const ata = await getAssociatedTokenAddress(mint, owner, false);
  const info = await conn.getAccountInfo(ata);
  if (info) return ata;
  const tx = new Transaction().add(
    createAssociatedTokenAccountInstruction(payer.publicKey, ata, owner, mint),
  );
  const sig = await conn.sendTransaction(tx, [payer]);
  await conn.confirmTransaction(sig, "confirmed");
  return ata;
}

async function ensureStarsBalance(
  conn: Connection,
  authority: Keypair,
  ata: PublicKey,
  minAmount: bigint,
): Promise<void> {
  const acct = await getAccount(conn, ata).catch(() => null);
  const have = acct ? acct.amount : BigInt(0);
  if (have >= minAmount) return;
  const need = minAmount - have;
  const tx = new Transaction().add(
    createMintToInstruction(STARS_MINT, ata, authority.publicKey, need),
  );
  const sig = await conn.sendTransaction(tx, [authority]);
  await conn.confirmTransaction(sig, "confirmed");
  console.log(`Minted ${need} Stars to fee payer (sig: ${sig})`);
}

async function main() {
  if (!RPC) throw new Error("SOLANA_RPC_URL missing");

  console.log("=== CREATE UI TEST MARKET ===");
  console.log("RPC:       ", RPC);
  console.log("Program ID:", PROGRAM_ID.toBase58());
  console.log("Stars Mint:", STARS_MINT.toBase58());

  const conn = new Connection(RPC, "confirmed");
  const feePayer = Keypair.fromSecretKey(FEE_PAYER_SK);
  console.log("Fee Payer: ", feePayer.publicKey.toBase58());

  const solBal = await conn.getBalance(feePayer.publicKey);
  console.log("Fee Payer SOL:", (solBal / 1e9).toFixed(4));

  const idl = JSON.parse(fs.readFileSync(IDL_PATH, "utf8")) as Idl;
  const wallet = new Wallet(feePayer);
  const provider = new AnchorProvider(conn, wallet, { commitment: "confirmed" });
  setProvider(provider);
  const program = new Program(idl, provider) as unknown as StellarMarketsProgram;

  const mintInfo = await getMint(conn, STARS_MINT);
  console.log("Stars decimals:", mintInfo.decimals);

  const feePayerAta = await ensureAta(
    conn,
    feePayer,
    feePayer.publicKey,
    STARS_MINT,
  );
  await ensureStarsBalance(conn, feePayer, feePayerAta, BigInt(1_000));

  // Read config for nextMarketId
  const [cfgPda] = configPDA(PROGRAM_ID);
  const cfgInfo = await conn.getAccountInfo(cfgPda);
  if (!cfgInfo) {
    throw new Error("Config not initialized — run initial setup first");
  }

  // Resolution 2 hours from now — no close gate in contract, but metadata is ignored
  const resolutionTime = new Date(Date.now() + 2 * 60 * 60 * 1000);

  console.log("\n--- createMarket ---");
  const created = await createMarket(
    program,
    feePayer.publicKey,
    STARS_MINT,
    feePayerAta,
    feePayerAta,
    {
      question: "UI TEST: Stellar bet-placement smoke test market",
      resolutionTime,
      feeAmount: 0,
    },
  );
  console.log("Market ID:  ", created.marketId);
  console.log("Market PDA: ", created.marketPda.toBase58());
  console.log("Vault PDA:  ", created.vaultPda.toBase58());
  console.log("Tx:         ", explorer(created.txSignature));

  console.log("\n--- seed 1 Stars YES ---");
  const seedYesSig = await placeBet(
    program,
    feePayer.publicKey,
    STARS_MINT,
    created.marketId,
    "yes",
    1,
  );
  console.log("YES seed:   ", explorer(seedYesSig));

  console.log("\n--- seed 1 Stars NO ---");
  const seedNoSig = await placeBet(
    program,
    feePayer.publicKey,
    STARS_MINT,
    created.marketId,
    "no",
    1,
  );
  console.log("NO seed:    ", explorer(seedNoSig));

  console.log("\n=== DONE ===");
  console.log("Market ID     :", created.marketId);
  console.log("Resolution UTC:", resolutionTime.toISOString());
  console.log("Open the UI at: /markets/" + created.marketId);

  const solBalAfter = await conn.getBalance(feePayer.publicKey);
  console.log(
    "\nFee Payer SOL after:",
    (solBalAfter / 1e9).toFixed(4),
    `(Δ ${((solBalAfter - solBal) / 1e9).toFixed(5)})`,
  );

  // Sanity PDA checks
  const [marketChk] = marketPDA(PROGRAM_ID, created.marketId);
  const [vaultChk] = vaultPDA(PROGRAM_ID, created.marketId);
  console.log("Market PDA matches:", marketChk.equals(created.marketPda));
  console.log("Vault  PDA matches:", vaultChk.equals(created.vaultPda));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
