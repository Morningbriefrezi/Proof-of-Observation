/**
 * Seed on-chain demo data for hackathon judges.
 * Mints 5 observation NFTs and awards Stars tokens to the fee payer wallet.
 *
 * Usage: npx tsx scripts/seed-demo-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import bs58 from 'bs58';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { mintCompressedNFT } from '../src/lib/mint-nft';

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

// ── Observations to seed ─────────────────────────────────────────────────────
const observations = [
  { target: 'Moon',        lat: 41.72, lon: 44.83, cloudCover: 8,  stars: 50,  date: '2026-04-10' },
  { target: 'Jupiter',     lat: 41.72, lon: 44.83, cloudCover: 12, stars: 75,  date: '2026-04-11' },
  { target: 'Pleiades',    lat: 41.72, lon: 44.83, cloudCover: 5,  stars: 60,  date: '2026-04-12' },
  { target: 'Saturn',      lat: 41.72, lon: 44.83, cloudCover: 18, stars: 100, date: '2026-04-13' },
  { target: 'Orion Nebula',lat: 41.72, lon: 44.83, cloudCover: 10, stars: 100, date: '2026-04-14' },
];

function oracleHash(lat: number, lon: number, cloudCover: number, date: string): string {
  // Simple deterministic hash (same logic as /api/sky/verify)
  const input = `${lat.toFixed(4)},${lon.toFixed(4)},${cloudCover},${date}`;
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(31, h) + input.charCodeAt(i) | 0;
  }
  return '0x' + Math.abs(h).toString(16).padStart(40, '0').slice(0, 40);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const { FEE_PAYER_PRIVATE_KEY, MERKLE_TREE_ADDRESS, COLLECTION_MINT_ADDRESS, STARS_TOKEN_MINT } = process.env;
  const DEVNET_URL = process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com';

  if (!FEE_PAYER_PRIVATE_KEY) throw new Error('FEE_PAYER_PRIVATE_KEY not set');
  if (!MERKLE_TREE_ADDRESS) throw new Error('MERKLE_TREE_ADDRESS not set');
  if (!COLLECTION_MINT_ADDRESS) throw new Error('COLLECTION_MINT_ADDRESS not set');
  if (!STARS_TOKEN_MINT) throw new Error('STARS_TOKEN_MINT not set');

  const feePayerKeypair = Keypair.fromSecretKey(bs58.decode(FEE_PAYER_PRIVATE_KEY));
  const feePayerAddress = feePayerKeypair.publicKey.toBase58();
  console.log(`\n🔑 Fee payer: ${feePayerAddress}`);
  console.log(`🌳 Tree: ${MERKLE_TREE_ADDRESS}`);
  console.log(`🖼️  Collection: ${COLLECTION_MINT_ADDRESS}`);
  console.log(`✦  Stars mint: ${STARS_TOKEN_MINT}`);
  console.log(`\nMinting ${observations.length} observation NFTs...\n`);

  const txIds: string[] = [];
  let totalStars = 0;

  for (const obs of observations) {
    const hash = oracleHash(obs.lat, obs.lon, obs.cloudCover, obs.date);
    try {
      const { txId } = await mintCompressedNFT({
        userAddress: feePayerAddress,
        target: obs.target,
        timestampMs: new Date(obs.date).getTime(),
        lat: obs.lat,
        lon: obs.lon,
        cloudCover: obs.cloudCover,
        oracleHash: hash,
        stars: obs.stars,
      });
      txIds.push(txId);
      totalStars += obs.stars;
      console.log(`[NFT] ${obs.target} — tx: ${txId}`);
      console.log(`      https://explorer.solana.com/tx/${txId}?cluster=devnet`);
    } catch (err) {
      console.error(`[NFT] Failed to mint ${obs.target}:`, err instanceof Error ? err.message : err);
    }
    await sleep(2000);
  }

  // ── Award Stars tokens ────────────────────────────────────────────────────
  console.log(`\n✦ Awarding ${totalStars} Stars tokens to fee payer...`);
  try {
    const connection = new Connection(DEVNET_URL, 'confirmed');
    const mintPublicKey = new PublicKey(STARS_TOKEN_MINT);

    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      feePayerKeypair,
      mintPublicKey,
      feePayerKeypair.publicKey
    );

    const sig = await mintTo(
      connection,
      feePayerKeypair,
      mintPublicKey,
      ata.address,
      feePayerKeypair,
      BigInt(totalStars)
    );

    console.log(`[Stars] Awarded ${totalStars} Stars — tx: ${sig}`);
    console.log(`        https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  } catch (err) {
    console.error('[Stars] Failed to award tokens:', err instanceof Error ? err.message : err);
  }

  console.log(`\n✅ Seeded ${txIds.length} observation NFTs and ${totalStars} Stars tokens`);
  console.log(`📊 View wallet: https://explorer.solana.com/address/${feePayerAddress}?cluster=devnet`);
}

main().catch(err => {
  console.error('\n❌ Seed failed:', err);
  process.exit(1);
});
