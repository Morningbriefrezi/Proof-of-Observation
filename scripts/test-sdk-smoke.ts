import {
  AnchorProvider,
  Wallet,
  setProvider,
} from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
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
import * as path from "path";
import { SystemProgram } from "@solana/web3.js";
import {
  getProgram,
  getConfig,
  getMarket,
  getAllMarkets,
  getUserPositions,
  createMarket,
  placeBet,
  resolveMarket,
  claimWinnings,
  PROGRAM_ID,
  configPDA,
  marketPDA,
  vaultPDA,
  positionPDA,
  type StellarMarketsProgram,
} from "../src/lib/markets";

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const RPC = process.env.SOLANA_RPC_URL!;
const STARS_MINT = new PublicKey(process.env.STARS_TOKEN_MINT!);
const FEE_PAYER_SK = bs58.decode(process.env.FEE_PAYER_PRIVATE_KEY!);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function explorer(sig: string) {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
}

const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
function check(name: string, ok: boolean, detail?: string) {
  checks.push({ name, ok, detail });
  console.log(`${ok ? "✅" : "❌"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fundSol(
  conn: Connection,
  from: Keypair,
  to: PublicKey,
  sol: number,
) {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: Math.round(sol * LAMPORTS_PER_SOL),
    }),
  );
  const sig = await conn.sendTransaction(tx, [from]);
  await conn.confirmTransaction(sig, "confirmed");
  return sig;
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
) {
  const tx = new Transaction().add(
    createMintToInstruction(STARS_MINT, dest, authority.publicKey, amount),
  );
  const sig = await conn.sendTransaction(tx, [authority]);
  await conn.confirmTransaction(sig, "confirmed");
  return sig;
}

async function tokenBalance(conn: Connection, ata: PublicKey): Promise<bigint> {
  try {
    const acc = await getAccount(conn, ata);
    return acc.amount;
  } catch {
    return BigInt(0);
  }
}

function programForKeypair(conn: Connection, kp: Keypair): StellarMarketsProgram {
  const wallet = new Wallet(kp);
  const provider = new AnchorProvider(conn, wallet, { commitment: "confirmed" });
  setProvider(provider);
  return getProgram(wallet, conn);
}

async function main() {
  console.log("=== STELLAR SDK SMOKE TEST (21 checkpoints) ===");
  console.log("RPC:", RPC);
  console.log("Program ID:", PROGRAM_ID.toBase58());
  console.log("Stars Mint:", STARS_MINT.toBase58());

  const conn = new Connection(RPC, "confirmed");
  const feePayer = Keypair.fromSecretKey(FEE_PAYER_SK);
  const alice = Keypair.generate();
  const bob = Keypair.generate();
  const carol = Keypair.generate();
  const dave = Keypair.generate();

  console.log("\nWallets:");
  console.log("  Fee payer / admin:", feePayer.publicKey.toBase58());
  console.log("  Alice:            ", alice.publicKey.toBase58());
  console.log("  Bob:              ", bob.publicKey.toBase58());
  console.log("  Carol:            ", carol.publicKey.toBase58());
  console.log("  Dave:             ", dave.publicKey.toBase58());

  const adminProgram = programForKeypair(conn, feePayer);

  // ─── 1. getConfig ────────────────────────────────────────
  const cfg = await getConfig(adminProgram);
  check(
    "01 getConfig() — Config exists, Stars mint matches",
    !!cfg && cfg.mint.equals(STARS_MINT),
    cfg ? `next_market_id=${cfg.nextMarketId} mint=${cfg.mint.toBase58()}` : "no config",
  );
  if (!cfg) throw new Error("Config missing — run scripts/verify-config.ts first");

  // ─── 2. wallets generated ────────────────────────────────
  check("02 Generated Alice/Bob/Carol/Dave keypairs", true);

  // ─── 3. fund SOL ─────────────────────────────────────────
  for (const k of [alice, bob, carol, dave]) {
    await fundSol(conn, feePayer, k.publicKey, 0.05);
  }
  check("03 Funded Alice/Bob/Carol/Dave with SOL (rent)", true);

  // ─── 4. mint 1000 Stars to each ──────────────────────────
  const mintInfo = await getMint(conn, STARS_MINT);
  check(
    "04a Mint decimals = 0 (raw integer Stars)",
    mintInfo.decimals === 0,
    `decimals=${mintInfo.decimals}`,
  );
  const feePayerAta = await ensureAta(conn, feePayer, feePayer.publicKey, STARS_MINT);
  const aliceAta = await ensureAta(conn, feePayer, alice.publicKey, STARS_MINT);
  const bobAta = await ensureAta(conn, feePayer, bob.publicKey, STARS_MINT);
  const carolAta = await ensureAta(conn, feePayer, carol.publicKey, STARS_MINT);
  const daveAta = await ensureAta(conn, feePayer, dave.publicKey, STARS_MINT);
  await mintStars(conn, feePayer, feePayerAta, BigInt(10));
  await mintStars(conn, feePayer, aliceAta, BigInt(1000));
  await mintStars(conn, feePayer, bobAta, BigInt(1000));
  await mintStars(conn, feePayer, carolAta, BigInt(1000));
  await mintStars(conn, feePayer, daveAta, BigInt(1000));
  check(
    "04 Minted 1000 Stars to each test wallet",
    (await tokenBalance(conn, aliceAta)) === BigInt(1000) &&
      (await tokenBalance(conn, bobAta)) === BigInt(1000) &&
      (await tokenBalance(conn, carolAta)) === BigInt(1000) &&
      (await tokenBalance(conn, daveAta)) === BigInt(1000),
  );

  // ─── 5. createMarket ─────────────────────────────────────
  const resolutionTime = new Date(Date.now() + 90_000); // 90s out
  const created = await createMarket(
    adminProgram,
    feePayer.publicKey,
    STARS_MINT,
    feePayerAta,
    feePayerAta,
    {
      question: "SDK SMOKE: will this resolve YES?",
      resolutionTime,
    },
  );
  console.log("  market id:", created.marketId, "tx:", explorer(created.txSignature));
  check(
    "05 createMarket — got new marketId and tx signature",
    typeof created.marketId === "number" && created.marketId > 0,
    `id=${created.marketId}`,
  );

  // ─── 6. seed 1 YES + 1 NO from feePayer to satisfy NoOpposition ─
  const seedYes = await placeBet(
    adminProgram,
    feePayer.publicKey,
    STARS_MINT,
    created.marketId,
    "yes",
    1,
  );
  const seedNo = await placeBet(
    adminProgram,
    feePayer.publicKey,
    STARS_MINT,
    created.marketId,
    "no",
    1,
  );
  console.log("  seed YES tx:", explorer(seedYes));
  console.log("  seed NO  tx:", explorer(seedNo));
  check("06 Seeded 1 Stars YES + 1 Stars NO from fee payer", true);

  // ─── 7. getMarket — pools {1,1} ──────────────────────────
  let m = await getMarket(adminProgram, created.marketId);
  check(
    "07 getMarket — pools = {yes:1, no:1}, resolved=false",
    !!m && m.yesPool === 1 && m.noPool === 1 && !m.resolved,
    m ? `yes=${m.yesPool} no=${m.noPool} resolved=${m.resolved}` : "null",
  );

  // ─── 8. Alice 100 YES ────────────────────────────────────
  const aliceProgram = programForKeypair(conn, alice);
  const aliceBetSig = await placeBet(
    aliceProgram,
    alice.publicKey,
    STARS_MINT,
    created.marketId,
    "yes",
    100,
  );
  console.log("  Alice bet tx:", explorer(aliceBetSig));
  check("08 Alice placeBet 100 YES", true);

  // ─── 9. Bob 200 NO ───────────────────────────────────────
  const bobProgram = programForKeypair(conn, bob);
  const bobBetSig = await placeBet(
    bobProgram,
    bob.publicKey,
    STARS_MINT,
    created.marketId,
    "no",
    200,
  );
  console.log("  Bob bet tx:  ", explorer(bobBetSig));
  check("09 Bob placeBet 200 NO", true);

  // ─── 10. Carol 50 YES ────────────────────────────────────
  const carolProgram = programForKeypair(conn, carol);
  const carolBetSig = await placeBet(
    carolProgram,
    carol.publicKey,
    STARS_MINT,
    created.marketId,
    "yes",
    50,
  );
  console.log("  Carol bet tx:", explorer(carolBetSig));
  check("10 Carol placeBet 50 YES", true);

  // ─── 11. getMarket — pools {151,201} ─────────────────────
  m = await getMarket(adminProgram, created.marketId);
  check(
    "11 getMarket — pools = {yes:151, no:201}",
    !!m && m.yesPool === 151 && m.noPool === 201,
    m ? `yes=${m.yesPool} no=${m.noPool}` : "null",
  );

  // ─── 12. getUserPositions per wallet ─────────────────────
  const aPos = await getUserPositions(adminProgram, alice.publicKey);
  const bPos = await getUserPositions(adminProgram, bob.publicKey);
  const cPos = await getUserPositions(adminProgram, carol.publicKey);
  const aOk = aPos.length === 1 && aPos[0].side === "yes" && aPos[0].amount === 100;
  const bOk = bPos.length === 1 && bPos[0].side === "no" && bPos[0].amount === 200;
  const cOk = cPos.length === 1 && cPos[0].side === "yes" && cPos[0].amount === 50;
  check(
    "12 getUserPositions — sides + amounts correct for Alice/Bob/Carol",
    aOk && bOk && cOk,
    `alice=${JSON.stringify(aPos.map((p) => [p.side, p.amount]))} bob=${JSON.stringify(bPos.map((p) => [p.side, p.amount]))} carol=${JSON.stringify(cPos.map((p) => [p.side, p.amount]))}`,
  );

  // ─── 13. parimutuel projected payout math ───────────────
  // total pot = 352, Alice yes 100/151 → 100/151 * 352 = ~233 (floor)
  const expectedAliceProj = Math.floor((100 / 151) * 352);
  const expectedCarolProj = Math.floor((50 / 151) * 352);
  const expectedBobProj = Math.floor((200 / 201) * 352);
  const projOk =
    aPos[0].projectedPayout === expectedAliceProj &&
    cPos[0].projectedPayout === expectedCarolProj &&
    bPos[0].projectedPayout === expectedBobProj;
  check(
    "13 projectedPayout matches parimutuel math (floor)",
    projOk,
    `alice=${aPos[0].projectedPayout}/${expectedAliceProj} carol=${cPos[0].projectedPayout}/${expectedCarolProj} bob=${bPos[0].projectedPayout}/${expectedBobProj}`,
  );

  // ─── 14. wait for resolutionTime ─────────────────────────
  const waitMs = Math.max(resolutionTime.getTime() + 5000 - Date.now(), 1000);
  console.log(`\nSleeping ${Math.round(waitMs / 1000)}s until resolution_time...`);
  await sleep(waitMs);
  check("14 Waited until resolution_time + 5s", true);

  // ─── 15. resolveMarket(YES) ──────────────────────────────
  const resolveSig = await resolveMarket(
    adminProgram,
    feePayer.publicKey,
    created.marketId,
    "yes",
  );
  console.log("  resolve tx:", explorer(resolveSig));
  check("15 resolveMarket(yes)", true);

  // ─── 16. getMarket — resolved + outcome=yes ──────────────
  m = await getMarket(adminProgram, created.marketId);
  check(
    "16 getMarket — resolved=true, outcome='yes'",
    !!m && m.resolved && m.outcome === "yes",
    m ? `resolved=${m.resolved} outcome=${m.outcome}` : "null",
  );

  // ─── 17. Alice claim ─────────────────────────────────────
  const aliceBalBefore = await tokenBalance(conn, aliceAta);
  const aliceClaimSig = await claimWinnings(
    aliceProgram,
    alice.publicKey,
    STARS_MINT,
    created.marketId,
  );
  console.log("  Alice claim tx:", explorer(aliceClaimSig));
  const aliceBalAfter = await tokenBalance(conn, aliceAta);
  const aliceDelta = Number(aliceBalAfter - aliceBalBefore);
  check(
    "17 Alice claimWinnings ≈ 100/151 * 352",
    aliceDelta === expectedAliceProj,
    `delta=${aliceDelta} expected=${expectedAliceProj}`,
  );

  // ─── 18. Carol claim ─────────────────────────────────────
  const carolBalBefore = await tokenBalance(conn, carolAta);
  const carolClaimSig = await claimWinnings(
    carolProgram,
    carol.publicKey,
    STARS_MINT,
    created.marketId,
  );
  console.log("  Carol claim tx:", explorer(carolClaimSig));
  const carolBalAfter = await tokenBalance(conn, carolAta);
  const carolDelta = Number(carolBalAfter - carolBalBefore);
  check(
    "18 Carol claimWinnings ≈ 50/151 * 352",
    carolDelta === expectedCarolProj,
    `delta=${carolDelta} expected=${expectedCarolProj}`,
  );

  // ─── 19. Bob claim — losing side, 0 payout ───────────────
  const bobBalBefore = await tokenBalance(conn, bobAta);
  const bobClaimSig = await claimWinnings(
    bobProgram,
    bob.publicKey,
    STARS_MINT,
    created.marketId,
  );
  console.log("  Bob claim tx:  ", explorer(bobClaimSig));
  const bobBalAfter = await tokenBalance(conn, bobAta);
  check(
    "19 Bob claimWinnings = 0 (losing side, clean no-op)",
    bobBalAfter === bobBalBefore,
    `delta=${Number(bobBalAfter - bobBalBefore)}`,
  );

  // ─── 20. Dave claim — never bet, must fail cleanly ───────
  const daveProgram = programForKeypair(conn, dave);
  let daveFailed = false;
  let daveErr = "";
  try {
    await claimWinnings(
      daveProgram,
      dave.publicKey,
      STARS_MINT,
      created.marketId,
    );
  } catch (e) {
    daveFailed = true;
    daveErr = (e as Error).message.slice(0, 120);
  }
  check(
    "20 Dave claim with no position fails cleanly (no panic)",
    daveFailed,
    daveErr,
  );

  // ─── 21. final balances summary ──────────────────────────
  const finalAlice = await tokenBalance(conn, aliceAta);
  const finalBob = await tokenBalance(conn, bobAta);
  const finalCarol = await tokenBalance(conn, carolAta);
  const finalDave = await tokenBalance(conn, daveAta);
  // alice started 1000, bet 100, claimed 233 → 1133
  // bob started 1000, bet 200, claimed 0 → 800
  // carol started 1000, bet 50, claimed 116 → 1066
  // dave started 1000, never bet → 1000
  const expFinalAlice = BigInt(1000 - 100 + expectedAliceProj);
  const expFinalCarol = BigInt(1000 - 50 + expectedCarolProj);
  const expFinalBob = BigInt(1000 - 200);
  const expFinalDave = BigInt(1000);
  check(
    "21 Final balances correct for all wallets",
    finalAlice === expFinalAlice &&
      finalBob === expFinalBob &&
      finalCarol === expFinalCarol &&
      finalDave === expFinalDave,
    `alice=${finalAlice}/${expFinalAlice} bob=${finalBob}/${expFinalBob} carol=${finalCarol}/${expFinalCarol} dave=${finalDave}/${expFinalDave}`,
  );

  // ─── final summary ───────────────────────────────────────
  const passed = checks.filter((c) => c.ok).length;
  const total = checks.length;
  console.log("\n=== SUMMARY ===");
  console.log(`Result: ${passed}/${total} checkpoints passed`);
  console.log(`Market ID: ${created.marketId}`);
  console.log(`Market PDA: ${marketPDA(PROGRAM_ID, created.marketId)[0].toBase58()}`);
  console.log(`Vault PDA:  ${vaultPDA(PROGRAM_ID, created.marketId)[0].toBase58()}`);

  // sanity: also test getAllMarkets returns at least 1
  const all = await getAllMarkets(adminProgram);
  console.log(`getAllMarkets returned ${all.length} market(s)`);

  if (passed !== total) {
    console.log("\n❌ FAIL — see failed checkpoints above");
    process.exit(1);
  }
  console.log("\n✅ ALL 21 CHECKPOINTS GREEN");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
