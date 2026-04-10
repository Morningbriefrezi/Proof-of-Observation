I now have everything I need. Full code, all live pages, every component of the core loop. Let me compile the complete report.

🔭 STELLAR — Full UX Audit Report
Date: April 9, 2026 | Reviewer: Stellar UX Advisor
Sources: Live site at stellarrclub.vercel.app + Full source review of github.com/Rezimod/Stellar
Simulated user: Georgian hobbyist, 24yo, Android, came from Astroman Facebook. Zero crypto experience.

🗺️ Executive Summary
The product loop is architecturally sound: observe → camera → verify → reward → collect is all wired up, ASTRA chat is live, quizzes exist, missions award Stars. The core is real. But three critical layers of crypto jargon, two dead pages, a broken collection route, and a 6-tap onboarding wall are actively destroying first impressions. A Georgian Facebook user landing on this site today sees "Astronomy on Solana," a "Connect Wallet" button, "devnet SOL," and a blank Sky page. They leave in 8 seconds. Every fix below targets that window.
Tap audit — core action "See tonight's sky → Observe something":

Home → [Start Observing] → /club Step 1 (login) → Step 2 (claim membership) → Step 3 (register telescope) → /missions → tap mission → camera
= 7 taps minimum. Target is 2.


FINDING #1 — Home Page Hero
Home Page — NEEDS WORK
Problem: Browser tab reads "Stellar — Astronomy on Solana." How It Works Step 4 says "Mint" with description "Proof sealed on Solana as your NFT." The Ecosystem card for the app itself says "NFT missions." The <meta> description and OpenGraph tags say "seal your discoveries as compressed NFTs on Solana." A Georgian parent browsing this for their kid sees the word "Solana" before they see anything about the Moon.
Fix: Scrub all crypto language from the hero, How It Works, and all meta tags. Replace "Mint" step with "Seal." Replace "NFT" with "Discovery Badge." Replace meta description.
Copy suggestion EN:

Tab title: Stellar — Astronomy Club by Astroman
Step 4 title: Seal
Step 4 desc: Your observation is saved as a permanent discovery badge
Ecosystem card desc: Collect discoveries, earn rewards
Meta description: Observe the night sky with your telescope. Earn real rewards from Astroman. Verify what you see, collect your discoveries.

Copy suggestion KA:

Tab title: სტელარი — ასტრონომიის კლუბი Astroman-ისგან
Step 4 title: დაიბეჭდე
Step 4 desc: შენი დაკვირვება ინახება, როგორც მუდმივი აღმოჩენის ნიშანი
Meta description: დააკვირდი ღამის ცას შენი ტელესკოპით. მიიღე რეალური ჯილდოები Astroman-ისგან.

Claude Code Prompt:
In src/app/layout.tsx, update the metadata object:
- Change title to: 'Stellar — Astronomy Club by Astroman'
- Change description to: 'Observe the night sky with your telescope. Earn real rewards from Astroman. Verify your observations and collect your discoveries.'
- Change openGraph.title to: 'Stellar — Astronomy Club by Astroman'
- Change openGraph.description to match the new description
- Change twitter.title and twitter.description to match

In src/messages/en.json, update home.steps:
- Change "mint" key value from "Mint" to "Seal"
- Change "mintDesc" value from "Proof sealed on Solana as your NFT" to "Your observation is permanently saved as a discovery badge"

In src/app/page.tsx, find the ecoCards array. Change the third card's desc property from 'NFT missions' to 'Collect discoveries, earn rewards'.

In src/messages/ka.json (or wherever Georgian translations live), apply the equivalent changes to the same keys.

FINDING #2 — Onboarding Step Labels
/club Onboarding — RETHINK
Problem: The three step labels in StepProgress are literally "Wallet," "Membership," "Telescope." The h1 says "Join Stellar Club." For a non-crypto user these are fine except "Wallet" — which is a crypto-specific term that will trigger immediate suspicion or confusion. The flow also requires 3 mandatory gates before any payoff. Zero reward before the wall.
Fix: Rename step labels. Combine steps 1 and 2 into a single "Join" step — claiming the free membership should happen silently after email sign-in, not be a separate tap. Telescope registration should be optional/"Later" with a skip link. Immediately show a welcome reward when they finish.
Copy suggestion EN:

Step 1 label: Join
Step 2 label: Start
Step 3 label: Telescope (keep, but add "Skip for now" link)
h1: Start Your Observation Journey
Sub: Join thousands of astronomers. Free forever.

Copy suggestion KA:

Step 1: შეერთება
Step 2: დაწყება
Step 3: ტელესკოპი
h1: დაიწყე შენი დაკვირვების მოგზაურობა
Sub: შეუერთდი ათასობით ასტრონომს. სრულიად უფასოდ.

Claude Code Prompt:
In src/app/club/page.tsx:

1. Change the steps array from:
   { label: 'Wallet', done: state.walletConnected },
   { label: 'Membership', done: state.membershipMinted },
   { label: 'Telescope', done: !!state.telescope },
to:
   { label: 'Join', done: state.walletConnected },
   { label: 'Start', done: state.membershipMinted },
   { label: 'Telescope', done: !!state.telescope },

2. Change stepTitles array from:
   ['Connect Wallet', 'Claim Membership', 'Register Telescope']
to:
   ['Create Your Account', 'Activate Observer Status', 'Register Your Telescope']

3. Change the h1 text from 'Join Stellar Club' to 'Start Your Observation Journey'

4. Change the subtitle paragraph from 'Observe the night sky, earn real rewards.' 
   to 'Join thousands of astronomers. Free forever.'

In src/components/club/TelescopeStep.tsx, add a "Skip for now →" link button 
below the "Register Telescope 🔭" button that calls the same router.push('/missions') 
that happens after telescope is registered, but without saving telescope data. 
Style it as: text-xs text-slate-600 hover:text-slate-400 underline mt-2.

FINDING #3 — WalletStep Crypto Leakage
WalletStep Component — RETHINK
Problem: After the user signs in via email, the UI surfaces: "Solana wallet connected," "Activating wallet on Solana devnet…," "✓ Wallet activated — 1 devnet SOL funded," "View on Solana Explorer ↗," and on failure: "Get free devnet SOL at faucet.solana.com." Every single one of these is a crypto term that violates Rule #1. The step card title itself says "Connect Wallet." For a user who came to photograph Jupiter, this is a horror film.
Fix: Rename all post-auth strings. Hide the airdrop status completely — it's a backend detail. Remove the Solana Explorer link from this step. The wallet address should never be shown here.
Copy suggestion EN:

Card title: Create Your Account
After sign-in success: ✓ Account created & ready
Sub-status: Your astronomy profile is set up
Remove entirely: "Activating wallet on Solana devnet…", "1 devnet SOL funded", "Wallet registered — needs activation", "Get free devnet SOL at faucet.solana.com ↗", "View on Solana Explorer ↗"

Copy suggestion KA:

Card title: შექმენი შენი ანგარიში
After sign-in: ✓ ანგარიში შექმნილია და მზადაა
Sub-status: შენი ასტრონომიული პროფილი დაყენებულია

Claude Code Prompt:
In src/components/club/WalletStep.tsx make the following changes:

1. Change the h3 text from 'Connect Wallet' to 'Create Your Account'

2. In the "done" state display block, replace ALL of the following with this clean success UI:
   Remove: the airdropStatus === 'funding' paragraph
   Remove: the airdropStatus === 'funded' paragraph  
   Remove: the walletBalance === 0 warning block
   Remove: the airdropStatus === 'failed' block
   Remove: the "View on Solana Explorer ↗" anchor tag
   
   Replace with just:
   <div className="flex items-center gap-2 text-[#34d399]">
     <CheckCircle2 size={15} />
     <span className="text-sm font-medium">Account created & ready</span>
   </div>
   <p className="text-slate-500 text-xs mt-1">Your astronomy profile is set up</p>

3. In the "not done" state, change the email section:
   - Change h-level text 'Continue with Email' to 'Join with your Email'
   - Change description from 'We create a Solana wallet for you automatically. No app needed.' 
     to 'No downloads needed. Takes 30 seconds.'
   - Change Button text from 'Continue with Email →' to 'Join Stellar →'
   - Change footer text from 'Also supports Google, SMS, and existing wallets.' 
     to 'Also supports Google and SMS sign-in.'
     (remove mention of "existing wallets" — irrelevant for target audience)

FINDING #4 — MembershipStep Crypto Leakage
MembershipStep Component — NEEDS WORK
Problem: After joining, the membership card says "Founding Member · Observations mint on Solana." The word "mint" is crypto jargon. Also this entire step is unnecessary friction — claiming a free "membership" is an invisible backend action that adds a tap with zero perceived value for the user.
Fix: Either auto-claim membership silently after email sign-in (merge with step 1), OR rebrand it as something motivating like "Choose Your Observer Rank" or a welcome moment.
Copy suggestion EN:

Card title: Activate Observer Status
Button: Activate Now — It's Free ✦
Success: Founding Observer · Collecting discoveries since 2026
Remove: "Observations mint on Solana"

Copy suggestion KA:

Card title: გააქტიურე დამკვირვებლის სტატუსი
Button: გააქტიურე ახლა — უფასოა ✦
Success: დამაარსებელი დამკვირვებელი · 2026-დან

Claude Code Prompt:
In src/components/club/MembershipStep.tsx:

1. Change the h3 text from 'Claim Membership' to 'Activate Observer Status'

2. Change the paragraph text from 'Claim your free membership to unlock sky missions and earn rewards.'
   to 'Activate your free observer status to unlock tonight\'s sky missions.'

3. Change the Button text from 'Claim Membership ✦' to 'Activate Now — It\'s Free ✦'
   (keep the joining/disabled states as-is)

4. In the done state card, change the subtitle p tag from:
   'Founding Member · Observations mint on Solana'
   to:
   'Founding Observer · Discovering since 2026'

5. In the done state card, change the main label from 'Stellar Club Member' to 'Observer Status: Active'

FINDING #5 — Sky Page Is Blank
/sky Page — RETHINK
Problem: The live site at stellarrclub.vercel.app/sky shows only the heading "Sky Forecast" and sub-heading "Planets Tonight" — zero actual content. No cloud cover, no planet data, no sun/moon times, nothing. This is likely a JavaScript hydration failure, an API key missing in the Vercel environment, or a client-side data fetch that silently fails. This is the second nav item and the most important entry point for a casual stargazer. It's a dead end.
Fix: Add a loading skeleton and a non-empty fallback state. At minimum, show the planet grid statically if the weather API fails. Add error boundary with a retry button inside the components. Also audit TonightHighlights, SunMoonBar, ForecastGrid, PlanetGrid for missing API keys / uncaught fetch errors.
Copy suggestion EN (fallback state):

Tonight's forecast is loading… Check your connection or try again.
[Retry]
(below) Show static planet visibility for tonight based on date calculation (no API needed)

Copy suggestion KA:

დღეს ღამის პროგნოზი იტვირთება… შეამოწმეთ კავშირი ან სცადეთ ხელახლა.

Claude Code Prompt:
In src/app/sky/page.tsx, wrap each section component in an individual 
React Suspense boundary with a skeleton fallback:

import { Suspense } from 'react';

Replace the return block structure so that each child component:
TonightHighlights, SunMoonBar, ForecastGrid, PlanetGrid, EventBanner
is individually wrapped like:
  <Suspense fallback={<div className="h-24 rounded-xl bg-white/5 animate-pulse" />}>
    <TonightHighlights />
  </Suspense>

Additionally, in each of the sky components (TonightHighlights.tsx, ForecastGrid.tsx, 
PlanetGrid.tsx), wrap their data fetch calls in try/catch blocks and render a 
non-empty fallback UI when data is unavailable:
  - If forecast fails: show "Sky data unavailable — try again later" 
    with a retry button that re-triggers the fetch
  - If planet data fails: show at least the static list of planet names 
    from the MISSIONS constant with "Check tonight" as their status

In PlanetGrid specifically, ensure there is always at least one visible element 
even when the API returns empty — use the MISSIONS array from @/lib/constants 
as static fallback data for planet names.

FINDING #6 — Marketplace Page Is Blank
/marketplace Page — RETHINK
Problem: stellarrclub.vercel.app/marketplace shows only the "Marketplace" heading. ProductGrid renders nothing. This is either a missing API connection to astroman.ge, a build-time data issue, or a runtime error in ProductGrid. For a user who came to buy a telescope, this is a dead end that makes the whole app feel unfinished.
Fix: Add static product data as fallback (at minimum 3 telescope listings with real Astroman product images/links), add a loading state, add error boundary. The fallback should link to astroman.ge directly with UTM parameters.
Copy suggestion EN:

Loading: Loading Astroman's catalog…
Error fallback CTA: Browse all telescopes at astroman.ge →

Copy suggestion KA:

Loading: Astroman-ის კატალოგი იტვირთება…
Error fallback: იხილეთ ყველა ტელესკოპი astroman.ge-ზე →

Claude Code Prompt:
In src/components/marketplace/ProductGrid.tsx (or wherever ProductGrid is defined):

1. Add a static FALLBACK_PRODUCTS array at the top of the file with at least 3 items:
   const FALLBACK_PRODUCTS = [
     { id: 1, name: 'Celestron AstroMaster 70AZ', price: '₾349', image: '/products/celestron-70.jpg', href: 'https://astroman.ge?utm_source=stellar&utm_medium=app' },
     { id: 2, name: 'Sky-Watcher 130/650', price: '₾599', image: '/products/skywatcher-130.jpg', href: 'https://astroman.ge?utm_source=stellar&utm_medium=app' },
     { id: 3, name: 'National Geographic 76/700', price: '₾249', image: '/products/ng-76.jpg', href: 'https://astroman.ge?utm_source=stellar&utm_medium=app' },
   ];

2. Wrap the entire component in an error boundary pattern using useState + useEffect:
   - Show a loading skeleton (3 cards with animate-pulse) while fetching
   - If fetch fails or returns empty, render FALLBACK_PRODUCTS 
   - Each fallback card links directly to astroman.ge with a "View at astroman.ge →" CTA

3. Add a non-empty state message above the grid:
   "Earn Stars on missions to unlock exclusive member discounts"
   styled as text-sm text-slate-400 mb-4

4. If the API completely fails, add a prominent banner:
   <a href="https://astroman.ge?utm_source=stellar&utm_medium=app" 
      className="block w-full py-4 text-center rounded-xl bg-[#FFD166]/10 border border-[#FFD166]/30 text-[#FFD166] font-semibold text-sm mb-4">
     Browse all 200+ telescopes at astroman.ge →
   </a>

FINDING #7 — Broken /nfts Route
MissionActive Done Screen — NEEDS WORK
Problem: After completing a mission, the "View My Collection" button calls router.push('/nfts'). This route does not exist in the app. This is the highest-emotion moment in the entire product — a user just completed their first observation and tapped the button they care most about — and they hit a 404. Catastrophic trust destruction.
Fix: Either create the /nfts page, or change the route to /profile and scroll to the mission history section. Immediate solution: redirect to /missions or /profile with a filter/hash.
Copy suggestion EN:

Button text: View My Discoveries
Route: /profile#discoveries

Copy suggestion KA:

Button: ნახე ჩემი აღმოჩენები

Claude Code Prompt:
In src/components/sky/MissionActive.tsx, find the done state JSX block.
Locate the "View My Collection" button:
  <button onClick={() => router.push('/nfts')} ...>
    View My Collection
  </button>

Change it to:
  <button 
    onClick={() => { onClose(); router.push('/profile'); }}
    className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-colors"
    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
  >
    View My Discoveries
  </button>

This routes to /profile where mission history is displayed. 
The onClose() call ensures the mission overlay closes cleanly before navigation.

Additionally, in the same done block, change the footer paragraph from:
  'Compressed NFT · Solana Devnet · {date}'
to:
  'Observation verified · {date}'

FINDING #8 — Mission Complete Share Text
MissionActive Done Screen — NEEDS WORK
Problem: Pre-filled share text for Warpcast says: "I just observed {mission.name} and sealed it on Solana ✦\n\nstellarrclub.vercel.app" — and for X: "Just observed {mission.name} and sealed it as a compressed NFT on @solana ✦". Both texts expose blockchain language in posts that non-crypto users will share. They will either not share (embarrassed by jargon they don't understand) or share it and confuse their astronomy friends.
Fix: Rewrite share copy to focus on the discovery and the astronomy achievement.
Copy suggestion EN (Warpcast):
I just observed {mission.name} through my telescope ✦ Captured and verified with Stellar by Astroman\n\nstellarrclub.vercel.app
Copy suggestion EN (X/Twitter):
Just observed {mission.name} through my telescope and collected my discovery ✦\n\n@AstromanGe stellar app → stellarrclub.vercel.app
Copy suggestion KA:
ახლახან დავაკვირდი {mission.name}-ს ჩემი ტელესკოპით ✦ გადამოწმებული Stellar-ით\n\nstellarrclub.vercel.app
Claude Code Prompt:
In src/components/sky/MissionActive.tsx, find the share buttons section in the 'done' step JSX.

Replace the Warpcast button's onClick handler text:
Change: `I just observed ${mission.name} and sealed it on Solana ✦\n\nstellarrclub.vercel.app`
To: `I just observed ${mission.name} through my telescope ✦ Verified with Stellar by Astroman\n\nstellarrclub.vercel.app`

Replace the X/Twitter button's onClick handler text:
Change: `Just observed ${mission.name} and sealed it as a compressed NFT on @solana ✦\n\nstellarrclub.vercel.app`
To: `Just observed ${mission.name} through my telescope and logged my discovery ✦\n\n@AstromanGe stellarrclub.vercel.app`

Also rename the button labels from 'Warpcast' and 'Post on X' 
to 'Share on Warpcast' and 'Share on X' for clarity.

FINDING #9 — Profile Page Crypto Overload
/profile Page — NEEDS WORK
Problem: The balance card is the FIRST thing an authenticated user sees in their profile. It shows: X.XXX SOL in a large bold font, Solana devnet as a subtitle, the full wallet address in monospace, "Add via Card" (shows "Coming soon" on tap — broken), and "Send Crypto" button. There are also ExternalLink icons that open Solana Explorer. This is a cryptocurrency wallet interface, not an astronomy app. Zero crypto visibility is the rule — this violates it completely.
Fix: Replace the SOL balance card with a Stars balance card. Show the wallet address only behind a collapsible "Advanced" section. Remove "Send Crypto" button. Replace the balance display with the user's actual Stars (✦) earned and their rank badge. The page's first impression should be: "You are a Stellar Observer, Level 3, with 425 ✦ Stars."
Copy suggestion EN:

Card header: Your Stars
Primary value: 425 ✦
Sub-line: Spend Stars for discounts at astroman.ge
Remove: SOL balance display, "Solana devnet", "Send Crypto"
"Add via Card" → rename to Buy Stars (Coming Soon) if kept, or remove entirely

Copy suggestion KA:

Card header: შენი ვარსკვლავები
Primary value: 425 ✦
Sub-line: გამოიყენე ვარსკვლავები ფასდაკლებისთვის astroman.ge-ზე

Claude Code Prompt:
In src/app/profile/page.tsx, make the following changes to the authenticated view:

1. Replace the entire "Balance card" div (the one with the SOL balance display) with 
   a Stars card:
   
   <div className="rounded-2xl p-5 flex flex-col gap-4 animate-page-enter"
     style={{
       background: 'linear-gradient(135deg, rgba(255,209,102,0.1) 0%, rgba(15,31,61,0.6) 100%)',
       border: '1px solid rgba(255,209,102,0.25)',
     }}>
     <div className="flex items-start justify-between">
       <div>
         <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider mb-1">Your Stars</p>
         <p className="text-4xl font-bold text-[#FFD166]">{starsBalance || totalStars} <span className="text-2xl">✦</span></p>
         <p className="text-slate-500 text-xs mt-1">Spend Stars for discounts at astroman.ge</p>
       </div>
       <div className="text-right">
         <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider mb-1">Rank</p>
         <p className="text-white text-sm font-semibold">{rank.name}</p>
       </div>
     </div>
     <a href="https://astroman.ge?utm_source=stellar_profile&utm_medium=app"
       target="_blank" rel="noopener noreferrer"
       className="w-full py-2.5 rounded-xl text-sm font-bold text-center transition-all"
       style={{ background: 'linear-gradient(135deg, #FFD166, #CC9A33)', color: '#070B14' }}>
       Spend Stars at astroman.ge →
     </a>
   </div>

2. Remove the "Fund buttons" grid (the grid containing "Add via Card" and "Send Crypto" buttons).

3. Move the wallet address section into a collapsible "Advanced" disclosure:
   Add a <details> element below the Stars card:
   <details className="mt-2">
     <summary className="text-xs text-slate-700 hover:text-slate-500 cursor-pointer py-1">
       Advanced — Wallet details
     </summary>
     {/* paste the existing address row and explorer link here */}
   </details>

4. In the "not authenticated" state card, keep as-is but change:
   - 'signInSubtitle' displayed text stays as cosmic-flavored
   - The sign-in CTA button text should say 'Start Observing' not 'Create Account'

FINDING #10 — Dual Navigation Systems
Navigation Architecture — RETHINK
Problem: The main app (/sky, /chat, /marketplace, /missions, /profile) uses one nav with Sky / Learn / Marketplace / Missions / Profile. But the /missions page (unauthenticated state, and in-session) shows a completely different nav: "Club / Missions / Gallery / Profile" — and two of those items (Missions, Gallery) are plain text with no href, not links. The "Gallery" tab leads nowhere. This is a split-brain navigation that breaks the user's mental map every time they enter the missions area.
Fix: Standardize to ONE navigation system. Remove the secondary club/missions nav entirely and use the main nav everywhere. If there are sub-tabs needed inside missions (Missions / Gallery), implement them as in-page tabs, not a top nav replacement.
Claude Code Prompt:
Check if there is a layout.tsx file in src/app/missions/ or src/app/(club)/ 
or any route group that overrides the main layout.tsx navigation.

If a separate layout file exists for the missions/club area:
1. Delete the custom Nav from that layout
2. Remove the duplicate "Club / Missions / Gallery / Profile" navigation
3. Rely on the main layout.tsx Nav and BottomNav instead

If the secondary nav is rendered inside a component (look for any component 
rendering a nav with "Club", "Missions", "Gallery", "Profile" as items):
1. Find that component
2. Replace it with in-page tab buttons (not a nav element):
   const MISSION_TABS = [
     { id: 'missions', label: 'Missions' },
     { id: 'gallery', label: 'My Discoveries' },
   ];
   Render these as styled <button> elements with onClick handlers 
   to switch between the MissionList and a new gallery/collection view
3. Make "My Discoveries" tab show the user's completedMissions from state

Also rename the "Gallery" concept throughout to "My Discoveries" — 
it's more motivating and less generic.

FINDING #11 — "Devnet" Label on Missions Page
/missions Page Header — NEEDS WORK
Problem: The missions page header shows <span className="ml-auto text-[10px] text-slate-700 uppercase tracking-widest">Devnet</span> next to the Missions h1. "Devnet" is a Solana developer network term. 100% of the Georgian astronomy audience will not know what it means. For those who do (developers), it signals "this is a test environment," which undermines trust in the rewards.
Fix: Remove it entirely. When the app moves to mainnet, this label should not return — there should never be network visibility in the astronomy UI.
Copy suggestion EN: (no label)
Copy suggestion KA: (no label)
Claude Code Prompt:
In src/app/missions/page.tsx, find and remove the following element entirely:
  <span className="ml-auto text-[10px] text-slate-700 uppercase tracking-widest">Devnet</span>

Also, in the same file, find the sky conditions status line:
  'Sky conditions: Observable' / 'Daytime — missions available tonight'

Change these to:
  '🟢 Sky conditions: Good for observing tonight' 
  '☀️ Daytime — come back after sunset'
This makes the time-based state change more motivating for a user checking during the day.

FINDING #12 — ASTRA Chat Discoverability
AstroChat Floating Button — NEEDS WORK
Problem: ASTRA is one of Stellar's best features — an actual AI astronomy companion. But it's buried as a floating Radio icon button in the bottom-right corner. New users from Facebook will not know it exists. The /chat route (accessible from the "Learn" nav tab) leads to a static accordion knowledge base, NOT the AI chat. So the most compelling feature of the product is hidden.
Fix: On the /chat (Learn) page, make ASTRA the primary interface — open the chat automatically when the user lands on the Learn page. Also rename the nav item from "Learn" to "Ask ASTRA" and update the chat page heading. The floating button should also show a tooltip/pulse on first visit.
Copy suggestion EN:

Nav label: Ask ASTRA
Chat page h1: Ask ASTRA Anything
Chat page sub: Your personal astronomy guide. Ask about tonight's sky, your telescope, or anything in the cosmos.
Initial tooltip on FAB: Ask ASTRA ✦

Copy suggestion KA:

Nav label: ჰკითხე ASTRA-ს
Chat page h1: ჰკითხე ASTRA-ს ნებისმიერი რამ
Sub: შენი პირადი ასტრონომიული გიდი.

Claude Code Prompt:
1. In src/messages/en.json, change:
   "learn": "Learn"  →  "learn": "Ask ASTRA"
   (also update the ka.json equivalent)

2. In src/app/chat/page.tsx, change the page h1 from 'Astronomy Guide' to 'Ask ASTRA'
   and add a subtitle below it:
   <p className="text-slate-400 text-sm mt-1 mb-6">
     Your personal astronomy guide. Ask about tonight\'s sky, your telescope, or the cosmos.
   </p>

3. In the same chat page, add a button above the planets accordion that opens ASTRA:
   <button
     onClick={() => document.querySelector('[aria-label="Open ASTRA astronomy assistant"]')?.click()}
     className="w-full py-4 rounded-2xl text-sm font-bold mb-6 transition-all"
     style={{ background: 'linear-gradient(135deg, rgba(56,240,255,0.15), rgba(26,143,160,0.1))', border: '1px solid rgba(56,240,255,0.25)', color: '#38F0FF' }}>
     💬 Open ASTRA Chat →
   </button>

4. In src/components/shared/AstroChat.tsx, add a first-visit pulse indicator:
   - Check localStorage for 'astra_visited' key
   - If it doesn't exist, add a pulsing ring around the FAB button:
     <div className="absolute inset-0 rounded-2xl animate-ping" 
       style={{ background: 'rgba(56,240,255,0.3)', animationDuration: '2s' }} />
   - Set 'astra_visited' = '1' in localStorage when the button is first clicked
   - Only show the pulse for the first 3 visits (check a counter in localStorage)

FINDING #13 — Language Toggle Is Ambiguous
LanguageToggle Component — NEEDS WORK
Problem: The nav shows a plain text "KA" button with no visual context. Georgian users may not know "KA" is the ISO code for Georgian. Non-Georgian users clicking it will switch to a script they can't read with no way back (the toggle presumably switches to "EN" but they may not find it). No flag, no label, no tooltip.
Fix: Show "🇬🇪 KA / EN" with a flag or use flag emoji. Add a tooltip. Use the full word on desktop.
Copy suggestion EN: 🇬🇪 Georgian / English
Copy suggestion KA: 🇬🇪 ქართული / English
Claude Code Prompt:
In src/components/nav/LanguageToggle.tsx (or wherever LanguageToggle is defined):

1. If the button currently shows just 'KA' or 'EN', update it to show:
   - When current locale is 'en': <span>🇬🇪 <span className="hidden sm:inline">Georgian</span><span className="sm:hidden">KA</span></span>
   - When current locale is 'ka': <span>🇬🇧 <span className="hidden sm:inline">English</span><span className="sm:hidden">EN</span></span>

2. Add a title attribute to the toggle button:
   title={locale === 'en' ? 'Switch to Georgian / გადართვა ქართულზე' : 'Switch to English'}

3. Add aria-label for accessibility:
   aria-label={locale === 'en' ? 'Switch to Georgian language' : 'Switch to English language'}

FINDING #14 — Leaderboard Is Hardcoded / Fake
Home Page Leaderboard — NEEDS WORK
Problem: The leaderboard data is 100% hardcoded: AstroHunter (Tbilisi, 1280 ✦), StarFinder (Lisbon, 940 ✦)… etc. The "Tbilisi" entry is a nice local touch but Georgian users who sign up and complete missions will never see themselves on this leaderboard. It's a social proof element that will quickly become a trust problem once real users exist.
Fix: Either remove the leaderboard until real data exists, or label it "Demo Rankings" visibly, or add a note "Join to appear here." Best short-term fix: make the leaderboard pull from real completedMissions data in state when available, and show the current user's rank even if there are only a few entries.
Copy suggestion EN:

Section label: — This Week's Top Observers —
If user is on leaderboard: You are #3 this week! 🔭
If no real data yet: remove the section or replace with "Be the first Stellar observer in your city"

Copy suggestion KA:

— ამ კვირის საუკეთესო დამკვირვებლები —
შენ ხარ #3 ამ კვირაში! 🔭

Claude Code Prompt:
In src/app/page.tsx, find the hardcoded leaderboard array:
[
  { rank: 1, name: 'AstroHunter', location: 'Tbilisi', points: 1280, verified: true },
  ...
]

Replace this section with a component that:
1. Reads state.completedMissions from useAppState hook
2. Tries to fetch a real leaderboard from /api/leaderboard (create this endpoint later)
3. Falls back to the hardcoded data ONLY if the fetch fails
4. Add a small label above the leaderboard: 
   <span className="text-[10px] text-slate-700 ml-2">(demo)</span>
   that shows when using fallback data
5. If the current user has any completed missions, add them to the leaderboard
   display as a highlighted entry with a "You" badge:
   <span className="text-[10px] text-[#FFD166] ml-1">You</span>
6. Change the section header from 'Leaderboard' to 'Top Observers This Week'
   in both the JSX text and the en.json / ka.json translation keys

FINDING #15 — Two-Tap Rule: Core Loop Path
Home → Observe Flow — RETHINK
Problem: The primary CTA "Start Observing →" takes users to /club for a 3-step setup. The Sky page (which should be tap 1 for a casual browser) is a separate nav tab. The path to see tonight's sky and start a mission is: Home → [Start Observing] → /club (Step 1, 2, 3) → auto-redirect /missions → tap mission card → mission overlay opens = 6+ taps before the camera. This violates the 2-tap rule entirely.
Fix: Restructure the primary CTA to lead to /sky first (instant value, no auth). The sky page should show tonight's targets with a "Observe This →" button on each. THAT button triggers sign-up if not authenticated. The club onboarding is triggered in-context only when needed, not as a wall.
Copy suggestion EN:

Hero CTA: See Tonight's Sky → (links to /sky)
On each planet card in Sky page: Observe This 🔭 (triggers auth if needed, then starts mission)
Below hero CTA, add secondary link: Already a member? Go to Missions →

Copy suggestion KA:

Hero CTA: ნახე დღეს ღამის ცა →
Planet card CTA: დააკვირდი 🔭

Claude Code Prompt:
In src/app/page.tsx:

1. Change the hero Link from href="/club" to href="/sky"
2. Change the button text from t('common.startObserving') to 'See Tonight\'s Sky →'
   (and update the translation key common.startObserving in en.json and ka.json)
3. Add a secondary link below the main CTA button:
   <Link href="/missions" className="text-xs text-slate-600 hover:text-slate-400 underline mt-1">
     Already a member? Go to Missions →
   </Link>

In src/app/sky/page.tsx, after the PlanetGrid component, 
pass an onObserve callback to PlanetGrid:
  <PlanetGrid onObserve={(planetId) => { /* trigger mission start */ }} />

In src/components/sky/PlanetGrid.tsx, add an "Observe This 🔭" button 
to each planet card. When clicked:
  - If user is authenticated (usePrivy().authenticated): 
    navigate to /missions and highlight the matching mission
  - If not authenticated:
    call login() from usePrivy() then redirect to /missions after auth completes
Style the button: px-3 py-1.5 text-xs font-semibold rounded-lg 
bg-gradient-to-r from-[#FFD166] to-[#CC9A33] text-black mt-2

FINDING #16 — Footer Shows "Powered by Solana"
Footer Component — NEEDS WORK
Problem: Every page footer shows "Powered by [Astroman logo] · Solana · Scriptonia." The Solana link is a direct <a> to solana.com. While acceptable for developers and crypto-savvy users, for the Georgian hobby astronomy audience it introduces unnecessary confusion and the impression that this is a crypto product, not an astronomy app.
Fix: Remove the Solana link from the public-facing footer. Keep Astroman and Scriptonia. Add a short astronomy-focused tagline instead.
Copy suggestion EN:

Built with 🔭 by Astroman · Powered by Scriptonia · Made in Georgia 🇬🇪

Copy suggestion KA:

შეიქმნა 🔭 Astroman-ის მიერ · Scriptonia-ს ძალით · გაკეთებული საქართველოში 🇬🇪

Claude Code Prompt:
In src/components/shared/Footer.tsx (find this file):
Remove the Solana anchor element: <a href="https://solana.com">Solana</a> 
and its surrounding separator dots.

Replace the footer attribution line with:
<p className="text-[10px] text-slate-700 text-center">
  Built with 🔭 by{' '}
  <a href="https://astroman.ge" target="_blank" rel="noopener noreferrer" 
     className="hover:text-slate-500 transition-colors">Astroman</a>
  {' '}·{' '}
  <a href="https://scriptonia.xyz" target="_blank" rel="noopener noreferrer"
     className="hover:text-slate-500 transition-colors">Scriptonia</a>
  {' '}· Made in Georgia 🇬🇪
</p>

FINDING #17 — Stars / Rewards Redemption Is Missing
Rewards Flow — RETHINK
Problem: Users earn Stars (✦) from missions. The home page promises "Discounts up to 20% on telescopes" and "Free Moon Lamp." But there is no redemption UI anywhere. The Marketplace page is blank. The Profile page has no "spend Stars" mechanism. The Stars balance in the profile links to nothing actionable. Users accumulate Stars but have no loop to spend them — the reward becomes meaningless.
Fix: Add a "Spend Your Stars" section to both the Marketplace page and Profile page with specific: current balance, minimum threshold for each reward, and a "Claim Discount Code" button that either generates a code or links to astroman.ge with the discount pre-applied.
Copy suggestion EN:

You have 425 ✦ Stars
500 ✦ = 10% discount on any telescope
[Claim 10% Discount Code] (greyed out until 500 ✦ reached: You need 75 more ✦)
1,000 ✦ = 20% discount on any telescope
250 ✦ = Free Moon Lamp with next order

Copy suggestion KA:

შენ გაქვს 425 ✦ ვარსკვლავი
500 ✦ = 10% ფასდაკლება ნებისმიერ ტელესკოპზე
[მოითხოვე 10% ფასდაკლების კოდი]

Claude Code Prompt:
Create a new component: src/components/shared/StarsRedemption.tsx

This component should:
1. Accept props: starsBalance: number
2. Define a REWARDS_TIERS array:
   const REWARDS_TIERS = [
     { stars: 250, label: 'Free Moon Lamp', desc: 'With your next telescope order', code: 'MOONLAMP25' },
     { stars: 500, label: '10% Telescope Discount', desc: 'On any telescope at astroman.ge', code: 'STELLAR10' },
     { stars: 1000, label: '20% Telescope Discount', desc: 'On any telescope at astroman.ge', code: 'STELLAR20' },
   ];
3. For each tier, render a card showing:
   - The reward name and description
   - A progress bar: (starsBalance / tier.stars) * 100% width, capped at 100%
   - If starsBalance >= tier.stars: a "Claim Code" button that copies the code to clipboard and shows it
   - If not enough stars: "{tier.stars - starsBalance} more ✦ needed" in text-slate-500

Style it using the existing glass-card class and #FFD166 gold accent colors.

Then import and render <StarsRedemption starsBalance={starsBalance || totalStars} /> 
in both:
- src/app/profile/page.tsx (below the stats grid)
- src/app/marketplace/page.tsx (above the ProductGrid, only when authenticated)

FINDING #18 — ASTRA Chat Suggestions Are Generic
AstroChat Suggestions — NEEDS WORK
Problem: The quick suggestion chips shown when first opening ASTRA are: "How do I find Jupiter tonight?", "Best eyepiece for the Moon?", "How to focus my telescope?", "What is the Orion Nebula?" — these are decent but generic and static. They don't change based on time of night, the user's mission progress, or their telescope. A beginner who just signed up and registered a Celestron 70AZ needs different suggestions than a veteran who just completed 5 missions.
Fix: Make the suggestions dynamic based on: (1) time of day (daytime = setup/learning tips, nighttime = observing tips), (2) user's current mission status, (3) their registered telescope brand if available.
Copy suggestion EN (nighttime, new user):

What can I see tonight?
How do I align my Celestron?
Best first target for a beginner?
How do I photograph through an eyepiece?

Copy suggestion EN (daytime):

What will be visible tonight?
How do I prepare my telescope?
What is the Orion Nebula?
How do I read a star map?

Claude Code Prompt:
In src/components/shared/AstroChat.tsx:

Replace the static SUGGESTIONS array with a dynamic function:
const getSuggestions = (telescopeBrand?: string, completedCount?: number): string[] => {
  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour < 5;
  const isMorning = hour >= 5 && hour < 12;
  
  if (isNight) {
    return [
      'What can I observe right now?',
      telescopeBrand ? `How do I focus my ${telescopeBrand}?` : 'How do I set up my telescope?',
      completedCount === 0 ? 'What\'s the easiest target for a beginner?' : 'What should I observe next?',
      'How do I photograph through an eyepiece?',
    ];
  } else if (isMorning) {
    return [
      'What will be visible tonight?',
      'How do I prepare my telescope during the day?',
      'What is the Orion Nebula?',
      'How do I read a star map?',
    ];
  } else {
    return [
      'What planets are visible tonight?',
      'How do I collimate a reflector telescope?',
      'What is the Andromeda Galaxy?',
      'How do I photograph the Moon?',
    ];
  }
};

Then in the component, get the needed context:
const { state } = useAppState();
const suggestions = getSuggestions(
  state.telescope ?? undefined, 
  state.completedMissions?.filter(m => m.status === 'completed').length ?? 0
);

Replace {SUGGESTIONS.map(...)} with {suggestions.map(...)}

📊 Summary Scorecard
Flow / PageRatingTop IssueHome HeroNEEDS WORK"Solana" in title + How It Works "Mint/NFT"Club OnboardingRETHINK3-step wall before any value, "Wallet" jargonWalletStepRETHINK"Solana devnet", "devnet SOL", Solana Explorer linksMembershipStepNEEDS WORK"mint on Solana" copy, unnecessary stepSky PageRETHINKPage is blank in production — critical content failureMissions PageNEEDS WORK"Devnet" label, dual nav systemMission Active FlowSHIP ITClean camera + verify + reward loopMission CompleteNEEDS WORK/nfts 404, "Compressed NFT · Solana Devnet" footer, share textProfile PageNEEDS WORKSOL balance as primary display, "Send Crypto"MarketplaceRETHINKBlank in production, no rewards redemptionASTRA ChatSHIP ITGood design, needs better discoverabilityNavigationRETHINKDual nav system breaks mental modelLanguage ToggleNEEDS WORK"KA" text only, no contextLeaderboardNEEDS WORKHardcoded fake dataStars RedemptionRETHINKDoes not exist — loop-breaking gap

🔥 Priority Order (Fix This Week)

Sky page blank — Fix Suspense/error handling so first-time visitors see real content
/nfts 404 — Route broken at the highest emotion moment
WalletStep crypto jargon purge — Biggest user-abandonment risk during onboarding
"Devnet" label removal — 1-minute fix, massive trust improvement
Hero CTA → /sky — Changes the first impression from "what is Solana" to "wow, I can see Jupiter tonight"
Marketplace fallback — Show static products so the tab isn't dead
Stars Redemption component — Closes the loop between earning and spending
Share text cleanup — Prevents accidental crypto evangelism by astronomy users