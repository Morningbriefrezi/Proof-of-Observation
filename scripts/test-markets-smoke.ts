import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMint,
} from "@solana/spl-token";
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function explorer(sig: string) {
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

async function mintStars(
  conn: Connection,
  authority: Keypair,
  dest: PublicKey,
  amount: bigint,
): Promise<string> {
  const tx = new Transaction().add(
    createMintToInstruction(STARS_MINT, dest, authority.publicKey, amount),
  );
  const sig = await conn.sendTransaction(tx, [authority]);
  await conn.confirmTransaction(sig, "confirmed");
  return sig;
}

async function fundSol(
  conn: Connection,
  from: Keypair,
  to: PublicKey,
  sol: number,
): Promise<string> {
  const tx = new Transaction().add(
    anchor.web3.SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: Math.round(sol * LAMPORTS_PER_SOL),
    }),
  );
  const sig = await conn.sendTransaction(tx, [from]);
  await conn.confirmTransaction(sig, "confirmed");
  return sig;
}

function marketPdas(programId: PublicKey, marketId: bigint) {
  const idBuf = Buffer.alloc(8);
  idBuf.writeBigUInt64LE(marketId);
  const [marketPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("market"), idBuf],
    programId,
  );
  const [vaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), idBuf],
    programId,
  );
  return { marketPda, vaultPda };
}

function positionPda(
  programId: PublicKey,
  marketId: bigint,
  user: PublicKey,
) {
  const idBuf = Buffer.alloc(8);
  idBuf.writeBigUInt64LE(marketId);
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("position"), idBuf, user.toBuffer()],
    programId,
  );
  return pda;
}

function configPda(programId: PublicKey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    programId,
  );
  return pda;
}

async function tokenBalance(conn: Connection, ata: PublicKey): Promise<bigint> {
  try {
    const acc = await getAccount(conn, ata);
    return acc.amount;
  } catch {
    return BigInt(0);
  }
}

async function main() {
  console.log("=== STELLAR MARKETS SMOKE TEST ===");
  console.log("RPC:", RPC);
  console.log("Program ID:", PROGRAM_ID.toBase58());
  console.log("Stars Mint:", STARS_MINT.toBase58());

  const conn = new Connection(RPC, "confirmed");
  const feePayer = Keypair.fromSecretKey(FEE_PAYER_SK);
  const alice = Keypair.generate();
  const bob = Keypair.generate();

  console.log("Fee Payer / Admin:", feePayer.publicKey.toBase58());
  console.log("Alice:", alice.publicKey.toBase58());
  console.log("Bob:", bob.publicKey.toBase58());

  const idl = JSON.parse(fs.readFileSync(IDL_PATH, "utf8"));
  const wallet = new Wallet(feePayer);
  const provider = new AnchorProvider(conn, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  const program = new Program(idl as anchor.Idl, provider);

  const mintInfo = await getMint(conn, STARS_MINT);
  console.log("Stars decimals:", mintInfo.decimals);
  const ONE = BigInt(10) ** BigInt(mintInfo.decimals);
  const seedAmount = BigInt(1000) * ONE;
  const betAmount = BigInt(100) * ONE;

  console.log("\n--- Fund test wallets ---");
  await fundSol(conn, feePayer, alice.publicKey, 0.05);
  await fundSol(conn, feePayer, bob.publicKey, 0.05);
  console.log("Funded alice, bob with 0.05 SOL each (for rent)");

  console.log("\n--- Ensure ATAs + mint Stars ---");
  const feePayerAta = await ensureAta(
    conn,
    feePayer,
    feePayer.publicKey,
    STARS_MINT,
  );
  const aliceAta = await ensureAta(conn, feePayer, alice.publicKey, STARS_MINT);
  const bobAta = await ensureAta(conn, feePayer, bob.publicKey, STARS_MINT);

  await mintStars(conn, feePayer, aliceAta, seedAmount);
  await mintStars(conn, feePayer, bobAta, seedAmount);
  console.log("Alice balance:", await tokenBalance(conn, aliceAta));
  console.log("Bob   balance:", await tokenBalance(conn, bobAta));

  console.log("\n--- Initialize config (idempotent) ---");
  const cfgPda = configPda(PROGRAM_ID);
  const cfgInfo = await conn.getAccountInfo(cfgPda);
  if (!cfgInfo) {
    const sig = await (program.methods as any)
      .initialize(feePayer.publicKey, 0)
      .accounts({
        admin: feePayer.publicKey,
        config: cfgPda,
        tokenMint: STARS_MINT,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Initialized:", explorer(sig));
  } else {
    console.log("Config already exists — skipping init");
  }

  const cfg: any = await (program.account as any).config.fetch(cfgPda);
  console.log("Config token_mint:", new PublicKey(cfg.tokenMint).toBase58());
  console.log("Config market_counter:", cfg.marketCounter.toString());

  console.log("\n--- Create market ---");
  const nextMarketId = BigInt(cfg.marketCounter.toString()) + BigInt(1);
  const resolutionTime = Math.floor(Date.now() / 1000) + 60;
  const { marketPda, vaultPda } = marketPdas(PROGRAM_ID, nextMarketId);

  const createSig = await (program.methods as any)
    .createMarket(
      "TEST: Will this market resolve YES?",
      new BN(resolutionTime),
      new BN(0),
    )
    .accounts({
      creator: feePayer.publicKey,
      config: cfgPda,
      market: marketPda,
      marketVault: vaultPda,
      tokenMint: STARS_MINT,
      creatorTokenAccount: feePayerAta,
      feeRecipientTokenAccount: feePayerAta,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
  console.log("Market created — ID:", nextMarketId.toString());
  console.log("Market PDA:", marketPda.toBase58());
  console.log("Vault PDA: ", vaultPda.toBase58());
  console.log("Tx:", explorer(createSig));

  console.log("\n--- Place positions ---");
  const alicePos = positionPda(PROGRAM_ID, nextMarketId, alice.publicKey);
  const bobPos = positionPda(PROGRAM_ID, nextMarketId, bob.publicKey);

  const aliceBetSig = await (program.methods as any)
    .placeBet(new BN(nextMarketId.toString()), { yes: {} }, new BN(betAmount.toString()))
    .accounts({
      bettor: alice.publicKey,
      config: cfgPda,
      market: marketPda,
      marketVault: vaultPda,
      userPosition: alicePos,
      bettorTokenAccount: aliceAta,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([alice])
    .rpc();
  console.log("Alice bet 100 YES:", explorer(aliceBetSig));

  const bobBetSig = await (program.methods as any)
    .placeBet(new BN(nextMarketId.toString()), { no: {} }, new BN(betAmount.toString()))
    .accounts({
      bettor: bob.publicKey,
      config: cfgPda,
      market: marketPda,
      marketVault: vaultPda,
      userPosition: bobPos,
      bettorTokenAccount: bobAta,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([bob])
    .rpc();
  console.log("Bob bet 100 NO:  ", explorer(bobBetSig));

  console.log("\n--- Wait for resolution_time (~65s) ---");
  const waitMs = Math.max(resolutionTime * 1000 + 5000 - Date.now(), 1000);
  console.log(`Sleeping ${Math.round(waitMs / 1000)}s...`);
  await sleep(waitMs);

  console.log("\n--- Resolve market (YES) ---");
  const resolveSig = await (program.methods as any)
    .resolveMarket(new BN(nextMarketId.toString()), { yes: {} })
    .accounts({
      admin: feePayer.publicKey,
      config: cfgPda,
      market: marketPda,
    })
    .rpc();
  console.log("Resolved YES:", explorer(resolveSig));

  console.log("\n--- Claim ---");
  const aliceClaimSig = await (program.methods as any)
    .claimWinnings(new BN(nextMarketId.toString()))
    .accounts({
      user: alice.publicKey,
      market: marketPda,
      marketVault: vaultPda,
      userPosition: alicePos,
      userTokenAccount: aliceAta,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    })
    .signers([alice])
    .rpc();
  console.log("Alice claimed:", explorer(aliceClaimSig));

  const bobClaimSig = await (program.methods as any)
    .claimWinnings(new BN(nextMarketId.toString()))
    .accounts({
      user: bob.publicKey,
      market: marketPda,
      marketVault: vaultPda,
      userPosition: bobPos,
      userTokenAccount: bobAta,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    })
    .signers([bob])
    .rpc();
  console.log("Bob claimed (expect 0 payout):", explorer(bobClaimSig));

  const aliceFinal = await tokenBalance(conn, aliceAta);
  const bobFinal = await tokenBalance(conn, bobAta);

  console.log("\n=== SUMMARY ===");
  console.log("Program ID:    ", PROGRAM_ID.toBase58());
  console.log("Stars Mint:    ", STARS_MINT.toBase58());
  console.log("Market ID:     ", nextMarketId.toString());
  console.log("Market PDA:    ", marketPda.toBase58());
  console.log("Vault PDA:     ", vaultPda.toBase58());
  console.log("Alice final:   ", aliceFinal, "(expected ~1100)");
  console.log("Bob final:     ", bobFinal, "(expected 900)");
  console.log("Create tx:     ", explorer(createSig));
  console.log("Alice bet tx:  ", explorer(aliceBetSig));
  console.log("Bob bet tx:    ", explorer(bobBetSig));
  console.log("Resolve tx:    ", explorer(resolveSig));
  console.log("Alice claim tx:", explorer(aliceClaimSig));
  console.log("Bob claim tx:  ", explorer(bobClaimSig));

  const expectedAlice = seedAmount - betAmount + BigInt(2) * betAmount;
  const expectedBob = seedAmount - betAmount;
  const ok = aliceFinal === expectedAlice && bobFinal === expectedBob;
  console.log("\nRESULT:", ok ? "✅ PASS" : "❌ FAIL");
  if (!ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
