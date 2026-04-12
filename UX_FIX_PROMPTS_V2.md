# STELLAR — UX Fix Prompts (Revised)
## Based on Visual Audit (April 12, 2026)

> Run each prompt in a new conversation, in order.
> These fix visual/structural issues only — no blockchain or API changes.
> PERFORMANCE RULE: Every visual effect must use CSS only (keyframes, transitions, gradients). No JavaScript animation loops, no requestAnimationFrame, no heavy canvas rendering. The app must feel instant.

---

## FIX PROMPT 1 — Unify Layout Shell + Cosmic Background + Loading Animations

> This is the highest-impact fix. Run this first.

```
I'm building Stellar, a Next.js 15 astronomy app. The app currently has inconsistent navigation, footer, and branding across pages. Some pages use the Stellar logo, others use the Astroman logo. Nav items differ per page. Footers vary. The background is plain dark. Loading states are bare text. All of this needs to be fixed in one pass.

Read ALL of these files before writing anything:
  src/app/layout.tsx
  src/app/globals.css
  src/app/page.tsx (homepage — check which nav/footer components it uses)
  src/app/missions/page.tsx
  src/app/marketplace/page.tsx (or src/app/shop/page.tsx — find the correct path)
  src/app/chat/page.tsx
  src/app/profile/page.tsx
  src/app/learn/page.tsx
  src/app/sky/page.tsx
  src/components/ (list directory — find all nav, header, footer, layout components)

Identify every nav/header and footer component in the codebase. There may be multiple versions:
  - A newer one used on the homepage (with Stellar branding, ✦ logo)
  - An older one used on inner pages (with Astroman logo from club.astroman.ge/logo.png)

---

## PART A — Unified Navigation

Step 1 — Identify the best existing nav component:

The homepage currently has the correct branding:
  - Logo: "STELLAR" text or ✦ mark (NOT the Astroman logo)
  - Mobile bottom nav: Sky · Missions · [Home] · Shop · Profile

Find which component renders this. This is the "good" version.

Step 2 — Identify the old/wrong nav component:

Inner pages (Marketplace, Profile, Chat) currently show:
  - Logo: Astroman logo from club.astroman.ge/logo.png
  - Different nav order with "Learn" instead of "ASTRA"
  - Footer with "Powered by Astroman · Solana · Scriptonia" and "Built at Vibecoding From 0 Hackathon"

Find which component renders this.

Step 3 — Unify to one layout:

Make ALL pages use the same nav and footer:

DESKTOP NAV (top bar):
  - Left: Stellar ✦ logo (link to /) — use the logo.png already in the public folder, NOT the Astroman logo
  - Links: Sky · Missions · ASTRA · Learn · Marketplace · Profile
  - "ASTRA" links to /chat (the AI chat page, NOT the learn page)
  - "Learn" links to /learn (the educational content page)
  - Far right: language toggle (KA/EN) if i18n is set up

MOBILE BOTTOM NAV (fixed bottom bar, ALL pages):
  - 5 items: Sky (/sky) · Missions (/missions) · Home (/) · Shop (/marketplace) · Profile (/profile)
  - Center "Home" item visually distinct (slightly larger or different style)
  - Active page highlighted with teal accent

FOOTER (same on every page):
  - "✦ STELLAR" heading
  - Link columns: Sky Forecast · Missions · ASTRA AI · Learn · Marketplace · Profile · Astroman ↗ · GitHub ↗
  - Bottom: "© 2026 Stellar · Built on Solana"
  - REMOVE: "Powered by Astroman · Solana · Scriptonia"
  - REMOVE: "Built at Vibecoding From 0 Hackathon"

Step 4 — Update every page to use the unified layout:

For each page file (missions, marketplace, chat, profile, learn, sky):
  - Remove any inline nav/header JSX
  - Remove any inline footer JSX
  - Remove imports of the old nav/footer components
  - Ensure the page uses the layout from layout.tsx

If the homepage has its own nav/footer inside page.tsx:
  - Move nav and footer into layout.tsx so they wrap all pages
  - Remove duplicates from page.tsx

Step 5 — Remove broken nav links:

  - Remove "Dark Sky" from any nav if /darksky page doesn't exist (check src/app/darksky/page.tsx)
  - "ASTRA" → /chat (AI chat)
  - "Learn" → /learn (educational content)
  - These are TWO SEPARATE pages. Do not merge them.

Step 6 — Clean up logo references:

Search the entire codebase for "club.astroman.ge/logo.png" — replace every instance with the local Stellar logo (/logo.png).

---

## PART B — Cosmic Background (CSS only, zero JS overhead)

Add a cosmic background to the app that's pure CSS — no canvas, no JavaScript, no animation frames.

In globals.css, add:

1. A subtle star-field effect using CSS radial-gradient (no JS):

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background:
      radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.2) 0%, transparent 100%),
      radial-gradient(1px 1px at 55% 20%, rgba(255,255,255,0.35) 0%, transparent 100%),
      radial-gradient(1px 1px at 70% 65%, rgba(255,255,255,0.25) 0%, transparent 100%),
      radial-gradient(1px 1px at 85% 45%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 15% 60%, rgba(255,255,255,0.5) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 100%),
      radial-gradient(1px 1px at 30% 90%, rgba(255,255,255,0.2) 0%, transparent 100%),
      radial-gradient(1px 1px at 65% 10%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 80% 85%, rgba(255,255,255,0.2) 0%, transparent 100%),
      radial-gradient(1px 1px at 95% 30%, rgba(255,255,255,0.25) 0%, transparent 100%),
      radial-gradient(1px 1px at 5% 50%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(2px 2px at 45% 40%, rgba(255,255,255,0.15) 0%, transparent 100%),
      radial-gradient(1px 1px at 60% 75%, rgba(255,255,255,0.2) 0%, transparent 100%);
    pointer-events: none;
  }

2. A very subtle nebula glow (CSS only):

  body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background:
      radial-gradient(ellipse 600px 400px at 20% 80%, rgba(56, 240, 255, 0.015) 0%, transparent 70%),
      radial-gradient(ellipse 500px 500px at 80% 20%, rgba(139, 92, 246, 0.012) 0%, transparent 70%);
    pointer-events: none;
  }

3. Make sure body background stays #070B14:
  body { background: #070B14; }

IMPORTANT: These are fixed position pseudo-elements with pointer-events:none. They don't affect layout, don't trigger repaints on scroll, and cost zero JavaScript. No canvas element, no requestAnimationFrame, no particle systems.

If the homepage currently has a JavaScript canvas star-field animation, KEEP IT on the homepage only for the hero section. But the CSS background above provides the cosmic feel on ALL pages without any JS cost.

---

## PART C — Loading Animations (CSS only)

Add reusable loading animations in globals.css. These replace all "Loading..." and "Detecting..." plain text across the app.

1. Skeleton shimmer animation:

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 25%,
      rgba(255,255,255,0.06) 50%,
      rgba(255,255,255,0.03) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.8s ease-in-out infinite;
    border-radius: 8px;
  }

2. Pulse dot animation (for "loading" indicators):

  @keyframes pulse-dot {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }

  .loading-dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }
  .loading-dots span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #38F0FF;
    animation: pulse-dot 1.4s ease-in-out infinite;
  }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

3. Fade-in for page content:

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-in {
    animation: fade-in 0.3s ease-out both;
  }

4. Staggered fade-in for lists/grids:

  .stagger-in > * {
    animation: fade-in 0.3s ease-out both;
  }
  .stagger-in > *:nth-child(1) { animation-delay: 0.05s; }
  .stagger-in > *:nth-child(2) { animation-delay: 0.10s; }
  .stagger-in > *:nth-child(3) { animation-delay: 0.15s; }
  .stagger-in > *:nth-child(4) { animation-delay: 0.20s; }
  .stagger-in > *:nth-child(5) { animation-delay: 0.25s; }
  .stagger-in > *:nth-child(6) { animation-delay: 0.30s; }
  .stagger-in > *:nth-child(7) { animation-delay: 0.35s; }

Now search across all pages for plain text loading states and replace them:

Replace all instances of text like "Loading...", "Detecting your location...", "Fetching...", "Loading sky conditions..." with proper skeleton + dots:

Pattern for a loading card:
  <div className="skeleton" style={{ height: 120, width: '100%' }} />

Pattern for loading text:
  <span className="loading-dots"><span/><span/><span/></span>

Pattern for inline loading message:
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
    <span className="loading-dots"><span></span><span></span><span></span></span>
    Detecting location
  </div>

Pages to update (search for "Loading" or "Detecting" in each):
  - src/app/sky/page.tsx — "Detecting your location..." → skeleton cards + dot animation
  - src/app/missions/page.tsx — "Loading sky conditions..." → skeleton + dots
  - src/app/nfts/page.tsx — "Fetching your observations..." → skeleton grid
  - src/app/marketplace/page.tsx — any loading state → skeleton cards
  - Any other page with plain text loading

Also add animate-in class to the main content wrapper of each page for a subtle fade-in on navigation. Just wrap each page's content div with className="animate-in".

Add stagger-in class to all card grids (mission cards, product cards, planet cards, NFT cards) so items appear one by one instead of all at once.

Do NOT use JavaScript-based animation libraries.
Do NOT add requestAnimationFrame or setInterval animations.
All animations are CSS keyframes only — zero runtime cost.
```

---

## FIX PROMPT 2 — Fix Empty/Broken Pages (Marketplace, Profile, ASTRA Chat)

> IMPORTANT: ASTRA chat (/chat) and Learn (/learn) are TWO SEPARATE PAGES. Do not merge them.

```
I'm building Stellar, a Next.js 15 astronomy app. Three pages are broken or empty. Fix each one. Read each file fully before making changes.

CRITICAL: /chat is the ASTRA AI chat page. /learn is the educational content page (planets, constellations, quizzes). These are separate features. The Learn page must NOT be at /chat. If /chat currently renders learn content, that's the bug — fix the route, don't merge them.

---

PROBLEM 1: /chat shows Learn page content instead of ASTRA AI chat

Read: src/app/chat/page.tsx

The /chat route currently renders "Astronomy Guide" with planet facts. This is wrong — that content belongs on /learn.

Search the codebase for the real AI chat component:
  - Search for files containing "ANTHROPIC_API_KEY" or "api/chat" or "streaming" or "useChat" or "ASTRA"
  - Check: src/app/api/chat/route.ts (the API endpoint for Claude)
  - Check: src/components/ for any chat component (ChatInterface, AstraChat, etc.)

If the AI chat component exists but /chat is rendering the wrong page:
  - Fix /chat to render the AI chat component
  - Make sure /learn renders the educational content

If the AI chat component is missing or broken, create a working one at src/app/chat/page.tsx:

  'use client'

  Page layout:
  - Header: "ASTRA ✦" (display/serif font, white) + "Your AI Astronomer" (text-sm, slate-400)
  - Chat area: scrollable container taking remaining viewport height (flex-1, overflow-y-auto)
  - Messages rendered as bubbles:
      User messages: right-aligned, background rgba(56,240,255,0.1), border 1px solid rgba(56,240,255,0.15), rounded-2xl
      ASTRA messages: left-aligned, background rgba(255,255,255,0.04), border 1px solid rgba(255,255,255,0.06), rounded-2xl
      Both: padding 12px 16px, max-width 85%, text-sm, color white
      ASTRA label: "ASTRA ✦" in gold (#FFD166), font-size 10px, above each ASTRA message
  - Input bar at bottom: fixed or sticky
      Dark input field, rounded-xl, border rgba(255,255,255,0.08)
      Placeholder: "Ask about tonight's sky..."
      Send button: teal, arrow icon
  - Three suggestion chips above input (only shown when no messages):
      "What's visible tonight?" · "Best beginner telescope?" · "Explain the Orion Nebula"
      On tap: fill input and auto-submit

  Chat logic:
  - On submit: POST to /api/chat with { messages: [...history, { role: 'user', content: inputText }] }
  - Stream the response using ReadableStream / EventSource (check what /api/chat returns)
  - If /api/chat doesn't exist or returns error: show styled fallback message from ASTRA:
      "I'm being calibrated for the Frontier hackathon. In the meantime, try the Sky Forecast for tonight's conditions!"
      With a link to /sky
  - Store conversation in component state (useState), not localStorage
  - Add a "Clear chat" button (small, top right corner)

  Loading state during ASTRA response:
  - Show typing indicator: three animated dots (use the .loading-dots CSS class from Fix Prompt 1)
  - Text below dots: "ASTRA is thinking..."

  Add animate-in class to messages as they appear.

---

PROBLEM 2: Marketplace page shows no products

Read: src/app/marketplace/page.tsx (or src/app/shop/page.tsx — find the correct path)
Read: src/lib/products.ts (product catalog may exist here)

The marketplace currently renders with just a header and empty content. Diagnose why:
  - Is it importing products? Is the array empty? Is there a render condition failing?

If the product data is missing, create src/lib/products.ts:

  export interface Product {
    id: string
    name: string
    category: 'telescope' | 'accessory' | 'digital'
    price: number
    currency: string
    emoji: string
    description: string
    url: string
    stars: number
  }

  export const products: Product[] = [
    {
      id: 'bresser-76-300',
      name: 'Bresser Junior 76/300',
      category: 'telescope',
      price: 299,
      currency: 'GEL',
      emoji: '🔭',
      description: 'Perfect first telescope for beginners. 76mm reflector with tabletop mount.',
      url: 'https://astroman.ge',
      stars: 5000
    },
    {
      id: 'celestron-astromaster-70',
      name: 'Celestron AstroMaster 70AZ',
      category: 'telescope',
      price: 599,
      currency: 'GEL',
      emoji: '🔭',
      description: '70mm refractor with full-height tripod. Great for Moon and planets.',
      url: 'https://astroman.ge',
      stars: 9000
    },
    {
      id: 'national-geo-60-700',
      name: 'National Geographic 60/700',
      category: 'telescope',
      price: 449,
      currency: 'GEL',
      emoji: '🔭',
      description: '60mm refractor with equatorial mount. Excellent optics for the price.',
      url: 'https://astroman.ge',
      stars: 7000
    },
    {
      id: 'moon-lamp-15',
      name: 'Moon Lamp 15cm',
      category: 'accessory',
      price: 45,
      currency: 'GEL',
      emoji: '🌙',
      description: '3D-printed Moon replica with touch dimmer. 16 colors.',
      url: 'https://astroman.ge',
      stars: 750
    },
    {
      id: 'star-projector',
      name: 'Galaxy Star Projector',
      category: 'accessory',
      price: 65,
      currency: 'GEL',
      emoji: '⭐',
      description: 'Projects stars and nebula patterns on your ceiling. USB powered.',
      url: 'https://astroman.ge',
      stars: 1000
    },
    {
      id: 'eyepiece-kit',
      name: 'Eyepiece & Filter Kit',
      category: 'accessory',
      price: 120,
      currency: 'GEL',
      emoji: '🔍',
      description: '5 eyepieces + 3 color filters + 2x Barlow lens in carry case.',
      url: 'https://astroman.ge',
      stars: 2000
    },
    {
      id: 'custom-starmap',
      name: 'Custom Star Map',
      category: 'digital',
      price: 29,
      currency: 'GEL',
      emoji: '🗺️',
      description: 'Personalized star map for any date and location. Digital download.',
      url: 'https://astroman.ge',
      stars: 500
    }
  ]

Rewrite or fix the marketplace page:
  - Import products from src/lib/products.ts
  - Header: "Marketplace" (serif/display font, white) + small badge "Powered by Astroman" linking to astroman.ge
  - Filter tabs: All · Telescopes · Accessories · Digital
      Tab style: pill buttons, active = white text + teal underline or bg, inactive = slate-400
      Filter by product.category
  - Product grid: grid-cols-2 on mobile, grid-cols-3 on desktop, gap-4
      Add className="stagger-in" to the grid container
  - Each card (dark card, rounded-2xl, overflow hidden):
      - Top: colored emoji on dark gradient background, centered, height 120px
          Background: subtle radial gradient based on category
          telescope → radial-gradient(circle at 50% 50%, rgba(56,240,255,0.06) 0%, transparent 70%)
          accessory → radial-gradient(circle at 50% 50%, rgba(255,209,102,0.06) 0%, transparent 70%)
          digital → radial-gradient(circle at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)
          Emoji: fontSize 48, centered
      - Bottom padding 12px:
          Product name (white, font-semibold, text-sm)
          Description (slate-400, text-xs, line-clamp-2)
          Price row: "{price} GEL" white + " · {stars} ✦" in gold, text-xs
          "Buy on Astroman →" link (teal, text-xs, target _blank)
  - Bottom banner: "Earn Stars by completing sky missions → Start Observing" link to /missions

---

PROBLEM 3: Profile page is completely blank

Read: src/app/profile/page.tsx

Rewrite the profile page:

Unauthenticated state:
  - Centered card (animate-in) with User icon from lucide-react
  - "Observer Profile" title (serif font, white)
  - "Sign in to track your Stars, rank, and observation history" (slate-400, text-sm)
  - Sign in button using Privy login() — same pattern as missions page

Authenticated state (animate-in on all sections):
  - Rank card (top, full width, centered):
      Rank emoji + rank name + "Your Rank" label
      Rank logic (from useAppState or localStorage completed missions count):
        0 missions → ⭐ Stargazer
        1+ → 🔭 Observer
        3+ → 🧭 Pathfinder
        5+ → ✨ Celestial
      Background: subtle gradient matching rank (stargazer = neutral, celestial = gold tint)

  - Stats row (3 cards in a row, stagger-in):
      Missions Completed | Stars Earned | Rank
      Values from useAppState() or localStorage
      Each card: dark bg, centered number (text-2xl white), label below (text-xs slate-400)

  - Stars balance card:
      Large: "{stars} ✦" in gold, text-3xl, font-bold
      Sub: "Complete sky missions to earn more" link to /missions

  - Wallet section (collapsible via details/summary, default closed):
      Summary: "Solana Wallet" with chevron
      Content: truncated address (first6...last4), copy button, "View on Explorer →" link
      Explorer URL: https://explorer.solana.com/address/{wallet}?cluster=devnet

  - Quick links row:
      "My NFTs →" → /nfts (outlined button)
      "Missions →" → /missions (outlined button)

  - Sign out button at bottom:
      Red-tinted ghost style: color #ef4444, border rgba(239,68,68,0.2)
      First tap: text changes to "Are you sure? Tap again to sign out"
      Second tap: calls Privy logout()

Import patterns from missions page for Privy:
  import { usePrivy } from '@privy-io/react-auth'
  const { authenticated, login, logout, user } = usePrivy()
  Wallet: user?.linkedAccounts?.find(a => a.type === 'wallet')?.address
```

---

## FIX PROMPT 3 — Homepage Cleanup

```
I'm building Stellar, a Next.js 15 astronomy app. The homepage needs surgical edits to tighten it for a hackathon demo.

Read src/app/page.tsx fully before making changes.

---

Change 1 — Fix the empty Leaderboard section:

Find the Leaderboard section. It currently shows "The leaderboard is empty."

Replace with seeded demo data — 3 entries:
  #1 🥇 AstroNova · 12 observations · 1,240 ✦
  #2 🥈 CosmicRezi · 8 observations · 890 ✦
  #3 🥉 StarGazer_GE · 5 observations · 620 ✦

Keep the "Start Observing →" CTA below.
Add stagger-in class to the leaderboard list.

---

Change 2 — Fix duplicate hero CTA buttons:

Currently both buttons go to /missions. Change:
  Button 1: "Start Observing →" → /missions (primary style, keep as-is)
  Button 2: "Tonight's Sky →" → /sky (secondary/ghost style)

---

Change 3 — Remove the "Global" badge:

There's a floating "Global" badge near the hero. Remove it entirely.

---

Change 4 — Shorten Partner Telescope Stores section:

Replace the two-store card layout with a single compact banner:
  Dark card, flex row, centered:
    Left: "🔭" emoji
    Center: "Shop telescopes from partner stores worldwide"
    Right: "Browse Store →" link to /marketplace
  One line. Remove the Astroman + High Point Scientific detailed cards.

---

Change 5 — Sky widget fallback:

The "Tonight's Sky" section depends on geolocation. If it shows empty/loading when location is unavailable:
  Add fallback: if geolocation fails after 3 seconds, default to lat=41.7151, lon=44.8271 (Tbilisi).
  Show note: "Showing for Tbilisi" in text-xs slate-400.

---

Do NOT change: How It Works section, Mission cards, ASTRA preview, Rewards section.
```

---

## FIX PROMPT 4 — Visual Consistency (Fonts, Buttons, Cards, Difficulty Badges)

```
I'm building Stellar, a Next.js 15 astronomy app. The visual design is inconsistent — different heading fonts, button styles, card backgrounds. Standardize the design system.

Read these files:
  src/app/globals.css
  src/app/layout.tsx
  src/app/page.tsx (homepage — reference for "good" styles)
  src/app/learn/page.tsx (best-designed page — use as reference)
  src/app/missions/page.tsx
  tailwind.config.ts (or .js)

---

Step 1 — CSS custom properties in globals.css:

Add to :root (merge with any existing variables, don't duplicate):

  :root {
    --bg-primary: #070B14;
    --bg-card: rgba(255, 255, 255, 0.03);
    --bg-card-hover: rgba(255, 255, 255, 0.06);
    --border-subtle: rgba(255, 255, 255, 0.06);
    --border-medium: rgba(255, 255, 255, 0.10);
    --text-primary: #ffffff;
    --text-secondary: #94a3b8;
    --text-muted: rgba(255, 255, 255, 0.35);
    --accent-gold: #FFD166;
    --accent-teal: #38F0FF;
    --accent-green: #34d399;
  }

Step 2 — Display font:

If no serif/display font is imported, add one in layout.tsx using next/font:

  import { Playfair_Display, Inter } from 'next/font/google'
  const serif = Playfair_Display({ subsets: ['latin'], weight: ['400','700'], variable: '--font-display' })
  const sans = Inter({ subsets: ['latin'], variable: '--font-body' })

  Apply to <body>: className={`${serif.variable} ${sans.variable}`}

If another serif font is already imported (Instrument Serif, etc.), keep that — just make sure the variable --font-display is set.

Add to globals.css:
  h1, h2, .font-display { font-family: var(--font-display, Georgia, serif); }

Step 3 — Standardize page titles:

Search all pages for h1/h2 elements. Make sure every main page title uses:
  font-family: var(--font-display)
  color: white
  Pages: Sky Forecast, Sky Missions, ASTRA ✦, Learn, Marketplace, Observer Profile

Step 4 — Standardize buttons:

Add to globals.css:

  .btn-primary {
    background: linear-gradient(135deg, #38F0FF, #2dd4bf);
    color: #070B14;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .btn-primary:hover { opacity: 0.9; }

  .btn-ghost {
    background: transparent;
    color: #94a3b8;
    border: 1px solid rgba(255,255,255,0.10);
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.04); color: white; }

  .btn-gold {
    background: linear-gradient(135deg, #FFD166, #f59e0b);
    color: #070B14;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .btn-gold:hover { opacity: 0.9; }

Don't do a global find-and-replace on all buttons — just add the classes. Use them in newly written or rewritten components.

Step 5 — Mission card difficulty badges:

In missions page, add a small pill badge per difficulty next to the star reward:

  Beginner: bg rgba(52,211,153,0.15), color #34d399
  Intermediate: bg rgba(251,191,36,0.15), color #fbbf24
  Hard: bg rgba(167,139,250,0.15), color #a78bfa
  Expert: bg rgba(239,68,68,0.15), color #ef4444

  Style: font-size 10px, padding 2px 8px, border-radius 9999px, font-weight 500

The difficulty data should already be in the mission objects. If not, map by mission name:
  Moon, Jupiter, Pleiades → Beginner
  Orion Nebula, Saturn → Intermediate
  Andromeda → Hard
  Crab Nebula → Expert

---

Do NOT change page content or structure — only visual styling.
Do NOT modify the Learn page content — it's already good.
```

---

## FIX PROMPT 5 — Sky Page Location Fallback + Skeleton Loading

```
I'm building Stellar, a Next.js 15 astronomy app. The /sky page shows "Detecting your location..." and stays stuck if geolocation fails. Fix this with a fallback and proper skeleton loading.

Read src/app/sky/page.tsx fully before editing.

---

Step 1 — Location fallback:

Find where geolocation is requested (navigator.geolocation.getCurrentPosition).

Add a timeout fallback:

1. Set a 5-second timeout alongside the geolocation request.

2. If geolocation succeeds within 5 seconds: use real coordinates.

3. If it fails or times out:
   - Default to Tbilisi: lat=41.7151, lon=44.8271
   - Show info banner at top:
     "📍 Showing sky for Tbilisi · [Use my location]"
     "[Use my location]" retries geolocation on click
     Banner: bg rgba(56,240,255,0.06), border 1px solid rgba(56,240,255,0.12), rounded-xl, padding 8px 16px, text-xs

4. If geolocation denied (PermissionDeniedError): same fallback, banner says:
   "📍 Location access denied · Showing sky for Tbilisi"
   No retry link.

---

Step 2 — Skeleton loading states:

Replace all text loading indicators on the sky page with skeletons.

For the forecast section (while weather data loads):
  Show 7 skeleton cards in a row (one per day):
    Each: className="skeleton", height 80px, rounded-xl
    Use stagger-in on the container

For the planet section (while planet data loads):
  Show 6 skeleton cards in a grid:
    Each: className="skeleton", height 60px, rounded-xl

For the sun/moon times section:
  Show 2 skeleton bars: className="skeleton", height 40px, width '100%'

Once data arrives, replace skeletons with real content using animate-in class.

---

Do NOT change how weather/planet data is fetched — only the location handling and loading UI.
```

---

## RUN ORDER

1. **FIX PROMPT 1** → Unified layout + cosmic background + loading animations (biggest impact)
2. **FIX PROMPT 2** → Fix marketplace, profile, and ASTRA chat (fills empty pages)
3. **FIX PROMPT 3** → Homepage cleanup (demo-ready)
4. **FIX PROMPT 4** → Visual consistency (polish)
5. **FIX PROMPT 5** → Sky page fallback (prevents blank demo)

## PERFORMANCE RULES (apply to all prompts)
- All animations: CSS @keyframes only. Zero JavaScript animation loops.
- Background effects: CSS gradients on ::before/::after pseudo-elements. No canvas, no particles.js.
- Skeleton loading: CSS shimmer animation. No JS timers for visual effects.
- Page transitions: CSS fade-in (0.3s). No route-level animation libraries.
- Image loading: native loading="lazy" attribute. No intersection observer polyfills.
- Font loading: next/font with display: 'swap'. No FOUT flashes.
