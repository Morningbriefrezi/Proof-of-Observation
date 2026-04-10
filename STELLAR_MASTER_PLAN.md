# STELLAR — Master Execution Plan
## Day-by-Day Build Schedule: April 11 → May 10, 2026

**Builder:** Rezi — solo founder, Astroman (astroman.ge)
**Hackathon:** Colosseum Frontier — NO tracks, $30K Grand Champion + $10K × 20 teams
**Deadline:** May 10, 11:59 PM PDT (May 11, 10:59 AM Tbilisi time)
**Live:** stellarrclub.vercel.app

---

# CONFIRMED STATUS — April 10, 2026

Items confirmed done from git history (`git log`) + code reading. Do NOT re-run their prompts.

| Feature | Status | Notes |
|---|---|---|
| G1 — Location system | ✅ DONE | `src/lib/location.tsx`, `LocationPicker.tsx` exist |
| G2 — Dealer data | ✅ DONE | `src/lib/dealers.ts` exists |
| G3 — Location-aware marketplace | ✅ DONE | Shipped in globalize commit |
| G4 — Free observation mission | ✅ DONE | `free-observation` mission in `constants.ts`, 25 Stars, repeatable |
| G5 — Global copy | ✅ DONE | Shipped in globalize commit |
| Nav cleanup | ✅ DONE | Nav + profile redesigned per commits |
| Profile page | ✅ DONE | Stars balance, streak, observation history, rank — all wired |
| ASTRA API route | ✅ DONE | `/api/chat/route.ts` — Claude API, streaming, two tools: `get_planet_positions` + `get_sky_forecast` |
| Streak API | ✅ DONE | `/api/streak` exists and is consumed by profile page |
| PWA manifest | ⚠️ EXISTS BUT BROKEN | `public/manifest.json` exists, wrong app name, only favicon icon — not installable |
| `/observe` page | ✅ EXISTS | Capture flow page — do not redirect, it's intentional |

**Items NOT done (building in order):**

| Priority | Feature | Day |
|---|---|---|
| P0 | Prompt CLEAN-1 (remaining cleanup) | Day 1 morning |
| P0 | Prompt 2 — Sky Oracle | Day 1 afternoon |
| P0 | Prompts 3-4 — NFT minting on devnet | Day 2 |
| P0 | Prompt 5 — Stars SPL token | Day 3 |
| P0 | Prompt 6 — NFT Gallery (Helius DAS) | Day 4 |
| P0 | ASTRA-1 — Standalone ASTRA page | Day 5 |
| P1 | Shareable NFT success screen | Day 7 |
| P1 | PWA icons fix | Day 8 |
| P1 | New user onboarding overlay | Day 9 |
| P1 | HOME-1 — Homepage refresh | Day 11 |
| P1 | Prompt 8 — OG Image + share | Day 12 |
| P1 | Gamification polish | Day 13 |
| P2 | G6 — README | Day 14 |
| P2 | POLISH-1 — Final UX fixes | Day 15-16 |
| P2 | Demo video | Day 18-20 |
| P2 | Submission | Day 26-27 |

---

# SITE AUDIT — April 10, 2026

## Remaining Issues to Fix

| Page | Status | Issue |
|---|---|---|
| `/` Home | ⚠️ | Old text: "Vibecoding From 0 Hackathon" in footer. `constants.ts` has `club.astroman.ge` reference. |
| `/sky` | ⚠️ | Forecast data doesn't render in SSR. Needs GPS location to populate. |
| `/chat` | ❌ WRONG | This is an encyclopedia page (planets/deepsky/quizzes/events tabs). ASTRA is buried as one tab. Standalone ASTRA chat page does not exist. |
| `/marketplace` | ⚠️ | May appear empty on first SSR render. |
| `/profile` | ✅ | Works. Empty without auth — expected. |
| `/club` | ❌ | Phantom references. Not linked from main nav but should stay unlinked. |
| `/darksky` | ⚠️ | Page exists now but may not be polished. |
| `/nfts` | ❓ | Shows mock NFTs. Helius DAS not wired yet. |

## What to Cut / Keep Hidden

| Cut | Why | How |
|---|---|---|
| `/club` page | References Phantom, separate nav, broken UX | Keep file, remove from all navs ✅ (already done) |
| "Vibecoding From 0" in footer | Wrong hackathon branding | CLEAN-1 Task 4 |
| `club.astroman.ge` in `constants.ts` ECOSYSTEM | Points to external loyalty app, confuses narrative | CLEAN-1 Task 7 |
| Scriptonia credit in SPONSORS | Third-party credit adds nothing for judges | CLEAN-1 Task 7 |
| `/darksky` nav links (if 404-ing) | Don't promote it if it doesn't work | Check in testing |

## Clean Navigation (verify this is live, fix if not)

**Desktop top nav:** Sky · Missions · ASTRA · Marketplace · Profile
**Mobile bottom nav:** Sky · Missions · [Home center] · Shop · Profile
**Footer:** Sky · Missions · ASTRA AI · Marketplace · Profile · Astroman ↗ · GitHub ↗

---

# DAY-BY-DAY EXECUTION PLAN

## WEEK 1: April 11-13 (Days 1-3) — CLEANUP + ON-CHAIN CORE

### Day 1 — Friday April 11: CLEANUP + SKY ORACLE

**Morning: Run Prompt CLEAN-1**

```
I'm building Stellar, a Next.js 15 astronomy app for the Colosseum Frontier hackathon.
The app has had partial cleanup but some inconsistencies remain.

Read ALL of these files before making any changes:
  src/app/layout.tsx
  src/app/page.tsx
  src/app/missions/page.tsx
  src/app/chat/page.tsx
  src/app/marketplace/page.tsx
  src/app/profile/page.tsx
  src/lib/constants.ts

Also check:
  src/components/nav/ (all nav components)
  Any footer component you can find

---

TASK 1 — Verify homepage CTA:
Check if "Start Observing" or similar primary CTA on homepage links to /missions (not /club).
If it links anywhere other than /missions, fix it.
Find any remaining links to /club anywhere in the homepage and change them to /missions.

TASK 2 — Verify navigation:
The main nav should be: Sky · Missions · ASTRA · Marketplace · Profile
Mobile bottom nav: Sky · Missions · Home (center) · Shop (/marketplace) · Profile
If this is already correct, skip. Only fix if wrong.
Remove any remaining /darksky nav links if the page isn't working.

TASK 3 — Fix footer:
Replace ALL instances of "Vibecoding From 0 Hackathon" or "Vibecoding From 0 · March 14–15, 2026" — remove entirely.
Footer should say: "© 2026 Stellar · Built on Solana" on left, "Powered by Astroman" with link to astroman.ge on right.
Remove any remaining "Scriptonia" credit.
Remove any remaining club.astroman.ge footer links.

TASK 4 — Fix page metadata:
src/app/layout.tsx metadata title: "Stellar — Observe the Sky, Earn on Solana"
src/app/layout.tsx metadata description: "The global astronomy app that brings telescope owners on-chain. Verify observations, earn Stars tokens, collect NFT proofs."

TASK 5 — Fix constants.ts:
In src/lib/constants.ts:
  In the ECOSYSTEM object, remove the 'club' key entirely (the club.astroman.ge link).
  In the SPONSORS object, remove the 'scriptonia' key entirely.
  Keep 'store', 'sky', 'app' in ECOSYSTEM.
  Keep 'superteam' and 'solana' in SPONSORS.

TASK 6 — Fix "Explore the Platform" section if it still exists on homepage:
Look at src/app/page.tsx for any section with cards linking to astroman.ge, club.astroman.ge, or /club.
If a "Partner Stores" section already exists with Astroman and High Point Scientific cards — skip this task.
If the old "Explore the Platform" section still exists, replace with:
  Title: "Partner Telescope Stores" (white, serif)
  Subtitle: "Earn Stars anywhere. Spend them at your local dealer." (muted, text-sm)
  Two cards:
    Card 1: "Astroman" / "Georgia's first astronomy store" / "Ships to: Georgia, Armenia, Azerbaijan" / link to astroman.ge
    Card 2: "High Point Scientific" / "America's trusted telescope retailer" / "Ships to: US, Canada" / link to highpointscientific.com
  Style: same dark card styling (rgba(255,255,255,0.04) bg, rgba(255,255,255,0.08) border, rounded-2xl)

TASK 7 — PWA manifest fix:
Read public/manifest.json.
Change "name" to "Stellar — Observe. Earn. Explore."
Change "short_name" to "Stellar"
Leave everything else.

Do NOT restructure layouts. Do NOT touch API routes. Do NOT install packages.
Only fix text, links, metadata, and constants.
```

**Afternoon: Run Prompt 2 (Sky Oracle)**
From LATEST_PROMPTS.md — Sky Oracle prompt. Run exactly as written.

---

### Day 2 — Saturday April 12: NFT MINTING

**Full day: Run Prompt 3, then Prompt 4**

- Prompt 3: Server-side compressed NFT minting (`mint-nft.ts` + `/api/mint` + `/api/metadata/observation`)
- Prompt 4: Wire mission completion → real mint + success screen with Explorer link

**Before running, make sure you have:**
- Funded devnet fee payer: `solana airdrop 5 <FEE_PAYER_ADDRESS> --url devnet`
- `MERKLE_TREE_ADDRESS` in `.env.local`
- `COLLECTION_MINT_ADDRESS` in `.env.local`
- `FEE_PAYER_PRIVATE_KEY` in `.env.local`

**Test after Prompt 4:** Complete the Moon observation. Verify the NFT appears in Solana Explorer.

---

### Day 3 — Sunday April 13: STARS TOKEN + WEEK 1 VIDEO

**Morning: Run Prompt 5 (Stars SPL Token)**
Deploy Stars token, create `/api/award-stars`, show real balance in profile.

Before running: `npm install @solana/spl-token` if not already installed.
After running: `npm run setup:token` to deploy on devnet.

**Afternoon: Record + submit Week 1 video (Loom, 60 seconds)**

Script:
"I'm Rezi from Tbilisi, Georgia. I run Astroman — Georgia's first astronomy store. This is Stellar — a global astronomy app for telescope owners on Solana. This week: I fixed the branding, replaced fake oracle data with real Open-Meteo sky verification, and wired compressed NFT minting on Solana devnet. Complete an observation, a real cNFT mints to your wallet for $0.000005. Stars is now a real SPL token on devnet. [30s screen share: sign in → mission → success screen with Explorer link]"

Upload to Loom. Submit to Colosseum dashboard.

---

## WEEK 2: April 14-20 (Days 4-10) — GALLERY + ASTRA UI + PRODUCT MOMENTS

### Day 4 — Monday April 14: NFT GALLERY

**Run Prompt 6 (NFT Gallery)**
Rewrite `/nfts` page to fetch from Helius DAS API.

Before running:
- Add to `.env.local`: `NEXT_PUBLIC_COLLECTION_MINT_ADDRESS` (same as COLLECTION_MINT_ADDRESS)
- `NEXT_PUBLIC_HELIUS_RPC_URL` (sign up at helius.dev free tier)

**Test:** Gallery should show the NFT minted on Day 2 with its Solana Explorer link.

---

### Day 5 — Tuesday April 15: ASTRA STANDALONE PAGE

**Note:** The ASTRA API route at `/api/chat/route.ts` is already fully implemented (Claude API, streaming, two tools). You only need to build the standalone page UI.

**Run Prompt ASTRA-1:**

```
I'm building Stellar, a Next.js 15 astronomy app.

The /chat route is currently an "Astronomy Guide" encyclopedia with tabs: planets, deepsky, quizzes, events, telescopes, chat.
The Claude API streaming route at /api/chat/route.ts already exists and is fully implemented.
I need to:
1. Move the encyclopedia page to /learn
2. Build a new standalone ASTRA AI chat page at /chat

Read these files fully before writing anything:
  src/app/chat/page.tsx (encyclopedia — moving to /learn)
  src/app/api/chat/route.ts (existing Claude API route — DO NOT MODIFY)

---

Step 1 — Move encyclopedia:
Rename src/app/chat/page.tsx → src/app/learn/page.tsx
Keep all content exactly as-is. No changes to the encyclopedia.

Step 2 — Create src/app/chat/page.tsx (ASTRA standalone UI):

'use client'

Full-height dark page with no scroll on the outer container:

Header (fixed top, 52px tall):
  Left: BackButton component (import from @/components/shared/BackButton)
  Center: "ASTRA" (serif Georgia font, text-xl, white) with a ✦ sparkle before it
  Right: small muted text "AI Astronomer" (text-xs, rgba(255,255,255,0.3))
  Border-bottom: 1px solid rgba(255,255,255,0.06)
  Background: rgba(7,11,20,0.95) with backdrop-blur-sm

Chat area (flex-1, overflow-y-auto, pt-[52px] pb-[80px], px-4):
  Message bubbles:
    User: right-aligned, bg rgba(52,211,153,0.08), border 1px solid rgba(52,211,153,0.15), rounded-2xl, rounded-br-sm, px-4 py-3, max-w-[80%]
    Assistant: left-aligned, bg rgba(255,255,255,0.04), border 1px solid rgba(255,255,255,0.08), rounded-2xl, rounded-bl-sm, px-4 py-3, max-w-[85%]
    Loading state: show three dots animation in an assistant bubble: "ASTRA is thinking..."

When messages is empty, show suggested prompts (centered in the chat area):
  ASTRA logo: a simple circle with ✦ inside, 48px, rgba(52,211,153,0.1) bg, teal border
  Title: "ASTRA" (serif, text-2xl, white)
  Subtitle: "Your AI Astronomer" (text-sm, rgba(255,255,255,0.4))
  Three suggestion pills (clickable, horizontally scrollable on mobile):
    "What can I see tonight?"
    "When's the next clear night?"
    "Best starter telescope?"
  Pills style: bg rgba(255,255,255,0.04), border rgba(255,255,255,0.1), rounded-full, px-4 py-2, text-sm, text-white

Input bar (fixed bottom, 0 to bottom, full width):
  bg rgba(7,11,20,0.95), backdrop-blur-sm, border-top 1px solid rgba(255,255,255,0.08)
  padding: px-4 py-3, safe-area-bottom padding
  Row: textarea (1 row auto-expand, max 3 rows) + send button
  Textarea: bg rgba(255,255,255,0.04), border rgba(255,255,255,0.1), rounded-2xl, px-4 py-2, text-sm, text-white, placeholder "Ask ASTRA anything..."
  Send button: 36px circle, bg rgba(52,211,153,1) when active, rgba(255,255,255,0.1) when disabled, teal arrow-up icon

State:
  const [messages, setMessages] = useState<Array<{role: 'user'|'assistant', content: string}>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

Auto-scroll to bottom on new messages.

handleSend():
  1. If input is empty or loading, return
  2. const userMsg = { role: 'user', content: input.trim() }
  3. setMessages(prev => [...prev, userMsg])
  4. setInput('')
  5. setLoading(true)
  6. POST to /api/chat with body: { messages: [...messages, userMsg] }
  7. Read response as SSE stream:
     const reader = res.body.getReader()
     const decoder = new TextDecoder()
     let buffer = ''
     let assistantText = ''
     
     Loop: read chunks → decode → split by '\n\n' → parse lines starting with 'data: '
     For type: 'text': append to assistantText, update last assistant message in state
     For type: 'done': setLoading(false)
  8. Add assistant message to messages array as streaming progresses (update in place, don't append repeatedly)

Keyboard handling:
  On desktop: Enter submits, Shift+Enter = newline
  On mobile: send button only

Auth gate:
  Import usePrivy from @privy-io/react-auth
  If !authenticated, show centered card:
    Icon: ✦ in a circle
    "Sign in to chat with ASTRA" (serif, text-lg)
    "Get real-time sky data for your location" (muted, text-sm)
    Sign In button (teal, calls login())

No new packages. Use native fetch + ReadableStream.
```

---

### Day 6 — Wednesday April 16: TEST & FIX

No new prompts. Full manual QA pass.

Test flow end-to-end:
1. Sign up with email → confirm wallet created invisibly
2. Sky forecast → loads with real data for your location
3. Start Moon mission → capture photo → AI verifies → NFT mints → success screen shows Explorer link
4. NFT gallery → shows minted NFT
5. Stars balance → correct in profile
6. ASTRA → responds to "What can I see tonight?" with real planet data
7. Marketplace → shows Astroman products (Georgia) or High Point Scientific (US) based on location
8. Location picker → switching regions updates marketplace

Fix any bugs. Deploy to Vercel. Verify live URL works.

---

### Day 7 — Thursday April 17: SHAREABLE NFT SUCCESS SCREEN

This is the "wow moment." When a user mints an NFT, the success screen is what they screenshot and share. It needs to look exceptional.

**Run Prompt SHARE-1:**

```
I'm building Stellar. Users complete sky observations and mint compressed NFTs on Solana.
Currently, the mission success screen (shown after a successful mint) is functional but not memorable.
I need to make it a shareable moment — something users want to screenshot and post.

Read these files first:
  src/app/missions/page.tsx
  src/components/sky/MissionActive.tsx (if it exists — this likely has the success state)
  src/components/sky/ObserveFlow.tsx (if it exists)

Find where the "success" state is shown after a mission completes. Read it fully.

---

TASK 1 — Redesign the success card:

When a mission completes (NFT minted), show a full-screen overlay (fixed inset-0, z-50) with:

Background: deep space bg (#070B14) with a subtle radial gradient glow in teal at center (rgba(52,211,153,0.08) fading to transparent)

Card (centered, max-w-sm, mx-auto, px-4):
  
  Top section:
    Large emoji of the mission target (e.g., 🌕 for Moon) — 64px, centered
    Below: "Discovery Sealed" in white serif, text-2xl
    Below: mission name + date in muted text-sm ("Moon · April 17, 2026")
  
  Middle section (the "proof" box):
    Background: rgba(52,211,153,0.04), border: 1px solid rgba(52,211,153,0.15), rounded-2xl, p-4
    Label: "Verified on Solana" in teal, text-xs, uppercase, letter-spacing-widest
    Stars earned: "+{X} Stars" in white, text-xl, bold, with a ⭐ before it
    NFT: "1 Discovery NFT minted" in muted text-sm
    If txHash is available: show truncated Explorer link (first 8 chars...last 4 chars) that opens in new tab
  
  Bottom section:
    Two buttons stacked:
    1. "Share on X" button — full width, bg rgba(0,0,0,0.4), border rgba(255,255,255,0.15), text-white, rounded-2xl
       On click: open Twitter intent URL with this pre-written text:
       "Just verified my [MISSION_NAME] observation on @solana ✦
       
       Earned [STARS] Stars + 1 discovery NFT.
       
       Bringing telescopes on-chain with @StellarApp 🌌
       
       stellarrclub.vercel.app"
       Open: window.open(twitterUrl, '_blank')
    
    2. "View in Gallery →" button — full width, teal bg, rounded-2xl, links to /nfts
    
    3. Small text below: "Done" — tapping dismisses overlay and returns to missions list
  
  Animation: fade-in from scale 0.9 to 1, opacity 0 to 1, 300ms ease-out

TASK 2 — Update the X share URL:
Encode the tweet text properly: encodeURIComponent(tweetText)
Full URL: `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
This opens Twitter web in a new tab on mobile, or the X app if installed.

Do not change the mint logic. Only change the success UI shown after a successful mint.
If the current success state is conditional on a boolean flag, keep that flag — only redesign what's rendered when the flag is true.
```

---

### Day 8 — Friday April 18: PWA PROPER ICONS

The PWA manifest exists but only has a favicon. Without proper icons, the app can't be installed as a PWA on Android/iOS homescreen, which is a missed demo opportunity.

**Run Prompt PWA-1:**

```
I'm building Stellar. The app has a PWA manifest at public/manifest.json but only has a favicon as its icon. This means it can't be properly installed as a PWA.

Read public/manifest.json first.

TASK 1 — Create a simple, programmatic PWA icon:
Create a file at scripts/generate-icons.js:

const { createCanvas } = require('canvas');
const fs = require('fs');

// If 'canvas' package is not installed, note it but don't stop — provide instructions.

The icon should be:
  Background: #070B14 (deep space)
  A filled circle in the center: rgba(52,211,153,1) (teal), radius 40% of canvas size
  Inside the circle: white star/asterisk symbol "✦" centered, roughly 50% of circle size, font "Georgia, serif"
  
Generate at two sizes: 192x192 and 512x512.
Save to public/icons/icon-192.png and public/icons/icon-512.png.

TASK 2 — Update public/manifest.json:
Change the icons array to:
[
  { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
  { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
]

TASK 3 — If canvas package is unavailable:
As a fallback, create a simple SVG-based icon at public/icons/icon.svg:
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#070B14"/>
    <circle cx="256" cy="256" r="200" fill="#34d399"/>
    <text x="256" y="300" text-anchor="middle" fill="white" font-size="200" font-family="Georgia, serif">✦</text>
  </svg>

Add it to the manifest as a maskable icon.

TASK 4 — Add Apple touch icon:
In src/app/layout.tsx metadata, add:
  icons: {
    apple: '/icons/icon-192.png',
    icon: '/icons/icon-192.png',
  }

If you can't generate PNG icons without the canvas package, create the SVG and note that real PNGs need to be generated manually or added from Figma.
```

---

### Day 9 — Saturday April 19: FIRST-TIME ONBOARDING

Judges land on the app cold. Without onboarding, they don't know what Stellar does or where to start. This overlay takes 30 seconds to build context.

**Run Prompt ONBOARD-1:**

```
I'm building Stellar, a Next.js 15 astronomy app on Solana. When a new user visits for the first time, they don't know what to do.

I need a first-time user onboarding overlay — 3 steps, dismissible, shown once.

Read src/app/page.tsx and src/components/ to understand the existing design system.

---

Create src/components/home/OnboardingOverlay.tsx:

'use client'

Trigger logic:
  On mount, check localStorage.getItem('stellar_onboarded')
  If it's null/undefined → show overlay
  If it's set → return null (don't render)

Overlay (fixed inset-0, z-50, bg rgba(7,11,20,0.92), backdrop-blur-md):
  Centered container: max-w-sm, mx-auto, px-6, flex flex-col items-center, justify-center, h-full

  Step indicator: three dots at top — filled teal for current step, white/20 for others

  Step 1:
    Icon: 🔭 (48px)
    Heading: "Observe the Night Sky" (white, serif, text-2xl, text-center)
    Body: "Complete sky missions. Photograph the Moon, Jupiter, Saturn, and more." (muted, text-sm, text-center, leading-relaxed)

  Step 2:
    Icon: ⭐ (48px)
    Heading: "Earn Stars Tokens" (white, serif, text-2xl, text-center)
    Body: "Every verified observation earns Stars — real SPL tokens on Solana. No wallet needed to start." (muted, text-sm, text-center, leading-relaxed)

  Step 3:
    Icon: 🛒 (48px)
    Heading: "Shop at Partner Stores" (white, serif, text-2xl, text-center)
    Body: "Spend Stars on telescopes at Astroman (Georgia) or High Point Scientific (USA). Stars work everywhere." (muted, text-sm, text-center, leading-relaxed)

Navigation:
  Steps 1-2: "Next →" button (teal, full width, rounded-2xl, py-3)
  Step 3: "Get Started →" button (teal, full width, rounded-2xl, py-3) — on click: localStorage.setItem('stellar_onboarded', '1'), close overlay

  Below button: small "Skip" text link (muted, text-xs) — same behavior as Get Started

Animation between steps: slide left (step goes out left, next comes in from right), 200ms, use CSS transition on a wrapper div

Import and add <OnboardingOverlay /> inside src/app/page.tsx, just before the closing tag of the main content wrapper.
```

---

### Day 10 — Sunday April 20: WEEK 2 VIDEO + DISCORD

**Morning: Record + submit Week 2 video (Loom, 60 seconds)**

Script:
"Week 2 of Colosseum Frontier. Real on-chain primitives are live. Watch this: email signup, wallet created invisibly. Complete a Moon observation — AI verifies the photo, sky oracle confirms clear conditions, compressed NFT mints on Solana. Here it is in the gallery with an Explorer link. Stars balance is a real SPL token. Switch location to New York — marketplace shows American telescopes. Same Stars token, different dealer. [50s screen recording]"

**Afternoon: Colosseum Discord**
Post Week 2 update in #build-in-public. Include live URL. Tag @solana if possible.

---

## WEEK 3: April 21-27 (Days 11-17) — POLISH + CONTENT + BUFFER

### Day 11 — Monday April 21: HOMEPAGE REFRESH

**Run Prompt HOME-1:**

```
I'm building Stellar for Colosseum Frontier. The homepage needs updating.
Read src/app/page.tsx fully before writing.

---

TASK 1 — Update hero headline:
Find the main headline. Change to three lines:
  "Observe the"
  "Night Sky."  (this line in teal, #34d399)
  "Earn on Solana."

Find the subtitle. Change to:
  "Photograph celestial objects from anywhere in the world. Earn Stars tokens, collect discovery NFTs, and shop telescopes at your local dealer."

Find any trust line (like "Trusted by amateur astronomers..."). Change to:
  "Free to join · No wallet needed · Powered by Solana"

Keep ALL existing animations, star field canvas, and visual styling. Only change text content.

---

TASK 2 — Update "How It Works" step copy:
Find Step 3. If it says anything about "Satellite" or "Farmhawk" → change to: "Sky oracle verifies clear conditions"
Find Step 4. Update to: "Discovery sealed on Solana as compressed NFT"

---

TASK 3 — Add social proof counter:
Find the hero stats area (if it has stats like "7 missions" etc.).
Add one more stat: "Live on Solana Devnet" with a small green pulsing dot before it.
Or if there's no stats area: add a small muted line below the hero subtitle:
  "• Live on Solana Devnet" in text-xs, rgba(52,211,153,0.6), with a 2px pulsing green dot

---

TASK 4 — Update "Observe & Earn" section:
Change the description to:
  "Complete sky missions to earn Stars tokens and compressed NFTs on Solana. Redeem Stars at partner telescope stores worldwide."
Change CTA link from anywhere else to /missions.
Update reward bullets:
  "Discounts up to 20% on telescopes at partner stores"
  "Free Moon Lamp for your first lunar observation"
  "Free Custom Star Map for completing all 5 missions"

---

TASK 5 — Add founder note (subtle, for judges):
Somewhere near the footer (not in the footer) or below the partner stores section:
  One line: "Built solo by an astronomy store owner using AI development tools"
  Style: text-xs, rgba(255,255,255,0.18), text-center, my-4

---

Do NOT restructure layouts. Do NOT touch navigation. Do NOT install packages.
```

---

### Day 12 — Tuesday April 22: OG IMAGE + SHARING

**Run Prompt 8 (Farcaster Share + OG Image)**
From LATEST_PROMPTS.md. Creates `/api/og/sky` dynamic OG image, adds meta tags, share buttons to mission success screen.

---

### Day 13 — Wednesday April 23: GAMIFICATION POLISH

No new page. Polish what exists to feel more rewarding — this drives the "engaged user" narrative.

**Run Prompt GAMIFY-1:**

```
I'm building Stellar. The app has Stars tokens, ranks, streaks, and missions — but they're not visible enough. I want users to feel progression.

Read these files:
  src/app/missions/page.tsx
  src/app/profile/page.tsx
  src/lib/rewards.ts
  src/components/sky/StatsBar.tsx (if it exists)

---

TASK 1 — Streak badge on Missions page:
Find the top of the missions page (the header area, before the mission list).
If the user is authenticated and obsStreak > 0, show a small pill:
  "🔥 {streak}-day streak" — amber color (#F59E0B), bg rgba(245,158,11,0.1), border rgba(245,158,11,0.2), rounded-full, text-xs, px-3 py-1
If obsStreak === 0 and authenticated: show "Start your streak →" in muted text-xs
Fetch the streak from /api/streak?walletAddress={address} the same way profile page does.

TASK 2 — Rank badge on Profile page:
Read src/lib/rewards.ts to understand the getRank() function.
In the profile page, after showing Stars balance, add the user's rank prominently:
  Rank name (e.g., "Star Gazer", "Observer", "Astronomer") — white, serif, text-base
  Rank badge: a small pill with the rank name in purple/teal based on rank level
  Below rank: a simple text progress bar showing "X / Y Stars to next rank"
  Example: "1,250 / 2,000 Stars → Expert Observer"
  Style: progress as muted text, no actual bar element needed — just the fraction.

TASK 3 — Stars total in nav (mobile):
Check if there's a way to show the Stars balance in the profile tab of mobile bottom nav.
If the mobile nav renders a Profile icon: add a small amber badge below/above it showing Stars (e.g., "125★")
Only show if authenticated.
If this requires complex state threading, skip Task 3 and note why.

Do not change any mission logic. Do not change Stars earning amounts.
```

---

### Day 14 — Thursday April 24: README + BUG FIXES

**Morning: Run Prompt G6 (Updated README)**
From GLOBAL_PROMPTS.md. Rewrites README with global positioning, full tech stack, setup instructions, devnet config.

**Afternoon: Bug fixes + mobile testing**
Test every page at 375px width on iPhone SE viewport. Fix any horizontal overflow or broken layouts.

---

### Day 15 — Friday April 25: FINAL POLISH (PART 1)

**Run Prompt POLISH-1:**

```
I'm building Stellar for Colosseum Frontier. Final polish pass.

Read every page file:
  src/app/page.tsx
  src/app/sky/page.tsx
  src/app/missions/page.tsx
  src/app/chat/page.tsx
  src/app/marketplace/page.tsx
  src/app/nfts/page.tsx
  src/app/profile/page.tsx

---

TASK 1 — Loading states:
Every page that fetches data must have:
  - A skeleton or spinner while loading (not a blank screen)
  - An error state with a retry button if fetch fails

TASK 2 — Empty states:
  /nfts when no NFTs: telescope icon + "No observations yet" + "Complete a mission →" button to /missions
  /marketplace if products array is empty: show 3 placeholder cards with a shimmer animation
  /profile unauthenticated: "Sign in to see your profile" card with Privy login button

TASK 3 — Mobile responsiveness at 375px:
  No horizontal scroll on any page
  All cards stack to single column
  All buttons min-height 44px (tappable)
  Input fields don't get covered by keyboard (use padding-bottom on chat input)
  ASTRA chat input safe area handled for iPhone bottom bar

TASK 4 — Missing keys in .map():
Search for .map() calls without a key prop. Add keys.

TASK 5 — Performance:
  Add loading="lazy" to all product images in marketplace
  Confirm star field canvas stops animating via IntersectionObserver or visibility check
  Check ASTRA chat for event listener cleanup in useEffect return

Fix all issues. Do not change features, layout, or design.
```

---

### Day 16 — Saturday April 26: FINAL POLISH (PART 2) + CONTENT

**Morning: Finish any remaining polish from Day 15**

**Afternoon: Content day — no code:**
1. Write Colosseum project description (copy to save for submission):
   - Name: Stellar
   - One-line: "The global astronomy app that brings telescope owners on-chain"
   - Description: what it does, why Solana, distribution angle (Astroman 60K followers)
   - Links: stellarrclub.vercel.app · GitHub · demo video
2. Take app screenshots on iPhone simulator (375px) and desktop (1440px)
3. Post on X about gamification launch

**Colosseum Discord:** Post Week 3 progress update.

---

### Day 17 — Sunday April 27: WEEK 3 VIDEO

Record and submit (Loom, 60 seconds).

Script:
"Week 3. The app is fully polished. Rank progression, streak tracking, NFT gallery — all live. New users get a 3-step onboarding. When you mint an NFT there's a shareable success card — share directly to X. ASTRA is now a standalone AI chat page with real sky data. Getting close to submission. [50s screen demo]"

---

## WEEK 4: April 28 - May 7 (Days 18-27) — DEMO VIDEO + SUBMISSION

### Day 18-19 — Monday-Tuesday April 28-29: DEMO VIDEO RECORDING

Record the 2-minute submission video. This is your most important marketing asset.

**Structure (2 minutes, NOT 3):**

**0:00-0:30 — Pitch (talking head or voiceover):**
- "300 million amateur astronomers. Zero on-chain. I'm changing that."
- "I run Astroman — Georgia's first astronomy store. 60K followers. Physical store in Tbilisi."
- "This is Stellar — observe the sky, earn on Solana, shop at your local dealer."

**0:30-1:30 — Live demo (screen recording, no cuts):**
1. Sign up with email — wallet created, no seed phrase shown (10s)
2. Sky forecast — 7-day with Go/Maybe/Skip badges (5s)
3. Start Moon observation → upload photo → AI verifies → NFT minting animation → success card with Explorer link (25s)
4. Gallery — shows minted NFT (5s)
5. Profile — Stars balance, rank, streak (5s)
6. Switch location to New York → marketplace updates to US products (10s)
7. Ask ASTRA "What can I see tonight?" — streaming response (10s)

**1:30-2:00 — Close:**
- "Mainnet launch with Astroman's 60K audience on day one."
- "Zero competition on any chain. Real business. Real users. Global from day one."
- "stellarrclub.vercel.app"

Upload to YouTube (unlisted preferred) or Loom.

**Key principles for the recording:**
- Start already logged in for the demo section (don't waste time on login screen)
- Have a real NFT pre-minted in the gallery so gallery isn't empty
- Use Tbilisi location → then switch to New York — shows the global angle
- Don't explain the UI, just use it — let the product speak

---

### Day 20 — Wednesday April 30: SUBMISSION DRAFT

Write the full Colosseum submission. Save to a local text file.

**Project submission text:**

```
Name: Stellar

One-line: The global astronomy app that brings telescope owners on-chain.

Description:
Stellar lets amateur astronomers photograph celestial objects, get AI-verified observations, and earn Stars tokens on Solana. Verified observations become compressed NFTs — proof of discovery, sealed on-chain. Stars tokens are redeemable at partner telescope stores worldwide.

The Solana layer is invisible to users. Sign up with email. Wallet created automatically. Pay with credit card. Never see gas fees or seed phrases.

Distribution moat: Built by the founder of Astroman — Georgia's first astronomy store, 60K Facebook followers, physical location in Tbilisi. Mainnet launch targets the Astroman audience directly.

What's live on devnet:
- Privy email/Google auth with embedded Solana wallets
- 7-day sky forecast (Open-Meteo) with Go/Maybe/Skip visibility badges
- Planet tracker (Mercury through Saturn + Moon, real positions)
- 8 observation missions from free sky photo to the Andromeda Galaxy
- AI-verified photo submission (Claude API vision)
- Compressed NFT minting via Metaplex Bubblegum (~$0.000005 per NFT)
- Stars SPL token on devnet (award-stars, redeem-stars APIs)
- NFT gallery from Helius DAS API
- ASTRA — Claude-powered AI astronomer with real-time sky data
- Location-aware marketplace (Georgia → Astroman products, USA → High Point Scientific)
- Rank progression, streak tracking, gamification

Tech: Next.js 15 · Privy · Claude API · Metaplex Bubblegum · SPL Token · Helius · Supabase · Open-Meteo

Links:
- Live: stellarrclub.vercel.app
- GitHub: github.com/Morningbriefrezi/Stellar
- Video: [YouTube/Loom link]

Team: Solo — Rezi (Revaz Modebadze), founder of Astroman, astroman.ge
```

---

### Day 21-25 — Thursday May 1 to Monday May 5: BUFFER DAYS

Use for:
- Re-recording demo if first take isn't good enough
- Fixing anything that broke on Vercel
- One more full flow test (sign up fresh → complete mission → verify on Explorer)
- Responding to any Colosseum Discord questions or feedback
- Final GitHub cleanup (remove unused files, check README renders correctly)

**Do not build new features in buffer days.** Resist the urge.

---

### Day 26 — Tuesday May 6: FINAL CHECKS + SUBMIT EARLY

Submission checklist before clicking submit:
- [ ] Live URL works: stellarrclub.vercel.app
- [ ] GitHub repo is public
- [ ] Demo video link works (test in incognito)
- [ ] All links in submission text open correctly
- [ ] Full flow works on mobile (iPhone + Android if possible)
- [ ] NFT minting works end-to-end on devnet
- [ ] ASTRA responds in both English and Georgian

Submit on Colosseum platform. Do not wait until May 10.

---

### May 7-10: ABSOLUTE BACKUP ONLY

Only touch the app if something is genuinely broken. The submission is in. Rest.

---

# WEEKLY X POSTS

## Week 1 (April 11-13)

**Friday April 11:**
```
There are 300M+ amateur astronomers worldwide.

Zero apps bringing them on-chain.

Building that for @colosseum Frontier. On @solana.

stellarrclub.vercel.app
```

**Sunday April 13:**
```
Week 1 @colosseum Frontier:

→ Sky oracle live (honest Open-Meteo verification)
→ Compressed NFTs minting on devnet
→ Stars SPL token deployed
→ Zero fake branding, zero middleware theater

Solo builder. AI tooling. Real telescope business.
```

## Week 2 (April 14-20)

**Tuesday April 15:**
```
Each sky observation on Stellar:

AI verifies your photo
Sky oracle hashes weather conditions
cNFT minted for ~$0.000005
SPL tokens awarded instantly
All gasless — user never sees crypto

Privy + Bubblegum + Claude API on @solana.
```

**Friday April 18:**
```
Sign up in Tbilisi → Astroman telescopes.
Switch to New York → Celestron products.

Same Stars token at both.

This is what consumer crypto looks like when you start from a real business.
```

**Sunday April 20:**
```
Week 2 @colosseum Frontier:

Real NFTs in gallery ✓
Stars token on devnet ✓  
ASTRA AI with live sky data ✓
Global marketplace switching ✓

From local astronomy store to global platform.
```

## Week 3 (April 21-27)

**Wednesday April 23:**
```
New on Stellar: the shareable moment.

Complete an observation.
NFT mints.
Success screen opens — share directly to X.

This is what a viral loop looks like in a real consumer app.
```

**Friday April 25:**
```
Why I built Stellar solo with AI tools:

I run a telescope store. I know the users. I know the products.

Claude Code writes the engineering.
I handle the vision.

2026: domain expertise + AI > generic dev team.
```

**Sunday April 27:**
```
Week 3 @colosseum Frontier:

Onboarding overlay for new users ✓
Shareable NFT success screen ✓
Rank progression + streak tracking ✓
OG images + social sharing ✓

One more week to submission.
```

## Week 4 (April 28 - May 7)

**Tuesday April 29:**
```
Demo video tomorrow.

2 minutes:
- Email signup (no wallet shown)
- Sky forecast for your location
- Observe → verify → NFT minted → share on X
- Stars balance = real SPL token
- Location switch → marketplace updates

Consumer crypto for stargazers.
```

**Thursday May 1:**
```
Astroman has 60K followers and a physical store.

They buy telescopes. Now they also:
→ Log observations on Solana
→ Earn Stars tokens
→ Collect NFT proofs
→ Never know they're using crypto

That's the distribution moat.
```

**Monday May 5:**
```
Submitting Stellar to @colosseum Frontier.

The global astronomy app on @solana.

Zero competition. Real business. Real users.

stellarrclub.vercel.app
```

---

# AI IMAGE PROMPTS (for X posts)

**"300M astronomers":**
A person silhouetted from behind holding a smartphone toward a brilliant Milky Way sky. The phone screen shows a glowing teal checkmark. Tiny light particles float upward from phone to stars. Deep blue and teal cinematic tones. No text, no logos.

**"Location switching":**
Split screen: left is a warm telescope shop on a Georgian cobblestone street with Caucasus mountains. Right is a sleek modern US telescope store with city skyline. A single glowing teal line connects them through center. Dark, moody, editorial.

**"Solo builder":**
Top-down desk at night. Laptop with code (dark theme). Small telescope, coffee, phone showing star chart. Soft teal glow from laptop. Moody developer workspace.

**"Shareable moment":**
A hand holding a phone showing a dark space-themed success screen. The screen shows a large moon emoji, "Discovery Sealed," and a glowing teal "Share on X" button. Stars visible in background through a window. Cinematic, warm mood.

**"Distribution moat":**
A telescope store interior, warmly lit, telescopes on display. Through the store window, a night sky full of stars. On the store counter, a subtle holographic teal glow. Cozy meets futuristic.

---

# PROMPT REFERENCE INDEX

| # | Name | Source | Day | Status |
|---|---|---|---|---|
| 1 | Bubblegum Setup | LATEST_PROMPTS.md | Pre-plan | ✅ DONE |
| G1 | Location System | GLOBAL_PROMPTS.md | Pre-plan | ✅ DONE |
| G2 | Dealer Data | GLOBAL_PROMPTS.md | Pre-plan | ✅ DONE |
| G3 | Marketplace Page | GLOBAL_PROMPTS.md | Pre-plan | ✅ DONE |
| G4 | Free Observation | GLOBAL_PROMPTS.md | Pre-plan | ✅ DONE |
| G5 | Global Copy | GLOBAL_PROMPTS.md | Pre-plan | ✅ DONE |
| CLEAN-1 | Critical Fixes | This document | Day 1 morning | Day 1 |
| 2 | Sky Oracle | LATEST_PROMPTS.md | Day 1 afternoon | Day 1 |
| 3 | NFT Minting | LATEST_PROMPTS.md | Day 2 | Day 2 |
| 4 | Wire Mint + Success | LATEST_PROMPTS.md | Day 2 | Day 2 |
| 5 | Stars Token | LATEST_PROMPTS.md | Day 3 | Day 3 |
| 6 | NFT Gallery | LATEST_PROMPTS.md | Day 4 | Day 4 |
| ASTRA-1 | ASTRA Standalone Page | This document | Day 5 | Day 5 |
| SHARE-1 | Shareable NFT Success | This document | Day 7 | Day 7 |
| PWA-1 | PWA Icons Fix | This document | Day 8 | Day 8 |
| ONBOARD-1 | Onboarding Overlay | This document | Day 9 | Day 9 |
| HOME-1 | Homepage Refresh | This document | Day 11 | Day 11 |
| 8 | OG Image + Share | LATEST_PROMPTS.md | Day 12 | Day 12 |
| GAMIFY-1 | Gamification Polish | This document | Day 13 | Day 13 |
| G6 | README | GLOBAL_PROMPTS.md | Day 14 | Day 14 |
| POLISH-1 | Final UX Fixes | This document | Day 15-16 | Day 15 |

**Total prompts in this document: 8** (CLEAN-1, ASTRA-1, SHARE-1, PWA-1, ONBOARD-1, HOME-1, GAMIFY-1, POLISH-1)
**Prompts from previous docs (not yet run): 6** (2-6, 8 from LATEST_PROMPTS · G6 from GLOBAL_PROMPTS)
**Already done: 7** (Bubblegum, G1-G5 + nav)
**Total to run: 14 prompts over 16 active days**

---

# FILES THIS PLAN DEPENDS ON

Keep all four files in your project root:
- **STELLAR_MASTER_PLAN.md** (this file) — day-by-day schedule + all new prompts
- **LATEST_PROMPTS.md** — Prompts 2-8 (Sky Oracle, NFT mint, Stars token, gallery, OG image)
- **GLOBAL_PROMPTS.md** — G6 (README) — G1-G5 already done
- **CLAUDE.md** — project instructions for every Claude session

---

*Last updated: April 10, 2026*
*Next action: Day 1, April 11 — Run Prompt CLEAN-1 (morning), then Prompt 2 (afternoon)*
*Week 4 buffer days are real. Use them.*
