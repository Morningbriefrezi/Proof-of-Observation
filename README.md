# ✦ Stellar — Cosmic Prediction Markets on Solana

**Predict celestial events. Observe the sky. Earn real telescope gear.**

Stellar is a prediction market protocol where the events are in the sky and your edge comes from going outside. Bet on meteor shower peaks, clear sky windows, space mission outcomes, and solar activity — then verify the results by looking up.

[Live App](https://stellarrclub.vercel.app) · [Colosseum Frontier 2026](https://www.colosseum.org) · [Twitter/X](https://x.com/StellarClub26)

---

## Why Stellar is Different

| | Polymarket | Stellar |
|---|---|---|
| **Research** | Read Bloomberg | Go outside with a telescope |
| **Markets** | Text on a page | Events in the physical sky |
| **Edge** | Capital advantage | Observation advantage (1.5× payout) |
| **Winnings** | USDC | Stars → real telescopes at [Astroman](https://astroman.ge) |
| **Resolution** | Admin/news | Scientific instruments (IMO, NOAA, Open-Meteo) |
| **Activity loop** | Trading only | Observe → Predict → Earn → Spend |

## How It Works

1. **Browse markets** — 20 live cosmic prediction markets tied to real celestial events
2. **Stake Stars** — Bet YES or NO on outcomes using Stars (SPL token on Solana)
3. **Observe** — Complete sky missions to earn a 1.5× observer advantage on related markets
4. **Win** — Markets resolve via scientific oracles. Winners claim Stars.
5. **Redeem** — Exchange Stars for telescopes and gear at [Astroman](https://astroman.ge), Georgia's first astronomy store

## Features

- **20 live prediction markets** — meteor showers, clear sky windows, space missions, solar activity, scientific discoveries
- **Observer advantage multiplier** — complete a sky mission, earn 1.5× on related market payouts
- **ASTRA AI analyst** — ask the built-in AI astronomer "should I bet YES?" and get analysis with live sky data
- **Sky map interface** — markets positioned at celestial coordinates, not a spreadsheet
- **Compressed NFT proofs** — every observation minted as a cNFT (~$0.000005/mint via Metaplex Bubblegum)
- **Stars SPL token** — real on-chain token, not localStorage points
- **Physical redemption** — Stars redeemable for telescopes at Astroman (Tbilisi, Georgia)
- **Zero-crypto UX** — email signup via Privy, embedded wallets, gasless transactions
- **Scientific oracles** — Open-Meteo (weather), NOAA (solar), IMO (meteors), astronomy-engine (celestial mechanics)

## DePIN: Decentralized Sky Observation Infrastructure

Stellar is a DePIN (Decentralized Physical Infrastructure Network) where the physical infrastructure is the night sky and the nodes are human observers with phones and telescopes.

### How it works

Every Stellar user is a node in a decentralized sky observation network:

| Node Type | Hardware | Data Contributed | Reward |
|---|---|---|---|
| **Passive** | Smartphone | GPS + timestamp + weather confirmation | 5–25 ✦ |
| **Observer** | Smartphone + eyes | Verified sky photo, AI-analyzed observation, cNFT proof | 50–250 ✦ |
| **Advanced** | Telescope + camera | High-resolution captures, Bortle readings, spectral data | 100–500 ✦ |

### Why this is DePIN

1. **The infrastructure is physical.** Each observation comes from a real location, at a real time, verified by GPS + timestamp + AI photo analysis. You cannot fake looking at the sky.
2. **The network is decentralized.** No central observatory controls the data. Every smartphone with Stellar is a sensor in a global sky monitoring grid. More observers = better coverage = more accurate market resolution.
3. **Data has economic value.** Observation data directly feeds prediction market resolution. The same data that proves "I saw the Lyrids" also resolves the "Lyrids ZHR > 18" market. Contributors are paid in Stars tokens.
4. **Proofs are on-chain.** Every observation is sealed as a compressed NFT on Solana (~$0.000005/mint), creating an immutable, timestamped, geolocated record of sky conditions worldwide.

### Network stats

Live at [stellarrclub.vercel.app/network](https://stellarrclub.vercel.app/network) — real-time map of all observer nodes and sky data contributions.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind 4 |
| Auth | Privy embedded Solana wallets (email/Google login) |
| Markets | Custom Anchor program on Solana devnet |
| NFTs | Metaplex Bubblegum compressed NFTs |
| Token | Stars SPL token (0 decimals) |
| AI | Claude API — ASTRA persona with tool calling (sky data + market research) |
| Oracles | Open-Meteo, NOAA SWPC, IMO, astronomy-engine |
| Database | Neon Postgres via Drizzle ORM |
| RPC | Helius |
| Deploy | Vercel |

## Market Categories

| Category | Example | Oracle | Uncertainty |
|---|---|---|---|
| Meteor showers | Lyrids peak > 18 ZHR | IMO live count | Genuinely unpredictable |
| Clear sky windows | Tbilisi < 30% cloud cover tonight | Open-Meteo | Weather-dependent |
| Solar activity | Kp index > 5 this week | NOAA SWPC | Unpredictable |
| Space missions | Artemis II launches by June | NASA official | Schedule risk |
| Comets | C/2025 R3 reaches naked-eye | MPC/COBS | Famously unpredictable |
| Scientific discoveries | JWST biosignature detection | Published papers | Unknown unknowns |

## The Flywheel

```
Observe the sky → Earn Stars + NFT proof
    ↓
Predict markets → Stake Stars on outcomes
    ↓
Observer advantage → 1.5× payout for verified observations
    ↓
Win Stars → Redeem at Astroman for real telescopes
    ↓
Better telescope → Better observations → Repeat
```

## Distribution Advantage

Stellar isn't built in a vacuum. [Astroman](https://astroman.ge) is Georgia's first astronomy e-commerce store with:
- Active social following across Georgia
- Physical retail presence in Tbilisi
- Existing customer base of telescope buyers
- Direct relationships with schools and astronomy clubs

Every Astroman customer is a potential Stellar user. Every Stellar winner becomes an Astroman customer.

## Running Locally

```bash
git clone https://github.com/Morningbriefrezi/Stellar.git
cd Stellar
npm install
cp .env.example .env.local  # Fill in your keys
npm run dev
```

Required environment variables: see `.env.example`

## On-Chain Addresses (Devnet)

- **Program:** `Bcufe9vy6V3Vn4eqBQqdmRKzJgEcHdVxHci6ursiTkvi`
- **Stars Token:** `3cnZEZAu2ENujwNNtA5phyqSi3JvAaHpyzExQiXw1YwW`
- **Fee Payer:** `BEGJbkPn7eEAKkjLTGh39usDiscM7P2BwQyXNToHdVVg`
- **Markets:** IDs 4–23 (20 active markets)

## Builder

**Rezi (Revaz Modebadze)** — Founder of [Astroman](https://astroman.ge), Georgia's first astronomy store. Built solo for Colosseum Frontier 2026.

- 2nd place, Superteam Georgia Hackathon
- [Twitter/X: @StellarClub26](https://x.com/StellarClub26)
- Tbilisi, Georgia
