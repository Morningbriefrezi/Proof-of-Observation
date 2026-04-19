# Stellar ✦

**Prediction markets for sky, weather, and natural events.**

Bet on what the sky will do next. Stellar is the prediction market protocol for the events mass-market platforms won't list — meteor shower peaks, cloud-cover windows, aurora outlooks, storm formations, solar flares — settled by domain oracles on Solana.

🔗 **Live:** [stellarrclub.vercel.app](https://stellarrclub.vercel.app)
🏗️ **Hackathon:** Colosseum Frontier 2026 · Consumer Track
👤 **Builder:** Rezi ([@StellarClub26](https://x.com/StellarClub26)) — Founder of [Astroman.ge](https://astroman.ge), Georgia's first astronomy e-commerce store

📄 **Full spec:** [STELLAR_INFO.md](STELLAR_INFO.md)

---

## What It Does

Stellar lets users stake **Stars tokens** on binary outcomes of upcoming sky, weather, and natural events — from tomorrow's cloud cover to the Lyrid meteor shower peak to a SpaceX launch window. Markets resolve automatically through a stack of domain oracles: a deterministic Sky Oracle, Claude Vision photo verification, and live feeds from NOAA, Open-Meteo, NASA, and astronomy-engine.

Three event verticals, one protocol:

- **Sky** — meteor showers, lunar events, planet visibility, deep-sky observing windows
- **Weather** — cloud cover, storms, snow, hail, wind, fog
- **Natural phenomena** — auroras, Kp-index spikes, solar flares, wildfire smoke, launches

Users earn Stars through sky observation missions, daily check-ins, and knowledge quizzes — then stake them on markets. No real-money deposits. No wallets to manage. No seed phrases. No gas fees. Sign up with email. The blockchain is invisible.

---

## Why Blockchain?

Stellar passes the structural-necessity test cleanly. Three gates can't be solved off-chain:

1. **Trustless settlement between strangers.** Two users on opposing sides of a market need payouts to flow automatically on resolution — without trusting an operator.
2. **Programmable conditional payouts.** "Cloud cover below 30% at coordinates X on date Y" needs code — not customer service — to decide who wins.
3. **Open participation, no gatekeeping.** A storm chaser in Oklahoma, an astronomer in Georgia, and an aurora hunter in Finland trade in the same market without permission.

Remove the chain and the product collapses.

---

## Why Devnet + Stars-Only for the MVP

Deliberate scope, not a dodge:

- **Zero regulatory exposure** — no real-money stakes means no "is this gambling?" overhang
- **Zero cold-start liquidity** — new signups already hold 100 Stars earned through app engagement
- **End-to-end on-chain** — markets, positions, resolution, payouts all produce real Solana signatures
- **Trivial mainnet path** — same contract deploys with USDC in v2, no protocol changes

---

## Distribution Advantage

Stellar isn't starting from zero. [Astroman.ge](https://astroman.ge) is Georgia's first astronomy e-commerce store with:
- 60K+ social media followers
- Physical retail in Tbilisi
- Active telescope customer base — highest-intent prediction market users
- Real product inventory for optional Stars redemption

---

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
**Auth:** Privy (embedded Solana wallets, email/Google login)
**On-chain:** Anchor prediction-market program, Metaplex Bubblegum (position cNFTs), SPL Token (Stars), Helius DAS API
**AI:** Claude API with tool calling (ASTRA market analyst), Claude Vision (photo verification)
**Oracles:** Sky Oracle (internal), Open-Meteo, NOAA Kp, astronomy-engine, NASA, IMO
**Database:** Neon (Postgres) via Drizzle ORM
**Deploy:** Vercel · Solana devnet

---

## Core Features

- **Live Markets** — grid of active markets across Sky, Weather, Natural-phenomenon verticals, live odds, total Stars locked
- **Market Detail** — pool sizes, price chart, position entry, active positions, resolution countdown, "Research with ASTRA" button
- **ASTRA AI Analyst** — Claude-powered research tool that pulls live weather, historical base rates, celestial positions, implied vs estimated probability
- **Resolution Engine** — hourly cron, three pathways: automated oracle, Claude Vision photo verification, trusted manual source
- **Sky Missions** — existing observation missions now feed Stars into the market loop
- **Position Portfolio** — cNFT-backed positions (active + resolved) via Helius DAS
- **Sky Score + Tonight's Highlights + Events Calendar** — context layer driving market discoverability
- **Bilingual** — English + Georgian (next-intl)
- **Astroman Redemption** — bonus layer, large Stars balances redeem for telescope gear

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
# 1. Fund the fee payer wallet
solana airdrop 5 <FEE_PAYER_ADDRESS> --url devnet

# 2. Deploy Stellar Markets Anchor program
npm run deploy:markets

# 3. Create Bubblegum merkle tree for position cNFTs
npm run setup:bubblegum

# 4. Deploy Stars SPL token
npm run setup:token

# 5. Seed demo markets for judges
npm run seed:markets
```

---

## Architecture

```
User (email login via Privy)
  → Earns Stars via sky missions, check-ins, quizzes
  → Browses Live Markets (Sky / Weather / Natural)
  → Opens Market Detail → Research with ASTRA (live oracle data + base rates)
  → Stakes Stars YES/NO → Position cNFT minted (Bubblegum)
  → Pool updates in PDA-controlled vault
  → Resolution cron hits market close
  → Oracle resolves (Sky Oracle / Open-Meteo / NOAA / Claude Vision / manual)
  → on-chain resolve_market → parimutuel payout distribution
  → Winners see Stars credited, Position Portfolio updates
  → Optional: Stars redeemed at Astroman.ge
```

All transactions use a server-side fee payer. Users never interact with wallets directly.

---

## Roadmap

**Weeks 1-4 post-hackathon** — Whitelisted community market creation, Astroman email campaign to seed first 500 users
**Months 2-6** — Mainnet deployment with USDC + Stars dual currency, Pyth/Switchboard integration, mobile PWA, second vertical (storm chasing or birdwatching)
**Months 6-12** — Third vertical, paid market creation for creators, tokenized liquidity provision

---

## License

MIT
