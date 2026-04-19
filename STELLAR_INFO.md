# STELLAR ✦ — Prediction Markets for Sky, Weather & Natural Events

**Bet on what the sky will do next.**

**Hackathon:** Colosseum Frontier 2026 (April 6 – May 11, 2026)
**Builder:** Rezi (Revaz Modebadze) — founder of Astroman.ge, Georgia's first astronomy e-commerce store
**Live:** [stellarrclub.vercel.app](https://stellarrclub.vercel.app)
**GitHub:** [github.com/Morningbriefrezi/Stellar](https://github.com/Morningbriefrezi/Stellar)
**X:** [@StellarClub26](https://x.com/StellarClub26)
**Network:** Solana devnet (hackathon MVP)

---

## What Stellar Is

Stellar is a **prediction market protocol for sky, weather, and natural events** on Solana. Users stake Stars tokens on binary outcomes of upcoming events — from tomorrow's cloud cover to the Lyrid meteor shower peak, from a SpaceX launch window to whether aurora will reach mid-latitudes this weekend. Markets resolve automatically through a stack of domain oracles Stellar has built: a deterministic Sky Oracle, AI-powered photo verification via Claude Vision, and live integrations with NOAA, Open-Meteo, NASA, and astronomy-engine.

The vertical spans three adjacent event categories, each underserved by mass-market prediction platforms:

- **Sky events** — meteor showers, lunar events, planet visibility, deep-sky observing windows
- **Weather events** — cloud cover, storms, first snow, hail, wind, fog, severe thunderstorm nights
- **Natural-phenomenon events** — auroras, Kp-index spikes, solar flares, wildfire smoke days, small-scale geological activity

Why these three together? They share the same oracle infrastructure, the same obsessive hobby communities (amateur astronomers, storm chasers, aurora hunters, meteorologists), and they're almost entirely absent from Polymarket and Kalshi. The markets matter intensely to their audiences and have no settlement layer today.

Stellar runs on Solana devnet for the hackathon MVP. Positions are staked in Stars — Stellar's existing SPL token — which users earn through the app's existing sky observation missions, daily check-ins, and knowledge quizzes. No real-money deposits required. This is not a limitation — it's a deliberate design choice that sidesteps regulatory exposure entirely while demonstrating the protocol works end-to-end on-chain.

No wallets to manage. No seed phrases. No gas fees visible to users. Sign up with email. Everything else is invisible Solana infrastructure.

---

## Why Crypto Is Structurally Necessary

This is the question that disqualifies most consumer crypto products at hackathons. Stellar answers it cleanly.

Three hard gates cannot be solved without a blockchain:

1. **Trustless settlement between strangers.** A prediction market requires that two people who don't know each other stake tokens on opposing outcomes, and that payouts flow automatically when the event resolves. Without a neutral settlement layer, every resolution depends on trusting the platform operator not to favor one side. Polymarket's entire operational moat is that settlement happens on-chain. Centralized competitors collapse the moment a controversial resolution hits them.

2. **Programmable conditional payouts.** A market that resolves on "cloud cover below 30% at coordinates X on date Y" needs code — not customer service — to decide who wins. Stripe has no answer. Traditional escrow has no answer. Smart contracts do.

3. **Open participation with no operator gatekeeping.** A storm chaser in Oklahoma, an amateur astronomer in Georgia, and an aurora hunter in Finland should be able to trade in the same market without asking permission from anyone. SPL tokens on Solana enable this by default. A centralized platform would need payment licenses, KYC flows, and geographic restrictions.

Remove the blockchain from Stellar and the product collapses. Remove it from most consumer crypto apps and nothing is actually lost. This is the test Stellar passes cleanly.

---

## Why Devnet-Only and Stars-Only Is Actually Correct

For a 15-day solo hackathon MVP, running on devnet with Stars as the sole position currency is not a cop-out — it's the correct design decision for four reasons:

1. **Zero regulatory exposure.** No real money means no "is this gambling?" overhang for judges or future investors. Devnet with soft currency is how Polymarket originally demo'd. It's how Kalshi ran pre-CFTC. It is the standard hackathon approach.

2. **Zero cold-start liquidity problem.** The single biggest killer of new prediction markets is empty order books. Stars tokens flow to users from the existing sky missions, check-ins, and quizzes — so every new signup arrives already holding 100 Stars and can immediately place positions. The liquidity problem never existed because the currency was always free-to-earn.

3. **End-to-end demonstrates the protocol works.** Judges see the full lifecycle — market created on-chain, positions placed on-chain, resolution triggered on-chain, payouts distributed on-chain — with real transaction signatures in Solana Explorer. That's what matters for the "is this real crypto?" test. The currency being devnet Stars vs mainnet USDC is a v1 vs v2 concern, not a hackathon-judging concern.

4. **Clean path to mainnet.** v2 on mainnet replaces Stars with USDC (or keeps both — Stars for free-play tutorials, USDC for real stakes) with zero protocol changes. The same contract, accounts, and PDAs deploy to mainnet unchanged. The upgrade story is trivial.

The honest pitch line: *"We deliberately constrained the MVP to devnet + Stars so we could ship the protocol cleanly in 15 days without legal or liquidity overhead. The same contract deploys to mainnet with USDC in v2 — the hard part was always the oracles, the resolution logic, and the vertical fit. We've proved all three on devnet."*

---

## Who It's For

Concentric circles of engagement:

**Circle 1 — Curious browsers**
Anyone interested in the sky, weather, or natural events. Opens Stellar, sees live markets on this week's meteor shower, next weekend's storm forecast, Thursday's aurora outlook. No account needed to browse. Content funnel.

**Circle 2 — Free players**
Signs up with email (Privy). Receives 100 Stars tokens free plus can earn more through daily check-ins, sky missions, and quizzes. Places positions on markets using Stars. Never risks real money. This is the onboarding loop that teaches prediction market mechanics through gameplay.

**Circle 3 — Active market participants**
Completes observation missions to earn more Stars. Follows their win rate on the leaderboard. Uses ASTRA AI to research markets before betting. Creates a portfolio of active positions visible in the app.

**Circle 4 — Power users and creators (v2)**
Community members whose reputation earns them the ability to propose new markets. Weekly market-creation calls. This is the supply-side unlock for v2 post-hackathon.

**Circle 5 — Physical redemption (optional bonus layer)**
Users who redeem large Stars balances for discount codes at Astroman.ge, Georgia's astronomy retailer. Stars → telescope gear. This closes the loop between digital prediction and physical reward, unique to Stellar's distribution advantage.

The key insight: **the entire Circle 2 experience has no real-money exposure at all.** Users discover markets, earn Stars through genuine app engagement, and trade with other real users. The prediction market mechanics work identically whether the currency is free-earned Stars or real USDC — which is exactly why devnet is the right MVP target.

---

## Distribution Advantage

Stellar isn't starting from zero. It's backed by [Astroman.ge](https://astroman.ge) — Georgia's first astronomy e-commerce store:

- **60K+** social media followers across platforms
- **Physical retail** presence in Tbilisi
- **Active customer base** of telescope buyers who are your highest-intent prediction market users
- **Real product inventory** powering optional Stars redemption
- **Authentic founder story** — Rezi previously placed 2nd at a Superteam Georgia hackathon, demonstrating established credibility in Solana ecosystem

This is the single strongest go-to-market differentiator versus any other Frontier submission. No competitor has an existing business, existing customers, a physical store, and a ready-made niche community audience.

---

## Market Categories

Stellar launches with 15-20 seed markets across three adjacent verticals:

### Sky Markets
- "Will Jupiter be visible (altitude > 20°, cloud cover < 50%) from Tbilisi at 22:00 on April 25?"
- "Will the Lyrid meteor shower peak (April 22-23) report ZHR > 15 on IMO?"
- "Will the Moon reach 80% illumination before May 1?"
- "Will any Messier object be visibly photographable from Bortle 6 zones this week?"
- "Will a comet brighter than magnitude 7 be observable from the Northern Hemisphere by May 5?"

### Weather Markets
- "Will Tbilisi record less than 25% cloud cover for any night this week?"
- "Will any major European capital see overnight lows below 0°C in the next 7 days?"
- "Will the Caucasus region receive measurable precipitation (>2mm) this weekend?"
- "Will wind speeds in Tbilisi exceed 30km/h on any day this week?"
- "Will fog reduce visibility to <1km at any Caucasus airport on April 24?"

### Natural-Phenomenon Markets
- "Will geomagnetic activity (Kp index) reach 5+ at any point before May 5?"
- "Will aurora be visible from latitudes below 55°N this week?"
- "Will SpaceX Starship IFT-[next] reach stage separation on scheduled attempt?"
- "Will any M-class or X-class solar flare occur before April 30?"
- "Will a named storm system form in the North Atlantic before May 10?"

Each market has:
- A specific YES condition
- A resolution source (Sky Oracle / NOAA / Open-Meteo / NASA / Claude Vision / IMO / manual)
- A close time (when positions lock)
- A resolution time (when outcome is determined and payouts distributed)

**All markets use Stars tokens as the staking currency.** Minimum position: 10 Stars. No maximum.

---

## Core Features

### Live Markets (/markets)

The home of the product. Grid view of all active markets, organized by category. Each card shows:
- Title and category badge
- Current odds (YES / NO split based on pool ratios — parimutuel)
- Total Stars Locked (TSL, analogous to TVL)
- Number of active traders
- Time to close
- Resolution source icon

Reuses your existing cosmic design system verbatim — the visual language you've already built.

### Market Detail (/markets/[id])

Each market has a dedicated page showing:
- Full resolution criteria
- Current pool sizes (YES pool, NO pool)
- Live price chart (odds over time)
- Position entry form — YES or NO, Stars amount, projected payout
- Active positions list (wallet addresses redacted, position sizes and sides shown)
- "Research with ASTRA" button that opens the AI analyst in context
- Resolution countdown

Entry flow: user sees their Stars balance → picks side → picks amount → sees projected payout → confirms → transaction signed via Privy embedded wallet → position cNFT minted → pool updates.

### Resolution Engine

Markets resolve via three pathways:

1. **Automated oracle resolution (highest priority)** — Sky Oracle for weather-conditional markets, Open-Meteo API for direct weather, NOAA Kp index API for aurora and geomagnetic events, astronomy-engine for deterministic celestial mechanics.

2. **Claude Vision photo-verification** — for markets like "Will 5 traders successfully photograph aurora this week?", users submit photos, Claude Vision classifies, resolution aggregates.

3. **Trusted oracle resolution** — IMO peak reports, SpaceX launch outcomes, solar flare class announcements. Manually resolved by the Stellar team from official sources. Every manual resolution links to the source document in the UI. v2 migrates as many as possible to Pyth/Switchboard.

A resolution cron runs hourly, checks markets past close-time, fetches oracle data, calls the on-chain `resolve_market` instruction with the outcome.

### ASTRA AI Market Analyst

Stellar's killer differentiator. ASTRA (your existing Claude-powered chat) gets a new `research_market` tool. User asks:

*"Is YES on the Tbilisi Jupiter transit market a good bet?"*

ASTRA pulls:
- Live weather forecast for Tbilisi
- Historical cloud cover base rate for April nights in that location
- Jupiter's exact altitude/azimuth at the stated time (astronomy-engine)
- Current market odds
- Implied probability vs ASTRA's estimated true probability

Returns: reasoned analysis with confidence level, highlights what factors could shift the outcome, explicit note that it's analysis not financial advice.

No other prediction market has an AI domain analyst built in. For users new to sky/weather markets, this is the feature that makes them competent bettors.

### Sky Missions (reframed, not removed)

Your existing sky observation missions continue to exist. They now serve a specific role: **Stars generation**. Users photograph the Moon, Jupiter, Orion Nebula, and other targets to earn Stars they can then stake on markets. Observation = onboarding funnel into the prediction market loop.

Each completed mission mints a cNFT attestation as before (Bubblegum) and awards Stars. The new twist: Stars now have on-chain utility beyond a loyalty point.

### Supporting Features (existing, kept)

- **Sky Score (0-100)** — homepage indicator, now also context for market discoverability
- **Tonight's Highlights** — auto-generated summary of what's happening, each highlight becomes a potential market
- **Events Calendar** — upcoming astronomical and weather events, each generates one or more markets
- **Dark Sky Map** — location-specific sky quality, feeds market context
- **NFT Gallery (rebranded "Position Portfolio")** — shows user's active positions, resolved positions, and mission attestations all as cNFTs
- **Knowledge Quizzes** — earn Stars by learning about sky science and market mechanics

### Astroman Redemption (optional, not critical)

Users with large Stars balances can redeem for Astroman.ge discount codes — telescopes, moon lamps, accessories. This exists as a "bonus round" for power users. Not central to the hackathon pitch, but a genuine unique feature nobody else has.

---

## Technical Architecture

### On-chain (Solana Devnet)

- **Stellar Markets Program** (Anchor) — binary markets, parimutuel payouts, PDA-owned vaults, Stars SPL token integration. Forked from `SivaramPg/solana-simple-prediction-market-contract` (open-source, 48 tests, proven pattern)
- **Bubblegum cNFTs** — position tokens (~$0.000005 per mint via compression), existing Helius + Metaplex integration
- **Stars SPL Token** — existing, used as the position-staking currency
- **PDA-controlled vaults** — each market has its own vault PDA that holds all Stars staked on that market until resolution

### Off-chain

- **Next.js 15 / React 19 / TypeScript** — existing
- **Privy embedded wallets** — existing, users sign market transactions without seeing them
- **Claude API** — ASTRA research tool + photo verification + resolution assistant
- **Sky Oracle** — existing deterministic hashing layer, now a market resolver
- **Open-Meteo + astronomy-engine** — existing data sources, now feed oracle resolution
- **Neon Postgres + Drizzle** — existing, adds a `markets` table caching on-chain state for fast UI queries
- **Helius DAS API** — existing, now queries user's position portfolio
- **Resolution cron** — Vercel Cron or similar, runs every hour, checks markets past close, fetches oracle data, calls `resolve_market` on-chain

### Oracle Sources

- **Sky Oracle (internal)** — cloud cover, visibility, sky conditions at specific coordinates
- **Open-Meteo API** — weather forecasts and current conditions globally
- **astronomy-engine library** — celestial mechanics (deterministic, no API call)
- **NOAA Kp Index API** — aurora and geomagnetic activity
- **NASA public APIs** — mission launches, space weather
- **Claude Vision** — photo verification for observational markets
- **IMO (International Meteor Organization)** — meteor shower peak reports (manual v1)
- **NWS/Weather.gov** — storm events, severe weather warnings
- **NOAA Space Weather** — solar flare classification

---

## Why This Wins Frontier 2026

1. **Crypto is structurally necessary** — passes the kill question cleanly
2. **Pattern-match to winning narrative** — Capitola ($25K, prediction markets), Fora (3rd place, prediction markets), Trepa ($25K Breakout, sentiment prediction) all validate the thesis
3. **Differentiation from Polymarket** — vertical (sky/weather/natural) + domain oracles + AI analyst + free-to-play onboarding is a combination nobody else has
4. **Distribution from day 1** — Astroman 60K audience + physical store + Tbilisi community is unique to this submission
5. **Demo moment** — markets that resolve **live during judging week** (Lyrids April 22-23, Jupiter transits, SpaceX launches, aurora events) create "holy shit, it actually works" beats no other submission can replicate
6. **Clear path beyond hackathon** — mainnet + USDC migration is a trivial upgrade; vertical expansion to storm chasing, birdwatching, fishing is the same protocol with new oracles
7. **Reuses existing infrastructure** — Sky Oracle is the resolver, cNFTs are position tokens, Privy is onboarding, Claude Vision is evidence verification, Stars is the currency, existing missions feed Stars into the system
8. **Honest about constraints** — devnet + Stars is a deliberate scope decision that lets the MVP ship, not a dodge of hard problems. This framing wins sophisticated judges

---

## Pitch (60 seconds)

> Polymarket is a $6 billion prediction market, and it will never list a market for whether the Lyrid meteor shower peak will exceed 15 ZHR next week. Not because the audience doesn't exist, but because mass-market platforms can't serve niche obsessive communities economically.
>
> Stellar is the prediction market protocol for sky, weather, and natural events. We ship domain oracles, AI-powered market analysis, and a vertical-native experience tuned to the communities that care — amateur astronomers, storm chasers, aurora hunters, meteorologists.
>
> Our MVP runs on Solana devnet with Stars tokens users earn through sky observations and quizzes. This removes regulatory friction, solves cold-start liquidity, and demonstrates the protocol end-to-end without asking users to risk real money. The same contract deploys to mainnet with USDC in v2 — the hard work was always the oracles and the resolution logic, which are proven.
>
> Distribution is Astroman.ge — Georgia's largest astronomy retailer with 60,000 social followers and a physical Tbilisi store. Our first thousand users come from a channel that already exists. Our first oracle vertical is done. Our subsequent verticals — storm chasing, birdwatching, fishing — are the same protocol plus a new oracle adapter.
>
> We're not competing with Polymarket. We're building the category below them.

---

## Roadmap

**Weeks 1-4 post-hackathon** — Community market creation (whitelisted users propose markets), Astroman email campaign to seed first 500 real users, blog post "Why niche prediction markets need domain oracles"

**Months 2-6** — Mainnet deployment with USDC + Stars dual currency, Pyth/Switchboard integration for on-chain oracle resolution, mobile PWA, second vertical launch (storm chasing or birdwatching)

**Months 6-12** — Third vertical, paid market creation for creators, tokenized liquidity provision, accelerator pitch (Colosseum or aligned Solana fund)

---

*Last updated: April 19, 2026 — devnet MVP in active development*
*Maintained by Rezi Modebadze*
