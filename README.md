# Stellar ✦

**The night sky app — observe, earn, collect.**

Stellar turns every clear night into a verified discovery. Check tonight's sky score, complete observation missions, earn Stars tokens, and collect compressed NFT proofs — all powered by invisible Solana infrastructure.

🔗 **Live:** [stellarrclub.vercel.app](https://stellarrclub.vercel.app)
🏗️ **Hackathon:** Colosseum Frontier 2026 · Consumer Track
👤 **Builder:** Rezi ([@StellarClub26](https://x.com/StellarClub26)) — Founder of [Astroman.ge](https://astroman.ge), Georgia's first astronomy e-commerce store

---

## What It Does

Stellar answers one universal question: **"What can I see in the sky tonight?"**

Users get a real-time Sky Score (0–100), tonight's visible planets and highlights, 7-day forecast, and AI-powered guidance from ASTRA. When conditions are right, users complete observation missions — photograph celestial objects, get AI-verified, and earn:

- **Compressed NFTs** (Metaplex Bubblegum) — proof of each observation, ~$0.000005/mint
- **Stars tokens** (SPL) — redeemable for real telescope equipment at Astroman.ge

No wallets. No seed phrases. No gas fees. Sign up with email. The blockchain is invisible.

---

## Why Blockchain?

| Without Solana | With Solana |
|---|---|
| Points in localStorage — lost if you clear your browser | Stars as SPL tokens — permanent, verifiable, tradeable |
| "Trust me, I observed Jupiter" | Compressed NFT with oracle hash, coordinates, timestamp — verifiable on Explorer |
| Discount codes emailed | Token-gated redemption — balance checked on-chain |
| App shuts down, history gone | NFTs and tokens persist in your wallet forever |

Compressed NFTs cost ~$0.000005 each. We can mint millions. The fee payer covers all gas — users never need SOL.

---

## Distribution Advantage

Stellar isn't starting from zero. [Astroman.ge](https://astroman.ge) is Georgia's first astronomy e-commerce store with:
- 60K+ social media followers
- Physical retail in Tbilisi
- Active telescope customer base
- Real products in the Stellar marketplace

Stars tokens earned in-app are redeemable for real discounts at the physical store.

---

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4  
**Auth:** Privy (embedded Solana wallets, email/Google login)  
**Blockchain:** Metaplex Bubblegum (cNFTs), SPL Token (Stars), Helius DAS API  
**AI:** Claude API with tool calling (ASTRA), Claude Vision (photo verification)  
**Data:** Open-Meteo (weather), astronomy-engine (planet positions)  
**Database:** Neon (Postgres) via Drizzle ORM  
**Deploy:** Vercel

Built with: Metaplex Bubblegum · Helius · Privy · Open-Meteo · Claude API

---

## Features

- **Sky Score** — 0–100 rating for tonight's sky quality
- **Tonight's Highlights** — visible planets, moon phase, best viewing window
- **7-Day Forecast** — daily sky quality rated Go/Maybe/Skip
- **Planet Tracker** — rise/set/transit times for Mercury through Saturn
- **ASTRA AI** — floating chat widget with live sky tool calling (accessible from every page)
- **Observation Missions** — 7 targets from Moon (naked eye) to Orion Nebula (telescope)
- **Knowledge Quizzes** — Solar System, Constellations, Telescopes (EN + Georgian)
- **NFT Gallery** — compressed observation NFTs fetched via Helius DAS
- **Marketplace** — real Astroman.ge products, Stars token redemption
- **Bilingual** — English + Georgian (next-intl)

---

## How to Run

```bash
git clone https://github.com/Morningbriefrezi/Stellar.git
cd Stellar
npm install
cp .env.example .env.local  # fill in your keys
npm run dev
```

Required env vars: see `.env.example`

---

## On-Chain Setup (devnet)

```bash
# 1. Fund your fee payer wallet
solana airdrop 5 <FEE_PAYER_ADDRESS> --url devnet

# 2. Create Bubblegum merkle tree + NFT collection
npm run setup:bubblegum

# 3. Deploy Stars SPL token
npm run setup:token

# 4. Seed demo observations for judges
npm run seed:demo
```

---

## Architecture

```
User (email login via Privy)
  → Tonight's Sky Score + Highlights (Open-Meteo + astronomy-engine)
  → Ask ASTRA (Claude with live tool calling — planet positions, sky conditions)
  → Start Mission → Camera → Claude Vision photo verification
  → Sky Oracle hash (deterministic per location/hour)
  → POST /api/mint → Metaplex Bubblegum cNFT on devnet
  → POST /api/observe/log → SPL token mintTo (Stars)
  → NFT Gallery (Helius DAS: getAssetsByOwner)
  → Marketplace → Stars redemption → Astroman.ge
```

All transactions use a server-side fee payer. Users never interact with wallets directly.

---

## License

MIT
