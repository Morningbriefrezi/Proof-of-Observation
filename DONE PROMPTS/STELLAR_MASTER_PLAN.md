# STELLAR — Master Execution Plan (Apr 14 → May 11, 2026)

## The Self-Interrogation: Where The Previous Strategy Was Wrong

Before building prompts, I need to be honest about what the previous analysis got wrong or didn't question hard enough.

### Blind Spot #1: "60K amateur astronomers in Georgia" is a fiction

The Astroman social following is real. But "60K amateur astronomers" overstates the addressable market by 10x. Most followers are casual — they liked a pretty moon photo, not people who own telescopes. The pitch needs to be honest: "Astroman has 60K social followers and a core customer base of telescope buyers. Stellar is designed for EVERYONE who has ever looked up at the sky — you don't need a telescope to use it."

**The fix:** Reframe from "astronomy app for enthusiasts" to "the night sky app for everyone, with depth for enthusiasts." The Moon mission is naked-eye. Constellations are naked-eye. The sky forecast is useful for anyone going outside at night — photographers, campers, couples on a date. Only the deep-sky missions require equipment.

### Blind Spot #2: The app is too telescope-centric for a Consumer track win

Every Cypherpunk Consumer winner had mass-market appeal: Capitola (anyone who bets), Superfan (anyone who likes music), Toaster (anyone who trades), Rekt (anyone curious about crypto trading), Nomu (anyone who shops). "Amateur astronomy" sounds niche. "Tonight's sky" sounds universal.

**The fix:** The homepage, pitch, and first-user experience must appeal to someone who has NEVER owned a telescope. The hook is: "What can I see in the sky tonight?" That's a question billions of people have asked. The telescope marketplace and deep-sky missions are the monetization layer, not the top of funnel.

### Blind Spot #3: The previous prompt sequence is too linear and fragile

Prompts 2-10 form a strict dependency chain. If Prompt 3 breaks (Bubblegum minting), Prompts 4-10 are blocked. A solo builder with 27 days cannot afford a single 2-day blocker. The architecture needs parallel workstreams.

**The fix:** Restructure into 3 independent tracks that can progress in parallel:
- **Track A:** Core loop (observe → verify → mint → done) — Prompts 2-4
- **Track B:** Token + gallery + profile — Prompts 5-6, can be built with simulated data first
- **Track C:** Polish, audience expansion, and submission assets — new prompts

### Blind Spot #4: No "wow moment" for non-crypto judges

Judges evaluate hundreds of submissions. The current flow is: sign up → see forecast → start mission → take photo → wait → get NFT. That's a 5-minute journey before any payoff. Judges will give you 60 seconds.

**The fix:** The FIRST screen after login needs a "wow" within 5 seconds. "Tonight in Tbilisi: Jupiter is rising at 9:14 PM, the Milky Way peaks at midnight, and there are 3 active missions you can complete right now." The sky data IS the hook, not the blockchain.

### Blind Spot #5: ASTRA (AI chat) is buried and underutilized

Claude tool calling with live sky data is one of Stellar's most impressive technical features, but it's hidden behind a nav link. No winner buried their best feature. Capitola's aggregation WAS the homepage. Rekt's gamification WAS the first screen.

**The fix:** ASTRA should be accessible from everywhere — a floating button, a quick-ask bar on the sky page, a suggestion after mission completion. "Ask ASTRA: What should I observe tonight?" is a universal entry point that works for astronomers AND casual users.

### Blind Spot #6: The "everyone" hook is missing

What makes a non-astronomer open this app? Right now: nothing. The sky forecast is useful but not shareable. The missions require going outside at night. There's no casual engagement path.

**The new features that solve this (minimal effort, maximum audience expansion):**

1. **"Tonight's Sky" shareable card** — A beautiful, auto-generated card showing tonight's highlights for your location. Moon phase, visible planets, meteor shower alerts. Shareable to Instagram Stories, WhatsApp, X. This is the viral loop. Someone shares "Tonight in Tbilisi: Jupiter + Saturn visible, 12% cloud cover 🌙" and their friend downloads the app.

2. **"Sky Score" for tonight** — A single number 0-100 rating how good tonight's sky is. Like a UV index but for stargazing. "Tonight's Sky Score: 87/100 — GO!" This is dead simple to compute from existing Open-Meteo data and gives everyone a reason to check the app daily.

3. **Constellation guide (naked eye)** — "Point your phone at the sky" is something every human can do. A simple list of "constellations visible tonight from your location" with viewing directions. No telescope needed. No AR needed. Just: "Look southeast at 10 PM for Scorpius."

4. **Moon phase tracker** — Everyone cares about the Moon. Full moon dates, new moon dates, current phase. This is the "weather app" equivalent — people check it habitually.

5. **Astronomical events calendar** — "Next meteor shower: April 22 (Lyrids). Next eclipse visible from your location: ..." This drives retention without requiring any astronomy knowledge.

These features use data Stellar already has (astronomy-engine, Open-Meteo). They require no blockchain. They're the top of funnel that converts casual users into mission-completers who earn NFTs and spend Stars.

---

## The Revised Architecture: Three Parallel Tracks

```
TRACK A — Core Blockchain Loop (Must work by Apr 23)
  Clean up → Sky Oracle → Mint NFT → Success screen
  This is the backbone. Without it, there's nothing to demo.

TRACK B — Token + Gallery + Profile (Must work by Apr 27)
  Stars token → Award endpoint → Profile balance → NFT gallery
  Can be built in parallel with simulated mint data.

TRACK C — Audience Expansion + Polish + Submission (Apr 17 → May 11)
  Sky Score → Tonight's card → Share flow → ASTRA upgrade →
  Branding fix → README → Pitch video → Submission
  This is what turns a working app into a winning one.
```

---

## COMPLETE PROMPT SERIES (Prompts 1-15)

> Prompt 1 is already complete (Bubblegum tree + collection setup).
> The prompts below replace and extend the previous Prompt 2-10 series.
> Each prompt is self-contained. Run one per Claude Code conversation.
> Prompts marked ★ are on the critical path. Others can be reordered.

---

## TRACK A — CORE BLOCKCHAIN LOOP

---

### ★ PROMPT 2 — Clean Codebase: Remove Fakes, Add Sky Oracle

**Priority:** 🔴 Critical — everything depends on this
**Time estimate:** 1 Claude Code session (~30 min)
**Depends on:** Prompt 1 complete

```
I'm building Stellar, a Next.js 15 astronomy app. Two fake third-party libraries (farmhawk.ts and pollinet.ts) need to be removed and replaced with honest, cleaner alternatives.

Farmhawk was a fake "satellite oracle" that actually just called Open-Meteo directly.
Pollinet was a fake "mesh relay" with an IndexedDB offline queue.

Replacements:
- Sky Oracle: a server-side API route that calls Open-Meteo, computes a deterministic hash, and returns sky conditions. No fake branding.
- Offline handling: removed entirely. If !navigator.onLine, show an error and let the user retry.

Read all of these files before writing anything:
  src/lib/farmhawk.ts
  src/lib/pollinet.ts
  src/lib/types.ts
  src/components/sky/Verification.tsx
  src/components/sky/MissionActive.tsx
  src/app/missions/page.tsx
  src/lib/constants.ts

---

Step 1 — Update src/lib/types.ts:

Replace the FarmHawkResult interface with SkyVerification:
  export interface SkyVerification {
    verified: boolean
    cloudCover: number
    visibility: 'Excellent' | 'Good' | 'Fair' | 'Poor'
    conditions: string
    humidity: number
    temperature: number
    windSpeed: number
    oracleHash: string
    verifiedAt: string
  }

Remove PollinetStatus entirely.

Update CompletedMission:
  - Change: farmhawk: FarmHawkResult | null  →  sky: SkyVerification | null
  - Remove: pollinet: { mode: 'direct' | 'mesh' | 'queued'; peers: number }
  - Keep status: 'completed' | 'pending'

---

Step 2 — Create src/app/api/sky/verify/route.ts:

GET handler reading query params: lat, lon (required, numbers).
Validation: if missing or not finite, return 400.

Logic:
1. Call Open-Meteo:
   `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=cloud_cover,visibility,relative_humidity_2m,temperature_2m,wind_speed_10m&timezone=auto`

2. Parse response:
   cloudCover = current.cloud_cover ?? 15
   visMeters = current.visibility ?? 20000
   humidity = current.relative_humidity_2m ?? 50
   temperature = current.temperature_2m ?? 12
   windSpeed = current.wind_speed_10m ?? 5

3. Visibility rating:
   Excellent: visMeters > 20000 && cloudCover < 20
   Good: visMeters > 10000 && cloudCover < 50
   Fair: visMeters > 5000 && cloudCover < 70
   Poor: otherwise

4. Build conditions string (same logic as old farmhawk)

5. Oracle hash (deterministic per location per hour):
   const hourSlot = Math.floor(Date.now() / 3600000)
   const hashInput = `${Number(lat).toFixed(4)},${Number(lon).toFixed(4)},${cloudCover},${hourSlot}`
   const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashInput))
   const oracleHash = '0x' + Array.from(new Uint8Array(hashBuffer)).slice(0, 20).map(b => b.toString(16).padStart(2, '0')).join('')

6. Return SkyVerification JSON:
   { verified: cloudCover < 60, cloudCover, visibility, conditions, humidity, temperature, windSpeed, oracleHash, verifiedAt: new Date().toISOString() }

On Open-Meteo failure: fallback with verified: true, cloudCover: 15.

---

Step 3 — Update src/components/sky/Verification.tsx:

- Replace: farmhawk: FarmHawkResult → sky: SkyVerification
- Remove: pollinet: PollinetStatus, onQueueOffline: () => void
- Replace all farmhawk.* with sky.*
- Remove offlineMode state, Pollinet toggle, "Oracle receipt" dropdown
- Add single info badge: "Sky Oracle · Open-Meteo · {time}"
- CTA button always calls onMint: "Seal on Solana  ✦ +${stars}"
- Remove Wifi/WifiOff imports

---

Step 4 — Update src/components/sky/MissionActive.tsx:

- Remove farmhawk/pollinet imports, state, and handlers
- Replace handleCapture to call /api/sky/verify instead of verifyWithFarmHawk
- Update handleMint to use sky.cloudCover and sky.oracleHash
- Update Verification component props
- Update addMission call: sky: sky!, remove pollinet field
- Add offline check: if !navigator.onLine show error

---

Step 5 — Update src/app/missions/page.tsx:

- Remove initPollinetSync import and useEffect
- Remove syncToast state and JSX

---

Step 6 — Update src/lib/constants.ts:

- Remove farmhawk and pollinet from SPONSORS
- Change oracle to 'open-meteo-v1' in AGENT_META
- Remove platform: 'cyreneai'

---

Step 7 — Delete src/lib/farmhawk.ts and src/lib/pollinet.ts

Verify no remaining imports before deleting.
```

---

### ★ PROMPT 3 — Server-Side Compressed NFT Minting

**Priority:** 🔴 Critical
**Time estimate:** 1 session (~30 min)
**Depends on:** Prompt 1 (Bubblegum tree created), Prompt 2

```
I'm building Stellar, a Next.js 15 + Solana astronomy app. I need a server-side compressed NFT minting function and API routes.

Read these files first:
  src/lib/solana.ts
  src/lib/types.ts

---

Step 1 — Create src/lib/mint-nft.ts (server-only):

Import bs58, createUmi, keypairIdentity, generateSigner, percentAmount, publicKey as toPublicKey from umi/bubblegum/token-metadata packages.

Export interface ObservationMintParams {
  userAddress: string | null
  target: string
  timestampMs: number
  lat: number
  lon: number
  cloudCover: number
  oracleHash: string
  stars: number
}

Export async function mintCompressedNFT(params): Promise<{ txId: string }>

Implementation:
  - Validate env vars: FEE_PAYER_PRIVATE_KEY, MERKLE_TREE_ADDRESS, COLLECTION_MINT_ADDRESS
  - Create UMI instance with devnet RPC
  - Decode fee payer from base58, set as identity
  - Recipient = userAddress if provided, else fee payer
  - NFT name: "Stellar: ${target}"
  - URI: "${APP_URL}/api/metadata/observation?target=...&ts=...&lat=...&lon=...&cc=...&hash=...&stars=..."
  - mintV1 with leafOwner, merkleTree, collectionMint, metadata
  - Return { txId: bs58.encode(signature) }

---

Step 2 — Create src/app/api/mint/route.ts:

POST handler. JSON body with: userAddress, target, timestampMs, lat, lon, cloudCover, oracleHash, stars.

Validation: target non-empty, timestampMs positive, cloudCover 0-100 (reject >70), lat -90 to 90, lon -180 to 180, stars positive integer.

Call mintCompressedNFT, return { txId, explorerUrl }.
On error: 500 { error: message }.

---

Step 3 — Create src/app/api/metadata/observation/route.ts:

GET handler reading URLSearchParams: target, ts, lat, lon, cc, hash, stars.

Return Metaplex-compatible JSON metadata with name, description, image (static placeholder), external_url, and attributes array including Target, Date, Location, Cloud Cover, Oracle Hash, Stars Earned.

Do not touch existing files.
```

---

### ★ PROMPT 4 — Wire Mission → Real Mint + Success Screen

**Priority:** 🔴 Critical
**Time estimate:** 1 session (~45 min)
**Depends on:** Prompts 2 + 3

```
I'm building Stellar. The observation flow in MissionActive.tsx currently calls a simulated mintObservation(). Replace it with a real POST to /api/mint and add a proper success screen.

Read these files fully:
  src/components/sky/MissionActive.tsx
  src/app/missions/page.tsx
  src/lib/types.ts

---

Changes to src/components/sky/MissionActive.tsx:

1. Remove mintObservation import from solana.ts. Remove Connection/PublicKey imports.
   Add state: const [mintTxId, setMintTxId] = useState('')
   Import ExternalLink from lucide-react, useRouter from next/navigation.

2. Replace handleMint():
   a. setStep('minting')
   b. Snapshot prevCompleted/prevRank/prevUnlocked for reward diff
   c. Clear mintError
   d. AbortController with 60s timeout
   e. POST /api/mint with JSON body:
      { userAddress: solanaWallet?.address ?? null, target: mission.name, timestampMs: new Date(timestamp).getTime(), lat: coords.lat, lon: coords.lon, cloudCover: sky?.cloudCover ?? 0, oracleHash: sky?.oracleHash ?? 'sim', stars: mission.stars }
   f. Handle errors: parse JSON, setMintError, return to 'verified'
   g. Fire-and-forget POST /api/award-stars (don't await, catch errors)
   h. setMintTxId(txId)
   i. setMintDone(true)
   j. setTimeout 1200ms: run reward diff, then setStep('done')
   k. In addMission: set method based on txId prefix

3. Add step === 'done' render:
   Full-screen centered dark panel:
   - Teal checkmark in circle (w-16 h-16)
   - "Discovery Sealed" h2 (serif, white)
   - "{mission.emoji} {mission.name}" (slate-400, text-sm)
   - "+{mission.stars} ✦" (#FFD166, font-bold)
   - If real txId (not sim): Solana Explorer link (teal, text-xs, ExternalLink icon)
   - "Share" button: onClick opens twitter intent with pre-composed text:
     "I just observed {mission.name} and sealed it on Solana ✦ @StellarClub26"
     Style: bg rgba(29,155,240,0.1), border rgba(29,155,240,0.3), text-xs
   - Two bottom buttons:
     "View NFTs" (outlined, → router.push('/nfts'))
     "Done" (brass gradient, → onClose())

4. In step === 'verified': show mintError if set as amber text.

5. Remove unused connection variable.

Changes to src/app/missions/page.tsx:
  Remove mintObservation, Connection, PublicKey imports if no longer used.
```

---

## TRACK B — TOKEN + GALLERY + PROFILE

---

### ★ PROMPT 5 — Stars SPL Token: Deploy + Award + Balance

**Priority:** 🔴 Critical
**Time estimate:** 1 session (~30 min)
**Depends on:** Prompt 1 (fee payer funded)
**Can run in parallel with:** Prompt 2

```
I'm building Stellar. Deploy a Stars SPL token on devnet, create an award endpoint, and show the real balance in the profile.

Read src/lib/solana.ts, src/app/profile/page.tsx, and scripts/setup-bubblegum.ts first.

---

Step 1 — Create scripts/create-stars-token.ts:

Use same .env.local loading pattern as setup-bubblegum.ts.
Load fee payer from FEE_PAYER_PRIVATE_KEY (base58 → Keypair.fromSecretKey).
Connect to devnet.
createMint(connection, feePayerKeypair, feePayerKeypair.publicKey, null, 0) — 0 decimals.
Print mint address, write STARS_TOKEN_MINT to .env.local.
Add to package.json: "setup:token": "npx tsx scripts/create-stars-token.ts"

---

Step 2 — Create src/app/api/award-stars/route.ts:

POST accepting { recipientAddress: string, amount: number, reason: string }.
Validate: recipientAddress is valid PublicKey, amount is integer 1-1000, reason non-empty.
If STARS_TOKEN_MINT not set: return 503.
Load fee payer, getOrCreateAssociatedTokenAccount, mintTo.
Return { success: true, txId, explorerUrl }.
Console log: '[Stars] Awarded {amount} to {address} for {reason}'

---

Step 3 — Add to src/lib/solana.ts (append, don't modify existing):

export async function getStarsBalance(walletAddress: string): Promise<number>
  Use getAssociatedTokenAddress + getAccount. Return Number(account.amount). Catch → 0.

---

Step 4 — Update src/app/profile/page.tsx:

Read full file first.
Add useState for starsBalance (default 0).
Add useEffect: when wallet available, call getStarsBalance, set state.
Show the real on-chain balance where Stars are displayed.
```

---

### ★ PROMPT 6 — NFT Gallery (/nfts page)

**Priority:** 🟡 High
**Time estimate:** 1 session (~30 min)
**Depends on:** Prompt 3 (collection mint exists)

```
I'm building Stellar. Rewrite src/app/nfts/page.tsx to fetch and display real compressed observation NFTs.

Read src/app/nfts/page.tsx and src/app/missions/page.tsx (for auth + Privy pattern) first.

---

Auth gate: if !authenticated, show sign-in prompt (same style as missions page).

On mount when authenticated — fetch via Helius DAS API:
  POST to NEXT_PUBLIC_HELIUS_RPC_URL (fallback: devnet) with:
  { jsonrpc: '2.0', id: 1, method: 'getAssetsByOwner', params: { ownerAddress: wallet, page: 1, limit: 100, displayOptions: { showUnverifiedCollections: true } } }

Filter by collection: keep items where grouping includes NEXT_PUBLIC_COLLECTION_MINT_ADDRESS.
If env var not set, show all returned assets as fallback.

States: loading (spinner), error (retry message), empty (Telescope icon + "No observations yet" + link to /missions), loaded (grid).

NFT grid (grid-cols-2 sm:grid-cols-3, gap-3):
  Each card (dark rounded style):
  - NFT name (text-sm, semibold, white)
  - Attributes: Target, Date, Cloud Cover, Stars Earned as small pills
  - "View on Explorer" link (teal, text-xs, ExternalLink icon)

Page header: "My Observations" (serif) + count badge.

Note: add NEXT_PUBLIC_COLLECTION_MINT_ADDRESS and NEXT_PUBLIC_HELIUS_RPC_URL to .env.local.
```

---

## TRACK C — AUDIENCE EXPANSION + POLISH

---

### PROMPT 7 — Fix All Broken Pages + Unify Branding

**Priority:** 🔴 Critical (judges will click every nav link)
**Time estimate:** 1 session (~45 min)
**Depends on:** Nothing — can run anytime
**This is the single highest-ROI prompt for hackathon scoring.**

```
I'm building Stellar, a Next.js 15 astronomy app for the Colosseum Frontier hackathon. A UX audit found critical issues that must be fixed before submission. Every page accessible from navigation must render properly. Broken pages destroy judge confidence.

Read the following files and the full navigation structure before making any changes:
  src/app/layout.tsx (or wherever the nav links are defined)
  src/components/ (find the nav/header/footer components)
  src/app/darksky/page.tsx
  src/app/chat/page.tsx
  src/app/profile/page.tsx
  src/app/leaderboard/page.tsx

---

TASK 1 — Identify all navigation links:
  Read the nav component(s). List every route that appears in desktop nav, mobile nav, and footer.
  For each route, check if the page exists and renders without errors.

TASK 2 — Fix or remove /darksky:
  If src/app/darksky/page.tsx exists but is broken or returns 404:
    Option A (preferred): Make it render a static "Coming Soon" placeholder with:
      - "Dark Sky Network" title (serif, white)
      - "We're building a light pollution map powered by real observer data."
      - "Complete sky missions to contribute Bortle readings."
      - CTA button → /missions
      - Consistent dark theme (bg #070B14)
    Option B: Remove /darksky from all nav links.

TASK 3 — Fix /chat routing:
  The /chat page reportedly renders Learn content instead of ASTRA AI chat.
  Read src/app/chat/page.tsx. If it's rendering wrong content, fix the imports/routing.
  If the ASTRA chat component exists elsewhere, wire it to /chat.
  If the chat component doesn't exist yet, create a placeholder:
    - "ASTRA — AI Astronomer" title
    - "Ask ASTRA anything about tonight's sky"
    - Simple input field + submit button
    - Placeholder response: "ASTRA will be available soon. Check back after the next update."
    - Style: dark theme, consistent with rest of app

TASK 4 — Fix /profile:
  If the profile page is blank, ensure it renders:
    - User greeting with name/email from Privy
    - Stars balance (show 0 if token not configured yet)
    - Rank (Stargazer if 0 missions)
    - Stats: missions completed (from useAppState), observation count
    - Wallet address in collapsible section
    - Sign out button
  If data isn't available yet, show reasonable defaults — never a blank page.

TASK 5 — Fix /leaderboard:
  If it shows mock data, that's acceptable but label it:
    Add a small banner: "Leaderboard updates with real observer data coming soon"
  If it's completely empty/broken, either:
    - Populate with 5-8 rows of seeded data (Georgian names + realistic stats)
    - Or add a "Coming Soon" placeholder similar to darksky

TASK 6 — Unify branding:
  Search the entire codebase for references to club.astroman.ge/logo.png or any Astroman logo URL.
  Replace ALL instances on inner pages with Stellar branding.
  The Astroman logo should ONLY appear on the marketplace page as a partner badge, not as the app logo.
  Ensure the nav bar shows "Stellar" (or the Stellar logo) on every page, not switching between Stellar and Astroman.

TASK 7 — Fix footer:
  If the footer references an unrelated hackathon or has incorrect links, fix it.
  Footer should link to: Sky · Missions · ASTRA · Marketplace · Astroman ↗ (external)

TASK 8 — Verify by opening every nav route:
  After all fixes, mentally trace: /, /sky, /missions, /chat, /marketplace, /profile, /nfts, /leaderboard, /darksky.
  Each must render without errors and show content consistent with the Stellar brand.
```

---

### PROMPT 8 — Sky Score + Tonight's Highlights (Audience Expansion)

**Priority:** 🟡 High — this makes the app appealing to non-astronomers
**Time estimate:** 1 session (~45 min)
**Depends on:** Nothing

```
I'm building Stellar, a Next.js 15 astronomy app. I need to add two features that make the app useful for EVERYONE, not just telescope owners: a "Sky Score" (0-100 rating for tonight's sky quality) and a "Tonight's Highlights" summary.

These features use data we already compute — no new external APIs needed.

Read these files first:
  src/app/sky/page.tsx (or wherever the sky forecast renders)
  src/lib/sky-data.ts
  src/lib/planets.ts
  src/app/api/sky/forecast/route.ts
  src/app/page.tsx (homepage)

---

FEATURE 1 — Sky Score API + Component

Create src/app/api/sky/score/route.ts:

GET handler with query params: lat, lon (default: 41.72, 44.83 — Tbilisi)

Scoring logic (0-100):
  1. Fetch current conditions from Open-Meteo (same call as sky/verify)
  2. cloudScore = Math.max(0, 100 - (cloudCover * 1.2))  // 0% clouds = 100, 83% = 0
  3. humidityPenalty = humidity > 80 ? (humidity - 80) * 0.5 : 0
  4. windPenalty = windSpeed > 20 ? (windSpeed - 20) * 0.3 : 0
  5. lightPollutionBase = 15  // static penalty, could be dynamic later
  6. moonPenalty: calculate current moon illumination using astronomy-engine or approximate:
     const moonAge = (Date.now() / 86400000 - 10971.5) % 29.53  // days since known new moon
     const moonIllumination = (1 - Math.cos(2 * Math.PI * moonAge / 29.53)) / 2
     moonPenalty = moonIllumination * 20  // full moon = -20 points
  7. skyScore = Math.round(Math.max(0, Math.min(100, cloudScore - humidityPenalty - windPenalty - lightPollutionBase - moonPenalty)))

Badge logic:
  90-100: "Perfect" (emoji: ✨)
  70-89: "Great" (emoji: 🌟)
  50-69: "Good" (emoji: ⭐)
  30-49: "Fair" (emoji: 🌤️)
  0-29: "Poor" (emoji: ☁️)

Return:
{
  score: number,
  badge: string,
  emoji: string,
  breakdown: { cloud: number, humidity: number, wind: number, moon: number, lightPollution: number },
  recommendation: string  // e.g. "Great night for naked-eye stargazing" / "Best for planet viewing" / "Stay inside tonight"
}

---

FEATURE 2 — Tonight's Highlights API

Create src/app/api/sky/tonight/route.ts:

GET handler with query params: lat, lon (default Tbilisi).

Logic:
1. Get planet positions (import from existing planets.ts or call astronomy-engine directly)
   For each of [Mercury, Venus, Mars, Jupiter, Saturn, Moon]:
   - Is it above the horizon tonight (between sunset and sunrise)?
   - What's its peak altitude?
   - When does it rise/set?

2. Get sky score (call the score endpoint or compute inline)

3. Build highlights array (max 5 items, ordered by interest):
   Priority order:
   - Any planet with altitude > 30° = "Jupiter is high in the sky tonight"
   - Moon phase note: "Waxing Crescent Moon (23% illuminated)"
   - Meteor shower if within ±3 days of a known peak (hardcode the major ones: Lyrids Apr 22, Eta Aquariids May 5, etc.)
   - ISS pass if easily available (skip if too complex — don't block on this)
   - Constellation suggestion: "Look south for Scorpius after 10 PM"

4. Return:
{
  skyScore: { score, badge, emoji },
  highlights: [
    { type: 'planet', title: 'Jupiter Rises at 9:14 PM', subtitle: 'Look east — brightest object after the Moon', icon: '🪐' },
    { type: 'moon', title: 'Waxing Crescent Moon', subtitle: '23% illuminated · Sets at 11:30 PM', icon: '🌙' },
    ...
  ],
  sunTimes: { rise: string, set: string },
  bestWindow: { start: string, end: string, reason: string }
}

---

FEATURE 3 — Add to Homepage

Read src/app/page.tsx fully.

Add a "Tonight" section near the top of the homepage (after hero, before "How It Works"):

Fetch /api/sky/tonight on mount (use user's location if available, else Tbilisi).

Render:
  - Sky Score circle (large, centered): number inside colored ring
    Color: score >= 70 → teal, 50-69 → amber, <50 → slate
    Below: badge text + recommendation
  - Highlights as horizontal scroll cards (dark cards, rounded-xl):
    Each card: icon + title + subtitle
    On click: if planet → navigate to /sky, if mission-related → /missions
  - "Best Window" bar: "Tonight's best: {start} – {end} · {reason}"

This section should be THE first thing users see after the hero. It answers the universal question: "Is tonight good for looking at the sky?"

---

FEATURE 4 — Add to /sky page

Read the sky forecast page fully.

Add the Sky Score as a prominent element at the top:
  Large number with colored ring + badge
  Below the score: breakdown tooltip or expandable showing cloud/moon/humidity contributions

Add "Tonight's Highlights" as a section above the 7-day forecast.

---

CONSTRAINTS:
- All new API routes must have error handling and sensible fallbacks
- Use CSS animations sparingly (CSS only, no requestAnimationFrame)
- The Sky Score ring can use a CSS conic-gradient for the colored arc
- Hardcode meteor shower dates as a simple array — don't over-engineer this
- Default to Tbilisi coordinates if geolocation unavailable
```

---

### PROMPT 9 — ASTRA AI Upgrade: Tool Calling + Floating Access

**Priority:** 🟡 High
**Time estimate:** 1 session (~45 min)
**Depends on:** Prompt 8 (uses sky/tonight and sky/score APIs)

```
I'm building Stellar. Upgrade ASTRA (the AI astronomer) with Claude tool calling for live sky data, and make it accessible from anywhere in the app.

Read src/app/api/chat/route.ts and src/app/chat/page.tsx fully.
Read src/lib/sky-data.ts and src/lib/planets.ts for existing astronomy functions.

---

PART 1 — Upgrade src/app/api/chat/route.ts:

Define 2 tools for the Claude API call:

Tool 1: get_planet_positions
  description: "Get current positions and visibility for all planets and the Moon tonight"
  input_schema: { type: "object", properties: { lat: { type: "number" }, lon: { type: "number" } }, required: [] }
  Implementation: call existing planet calculation logic
  Return: JSON array of { name, visible, altitude, riseTime, setTime }

Tool 2: get_sky_conditions
  description: "Get tonight's sky score, quality forecast, and highlights for a location"
  input_schema: { type: "object", properties: { lat: { type: "number" }, lon: { type: "number" } }, required: [] }
  Implementation: call /api/sky/tonight internally (or compute inline)
  Return: { skyScore, highlights, bestWindow }

Wire tools into the messages API call:
  - Pass tools array to Claude
  - Handle tool_use blocks: extract name + input, call implementation, build tool_result
  - Second Claude call with tool result, then stream final text
  - Keep existing SSE streaming format
  - If tool call fails, continue with text response

Updated system prompt:
"You are ASTRA, an expert AI astronomer powering the Stellar app. You have real-time access to sky conditions and planet positions via tools. When asked about tonight's sky, what's visible, or when to observe, call your tools to get live data. Be concise, enthusiastic, and specific — mention exact times and directions. Respond in the same language the user writes in (Georgian or English). Never mention you are Claude or an AI model. You ARE ASTRA."

Default lat/lon for tool calls: 41.72, 44.83 (Tbilisi).

---

PART 2 — Create ASTRA Quick-Ask Component

Create src/components/AstraQuickAsk.tsx:

A floating button + expandable chat widget that appears on key pages.

Collapsed state:
  Floating button (bottom-right, above mobile nav if present):
  - Circle, 48x48, brass/gold gradient background
  - "✦" icon or small sparkle icon
  - Pulse animation on first visit (CSS only)

Expanded state (on click):
  - Slide-up panel (320px wide, 400px tall max, dark card)
  - Header: "ASTRA" + close button
  - Scrollable message area
  - Input bar with send button
  - Pre-filled suggestions as tappable chips:
    "What can I see tonight?" · "Best time to observe?" · "Tell me about Jupiter"

On send: POST to /api/chat with the user's message. Stream response into the panel.
On close: collapse back to floating button, keep conversation state.

---

PART 3 — Add AstraQuickAsk to pages

Import and render <AstraQuickAsk /> on:
  - src/app/page.tsx (homepage)
  - src/app/sky/page.tsx (sky forecast)
  - src/app/missions/page.tsx (missions)

Do NOT add to /chat (it has full chat already), /marketplace, or /profile.

---

PART 3B — Update /chat page

If the full chat page exists but is rendering wrong content:
  Fix it to render the actual ASTRA chat interface.
  It should use the same /api/chat endpoint.
  The /chat page should be a full-screen version of the chat experience.

---

CONSTRAINTS:
- Keep the existing SSE streaming format exactly
- The floating widget must not block other UI elements
- CSS-only animations (pulse on the button)
- The widget should lazy-load — don't import chat logic until the button is clicked
- Mobile: the expanded panel should be near-full-screen (bottom sheet style)
```

---

### PROMPT 10 — Shareable Tonight's Card + OG Image

**Priority:** 🟡 High — this is the viral loop
**Time estimate:** 1 session (~30 min)
**Depends on:** Prompt 8 (uses sky/tonight API)

```
I'm building Stellar. I need a shareable "Tonight's Sky" card image and Open Graph metadata for social sharing.

Read src/app/layout.tsx and the /api/sky/tonight route.

---

Step 1 — Create src/app/api/og/tonight/route.tsx:

Use ImageResponse from 'next/og' (built into Next.js, no install needed).
Size: 1200x630. All styles inline (ImageResponse requirement).

Accept query params: score, badge, highlight1, highlight2, highlight3, location (all optional with defaults).

Design:
  - Background: #070B14 (deep space dark)
  - Top-left: "STELLAR" in #FFD166, fontSize 28, bold
  - Top-right: location text in rgba(255,255,255,0.4), fontSize 14
  - Center: Sky Score number, fontSize 120, bold
    Color: score >= 70 → #34d399, 50-69 → #FBBF24, <50 → #64748B
  - Below score: badge text, fontSize 24, same color family
  - Three highlight cards in a row (dark rounded boxes):
    Each: icon + short title text, fontSize 16
  - Bottom: "stellarrclub.vercel.app" in rgba(255,255,255,0.15), fontSize 12

---

Step 2 — Create src/app/api/og/sky/route.tsx (generic app OG):

Static OG image for the app homepage (no dynamic params needed).
Size: 1200x630.
Design:
  - Background: #070B14
  - "STELLAR" centered, fontSize 80, #FFD166
  - Subtitle: "The night sky app — observe, earn, collect", fontSize 22, #94a3b8
  - Three dark boxes: "🌕 Moon" · "🪐 Jupiter" · "🪐 Saturn"
  - Bottom: "stellarrclub.vercel.app"

---

Step 3 — Add meta tags to src/app/layout.tsx:

In the metadata export:
  og:image → /api/og/sky
  og:title → Stellar — The Night Sky App
  og:description → See what's visible tonight, complete sky missions, earn NFTs on Solana.
  twitter:card → summary_large_image
  twitter:image → /api/og/sky
  twitter:site → @StellarClub26

---

Step 4 — Add "Share Tonight" button to homepage:

In the Tonight section created by Prompt 8, add a "Share Tonight's Sky" button.

On click:
  1. Build the OG URL: /api/og/tonight?score={score}&badge={badge}&highlight1={...}&location={...}
  2. Build share text: "Tonight's Sky Score: {score}/100 {emoji} — {highlights summary} · stellarrclub.vercel.app"
  3. Use Web Share API if available (navigator.share), fallback to Twitter intent:
     window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`)

Style: small pill button, outline style, "Share ↗" text.

---

Step 5 — Add Farcaster Frame meta tags:

In layout.tsx <head>:
  fc:frame → vNext
  fc:frame:image → /api/og/sky
  fc:frame:button:1 → Check Tonight's Sky
  fc:frame:post_url → https://stellarrclub.vercel.app

Do NOT install @farcaster/miniapp-sdk — meta tags are sufficient.
```

---

### PROMPT 11 — Dynamic NFT Images (Unique Per Observation)

**Priority:** 🟡 Medium
**Time estimate:** 1 session (~30 min)
**Depends on:** Prompt 3

```
I'm building Stellar. Each minted observation NFT should have a unique image generated dynamically via Next.js ImageResponse. Currently all NFTs share a static placeholder image.

Read src/app/api/metadata/observation/route.ts and src/lib/mint-nft.ts.

---

Step 1 — Create src/app/api/og/observation/route.tsx:

Use ImageResponse from 'next/og'. Size: 600x600 (square, optimal for NFT thumbnails).

Accept query params: target, ts, lat, lon, cc, stars, hash

Design (all inline styles):
  - Background: #070B14
  - Star field: Use the hash param as a seed to generate 30-50 small white/yellow dots at deterministic positions:
    Parse first 20 chars of hash, use pairs of hex digits to compute x,y coordinates and brightness.
    This makes each NFT image unique but reproducible (same hash = same star field).
  - Center: target emoji (map common targets: Moon→🌕, Jupiter→🪐, Saturn→🪐, Pleiades→✨, Orion→⭐, Andromeda→🌌, Crab Nebula→💥)
    fontSize: 64
  - Below emoji: target name, fontSize: 28, bold, white
  - Below name: date formatted from ts, fontSize: 14, #94a3b8
  - Bottom-left: "☁️ {cc}%" and "✦ {stars}" in small text
  - Bottom-right: "STELLAR" in #FFD166, fontSize: 12
  - Top-right: small location text from lat/lon: "{lat}°, {lon}°"
  - Subtle border: 2px solid rgba(255,209,102,0.15) around the full image

---

Step 2 — Update src/app/api/metadata/observation/route.ts:

Change the "image" field in the returned metadata from the static placeholder to:
  `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://stellarrclub.vercel.app'}/api/og/observation?target=${encodeURIComponent(target)}&ts=${ts}&lat=${lat}&lon=${lon}&cc=${cc}&stars=${stars}&hash=${hash}`

This means every NFT in the gallery and on Solana Explorer will show a unique, beautiful image.

---

CONSTRAINTS:
- ImageResponse only supports inline styles
- The star field must be deterministic (same hash → same positions)
- Keep the image generation fast (<500ms)
- No external images — everything rendered with CSS/text/shapes
```

---

### PROMPT 12 — README Overhaul for Hackathon Submission

**Priority:** 🟡 High
**Time estimate:** 1 session (~20 min)
**Depends on:** Most features built

```
I'm building Stellar for the Colosseum Frontier 2026 hackathon (Consumer Track). The README.md needs to be rewritten specifically for hackathon judges. Judges spend 2-3 minutes per README.

Read the current README.md and package.json first.

---

Rewrite README.md with this exact structure:

# Stellar ✦

**The night sky app — observe, earn, collect.**

Stellar turns every clear night into a verified discovery. Check tonight's sky score, complete observation missions, earn Stars tokens, and collect compressed NFT proofs — all powered by invisible Solana infrastructure.

🔗 **Live:** [stellarrclub.vercel.app](https://stellarrclub.vercel.app)
🏗️ **Hackathon:** Colosseum Frontier 2026 · Consumer Track
👤 **Builder:** Rezi ([@StellarClub26](https://x.com/StellarClub26)) — Founder of [Astroman.ge](https://astroman.ge), Georgia's first astronomy e-commerce store

---

## What It Does

Stellar is a consumer astronomy app that answers one question: **"What can I see in the sky tonight?"**

Users get a real-time Sky Score (0-100), tonight's visible planets and highlights, 7-day forecast, and AI-powered sky guidance from ASTRA. When conditions are right, users complete observation missions — photograph celestial objects, get AI-verified, and earn:

- **Compressed NFTs** (Metaplex Bubblegum) — proof of each observation, ~$0.000005/mint
- **Stars tokens** (SPL) — redeemable for real telescope equipment at Astroman.ge

No wallets. No seed phrases. No gas fees. Sign up with email. Everything else is invisible.

---

## Why Blockchain?

| Without Solana | With Solana |
|---|---|
| Points in localStorage — lost if you clear your browser | Stars as SPL tokens — permanent, verifiable, tradeable |
| "Trust me, I observed Jupiter" | Compressed NFT with oracle hash, coordinates, and timestamp — verifiable on Explorer |
| Discount codes emailed | Token-gated redemption — balance checked on-chain before issuing |
| App shuts down, history gone | NFTs and tokens persist in user's wallet forever |

Compressed NFTs cost ~$0.000005 each. We can mint millions. The fee payer covers all gas — users never need SOL.

---

## Distribution Advantage

Stellar isn't starting from zero. [Astroman.ge](https://astroman.ge) is Georgia's first astronomy e-commerce store with:
- 60K+ social media followers
- Physical retail presence in Tbilisi
- Active telescope customer base
- Real products in the Stellar marketplace (telescopes, moon lamps, accessories)

Stars tokens earned in-app are redeemable for real discounts and products at the physical store.

---

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
**Auth:** Privy (embedded Solana wallets, email/Google login)
**Blockchain:** Metaplex Bubblegum (cNFTs), SPL Token (Stars), Helius DAS API
**AI:** Claude API with tool calling (ASTRA persona), Claude Vision (photo verification)
**Data:** Open-Meteo (weather), astronomy-engine (planet positions)
**Database:** Neon (Postgres) via Drizzle ORM
**Deploy:** Vercel

Built with: Metaplex Bubblegum · Helius · Privy · Colosseum Copilot · Open-Meteo · Claude API

---

## Features

- **Sky Score** — 0-100 rating for tonight's sky quality
- **Tonight's Highlights** — visible planets, moon phase, best viewing window
- **7-Day Forecast** — daily sky quality rated Go/Maybe/Skip
- **Planet Tracker** — rise/set/transit times for Mercury through Saturn
- **ASTRA AI** — ask anything about tonight's sky (Claude with live data tools)
- **Observation Missions** — 7 targets from Moon (beginner) to Crab Nebula (expert)
- **Knowledge Quizzes** — Solar System, Constellations, Telescopes (EN + Georgian)
- **NFT Gallery** — view all your compressed observation NFTs
- **Marketplace** — real Astroman.ge products, Stars redemption
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
# 1. Fund your fee payer wallet with devnet SOL
solana airdrop 5 <FEE_PAYER_ADDRESS> --url devnet

# 2. Create Bubblegum merkle tree + collection
npm run setup:bubblegum

# 3. Deploy Stars SPL token
npm run setup:token
```

---

## Architecture

```
User (email login via Privy)
  → Tonight's Sky Score + Highlights (Open-Meteo + astronomy-engine)
  → Start Mission → Camera → Claude Vision verification
  → Sky Oracle hash (deterministic per location/hour)
  → POST /api/mint → Metaplex Bubblegum cNFT
  → POST /api/award-stars → SPL Token mintTo
  → NFT Gallery (Helius DAS: getAssetsByOwner)
  → Marketplace → Stars redemption → Astroman.ge
```

All transactions use a server-side fee payer. Users never interact with wallets.

---

## License

MIT

---

Also create .env.example listing all required env vars with comments explaining each.
```

---

### PROMPT 13 — Seed Real On-Chain Data for Judge Verification

**Priority:** 🔴 Critical for submission
**Time estimate:** 1 session (~20 min)
**Depends on:** Prompts 3, 4, 5

```
I'm building Stellar. Before hackathon submission, I need real on-chain data that judges can verify on Solana Explorer. Create a script that mints several test observation NFTs and awards Stars tokens.

Read src/lib/mint-nft.ts, src/app/api/award-stars/route.ts, and .env.local.

---

Create scripts/seed-demo-data.ts:

Load .env.local (same pattern as setup-bubblegum.ts).
Require: FEE_PAYER_PRIVATE_KEY, MERKLE_TREE_ADDRESS, COLLECTION_MINT_ADDRESS, STARS_TOKEN_MINT

Define test observations (at least 5):
const observations = [
  { target: 'Moon', lat: 41.72, lon: 44.83, cloudCover: 8, stars: 50, date: '2026-04-10' },
  { target: 'Jupiter', lat: 41.72, lon: 44.83, cloudCover: 12, stars: 75, date: '2026-04-11' },
  { target: 'Pleiades', lat: 41.72, lon: 44.83, cloudCover: 5, stars: 60, date: '2026-04-12' },
  { target: 'Saturn', lat: 41.72, lon: 44.83, cloudCover: 18, stars: 100, date: '2026-04-13' },
  { target: 'Orion Nebula', lat: 41.72, lon: 44.83, cloudCover: 10, stars: 100, date: '2026-04-14' },
]

For each observation:
  1. Compute oracle hash (same logic as /api/sky/verify)
  2. Call mintCompressedNFT with the fee payer as recipient
  3. Log: "[NFT] Minted {target} — tx: {txId}"
  4. Wait 2 seconds between mints (avoid rate limits)

After all NFTs:
  5. Award Stars tokens to the fee payer wallet:
     total = sum of all stars from observations
     Call the SPL mintTo function directly (same logic as award-stars route)
     Log: "[Stars] Awarded {total} Stars — tx: {txId}"

Print summary:
  "✅ Seeded {n} observation NFTs and {total} Stars tokens"
  "📊 View on Explorer: https://explorer.solana.com/address/{feePayerAddress}?cluster=devnet"

Add to package.json: "seed:demo": "npx tsx scripts/seed-demo-data.ts"

Also insert matching rows into the observation_log database table (if DATABASE_URL is set):
  For each observation: insert { wallet: feePayerAddress, target, stars, confidence: 'high', mint_tx: txId, created_at: date }

This ensures the leaderboard, profile, and NFT gallery all show real data.
```

---

### PROMPT 14 — Mobile-First Polish + Success Screen Upgrade

**Priority:** 🟡 Medium
**Time estimate:** 1 session (~30 min)
**Depends on:** Prompt 4

```
I'm building Stellar for a Consumer track hackathon. The demo will be evaluated as a consumer product, likely on a phone-sized viewport. Polish the mobile experience and upgrade the success screen (the most judge-visible screen in the app).

Read these files:
  src/components/sky/MissionActive.tsx (especially step === 'done')
  src/app/page.tsx (homepage)
  src/app/layout.tsx
  Any global CSS or Tailwind config

---

TASK 1 — Success Screen ("Discovery Sealed") Polish:

The step === 'done' screen is what judges see after the demo's climax. It must be beautiful and memorable.

Current: basic centered layout with checkmark, text, and buttons.

Upgrade to:
  - Full viewport height, centered, no scroll
  - Subtle CSS radial gradient background: from rgba(52,211,153,0.05) center to transparent
  - The checkmark circle should have a brief CSS scale-in animation (transform from 0.5 to 1, 300ms ease-out)
  - "Discovery Sealed" in serif font, slightly larger (text-2xl)
  - The mission emoji should be large (text-4xl) with a subtle float animation (translateY 0 → -4px → 0, 3s infinite)
  - Stars earned "+{n} ✦" should have a CSS glow effect: text-shadow 0 0 12px rgba(255,209,102,0.4)
  - Solana Explorer link styled as a pill: bg rgba(56,240,255,0.06), border 1px solid rgba(56,240,255,0.15), px-3 py-1.5
  - Share button below: "Share on X ↗" — same outline style as previous prompt
  - Bottom buttons: "My NFTs" (outlined) and "Done" (brass gradient #B8860B → #FFD166)
  - Add a small "Sealed on Solana" badge with the Solana logo (inline SVG or text) at the bottom

---

TASK 2 — Mobile Navigation Polish:

Check the mobile bottom nav. Ensure:
  - 5 items max (Sky · Missions · [center] · Chat · Profile)
  - The center button should be visually distinct (larger, brass/gold accent)
  - Active state is clearly indicated
  - Nav doesn't overlap with content
  - The floating ASTRA button (from Prompt 9) doesn't collide with bottom nav

---

TASK 3 — Homepage Mobile Layout:

Ensure the homepage renders well at 390px width:
  - Hero section: no horizontal overflow
  - Sky Score + Tonight section: cards stack vertically on mobile
  - "How It Works" section: steps stack vertically
  - All CTAs are thumb-reachable (not tiny text links)
  - No horizontal scroll anywhere

---

TASK 4 — Loading States:

Add consistent loading states across the app:
  - Page transitions: subtle fade-in (CSS only)
  - Data loading: use consistent skeleton/shimmer pattern (CSS keyframes on background-position)
  - Never show a blank white screen while data loads

---

CONSTRAINTS:
- All animations CSS-only (keyframes, transitions, gradients)
- No requestAnimationFrame, no canvas, no JS animation loops
- Test at 390px viewport width
- Dark theme throughout (bg #070B14 or similar)
```

---

### PROMPT 15 — Pre-Submission Checklist + Final Fixes

**Priority:** 🔴 Critical — run this last
**Time estimate:** 1 session (~30 min)
**Depends on:** All previous prompts

```
I'm building Stellar for the Colosseum Frontier 2026 hackathon (Consumer Track). Submission deadline: May 11, 2026. This is the final quality check before submission. Do NOT add new features. Only fix, verify, and polish.

---

TASK 1 — Route Verification:

Visit every route in the app and verify it renders without errors:
  /, /sky, /missions, /chat, /marketplace, /profile, /nfts, /leaderboard, /darksky
  For each: confirm no 404, no blank page, no JS errors in console, no layout breaks.
  If anything is broken, fix it or remove the nav link.

---

TASK 2 — On-Chain Verification:

Check that the following exist on devnet (using Solana Explorer):
  - At least 3 compressed NFTs from the collection
  - Stars token mint address exists
  - At least 1 wallet has a non-zero Stars balance
  If any are missing, run the seed script (npm run seed:demo).

---

TASK 3 — Environment Variable Audit:

Create or update .env.example with ALL required variables:
  NEXT_PUBLIC_PRIVY_APP_ID=
  ANTHROPIC_API_KEY=
  DATABASE_URL=
  SOLANA_RPC_URL=https://api.devnet.solana.com
  FEE_PAYER_PRIVATE_KEY=
  MERKLE_TREE_ADDRESS=
  COLLECTION_MINT_ADDRESS=
  STARS_TOKEN_MINT=
  NEXT_PUBLIC_COLLECTION_MINT_ADDRESS=
  NEXT_PUBLIC_HELIUS_RPC_URL=
  NEXT_PUBLIC_APP_URL=https://stellarrclub.vercel.app

Verify .gitignore includes .env.local and does NOT include .env.example.

---

TASK 4 — TypeScript + Build Check:

Run: npm run build
Fix any TypeScript errors or build failures.
Do NOT suppress errors with @ts-ignore unless absolutely necessary.

---

TASK 5 — Performance Quick Check:

Ensure the homepage loads in under 3 seconds:
  - No massive unoptimized images
  - No blocking API calls before first paint
  - Sky data should load asynchronously after initial render

---

TASK 6 — Meta Tags Verification:

Check that the deployed site has correct:
  - <title> → "Stellar — The Night Sky App"
  - og:image → points to working OG image endpoint
  - og:description → concise, compelling
  - twitter:card → summary_large_image
  - favicon → exists and is not the default Next.js icon

---

TASK 7 — Console Cleanup:

Remove or suppress any console.log statements that would make the app look unfinished.
Keep error logging for server-side routes.
Remove any TODO/FIXME comments that judges might see in source.

---

TASK 8 — Mobile Screenshot Audit:

Open the app at 390px width. Take screenshots of:
  1. Homepage with Sky Score
  2. Sky forecast page
  3. Mission in progress
  4. "Discovery Sealed" success screen
  5. NFT gallery with real NFTs
  6. Marketplace

Save these for the submission. They should all look polished and consistent.

---

Output a checklist of everything checked and its status (✅ or ❌ with fix needed).
```

---

## SUBMISSION ASSETS CHECKLIST

These are NOT code prompts — these are the deliverables Rezi needs to create manually:

### 1. Pitch Video (3 minutes max)

Record in this order:
  0:00-0:30 — "I'm Rezi, I run Astroman.ge..." (distribution story)
  0:30-1:00 — "What can I see tonight?" (show Sky Score, highlights)
  1:00-1:45 — Demo: signup → mission → photo → verify → NFT minted (show Explorer)
  1:45-2:15 — "Why Solana?" (compressed NFT cost, SPL tokens, gasless UX)
  2:15-2:45 — "Business model" (Astroman revenue, token redemption, ASTRA premium)
  2:45-3:00 — "Live at stellarrclub.vercel.app, EN + Georgian, 7 missions, seeking ecosystem support"

Tips from winners:
  - Record on phone or at phone-sized viewport (Consumer track = mobile product)
  - Show real Solana Explorer links
  - Speak to camera for 0:00-0:30 and 2:15-3:00, screencast for 0:30-2:15
  - Clean desk, good lighting, confident delivery

### 2. Technical Demo Video (2-3 minutes)

Separate from pitch. Show:
  - Full signup flow with Privy
  - Sky Score computation
  - ASTRA answering "What should I observe tonight?" with tool calls
  - Mission flow start to finish with real NFT minting
  - NFT visible in gallery + Solana Explorer
  - Stars balance on profile
  - Marketplace with Stars redemption

### 3. Colosseum Arena Project Page

Required fields:
  - Project name: Stellar
  - One-liner: "The night sky app — observe, earn, collect on Solana"
  - Track: Consumer
  - Live URL: stellarrclub.vercel.app
  - GitHub: github.com/Morningbriefrezi/Stellar
  - Pitch video URL
  - Demo video URL
  - Team: Rezi (solo)

### 4. X/Twitter Build-in-Public Posts

Post at least 3-4 times between now and May 11:
  - Week 1: "Building Stellar for @Colosseum Frontier 🔭 Sky Score is live — check tonight's sky quality at stellarrclub.vercel.app"
  - Week 2: "First compressed NFT minted on devnet for $0.000005 🌌 Each observation is now a permanent proof on Solana"
  - Week 3: "ASTRA knows what's in your sky tonight ✦ Ask anything about the stars, get real-time answers"
  - Week 4: "Submitted to @Colosseum Frontier! 7 missions, real NFTs, real telescope rewards 🔭✦"
  Tag: @StellarClub26, @colosseum, #SolanaHackathon

---

## EXECUTION TIMELINE (27 days)

```
WEEK 1: Apr 14-20 — FOUNDATION
  Mon 14:  Prompt 7 (fix broken pages + branding) ← DO THIS FIRST
  Tue 15:  Prompt 2 (clean codebase, sky oracle)
  Wed 16:  Prompt 3 (server-side NFT minting)
  Thu 17:  Prompt 4 (wire mission → real mint)
  Fri 18:  Prompt 5 (Stars token deploy + award)
  Sat 19:  Prompt 6 (NFT gallery)
  Sun 20:  Test full flow end-to-end on devnet. Fix any issues.

WEEK 2: Apr 21-27 — AUDIENCE + POLISH
  Mon 21:  Prompt 8 (Sky Score + Tonight's Highlights)
  Tue 22:  Prompt 9 (ASTRA tool calling + floating widget)
  Wed 23:  Prompt 10 (OG images + share flow)
  Thu 24:  Prompt 11 (dynamic NFT images)
  Fri 25:  Prompt 13 (seed demo data on devnet)
  Sat 26:  Prompt 14 (mobile polish + success screen)
  Sun 27:  Prompt 12 (README overhaul)

WEEK 3: Apr 28 - May 4 — CONTENT + RECORDING
  Mon 28:  Write pitch script, practice out loud
  Tue 29:  Record pitch video (3+ takes)
  Wed 30:  Record technical demo video
  Thu 1:   X post #1 (Sky Score announcement)
  Fri 2:   X post #2 (NFT minting announcement)
  Sat 3:   Review videos, re-record if needed
  Sun 4:   X post #3 (ASTRA announcement)

WEEK 4: May 5-11 — SUBMISSION
  Mon 5:   Prompt 15 (pre-submission checklist)
  Tue 6:   Fix any issues from checklist
  Wed 7:   Final deploy to Vercel, verify live site
  Thu 8:   Create Colosseum Arena project page
  Fri 9:   Upload videos, fill all fields
  Sat 10:  Final review of everything
  Sun 11:  Submit. X post #4 (submission announcement).
```

---

## THE MINDSET SHIFT

The previous strategy optimized for **"what impresses Solana developers."**
This plan optimizes for **"what wins a Consumer track judged like an investor pitch."**

The difference:
- Judges don't care about Anchor programs. They care about user acquisition.
- Judges don't care about Jito bundles. They care about revenue models.
- Judges don't care about test suites. They care about whether real humans would use this.

Astroman.ge is your unfair advantage. No other submission has a physical store, existing customers, and a proven social media following. Lead with that, always.

The Sky Score is your hook for everyone. "Is tonight good for stargazing?" is a universal question. "Want to mint a compressed NFT?" is not.

Build for the masses. Monetize the enthusiasts. Win with distribution.

---

*Last updated: April 14, 2026*
*27 days to submission. Every day counts.*
