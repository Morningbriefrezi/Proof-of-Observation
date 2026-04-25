/**
 * Resolve expired markets using the fee-payer (admin) wallet.
 *
 * Usage:
 *   npx tsx scripts/resolve-markets.ts              # dry run: list what would resolve
 *   npx tsx scripts/resolve-markets.ts --execute    # actually send resolve txs
 *   npx tsx scripts/resolve-markets.ts --execute --only 4,6,24
 *
 * Outcome source (in order): MANUAL_OUTCOMES map (verified) > skip.
 * If either pool is 0, the market cannot be resolved on-chain (NoOpposition);
 * the script logs and skips those.
 */
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import bs58 from "bs58";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const RPC = process.env.SOLANA_RPC_URL!;
const PROGRAM_ID = new PublicKey(process.env.PREDICTION_MARKET_PROGRAM_ID!);
const FEE_PAYER_SK = bs58.decode(process.env.FEE_PAYER_PRIVATE_KEY!);

const IDL_PATH = path.resolve(
  __dirname,
  "..",
  "src",
  "lib",
  "markets",
  "idl.json",
);
const idl = JSON.parse(fs.readFileSync(IDL_PATH, "utf8"));

/**
 * Verified outcomes for markets past resolution_time as of 2026-04-25.
 *
 *  #3  UI TEST smoke market                               → YES (test)
 *  #4  Lyrids ZHR ≥18 on Apr 21/22 (v1 sky-001)           → YES (IMO 2026: peak ~23, nominal 18)
 *  #6  Vandenberg Falcon 9 Apr 22 (v1 sky-003)            → YES (Starlink 24 sats, booster landed)
 *  #24 Lyrids ZHR >18 (v2 meteor-001)                     → YES (same IMO data)
 *  #50 Tbilisi cloud <30% during Lyrids (v2 weather-003)  → NO  (Open-Meteo avg ~32% for 17-00 UTC)
 */
const MANUAL_OUTCOMES: Record<number, "yes" | "no"> = {
  3: "yes",
  4: "yes",
  6: "yes",
  24: "yes",
  50: "no",
};

function configPda(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID,
  );
  return pda;
}

function marketPda(marketId: bigint): PublicKey {
  const idBuf = Buffer.alloc(8);
  idBuf.writeBigUInt64LE(marketId);
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("market"), idBuf],
    PROGRAM_ID,
  );
  return pda;
}

function keypairWallet(keypair: Keypair) {
  return {
    publicKey: keypair.publicKey,
    payer: keypair,
    async signTransaction<T extends Transaction>(tx: T): Promise<T> {
      tx.partialSign(keypair);
      return tx;
    },
    async signAllTransactions<T extends Transaction>(txs: T[]): Promise<T[]> {
      for (const tx of txs) tx.partialSign(keypair);
      return txs;
    },
  };
}

interface RawMarket {
  id: BN;
  question: string;
  resolutionTime: BN;
  state: { active?: object; resolved?: object; cancelled?: object };
  winningOutcome: { none?: object; yes?: object; no?: object };
  yesPool: BN;
  noPool: BN;
}

interface Row {
  id: number;
  question: string;
  resolutionTime: Date;
  yesPool: number;
  noPool: number;
  resolved: boolean;
  cancelled: boolean;
}

function explorer(sig: string): string {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
}

function parseArgs(): { execute: boolean; only: Set<number> | null } {
  const args = process.argv.slice(2);
  const execute = args.includes("--execute");
  let only: Set<number> | null = null;
  const onlyIdx = args.indexOf("--only");
  if (onlyIdx !== -1 && args[onlyIdx + 1]) {
    only = new Set(
      args[onlyIdx + 1]
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => Number.isFinite(n)),
    );
  }
  return { execute, only };
}

async function main() {
  const { execute, only } = parseArgs();
  const conn = new Connection(RPC, "confirmed");
  const feePayer = Keypair.fromSecretKey(FEE_PAYER_SK);
  const provider = new AnchorProvider(conn, keypairWallet(feePayer) as never, {
    commitment: "confirmed",
  });
  const program = new Program(idl, provider) as any;

  console.log("=== RESOLVE MARKETS ===");
  console.log("RPC:       ", RPC);
  console.log("Program:   ", PROGRAM_ID.toBase58());
  console.log("Admin:     ", feePayer.publicKey.toBase58());
  console.log("Mode:      ", execute ? "EXECUTE" : "DRY RUN (pass --execute to submit)");
  if (only) console.log("Filter:     only markets", [...only].sort((a, b) => a - b).join(", "));
  console.log();

  const now = Date.now();
  const raw = (await program.account.market.all()) as Array<{ account: RawMarket }>;
  const rows: Row[] = raw
    .map(({ account }) => ({
      id: Number(account.id.toString()),
      question: account.question,
      resolutionTime: new Date(Number(account.resolutionTime.toString()) * 1000),
      yesPool: Number(account.yesPool.toString()),
      noPool: Number(account.noPool.toString()),
      resolved: !!account.state.resolved,
      cancelled: !!account.state.cancelled,
    }))
    .sort((a, b) => a.id - b.id);

  const candidates = rows.filter(
    (r) =>
      !r.resolved &&
      !r.cancelled &&
      r.resolutionTime.getTime() <= now &&
      (!only || only.has(r.id)),
  );

  if (candidates.length === 0) {
    console.log("No expired unresolved markets. Nothing to do.");
    return;
  }

  console.log(`Found ${candidates.length} expired market(s):\n`);

  const results: Array<{
    id: number;
    title: string;
    outcome: string;
    status: string;
    txSignature?: string;
  }> = [];

  for (const m of candidates) {
    const title = m.question;
    const outcome = MANUAL_OUTCOMES[m.id];
    const hdr = `  #${m.id} · ${title.slice(0, 70)}`;
    console.log(hdr);
    console.log(
      `       pools Y=${m.yesPool} N=${m.noPool} · res=${m.resolutionTime.toISOString()}`,
    );

    if (!outcome) {
      console.log(`       SKIP — no outcome in MANUAL_OUTCOMES. Add to script to resolve.\n`);
      results.push({ id: m.id, title, outcome: "—", status: "skipped:no-outcome" });
      continue;
    }

    if (m.yesPool === 0 || m.noPool === 0) {
      console.log(
        `       SKIP — NoOpposition (yesPool=${m.yesPool}, noPool=${m.noPool}). Seed the empty side before resolving.\n`,
      );
      results.push({
        id: m.id,
        title,
        outcome,
        status: "skipped:no-opposition",
      });
      continue;
    }

    if (!execute) {
      console.log(`       would resolve → ${outcome.toUpperCase()}\n`);
      results.push({ id: m.id, title, outcome, status: "dry-run" });
      continue;
    }

    try {
      const sig: string = await program.methods
        .resolveMarket(
          new BN(m.id),
          outcome === "yes" ? { yes: {} } : { no: {} },
        )
        .accountsStrict({
          admin: feePayer.publicKey,
          config: configPda(),
          market: marketPda(BigInt(m.id)),
        })
        .rpc();
      console.log(`       ✓ resolved ${outcome.toUpperCase()}`);
      console.log(`         ${explorer(sig)}\n`);
      results.push({ id: m.id, title, outcome, status: "resolved", txSignature: sig });
    } catch (e) {
      const msg = (e as Error).message?.slice(0, 300) ?? String(e);
      console.log(`       ✗ FAILED: ${msg}\n`);
      results.push({ id: m.id, title, outcome, status: `error:${msg.slice(0, 80)}` });
    }
  }

  console.log("=== SUMMARY ===");
  console.log(`Total considered: ${candidates.length}`);
  const tally: Record<string, number> = {};
  for (const r of results) tally[r.status] = (tally[r.status] ?? 0) + 1;
  for (const [k, v] of Object.entries(tally)) console.log(`  ${k}: ${v}`);
  console.log();
  console.log("Results:");
  for (const r of results) {
    const sig = r.txSignature ? ` · ${r.txSignature.slice(0, 12)}…` : "";
    console.log(
      `  #${r.id.toString().padStart(2)} ${r.outcome.toUpperCase().padEnd(4)} [${r.status}]${sig} — ${r.title.slice(0, 55)}`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
