# STELLAR ✦ — Complete Project Document

**The night sky app — check, observe, earn, collect, spend.**

**Hackathon:** Colosseum Frontier 2026 (April 6 – May 11, 2026) · Consumer Track
**Builder:** Rezi (Revaz Modebadze) — founder of Astroman.ge, Georgia's first astronomy e-commerce store
**Live:** [stellarrclub.vercel.app](https://stellarrclub.vercel.app)
**GitHub:** [github.com/Morningbriefrezi/Stellar](https://github.com/Morningbriefrezi/Stellar)
**X:** [@StellarClub26](https://x.com/StellarClub26)

---

## What Stellar Is

Stellar answers one universal question: **"What can I see in the sky tonight?"**

It's a consumer night-sky app that gives every person — not just telescope owners — a reason to look up. Open the app, see tonight's Sky Score (0–100), check which planets are visible, learn when the next meteor shower is, and get AI-powered answers about anything overhead. No equipment needed.

For those who go deeper, Stellar turns real sky observations into verified on-chain discoveries. Point your camera at the Moon, Jupiter, or a deep-sky object. Claude Vision AI verifies what you captured. A Sky Oracle confirms clear conditions with a deterministic hash. A compressed NFT is minted to your wallet for ~$0.000005. You earn Stars tokens — a real SPL token on Solana — redeemable for physical telescope equipment at Astroman.ge in Tbilisi.

No wallets. No seed phrases. No gas fees. Sign up with email. Everything else is invisible Solana infrastructure.

---

## Who It's For

Stellar is designed in concentric circles of engagement:

**Circle 1 — Everyone (billions of potential users)**
Anyone who has ever looked at the sky and wondered what they're seeing. Photographers checking conditions for night shoots. Campers planning their evening. Parents deciding if tonight is a good stargazing night with the kids. Couples on a date who want to know which bright dot is Jupiter. The Sky Score, Tonight's Highlights, upcoming events calendar, and ASTRA AI serve this audience. No telescope, no account, no blockchain.

**Circle 2 — Curious observers (millions)**
People who create an account, check the sky daily, build a streak, take quizzes, and earn Stars passively. The daily check-in mechanic (1 Star per day, bonus at 7-day streak) and knowledge quizzes engage this layer. They may never complete an observation mission, but they accumulate Stars and engage with the marketplace.

**Circle 3 — Active stargazers (hundreds of thousands)**
People who complete observation missions — photographing the Moon (naked eye), Jupiter, the Pleiades, or deep-sky targets. Each verified observation mints a compressed NFT and awards Stars. They build an NFT collection, climb the leaderboard, and unlock milestone rewards.

**Circle 4 — Equipment buyers (tens of thousands)**
People who spend Stars at the Astroman marketplace for real products — telescopes, moon lamps, accessories. Or who redeem token-gated discount codes at the physical Astroman store. This is the revenue layer.

The key insight: **Circles 1 and 2 require no telescope and no blockchain knowledge.** They're the top of funnel. Circles 3 and 4 are the monetization layer. The app works at every level.

---

## Distribution Advantage

Stellar isn't starting from zero. It's backed by [Astroman.ge](https://astroman.ge) — Georgia's first astronomy e-commerce store.

- **60K+** social media followers across platforms
- **Physical retail** presence in Tbilisi
- **Active customer base** of telescope buyers
- **Real product inventory** powering the in-app marketplace
- Stars tokens are redeemable for real discounts and physical products at the store

This is the single strongest differentiator versus any other hackathon submission. No competitor has an existing business, existing customers, and a physical store that accepts their token.

Rezi previously placed 2nd at a Superteam Georgia hackathon, demonstrating established credibility within the Georgian Solana community.

---

## Core Features

### Sky Score (0–100)
A single number rating tonight's sky quality, computed from cloud cover, humidity, wind speed, moon illumination, and light pollution estimates. Updated in real time from Open-Meteo weather data and astronomy-engine moon calculations.

- 90–100: Perfect ✨ — pristine dark sky
- 70–89: Great 🌟 — excellent for observing
- 50–69: Good ⭐ — planets and bright objects visible
- 30–49: Fair 🌤️ — limited visibility
- 0–29: Poor ☁️ — stay inside

Displayed prominently on the homepage and /sky page. The first thing anyone sees when they open the app.

### Tonight's Highlights
Auto-generated summary of what's visible tonight from the user's location:
- Visible planets with rise/set times and viewing directions
- Moon phase and illumination percentage
- Best observation window (time range with reasoning)
- Upcoming astronomical events (meteor showers, eclipses, conjunctions)

Uses astronomy-engine for planet positions and a hardcoded catalog of 15+ major events for 2026.

### 7-Day Sky Forecast
Each day rated Go / Maybe / Skip based on cloud cover predictions from Open-Meteo. Includes daily Sky Score projections so users can plan their week.

### Planet Tracker
Real-time positions for Mercury, Venus, Mars, Jupiter, Saturn, and the Moon. Rise, transit, and set times. Altitude and direction. Calculated locally via astronomy-engine — no external API dependency.

### ASTRA — AI Astronomer
An AI companion powered by Claude API with real-time tool calling. ASTRA can:
- Call `get_planet_positions` to answer "What's visible tonight?"
- Call `get_sky_conditions` to answer "Is tonight good for stargazing?"
- Respond in English or Georgian based on user language
- Provide specific times, directions, and equipment recommendations

Accessible via:
- Full chat page at /chat
- Floating quick-ask widget on homepage, /sky, and /missions
- Suggested prompts: "What should I observe tonight?" · "Best time to see Jupiter?" · "Tell me about the Moon"

ASTRA never mentions it's Claude. It IS Stellar's astronomer.

### Observation Missions
Seven sky missions ranging from beginner to expert:

| Mission | Target | Equipment | Stars | Difficulty |
|---|---|---|---|---|
| The Moon | Lunar surface | Naked eye | 50 | Beginner |
| Pleiades (M45) | Star cluster | Naked eye | 60 | Beginner |
| Jupiter | Galilean moons | Telescope | 75 | Beginner |
| Orion Nebula (M42) | Deep sky | Telescope | 100 | Intermediate |
| Saturn | Ring system | Telescope | 100 | Intermediate |
| Andromeda Galaxy (M31) | Deep sky | Telescope | 175 | Hard |
| Crab Nebula (M1) | Supernova remnant | Telescope | 250 | Expert |

**Mission flow:**
1. User taps "Start" on a mission
2. Mission briefing with observation hints
3. User goes outside, captures photo via camera or upload
4. Claude Vision API verifies the image (rejects screenshots, AI-generated images, daytime photos)
5. Sky Oracle (Open-Meteo) confirms clear conditions + generates deterministic oracle hash
6. If cloud cover < 60%: compressed NFT minted on Solana via Metaplex Bubblegum
7. Stars SPL tokens awarded to user's wallet
8. "Discovery Sealed" success screen with Solana Explorer link + share button

### Knowledge Quizzes
Three quiz categories, 10 questions each, available in English and Georgian:
- Solar System — 10 Stars per correct answer
- Constellations — 10 Stars per correct answer
- Telescopes — 10 Stars per correct answer

Quizzes require no equipment, no nighttime, no going outside. Playable anywhere, anytime.

### Daily Sky Check-In
Open the app → see tonight's Sky Score → tap "I checked tonight's sky ✓" → earn 1 Star. Seven consecutive days earns a 10-Star bonus. Miss a day, streak resets.

This is the Duolingo mechanic for the night sky. It gives Circle 1 and 2 users a reason to open the app every single day without requiring any observation equipment or effort.

### Upcoming Astronomical Events
Calendar of major sky events with location-specific visibility predictions:
- Lyrid Meteor Shower (April 22)
- Eta Aquariid Meteor Shower (May 5)
- Planetary conjunctions, eclipses, and rare events through December 2026

For each event: date, peak time, viewing direction, and a YES/MAYBE/NO visibility prediction based on the user's location and forecast weather.

### Shareable Sky Cards
Auto-generated images (via Next.js ImageResponse) showing tonight's Sky Score, visible planets, and location. Designed for Instagram Stories, WhatsApp, and X sharing. Includes the Web Share API with fallback to Twitter intent.

The viral growth engine: "Tonight's Sky in Tbilisi: 87/100 ✨ — Jupiter visible until midnight 🪐"

### NFT Gallery
All compressed observation NFTs owned by the user's wallet, fetched via Helius DAS API (`getAssetsByOwner`). Each NFT card shows:
- Unique dynamically-generated image (seeded star field from oracle hash + target emoji)
- Target object, date, location, cloud cover, Stars earned
- Link to Solana Explorer

### Marketplace (Astroman Products)
Real products from Astroman.ge with GEL pricing:
- Telescopes: Bresser, National Geographic, Celestron (7 models)
- Moon Lamps: 15cm, 20cm
- Projectors: Galaxy, star ceiling
- Accessories: Eyepiece kits, filters, tripods

Stars redemption tiers:
| Stars | Reward |
|---|---|
| 250 ✦ | Free Moon Lamp |
| 500 ✦ | 10% telescope discount |
| 1000 ✦ | 20% telescope discount |

When Stars are redeemed, they are burned (removed from circulation), creating deflationary pressure on the token supply.

### Leaderboard
Observer rankings by missions completed and Stars earned. Time filter tabs: This Week / This Month / All Time. Your position highlighted.

### Dark Sky Network
Light pollution data for Georgia with Bortle scale readings. Locations: Tbilisi, Kazbegi, Mestia, Kutaisi, Batumi, Borjomi. Foundation for a future crowdsourced DePIN dark sky map.

### Rank Progression
| Rank | Requirement |
|---|---|
| Stargazer | 0 missions |
| Observer | 1+ missions |
| Pathfinder | 3+ missions |
| Celestial | 5+ missions |

### Milestone Rewards
| Reward | Requirement | Value |
|---|---|---|
| First Light | Complete 1 mission | 10% off astroman.ge |
| Lunar Explorer | Observe the Moon | Free Moon Lamp (85 GEL) |
| Celestial | Complete 5 missions | Free custom framed star map (180 GEL) |
| Galaxy Hunter | Observe Andromeda | 100 GEL store voucher |
| Supernova Master | Capture Crab Nebula | Brand new telescope |

All rewards redeemable at the physical Astroman store in Tbilisi.

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| Animations | CSS keyframes only (no JS animation loops) |
| i18n | next-intl — English + Georgian |
| State | Custom `useAppState` hook (React context + localStorage) |
| Icons | lucide-react |

### Backend
| Layer | Technology |
|---|---|
| API | Next.js Route Handlers (Edge-compatible) |
| Database | Neon (serverless Postgres) via Drizzle ORM |
| AI Chat | Claude API (claude-sonnet-4-6) with tool calling |
| AI Verification | Claude Vision API (multimodal image analysis) |
| Weather/Sky | Open-Meteo API (free, no key) |
| Planet Math | astronomy-engine (local JS, no external API) |
| OG Images | Next.js ImageResponse (dynamic NFT + share cards) |
| Rate Limiting | In-memory middleware |

### Auth & Wallets
| Layer | Technology |
|---|---|
| Auth | Privy SDK (@privy-io/react-auth) |
| Login | Email, Google, SMS |
| Wallets | Privy embedded Solana wallets — auto-created on signup |
| Principle | No Phantom, no wallet-adapter, no seed phrases, no gas |

### Blockchain (Solana)
| Layer | Technology |
|---|---|
| Network | Solana devnet (mainnet after hackathon) |
| RPC | Helius (fallback: public devnet) |
| NFT Minting | Metaplex Bubblegum + Umi (compressed NFTs) |
| Token | Custom STARS SPL token (0 decimals) |
| Proofs | Solana Memo program (observation data on-chain) |
| Indexing | Helius DAS API (getAssetsByOwner) |
| Fees | Server-side fee payer covers all gas — users pay nothing |
| Cost | ~$0.000005 per compressed NFT mint |

### Infrastructure
| Layer | Technology |
|---|---|
| Deploy | Vercel (auto-deploy from main) |
| DB | Neon serverless Postgres |
| Secrets | Vercel env vars + .env.local |

### Ecosystem Integrations
Built with: Metaplex Bubblegum · Helius DAS · Privy · Open-Meteo · Claude API · Colosseum Copilot · Jupiter (price feed) · astronomy-engine

---

## Where and Why Blockchain Is Used

| What | Where | Why blockchain and not a regular database |
|---|---|---|
| **Embedded wallet** | Privy auto-creates on signup | Every user gets a real Solana address without knowing it — portable, self-custodied identity |
| **Observation NFTs** | Bubblegum cNFT per verified observation | Permanent, portable proof that survives app shutdown. Verifiable by anyone on Explorer. Costs $0.000005 |
| **Stars token** | SPL token minted on mission completion | Transparent balance verifiable on-chain. Can't be fabricated. Enables redemption validation without trusting the server |
| **Oracle hash** | SHA-256 of (location, cloud cover, hour) embedded in NFT metadata | Tamper-evidence. Proves sky conditions at observation time were independently sourced from Open-Meteo |
| **Gasless UX** | Server fee payer covers all transactions | Users never need SOL. True consumer experience. Invisible blockchain |
| **Token burn** | Stars burned on redemption | Deflationary mechanics. On-chain burn is transparent and verifiable |

**The pitch-ready version:** "Without Solana, your observation history lives in our database — if we shut down, it's gone. With compressed NFTs, your discoveries live in your wallet forever. Without an SPL token, your Stars are just a number we can change. With Stars on-chain, your balance is verifiable and your rewards are real."

---

## Stars Token — Tokenomics Design

### Earn Mechanisms
| Action | Stars Earned | Frequency |
|---|---|---|
| Daily sky check-in | 1 | Once per day |
| 7-day streak bonus | 10 | Once per week |
| Quiz correct answer | 10 | Per question (30 questions total) |
| Moon observation | 50 | Once |
| Pleiades observation | 60 | Once |
| Jupiter observation | 75 | Once |
| Saturn observation | 100 | Once |
| Orion Nebula observation | 100 | Once |
| Andromeda observation | 175 | Once |
| Crab Nebula observation | 250 | Once |

### Spend Mechanisms
| Action | Stars Cost | Type |
|---|---|---|
| Moon Lamp discount code | 250 | Burn |
| 10% telescope discount | 500 | Burn |
| 20% telescope discount | 1000 | Burn |
| Premium ASTRA queries (future) | 5 per query | Burn |
| NFT card customization (future) | 50 | Burn |
| Leaderboard boost (future) | 100/week | Burn |

### Token Properties
- **Decimals:** 0 (whole Stars only)
- **Mint authority:** Server-side fee payer (no user-initiated minting)
- **Burn on spend:** When Stars are redeemed, they are burned via SPL burn instruction
- **Supply:** Uncapped on devnet, will be capped on mainnet based on user growth projections
- **Network:** Solana devnet (SPL Token standard)

### Token Flow
```
User completes action
  → Server validates (mission verified, quiz correct, streak valid)
  → Server calls mintTo(user's ATA, amount)
  → Stars appear in user's wallet (on-chain, verifiable)
  → User redeems at marketplace
  → Server validates on-chain balance ≥ cost
  → Server generates discount code
  → Server calls burn(user's ATA, amount)
  → Stars permanently removed from supply
```

---

## All Routes

### Pages
| Route | Description | Auth Required |
|---|---|---|
| `/` | Homepage — Sky Score, Tonight's Highlights, How It Works, CTAs | No |
| `/sky` | 7-day forecast, planet tracker, Sky Score, upcoming events | No |
| `/chat` | ASTRA AI full chat interface | No |
| `/missions` | Mission list, quizzes, rewards, observation log | Partial (missions need auth) |
| `/observe` | Camera observation flow | Yes |
| `/marketplace` | Astroman product grid, Stars redemption | Partial |
| `/profile` | Stars balance, rank, stats, wallet, sign out | Yes |
| `/nfts` | Compressed NFT gallery | Yes |
| `/leaderboard` | Observer rankings | No |
| `/darksky` | Dark Sky Network / light pollution map | No |
| `/club` | Membership onboarding (3-step) | Yes |
| `/observations` | Full observation history | Yes |
| `/proof` | Individual observation proof details | No |

### API Routes
| Route | Method | Purpose |
|---|---|---|
| `/api/sky/score` | GET | Sky Score (0–100) with breakdown |
| `/api/sky/tonight` | GET | Tonight's highlights, visible planets, best window |
| `/api/sky/forecast` | GET | 7-day Open-Meteo forecast |
| `/api/sky/planets` | GET | Planet positions via astronomy-engine |
| `/api/sky/sun-moon` | GET | Sunrise/sunset/moonrise/moonset |
| `/api/sky/verify` | GET | Sky conditions + deterministic oracle hash |
| `/api/chat` | POST | Claude AI streaming (ASTRA, tool calling) |
| `/api/observe/verify` | POST | Claude Vision photo verification |
| `/api/observe/log` | POST | Log observation to DB + award Stars |
| `/api/observe/history` | GET | User's observation history |
| `/api/mint` | POST | Mint compressed NFT (Bubblegum) |
| `/api/metadata/observation` | GET | NFT metadata JSON (Metaplex-compatible) |
| `/api/metadata/collection` | GET | Collection-level metadata |
| `/api/award-stars` | POST | Server-side Stars SPL minting |
| `/api/stars-balance` | GET | Read on-chain SPL balance |
| `/api/redeem-code` | POST | Validate balance → generate discount code → burn Stars |
| `/api/products` | GET | Product catalog |
| `/api/price/sol` | GET | SOL/USD via Jupiter |
| `/api/streak` | GET | Check-in streak calculation |
| `/api/club/activate` | POST | Club membership activation |
| `/api/og/sky` | GET | Static app OG image |
| `/api/og/tonight` | GET | Dynamic tonight's sky OG image |
| `/api/og/observation` | GET | Dynamic per-NFT image (seeded star field) |

---

## Security & Rate Limiting

- `/api/chat` — 10 req/min per IP
- `/api/observe/verify` — 5 req/min per IP
- `/api/mint` — 1 mint per wallet+target per hour
- `/api/redeem-code` — validates on-chain balance before issuing code
- `/api/award-stars` — validates amount 1–1000, reason required
- Photo anti-cheat: Claude rejects screenshots, AI-generated images, daytime photos
- Sky oracle: cloud cover > 70% blocks minting
- Oracle hash: deterministic per location per hour (reproducible, tamper-evident)
- Daily check-in: 1 per wallet per calendar day (DB constraint)

---

## Database Schema (Neon/Postgres via Drizzle)

```sql
observation_log
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  wallet        TEXT NOT NULL
  target        TEXT NOT NULL
  stars         INTEGER NOT NULL
  confidence    TEXT NOT NULL       -- high / medium / low / minted
  mint_tx       TEXT                -- Solana tx hash (nullable)
  created_at    TIMESTAMPTZ DEFAULT now()

checkin_log
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  wallet        TEXT NOT NULL
  checked_at    DATE NOT NULL       -- one per wallet per day
  streak        INTEGER DEFAULT 1
  UNIQUE(wallet, checked_at)
```

---

## Navigation

**Desktop nav:** Sky · Missions · ASTRA · Marketplace · Profile
**Mobile bottom nav:** Sky · Missions · [Home ✦] · ASTRA · Profile
**Footer:** Sky · Missions · ASTRA · Marketplace · Dark Sky · Astroman ↗
**Floating:** ASTRA quick-ask widget (homepage, /sky, /missions)

All inner pages display Stellar branding. Astroman logo appears only on the marketplace page as a partner badge.

---

## Environment Variables

```bash
# Auth
NEXT_PUBLIC_PRIVY_APP_ID=cmnnk6n2c002d0cl47skaaz0d

# AI
ANTHROPIC_API_KEY=

# Database
DATABASE_URL=                          # Neon connection string

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
FEE_PAYER_PRIVATE_KEY=                 # Server wallet, base58, covers all gas
MERKLE_TREE_ADDRESS=                   # Bubblegum tree (set by setup:bubblegum)
COLLECTION_MINT_ADDRESS=               # Collection mint (set by setup:bubblegum)
STARS_TOKEN_MINT=                      # SPL token mint (set by setup:token)

# Client-exposed
NEXT_PUBLIC_COLLECTION_MINT_ADDRESS=   # Copy from COLLECTION_MINT_ADDRESS
NEXT_PUBLIC_HELIUS_RPC_URL=            # From helius.dev free tier
NEXT_PUBLIC_APP_URL=https://stellarrclub.vercel.app

# Optional
INTERNAL_API_SECRET=                   # Bearer token for /api/mint
```

---

## Roadmap

### Phase 1 — Hackathon MVP (Now → May 11, 2026) ✅
- [x] Sky Score + Tonight's Highlights
- [x] 7-day forecast + planet tracker
- [x] ASTRA AI with tool calling + floating widget
- [x] 7 observation missions with Claude Vision verification
- [x] Sky Oracle with deterministic hash
- [x] Compressed NFT minting (Bubblegum)
- [x] Stars SPL token (deploy, award, balance)
- [x] NFT gallery with Helius DAS
- [x] Dynamic NFT images (seeded star field per observation)
- [x] Shareable sky cards + OG images
- [x] Daily check-in streak
- [x] 3 knowledge quizzes (EN + Georgian)
- [x] Astroman marketplace with Stars redemption + burn
- [x] Leaderboard with real data
- [x] Unified Stellar branding across all pages
- [x] Mobile-first design
- [x] Bilingual (English + Georgian)

### Phase 2 — Post-Hackathon (May – August 2026)
**Mainnet deployment + token launch**
- [ ] Deploy to Solana mainnet
- [ ] Migrate Stars token with capped supply
- [ ] Production Helius RPC
- [ ] Real SOL/USDC payments at marketplace checkout
- [ ] Push notifications for clear sky nights
- [ ] Upcoming events auto-populated from astronomical databases
- [ ] ASTRA premium tier (5 Stars per deep-dive question)
- [ ] Full referral system (invite → both earn Stars on first mission)
- [ ] Real-time leaderboard from DB with weekly/monthly resets

### Phase 3 — Community Growth (September – December 2026)
**Network effects + community features**
- [ ] Telescope Lending Circle: owners list equipment, borrowers earn NFTs together
- [ ] Early Bird Marketplace: Nomu-style rewards for supporting new product listings
- [ ] Dark Sky DePIN: crowdsourced Bortle readings via Claude Vision zenith photos, global light pollution map
- [ ] NFT card customization (spend Stars to unlock designs)
- [ ] Community events: coordinated observation nights with bonus Stars
- [ ] Constellation AR guide (point phone at sky → see constellation outlines)
- [ ] Age gate: Explorer Mode for young astronomers with parental controls

### Phase 4 — Platform Expansion (2027+)
**From app to protocol**
- [ ] Stellar Sky Data API: expose Sky Score, planet positions, and observation data as a public API for other Solana apps
- [ ] Partner store integration: other astronomy retailers accept Stars
- [ ] Name a Star NFT: premium product where users name a cataloged star and mint a collectible
- [ ] Observation challenges: time-limited community missions (observe the ISS this weekend, comet viewing events)
- [ ] Global expansion: localization beyond EN/KA, partner stores in other countries
- [ ] Telescope image provenance: RAW file hash on-chain for serious astrophotographers
- [ ] Star token governance: community votes on new missions, marketplace products, and feature priorities

---

## Business Model

### Revenue Streams (Current)
1. **Marketplace affiliate revenue:** Users discover products in Stellar → purchase at Astroman.ge
2. **Token-gated discount codes:** Stars redemption drives repeat purchases at higher frequency than organic
3. **Stars as customer acquisition cost:** Each Star costs ~$0 to mint (devnet). On mainnet, server gas is negligible. Stars function as a loyalty program with on-chain transparency.

### Revenue Streams (Planned)
4. **ASTRA premium queries:** Free tier + 5 Stars per deep-dive (creates token demand + direct revenue)
5. **Partner retailer fees:** Other astronomy stores pay to be listed in the marketplace and accept Stars
6. **Early Bird product fees:** Small platform fee on Nomu-style early-supporter reward pools
7. **Name a Star NFT:** Premium collectible product with high margin
8. **Sky Data API:** B2B licensing of Sky Score and observation data to weather apps, travel platforms, event planners

### Unit Economics
- Cost to mint 1 cNFT: ~$0.000005
- Cost to mint Stars: negligible gas
- Cost per ASTRA query: ~$0.003 (Claude API)
- Value of 250 Stars redemption: 85 GEL Moon Lamp (~$30)
- Earning 250 Stars requires: ~5 missions + daily check-ins over 2 weeks
- Result: Engaged user spends 2 weeks building habit → converts to physical product purchase

---

## Why Blockchain? (For Non-Crypto Audiences)

**Without Solana:**
- Your observation history lives in our database. If we shut down, it's gone.
- Your Stars are a number we control. We could change it.
- Your achievements are screenshots. Nobody can verify them.

**With Solana:**
- Your observation NFTs live in YOUR wallet. Portable, permanent, verifiable by anyone.
- Your Stars are real tokens with a public balance. Transparent and immutable.
- Your oracle hash proves the sky conditions were independently verified at observation time.
- Compressed NFTs cost $0.000005 each. We can mint millions.
- You never see a wallet, never pay gas, never sign a transaction. Privy handles everything.

**The shortest version:** "Blockchain makes your night sky discoveries permanent, portable, and provable — and you never have to think about it."

---

*Last updated: April 15, 2026*
*Stellar is submitted to the Colosseum Frontier 2026 hackathon, Consumer Track.*
*Built by Rezi — founder of Astroman.ge, Georgia's first astronomy e-commerce store.*
