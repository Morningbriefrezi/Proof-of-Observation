# STELLAR — Claude Code Prompt Playbook
Colosseum Frontier Hackathon · April 7 – May 11, 2026

**Privy App ID:** `cmnnk6n2c002d0cl47skaaz0d`

> Paste each prompt block directly into Claude Code. Read the phase notes first.
> One prompt = one commit. Don't combine phases.

---

## BEFORE YOU START — Run Once

```
Check that the repo builds cleanly before any migration.
Run: npm run build
If it fails, read the error and fix it before touching anything else.
Do not proceed with the Privy migration until the baseline build passes.
```

---

## PHASE 1 — FOUNDATION (Apr 7–9)

### Day 1 Morning — Privy Migration

> **Prereq:** Create a `.env.local` file in the project root with:
> ```
> NEXT_PUBLIC_PRIVY_APP_ID=cmnnk6n2c002d0cl47skaaz0d
> ```
> Do this manually before running the prompt below.

```
Read CLAUDE.md. Replace the existing Solana wallet-adapter auth with Privy SDK.

Steps:
1. Install @privy-io/react-auth (npm install @privy-io/react-auth)
2. Delete src/components/providers/WalletProvider.tsx
3. Create src/components/providers/PrivyProvider.tsx:
   - Export a component called SolanaWalletProvider (keep the same export name
     so layout.tsx doesn't need to change)
   - Config:
     appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID
     loginMethods: ['email', 'sms', 'google', 'wallet']
     embeddedWallets: { solana: { createOnLogin: 'users-without-wallets' } }
     appearance: { theme: 'dark', accentColor: '#8B5CF6' }
   - Import PrivyProvider from @privy-io/react-auth and wrap children with it
4. Update src/components/shared/Nav.tsx:
   - Replace `useWallet()` from @solana/wallet-adapter-react with
     `usePrivy()` from @privy-io/react-auth
   - Replace `disconnect` with `logout`, `connected` with `authenticated`
   - Everything else (visual, wallet address from AppState) stays unchanged
5. Update src/components/club/WalletStep.tsx:
   - Remove useWallet, useWalletModal, saveEmailKeypair, createWalletFromEmail
   - Add usePrivy() -> { login, logout, authenticated, ready }
   - Add useSolanaWallets() from @privy-io/react-auth -> { wallets }
   - Email form: clicking "Continue with Email" calls login() — Privy handles
     the OTP flow natively, no custom keypair needed
   - On auth: call setWallet(wallets[0].address) same as before
   - Keep ALL existing visual design, card structure, and styling exactly as-is
   - Replace Phantom button: call login() — Privy supports wallet login natively
   - Guard: check `wallets.length > 0` before accessing wallets[0]
6. Update src/components/sky/MissionActive.tsx:
   - Replace useWallet() + useConnection() with useSolanaWallets()
   - Create connection manually: new Connection('https://api.devnet.solana.com')
   - Replace the dual send path (emailKeypair OR Phantom) with:
     wallets[0]?.sendTransaction(tx, connection)
   - Remove getEmailKeypair() and getEmailSendTransaction() calls
   - Guard: if (!wallets[0]) return early with an error state
7. Update src/app/missions/page.tsx same way as MissionActive.tsx
8. Remove wallet-adapter packages from package.json:
   @solana/wallet-adapter-base, @solana/wallet-adapter-phantom,
   @solana/wallet-adapter-react, @solana/wallet-adapter-react-ui
   Run: npm uninstall @solana/wallet-adapter-base @solana/wallet-adapter-phantom @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
9. Delete src/lib/emailWallet.ts (no longer needed)
10. Keep @solana/web3.js — still needed for transactions

Do NOT change any styling. Keep the existing dark cosmic theme.
Do NOT change layout.tsx (it already uses SolanaWalletProvider by name).
Do NOT change useAppState.ts — the setWallet(address) pattern stays.

Commit: "replace wallet-adapter with Privy embedded wallets"
```

---

### Day 1 — Build Verification Prompt

> Run this after the migration to catch TypeScript errors before pushing.

```
Run: npm run build

If there are TypeScript errors:
- Read each error carefully
- Fix only the erroring lines — do not refactor surrounding code
- Common issues to expect:
  - Missing 'ready' check before accessing Privy hooks
  - wallets[0] possibly undefined — add optional chaining or guard
  - Old wallet-adapter imports still present in a file we missed
- After fixing, run npm run build again
- Do not push until the build is clean

Do not change any visual design while fixing build errors.
```

---

### Day 1 Afternoon — next-intl Setup

```
Set up next-intl for English + Georgian internationalization.

1. Install next-intl (npm install next-intl)
2. The translation files already exist at src/messages/en.json and
   src/messages/ka.json — do not delete or overwrite them
3. Create src/i18n/request.ts with getRequestConfig
4. Create src/i18n/routing.ts with locale config:
   defaultLocale: 'en', locales: ['en', 'ka']
5. Update next.config.ts with next-intl plugin (createNextIntlPlugin)
6. Update src/app/layout.tsx to wrap children with NextIntlClientProvider
   - getLocale() from next-intl/server
   - getMessages() from next-intl/server
   - Pass messages prop to NextIntlClientProvider
7. Create src/components/nav/LanguageToggle.tsx:
   - Toggles between 'en' and 'ka' stored in localStorage
   - Displays: "EN" | "ქარ"
   - Dark cosmic styling matching existing nav pill buttons
8. Add LanguageToggle to Nav.tsx (right side, before wallet pill)
9. Update the home page hero text to use translation keys:
   t('common.appName'), t('common.tagline')
   - Add these keys to en.json and ka.json if they don't exist

Do not change any visual design. Just wire the translation system.
Commit: "add next-intl with EN/KA translations and language toggle"
```

---

### Day 2 — Profile Page

```
Create the profile page showing Privy auth state and wallet info.

File: src/app/profile/page.tsx

1. If not logged in: show auth prompt with cosmic styling
   - Icon, heading: "Sign up to explore the cosmos"
   - Button that calls login() from usePrivy()
   - Use translation key: t('profile.signUpPrompt')

2. If logged in (authenticated === true), show:
   - User email or linked social account (from user.email?.address or
     user.linkedAccounts)
   - Embedded Solana wallet address: wallets[0]?.address
     truncated as: first 8 chars + "..." + last 8 chars
     with a Copy button (navigator.clipboard.writeText)
   - SOL balance: fetch from devnet with Connection.getBalance(new PublicKey(address))
     show as: X.XXX SOL
     loading spinner while fetching
   - Placeholder sections (styled cards, no data yet):
     "Observations: 0" | "Rank: Explorer" | "Discoveries: 0"
   - "Sign Out" button that calls logout() from usePrivy()
     then calls reset() from useAppState()

3. All strings through translation keys
4. Mobile responsive — single column on mobile
5. Match existing dark cosmic card style (use the Card component)

This is the page where users will see their on-chain identity.
Commit: "build profile page with Privy wallet display"
```

---

### Day 3 — Navigation & Skeleton Pages

```
Polish the app shell navigation and create skeleton pages for all routes.

1. Update Nav.tsx:
   - Logo/brand on left (keep AstroLogo as-is)
   - Desktop tabs: Sky Forecast, AI Companion, Marketplace, Profile
   - Language toggle + auth status on right
   - If not authenticated: show "Sign In" button that calls login()
   - If authenticated: show existing wallet pill (keep current design)
   - Use translation keys: t('nav.sky'), t('nav.chat'), t('nav.marketplace'),
     t('nav.profile'), t('nav.signIn')
   - Add these keys to en.json and ka.json

2. Create/update these route pages with skeleton layouts:
   - src/app/sky/page.tsx — "Sky Forecast" heading + shimmer skeleton cards
   - src/app/chat/page.tsx — "AI Companion" heading + placeholder message area
   - src/app/marketplace/page.tsx — "Marketplace" heading + skeleton product grid
   Each skeleton should use the dark cosmic card style with animate-pulse

3. Keep StarField background and dark theme on every page
4. Mobile: bottom tab nav already exists (BottomNav), ensure tabs match

Commit: "add navigation, skeleton pages, translation keys"
```

---

### Day 3 Evening — Deploy Check

```
Verify the app deploys to Vercel successfully.

1. Run npm run build locally — must pass with 0 errors
2. Check that NEXT_PUBLIC_PRIVY_APP_ID is set in Vercel environment variables
   (Settings → Environment Variables in the Vercel dashboard)
   Value: cmnnk6n2c002d0cl47skaaz0d
3. If build passes locally but fails on Vercel, the most likely cause is a
   missing env var — check Vercel logs
4. Do not push broken code — fix locally first

This is not a code task. It's a checklist. Report build status only.
```

---

## PHASE 2 — SKY CORE (Apr 10–14)

### Day 4 — Open-Meteo Data Layer

```
Create the Open-Meteo weather integration for astronomy observation forecasting.

1. Create src/lib/sky-data.ts:
   Export: fetchSkyForecast(lat: number, lng: number)
   API: https://api.open-meteo.com/v1/forecast
   Params:
     latitude, longitude
     hourly=cloud_cover,visibility,temperature_2m,relative_humidity_2m,wind_speed_10m
     forecast_days=7
   Return type:
     Array of { date: string, hours: { time: string, cloudCover: number,
     visibility: number, temp: number, humidity: number, wind: number }[] }
   No any types. Use TypeScript interfaces.

2. Create src/app/api/sky/forecast/route.ts:
   - GET handler
   - Accept lat/lng as query params (searchParams)
   - Default to Tbilisi: lat=41.6941, lng=44.8337
   - Call fetchSkyForecast, return NextResponse.json(data)
   - Error handling: return { error: string } with status 500

3. Manual test: visiting /api/sky/forecast in browser returns 7 days of JSON

Do not build any UI yet — just the data layer.
Commit: "add Open-Meteo 7-day sky forecast API"
```

---

### Day 5 — Sky Forecast UI

```
Build the Sky Forecast dashboard page with the Open-Meteo data.

1. Create src/components/sky/ForecastCard.tsx:
   Props: { day: DayForecast, isToday: boolean }
   Shows:
   - Date (e.g. "Mon Apr 7" or "Today")
   - Cloud cover % (best hour of the day — minimum cloud cover)
   - Visibility in km
   - Best observation window (hours where cloud cover < 30%)
   - Badge component:
     "Go" — green, cloud < 30%
     "Maybe" — amber, cloud 30-60%
     "Skip" — red, cloud > 60%
   - isToday card is larger/featured
   Use existing dark cosmic card style. No new color variables.

2. Create src/components/sky/ForecastGrid.tsx:
   - Fetches from /api/sky/forecast on mount
   - Requests geolocation, falls back to Tbilisi if denied or unavailable
   - Loading state: 7 skeleton cards with animate-pulse
   - Error state: amber warning card with retry button
   - Renders 1 featured today card + 6 smaller upcoming cards
   - Responsive: single column on mobile, grid on desktop

3. Update src/app/sky/page.tsx to render ForecastGrid

4. Translation keys (add to en.json + ka.json):
   sky.today, sky.cloudCover, sky.visibility, sky.go, sky.maybe, sky.skip,
   sky.bestHours, sky.loadingForecast, sky.forecastError

Match existing Card component style. No new Tailwind color classes.
Commit: "build 7-day sky forecast dashboard"
```

---

### Day 6 — Planet Tracker

```
Add astronomy-engine planet tracker to the sky page.

1. Install: npm install astronomy-engine

2. Create src/lib/planets.ts:
   Export: getVisiblePlanets(lat: number, lng: number, date: Date)
   Calculate for: Moon, Mercury, Venus, Mars, Jupiter, Saturn
   For each planet use astronomy-engine to get:
   - Altitude (degrees above horizon)
   - Azimuth (compass direction)
   - Rise time, transit time, set time (as Date objects)
   - Magnitude (brightness)
   - visible: boolean (altitude > 10°)
   Return sorted by altitude descending.
   No any types.

3. Create src/components/sky/PlanetCard.tsx:
   Shows:
   - Planet name via t('planets.jupiter') etc.
   - Altitude and azimuth direction (N/NE/E/SE/S/SW/W/NW)
   - Rise / Transit / Set times formatted as HH:MM
   - Badge: "Visible Now" (green) or "Rises at HH:MM" (dim)
   - Small colored dot per planet (Moon=gray, Venus=white, Mars=red,
     Jupiter=amber, Saturn=yellow, Mercury=blue)

4. Create src/components/sky/PlanetGrid.tsx:
   - Calls getVisiblePlanets on mount with user's location
   - Loading skeleton, empty state
   - Renders PlanetCard grid

5. Add PlanetGrid below ForecastGrid on src/app/sky/page.tsx

6. Translation keys: planets.moon, planets.mercury, planets.venus,
   planets.mars, planets.jupiter, planets.saturn,
   planets.visibleNow, planets.risesAt

Commit: "add planet tracker with astronomy-engine"
```

---

### Day 7 — Tonight's Highlights + Events

```
Add tonight's highlights and event alerts to the sky page.

1. Create src/components/sky/TonightHighlights.tsx:
   - Featured card at TOP of sky page
   - Combine best forecast hour + highest visible planet into one sentence:
     "Best tonight: Jupiter at 45° — clear skies from 21:00–23:00"
   - If conditions are poor: "Cloudy tonight — next clear window: [date]"
   - Use translation key: t('sky.tonightHighlight')
   - Cosmic gold (#FFD166) accent, same card style as existing

2. Create src/lib/astro-events.ts:
   Hardcoded list of 2026 astronomy events:
   - Lyrids meteor shower: Apr 22
   - Eta Aquariids: May 5-6
   - Mars at opposition: May 17
   - Perseid meteor shower: Aug 12
   - Any other notable 2026 events
   Each: { name: string, date: string, description: string, viewingTip: string }
   Export: getUpcomingEvents(fromDate: Date): events within next 30 days

3. Create src/components/sky/EventBanner.tsx:
   - Dismissable banner (localStorage key to track dismissal)
   - Shows name, days until event, viewing tip
   - Amber/gold styling
   - Countdown: "In X days"

4. Sky page order: TonightHighlights → ForecastGrid → PlanetGrid → EventBanner

Commit: "add tonight's highlights and astronomy event alerts"
```

---

### Day 8 — Sky Page Polish + Mobile Test

```
Polish the sky page. Fix all responsive issues. Verify translations.

1. Test every component at 375px viewport width:
   - ForecastCard: text must not overflow, badge must be visible
   - PlanetCard: times must be readable
   - TonightHighlights: single column, no horizontal scroll
   Fix any overflow, truncation, or layout issues found.

2. Switch locale to 'ka' — check that every string on the sky page
   renders Georgian text. If a translation key is missing, add it to
   src/messages/ka.json with an appropriate Georgian value or a placeholder
   like "[ka] Cloud Cover" until you can fill it in.

3. Verify loading skeletons appear on first load (can test by adding a
   500ms artificial delay in the API route temporarily — remove after testing)

4. Add proper error boundaries: if the forecast API fails, the sky page
   must still render the planet tracker and tonight's highlights.

Do not add new features. Fix only what's broken.
Commit: "sky page responsive fixes and i18n verification"
```

---

## PHASE 3 — AI COMPANION (Apr 15–19)

### Day 9 — Chat UI

```
Rebuild the AI chat interface with streaming responses.

1. Create or update src/app/chat/page.tsx as a full-page chat:
   - Full viewport height minus nav height
   - Message list (scrollable, auto-scrolls to bottom on new message)
   - Message bubble styles:
     User: right-aligned, accent purple bg (#8B5CF6), white text
     Assistant: left-aligned, dark card bg (#1A1F2E), slate-200 text
   - Input row pinned to bottom: text input + send button
   - Send on Enter key (Shift+Enter for newline)
   - Streaming indicator: three animated dots while waiting
   - Welcome message on first load: t('chat.welcome')
   - Mobile: full screen, input above keyboard (use padding-bottom env var)

2. Keep the existing AstroChat floating popup component untouched —
   it stays for quick access from other pages

3. API call: POST /api/chat with { messages: Message[], locale: string }
   Stream the response chunks and append to the assistant bubble in real time

4. Translation keys: chat.welcome, chat.placeholder, chat.send, chat.thinking

Commit: "rebuild chat UI with full-page streaming interface"
```

---

### Day 10 — AI Context Injection

```
Upgrade the AI chat API route with real-time sky context injection.

Update src/app/api/chat/route.ts:

1. Before calling Claude, fetch current sky data in parallel:
   const [forecastData, planetData, eventData] = await Promise.all([
     fetchSkyForecast(41.6941, 44.8337),  // Tbilisi default
     getVisiblePlanets(41.6941, 44.8337, new Date()),
     getUpcomingEvents(new Date()),
   ])

2. Build a structured system prompt:

const systemPrompt = `You are ASTRA — a personal astronomer inside the STELLAR app.
You have access to real-time sky data for the user's location (Tbilisi, Georgia by default).

TONIGHT'S CONDITIONS:
${JSON.stringify(forecastData[0])}

VISIBLE PLANETS RIGHT NOW:
${JSON.stringify(planetData.filter(p => p.visible))}

UPCOMING EVENTS (next 30 days):
${JSON.stringify(eventData)}

USER LANGUAGE: ${locale}
If the user writes in Georgian (ქართული), respond in Georgian.
If the user writes in English, respond in English.

RULES:
- Use the real sky data above when answering questions about tonight's sky
- Be specific: mention actual altitudes, times, compass directions
- If asked what to observe, recommend based on what is ACTUALLY visible right now
- You may mention ONE relevant Astroman product per conversation if naturally appropriate
- Keep responses concise: 2-4 sentences for simple questions, up to 6 for complex ones
- Never make up sky data — only use what is provided above`

3. Use Claude API streaming (claude-sonnet-4-6 model):
   Use @anthropic-ai/sdk with stream: true
   Pipe chunks back to client via ReadableStream
   Content-Type: text/event-stream

4. Accept locale in request body: const { messages, locale } = await req.json()

Commit: "upgrade AI companion with real-time sky context and streaming"
```

---

### Day 11–13 — AI Polish + Georgian Testing

```
Polish the AI companion. Test edge cases. Ensure Georgian works correctly.

1. Test these prompts against the live API:
   - "What can I see in the sky tonight?" — should use real planet data
   - "რა ჩანს ცაზე ამაღამ?" — should respond in Georgian with real data
   - "Is tonight good for observing Jupiter?" — should check actual altitude
   - "What telescope should I buy for beginners?" — may mention Astroman
   - Send 10 rapid messages — check streaming doesn't break

2. Add error handling to /api/chat/route.ts:
   - If Claude API fails: return { error: "AI temporarily unavailable" }
   - If sky data fetch fails: still call Claude but without sky context,
     add note in system prompt: "Sky data unavailable — answer generally"
   - Client: show error bubble in chat UI instead of crashing

3. Add a "Clear conversation" button to the chat page (top right)
   - Clears message history from state
   - Does not call any API

4. Test on mobile at 375px — input field must stay above keyboard

Commit: "AI companion polish, error handling, mobile fixes"
```

---

## PHASE 4 — MARKETPLACE (Apr 20–25)

### Day 14 — Product Catalog + Pricing API

```
Create the product data structure and catalog for the Astroman marketplace.

1. Create src/lib/products.ts:

type Product = {
  id: string;
  name: { en: string; ka: string };
  description: { en: string; ka: string };
  category: 'telescope' | 'moonlamp' | 'projector' | 'accessory' | 'digital';
  priceGEL: number;
  image: string; // path under /public/products/
  inStock: boolean;
  featured: boolean;
  aiRecommendFor?: string[]; // e.g. ['jupiter', 'moon', 'beginner']
};

Create a catalog of 12 products with placeholder data (Rezi will replace):
- 3 telescopes (beginner ~400 GEL, intermediate ~900 GEL, advanced ~2200 GEL)
- 2 moon lamps (small ~80 GEL, large ~150 GEL)
- 2 star projectors (~120 GEL, ~250 GEL)
- 2 accessories (phone adapter ~60 GEL, premium eyepiece ~180 GEL)
- 3 digital products (star map ~30 GEL, constellation guide ~25 GEL,
  AI premium subscription ~50 GEL/month)

2. Create src/app/api/products/route.ts:
   GET: return the full catalog as JSON
   Accept optional ?category= filter param

3. Create src/app/api/price/sol/route.ts:
   GET: fetch SOL/USD price from CoinGecko public API
   (https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd)
   GEL/USD rate: use fixed 0.37 (1 GEL = 0.37 USD) or fetch if possible
   Return: { solPerGEL: number, solPrice: number }
   Cache for 60 seconds (Next.js route segment config revalidate = 60)

Commit: "add product catalog and SOL pricing API"
```

---

### Day 15 — Marketplace UI

```
Build the marketplace page with product grid and detail view.

1. Create src/components/marketplace/ProductCard.tsx:
   Props: { product: Product, solPerGEL: number }
   Shows:
   - Product image (use a placeholder div with cosmic bg if image missing)
   - Name (use product.name[locale] — pass locale as prop or read from context)
   - Price: "400 ₾" + "≈ X.XX SOL" (dim, smaller)
   - Category badge (same badge style as Go/Maybe/Skip)
   - "AI Pick" badge if aiRecommendFor is set
   - "Buy Now" button (variant="brass" from existing Button component)
   - Match existing dark cosmic card style exactly

2. Create src/components/marketplace/ProductGrid.tsx:
   - Fetches /api/products and /api/price/sol on mount
   - Filter tabs: All | Telescopes | Moon Lamps | Digital
   - Grid: 1 col on mobile, 2 on tablet, 3 on desktop
   - Loading skeletons while fetching
   - Empty state if no products in category

3. Create src/components/marketplace/ProductDetail.tsx:
   - Slides in as a bottom sheet or modal on mobile, side panel on desktop
   - Large image, full localized description
   - Price in GEL and SOL equivalent
   - "Pay with Card" — primary large button
   - "Pay with SOL" — secondary smaller button
   - Close button

4. Update src/app/marketplace/page.tsx to render ProductGrid

5. Translation keys: marketplace.title, marketplace.buyNow, marketplace.payCard,
   marketplace.paySol, marketplace.aiPick, marketplace.outOfStock,
   marketplace.loading, categories.all, categories.telescopes,
   categories.moonlamps, categories.digital

Commit: "build marketplace product grid and detail view"
```

---

### Day 16–17 — Checkout Flow

```
Implement the checkout flow with card-first payments.

1. Create src/components/marketplace/Checkout.tsx:
   State machine: idle → confirming → processing → success | error
   Shows:
   - Product name, image thumbnail, price in GEL and SOL
   - Payment method selection:
     PRIMARY: "Pay with Card" — large brass button (full width)
     SECONDARY: "Pay with SOL" — smaller, text-link style

2. "Pay with Card" handler:
   - If Privy fiat onramp is available on the plan: call it
   - Fallback (works for hackathon): show a modal with:
     "Complete your order by contacting Astroman:"
     Phone: [your store number]
     Telegram: [your handle]
     Reference code: STELLAR-[product.id]-[Date.now().toString(36).toUpperCase()]
   - This is a real checkout flow — Rezi manually fulfills the order

3. "Pay with SOL" handler:
   - Check wallets[0] exists and has SOL balance
   - Build a SystemProgram.transfer transaction:
     from: wallets[0].publicKey
     to: MERCHANT_WALLET (hardcode your devnet wallet address in env)
     amount: priceGEL * solPerGEL * LAMPORTS_PER_SOL
   - Sign via wallets[0].sendTransaction(tx, connection)
   - Show transaction signature + link to Solana Explorer
   - If insufficient balance: show "Fund your wallet" message

4. Create src/components/marketplace/OrderConfirmation.tsx:
   - "Order placed!" heading
   - Transaction hash with copy button (if SOL payment)
   - "View on Solana Explorer" link (devnet)
   - "Continue Exploring" button back to /sky

5. Store order in localStorage key 'stellar_orders' as array

Commit: "add checkout flow with card and SOL payment options"
```

---

## PHASE 5 — ON-CHAIN DEMO (Apr 26–29)

### Day 20–21 — Discovery Attestation

```
Build the Discovery Attestation minting flow.

1. Create src/lib/attestation.ts:
   Export: validateObservation(params: {
     object: string, lat: number, lng: number, timestamp: string
   }): Promise<{ valid: boolean, reason: string, altitude: number }>
   - Use astronomy-engine to check: was this object above 10° altitude
     at this location and time?
   - Fetch Open-Meteo for cloud cover at that time/location
   - Return valid=true only if altitude > 10° AND cloud cover < 60%
   - reason explains why invalid if applicable

2. Create src/app/api/mint/route.ts:
   POST: { object, lat, lng, timestamp, walletAddress }
   - Run validateObservation
   - If invalid: return { success: false, reason }
   - If valid:
     Try Metaplex Bubblegum compressed NFT mint (use server fee payer from
     FEE_PAYER_PRIVATE_KEY env var)
     If Bubblegum fails or is unavailable, fall back to:
     Solana Memo Program transaction with JSON metadata in memo field:
     { object, lat, lng, timestamp, validated: true, app: 'stellar' }
     This is still on-chain and verifiable.
   - Return: { success: true, txHash, explorerUrl, method: 'nft' | 'memo' }

3. Create src/components/sky/MintButton.tsx:
   - "Mint Discovery" button on PlanetCard when planet is visible
   - Requires authenticated === true (show login prompt if not)
   - Flow: idle → validating → minting → success | error
   - Success: show txHash + Solana Explorer link
   - Error: show reason (e.g. "Planet below horizon at that time")

4. Add MintButton to PlanetCard for visible planets

Commit: "add Discovery Attestation minting with validation"
```

---

### Day 22–23 — Discoveries Gallery

```
Build the "My Discoveries" gallery on the profile page.

1. Update src/app/profile/page.tsx to include a Discoveries section:
   - Reads stellar_state from localStorage (completedMissions array)
   - If empty: "No discoveries yet — start observing!"
   - If has entries: grid of discovery cards showing:
     Planet/object name, timestamp, txHash (truncated), status badge
     Link to Solana Explorer for each
   - Match the existing dark cosmic card style

2. Update the stats placeholders on profile with real data:
   - Observations: completedMissions.length
   - Rank: use getRank() from src/lib/rewards.ts

3. Test the full mint flow end to end:
   - Log in with email
   - Go to sky page
   - Click "Mint Discovery" on a visible planet
   - Confirm it lands on Solana Explorer (devnet)
   - Check it appears on profile page

Do not change any visual design. Only wire real data into existing UI slots.
Commit: "add discoveries gallery to profile page"
```

---

## PHASE 6 — TRACTION SPRINT (Apr 30 – May 4)

### Bug Fix Prompt Template

> Use this template when users report bugs during beta.

```
Bug report: [describe exact bug here]
Reproduction: [steps to reproduce]
Device/browser: [mobile Safari / Chrome desktop / etc.]

Read the relevant component file first before making any changes.
Fix only this specific bug. Do not refactor surrounding code.
Test the fix by tracing through the code logic manually.
Commit: "fix: [one-line description of bug]"
```

---

### Responsive Fix Prompt

```
A user reported a responsive issue on mobile.

Check these pages at 375px viewport width:
- /sky — ForecastCard, PlanetCard, TonightHighlights
- /chat — message bubbles, input row
- /marketplace — ProductCard, ProductGrid filter tabs
- /profile — wallet address display

For each issue found:
- Fix the specific CSS/Tailwind class causing overflow or misalignment
- Do not redesign — minimal fix only
- Mobile-first: fix the small screen, ensure desktop still works

Commit: "fix: mobile responsive issues on sky/chat/marketplace/profile"
```

---

## PHASE 7 — SUBMIT (May 5–11)

### Day 29 — Final Polish Pass

```
Final polish pass on the entire app before submission.

1. Check every page at 375px width:
   - /sky, /chat, /marketplace, /profile, / (home)
   - Fix any overflow, alignment, or spacing issues

2. Georgian language audit:
   - Set locale to 'ka', navigate every page
   - List every missing translation key
   - Add Georgian values for all missing keys in src/messages/ka.json

3. Loading states:
   - Every data-fetching component must have a loading skeleton
   - Skeleton must use animate-pulse and match the card dimensions

4. Error states:
   - Every API call must have an error state that shows a message
   - Error states must not crash the page

5. Meta tags:
   - Update src/app/layout.tsx metadata:
     title: "STELLAR — Your AI-Powered Window to the Cosmos"
     description: "7-day sky forecast, AI astronomer, real telescope marketplace — powered by invisible Solana infrastructure."
     Add og:image (can be a screenshot saved to /public/og.png)

6. Remove all console.log statements that were added for debugging

Commit: "final polish: responsive, i18n, error states, meta tags"
```

---

### Performance + Security Check

```
Run a final security and performance check before submission.

1. npm run build — must pass with 0 errors and 0 TypeScript errors

2. Check for exposed secrets:
   - Search for any hardcoded API keys in source files
   - Run: grep -r "anthropic" src/ --include="*.ts" --include="*.tsx"
     (should only appear in server-side API routes, not client components)
   - ANTHROPIC_API_KEY must never appear in client-side code
   - FEE_PAYER_PRIVATE_KEY must never appear in client-side code

3. Check bundle size:
   - Look at the build output — flag any page over 500kb
   - If astronomy-engine is imported in a client component, it will bloat
     the bundle. Move planet calculations to an API route if needed.

4. Check that all external API calls have timeouts:
   - Open-Meteo fetch: add signal: AbortSignal.timeout(5000)
   - CoinGecko fetch: add signal: AbortSignal.timeout(3000)

Report findings. Fix critical issues only (secrets, build errors).
Commit: "security: move API key usage server-side only"
```

---

## UTILITY PROMPTS (use anytime)

### Add a Translation Key

```
Add translation key: [key.path]
English value: "[english text]"
Georgian value: "[georgian text or TODO]"

Add to both src/messages/en.json and src/messages/ka.json.
Maintain alphabetical order within the same namespace object.
Do not touch any other file.
Commit: "i18n: add [key.path] translation"
```

---

### Fix a TypeScript Error

```
Fix TypeScript error: [paste error message here]

Read the file mentioned in the error before making any changes.
Fix only the specific type error. Do not refactor surrounding code.
Do not add 'as any' — find the correct type.
Commit: "fix: TypeScript error in [filename]"
```

---

### Add a Product to the Catalog

```
Add this product to src/lib/products.ts:

id: [slug]
name_en: [English name]
name_ka: [Georgian name]
description_en: [English description]
description_ka: [Georgian description]
category: [telescope | moonlamp | projector | accessory | digital]
priceGEL: [number]
image: /products/[filename].jpg
inStock: true
featured: [true | false]
aiRecommendFor: [[optional array of strings]]

Do not change anything else in the file.
Commit: "products: add [product name]"
```

---

### Daily Minimum Commit (busy days)

```
Today's minimum commit — pick one:

Option A: Add/fix a Georgian translation string
  Add missing key to src/messages/ka.json only.

Option B: Fix a CSS spacing issue
  Fix one specific padding/margin/overflow issue on one component.

Option C: Add a quiz question
  Add one question to an existing mission in the missions data.

Option D: Update a product description
  Edit name or description for one product in src/lib/products.ts.

Pick whichever is fastest. One file change. Commit and push.
Commit: "chore: [describe what you did]"
```

---

## ENV VARS REFERENCE

```
# .env.local — never commit this file

NEXT_PUBLIC_PRIVY_APP_ID=cmnnk6n2c002d0cl47skaaz0d
ANTHROPIC_API_KEY=                    # from console.anthropic.com
NEXT_PUBLIC_SUPABASE_URL=             # from supabase.com project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=        # from supabase.com project settings
SOLANA_RPC_URL=https://api.devnet.solana.com
FEE_PAYER_PRIVATE_KEY=                # devnet wallet, base58 encoded private key
MERCHANT_WALLET=                      # your devnet wallet address for SOL payments
```

---

## RULES (do not remove)

1. Don't redesign. Extend the existing repo. Preserve the visual language.
2. Utility first, crypto second. Build a useful astronomy tool. Solana is invisible.
3. Translation keys everywhere. No hardcoded strings. `t('key')` always.
4. Mobile-first. Test at 375px before anything else.
5. Every feature gets: loading state, empty state, error state.
6. One commit per day minimum. Colosseum tracks activity.
7. Marketplace is NOT optional. It's the revenue story.
8. Speed over perfection. Ship working features, not perfect features.

**NEVER cut:**
- Sky forecast dashboard
- AI companion
- Marketplace with card payment
- Georgian language
- Traction from 60K audience

**Drop in this order if behind:**
1. NFT minting → just show validation logic
2. Digital gift products → roadmap mention
3. SOL payment → card-only is fine
4. Event alerts
5. Profile wallet details
