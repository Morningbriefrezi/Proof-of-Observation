import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const RPC = process.env.SOLANA_RPC_URL!;
const STARS_MINT = new PublicKey(process.env.STARS_TOKEN_MINT!);
const PROGRAM_ID = new PublicKey(process.env.PREDICTION_MARKET_PROGRAM_ID!);
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

function explorer(sig: string) {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
}

async function main() {
  console.log("=== STELLAR MARKETS — VERIFY CONFIG ===");
  console.log("RPC:", RPC);
  console.log("Program ID:", PROGRAM_ID.toBase58());
  console.log("Stars Mint:", STARS_MINT.toBase58());

  const conn = new Connection(RPC, "confirmed");
  const feePayer = Keypair.fromSecretKey(FEE_PAYER_SK);
  const wallet = new Wallet(feePayer);
  const provider = new AnchorProvider(conn, wallet, { commitment: "confirmed" });
  anchor.setProvider(provider);

  const idl = JSON.parse(fs.readFileSync(IDL_PATH, "utf8"));
  const program = new Program(idl as anchor.Idl, provider);

  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID,
  );
  console.log("Config PDA:", configPda.toBase58());

  const info = await conn.getAccountInfo(configPda);

  if (!info) {
    console.log("\nConfig does not exist — calling initialize()");
    const sig = await (program.methods as any)
      .initialize(feePayer.publicKey, 0)
      .accounts({
        admin: feePayer.publicKey,
        config: configPda,
        tokenMint: STARS_MINT,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Initialized:", explorer(sig));
  } else {
    console.log("Config already exists.");
  }

  const cfg: any = await (program.account as any).config.fetch(configPda);
  console.log("\n--- CONFIG STATE ---");
  console.log("admin:           ", new PublicKey(cfg.admin).toBase58());
  console.log("fee_recipient:   ", new PublicKey(cfg.feeRecipient).toBase58());
  console.log("token_mint:      ", new PublicKey(cfg.tokenMint).toBase58());
  console.log("token_decimals:  ", cfg.tokenDecimals);
  console.log("max_fee_bps:     ", cfg.maxFeeBps);
  console.log("market_counter:  ", cfg.marketCounter.toString());
  console.log("paused:          ", cfg.paused);
  console.log("bump:            ", cfg.bump);

  const expectedMint = STARS_MINT.toBase58();
  const actualMint = new PublicKey(cfg.tokenMint).toBase58();
  if (expectedMint !== actualMint) {
    console.error(
      `\n❌ Config mint MISMATCH. Expected ${expectedMint}, got ${actualMint}`,
    );
    process.exit(1);
  }
  console.log("\n✅ Config OK — mint matches Stars and next_market_id =",
    cfg.marketCounter.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
