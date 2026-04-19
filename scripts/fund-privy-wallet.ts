import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  getAccount,
  mintTo,
} from "@solana/spl-token";
import bs58 from "bs58";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const RPC = "https://api.devnet.solana.com";
const DEFAULT_TARGET = "2konLYHiUGqfFymhx81TKFnqW1UdccvK11Y5tY9uY1FJ";
const MIN_SOL = 0.1;
const TOP_UP_SOL = 0.2;
const STARS_TO_MINT = BigInt(2000);

function sig(s: string) {
  return `https://explorer.solana.com/tx/${s}?cluster=devnet`;
}

function acct(pk: PublicKey) {
  return `https://explorer.solana.com/address/${pk.toBase58()}?cluster=devnet`;
}

async function main() {
  const feePayerSk = process.env.FEE_PAYER_PRIVATE_KEY;
  const mintStr = process.env.STARS_TOKEN_MINT;
  if (!feePayerSk) throw new Error("FEE_PAYER_PRIVATE_KEY missing from .env.local");
  if (!mintStr) throw new Error("STARS_TOKEN_MINT missing from .env.local");

  const targetArg = process.argv[2] ?? DEFAULT_TARGET;
  const target = new PublicKey(targetArg);
  const feePayer = Keypair.fromSecretKey(bs58.decode(feePayerSk));
  const mint = new PublicKey(mintStr);

  console.log("=== FUND PRIVY WALLET ===");
  console.log("RPC:       ", RPC);
  console.log("Fee Payer: ", feePayer.publicKey.toBase58());
  console.log("Target:    ", target.toBase58(), `→ ${acct(target)}`);
  console.log("Stars Mint:", mint.toBase58());
  console.log();

  const conn = new Connection(RPC, "confirmed");

  // (a) Check SOL balance
  const startLamports = await conn.getBalance(target);
  const startSol = startLamports / LAMPORTS_PER_SOL;
  console.log(`Starting SOL: ${startSol.toFixed(4)} (${startLamports} lamports)`);

  // (b) Transfer SOL if below threshold
  if (startSol < MIN_SOL) {
    const lamports = Math.round(TOP_UP_SOL * LAMPORTS_PER_SOL);
    const feePayerBal = await conn.getBalance(feePayer.publicKey);
    if (feePayerBal < lamports + 5_000) {
      throw new Error(
        `Fee payer has ${(feePayerBal / LAMPORTS_PER_SOL).toFixed(4)} SOL, need > ${TOP_UP_SOL} SOL + fees`,
      );
    }
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: feePayer.publicKey,
        toPubkey: target,
        lamports,
      }),
    );
    const transferSig = await conn.sendTransaction(tx, [feePayer]);
    await conn.confirmTransaction(transferSig, "confirmed");
    console.log(`Transferred ${TOP_UP_SOL} SOL → ${sig(transferSig)}`);
  } else {
    console.log(`SOL balance already ≥ ${MIN_SOL} — skipping transfer`);
  }

  // (c) Get or create ATA — Privy embedded wallets are off-curve PDAs, so allowOwnerOffCurve must be true
  const ataAccount = await getOrCreateAssociatedTokenAccount(
    conn,
    feePayer, // payer for rent if ATA doesn't exist
    mint,
    target,
    true, // allowOwnerOffCurve
  );
  const ata = ataAccount.address;
  console.log(`ATA:        ${ata.toBase58()} → ${acct(ata)}`);

  // (d) Mint 2000 Stars
  const mintSig = await mintTo(
    conn,
    feePayer,        // payer
    mint,
    ata,
    feePayer,        // mint authority
    STARS_TO_MINT,
  );
  console.log(`Minted ${STARS_TO_MINT} Stars → ${sig(mintSig)}`);

  // (e) Verify final balances
  const finalLamports = await conn.getBalance(target);
  const finalSol = finalLamports / LAMPORTS_PER_SOL;
  const finalAta = await getAccount(conn, ata);

  console.log();
  console.log("=== FINAL ===");
  console.log(`Final SOL:   ${finalSol.toFixed(4)} (${finalLamports} lamports)`);
  console.log(`Final Stars: ${finalAta.amount.toString()} (raw, 0 decimals)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
