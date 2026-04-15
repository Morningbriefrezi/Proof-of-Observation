# STELLAR — Hackathon Win Prompts
# Based on full codebase audit + Colosseum winner analysis
# April 15, 2026 · Execute in order · Each prompt is self-contained

---

## CRITICAL FIXES (Do these first — judge-facing impact)

---

### PROMPT C1 — Fix "Powered by Claude" in ASTRA chat header

In `src/app/chat/page.tsx`, find the ASTRA header subtitle on line ~141:
```
'AI Astronomer · Powered by Claude'
```
Change it to:
```
'AI Astronomer · Online'
```
And for the Georgian locale branch (if it reads `'AI ასტრონომი · Claude-ით'`), change it to:
```
'AI ასტრონომი · ონლაინ'
```
This is a one-line fix per locale. The STELLAR brand spec says ASTRA never mentions Claude — it IS Stellar's astronomer.

---

### PROMPT C2 — Replace fake homepage leaderboard with real API data

In `src/app/page.tsx`, the "Leaderboard" section inside the "Missions + Leaderboard" grid (around line 820) contains hardcoded fake entries:
```js
{ medal: '🥇', name: 'AstroNova', obs: 12, stars: 1240 },
{ medal: '🥈', name: 'CosmicRezi', obs: 8, stars: 890 },
{ medal: '🥉', name: 'StarGazer_GE', obs: 5, stars: 620 },
```

Replace this entire section with a real data fetch. Steps:

1. Add state at the top of `HomePage`:
```ts
const [liveLeaders, setLiveLeaders] = useState<{ handle: string; observations: number; stars: number }[]>([]);
const [leadersLoading, setLeadersLoading] = useState(true);
```

2. Add a useEffect to fetch real data:
```ts
useEffect(() => {
  fetch('/api/leaderboard?period=all&limit=3')
    .then(r => r.json())
    .then(data => {
      const entries = (data.leaderboard ?? []).slice(0, 3).map((e: { wallet: string; observations: number; total_stars: number }) => ({
        handle: e.wallet.length > 8 ? `${e.wallet.slice(0, 4)}…${e.wallet.slice(-4)}` : e.wallet,
        observations: e.observations,
        stars: e.total_stars,
      }));
      setLiveLeaders(entries);
    })
    .catch(() => setLiveLeaders([]))
    .finally(() => setLeadersLoading(false));
}, []);
```

3. Replace the hardcoded entries render with:
```tsx
{leadersLoading ? (
  [0,1,2].map(i => (
    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
      <div style={{ width: 20, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.05)', animation: 'pulse 2s ease-in-out infinite' }} />
      <div style={{ flex: 1, height: 13, borderRadius: 4, background: 'rgba(255,255,255,0.04)', animation: 'pulse 2s ease-in-out infinite' }} />
      <div style={{ width: 60, height: 11, borderRadius: 4, background: 'rgba(255,255,255,0.03)', animation: 'pulse 2s ease-in-out infinite' }} />
    </div>
  ))
) : liveLeaders.length === 0 ? (
  <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
    No observers yet — be the first!
  </div>
) : (
  liveLeaders.map((entry, i) => {
    const medals = ['🥇', '🥈', '🥉'];
    return (
      <div key={entry.handle} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16 }}>{medals[i]}</span>
        <span style={{ color: 'white', fontSize: 13, flex: 1, fontFamily: 'var(--font-mono)' }}>{entry.handle}</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{entry.observations} obs · {entry.stars} ✦</span>
      </div>
    );
  })
)}
```

Remove the hardcoded `p` tag: `"Real rankings update daily"` — it undercuts the live data.

---

### PROMPT C3 — Wire Stars balance on homepage to authenticated user

In `src/app/page.tsx`, the "Earn Stars. Spend Real Rewards." section shows a hardcoded `0 ✦` balance and 0% progress bar for all visitors including logged-in users with real balances.

1. Add state near the top of `HomePage`:
```ts
const [homeStars, setHomeStars] = useState(0);
const [homeStarsLoaded, setHomeStarsLoaded] = useState(false);
```

2. Add a useEffect that runs when wallet is known:
```ts
useEffect(() => {
  const addr = walletAddress ?? state.walletAddress;
  if (!authenticated || !addr) { setHomeStarsLoaded(true); return; }
  fetch(`/api/stars-balance?address=${encodeURIComponent(addr)}`)
    .then(r => r.json())
    .then(d => setHomeStars(d.balance ?? 0))
    .catch(() => {})
    .finally(() => setHomeStarsLoaded(true));
}, [authenticated, walletAddress, state.walletAddress]);
```

3. Replace the hardcoded `0 ✦` display with:
```tsx
{homeStarsLoaded ? `${homeStars} ✦` : '— ✦'}
```

4. Replace the progress bar `width: '0%'` with a dynamic value. The first reward threshold is 50 Stars (Moon observation). Use:
```ts
const FIRST_THRESHOLD = 50;
const progressPct = Math.min(100, Math.round((homeStars / FIRST_THRESHOLD) * 100));
```
Then set the inner bar: `width: \`${progressPct}%\``

5. Update the "Next reward at 50 ✦" label dynamically:
```tsx
{homeStars >= 250
  ? 'Next reward at 500 ✦'
  : homeStars >= 50
  ? 'Next reward at 250 ✦'
  : 'Next reward at 50 ✦'}
```

---

## HOMEPAGE UPGRADES (High impact for judges)

---

### PROMPT H1 — Add Live Stats Bar below hero section

After the closing `</section>` tag of the hero section in `src/app/page.tsx`, and before the `<div className="max-w-3xl ...">` wrapper that holds the rest of the page, insert a new live stats bar component.

Create `src/components/home/LiveStatsBar.tsx`:

```tsx
'use client';
import { useState, useEffect } from 'react';

interface Stats {
  totalObservations: number;
  totalStars: number;
  activeTonight: number;
}

export default function LiveStatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/leaderboard?period=all&limit=100')
      .then(r => r.json())
      .then(data => {
        const lb = data.leaderboard ?? [];
        const totalObservations = lb.reduce((s: number, e: { observations: number }) => s + e.observations, 0);
        const totalStars = lb.reduce((s: number, e: { total_stars: number }) => s + e.total_stars, 0);
        setStats({ totalObservations, totalStars, activeTonight: lb.length });
      })
      .catch(() => {});
  }, []);

  if (!stats) return null;
  if (stats.totalObservations === 0) return null;

  const items = [
    { value: stats.totalObservations.toLocaleString(), label: 'discoveries sealed on Solana' },
    { value: `${stats.totalStars.toLocaleString()} ✦`, label: 'Stars earned' },
    { value: stats.activeTonight.toLocaleString(), label: 'observers joined' },
  ];

  return (
    <div style={{
      width: '100%',
      background: 'rgba(52,211,153,0.04)',
      borderTop: '1px solid rgba(52,211,153,0.08)',
      borderBottom: '1px solid rgba(52,211,153,0.08)',
      padding: '10px 16px',
    }}>
      <div style={{
        maxWidth: 640, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 24, flexWrap: 'wrap',
      }}>
        {items.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#34d399', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {item.value}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{item.label}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ color: 'rgba(52,211,153,0.6)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</span>
        </div>
      </div>
    </div>
  );
}
```

Import it in `src/app/page.tsx` and place it between the `</section>` (end of hero) and the opening of the scrollable content div.

---

### PROMPT H2 — Surface Sky Score above the fold in the hero section

Currently the Sky Score is inside `HomeSkyPreview` which is below the fold. Judges on mobile never see it without scrolling.

In `src/app/page.tsx`, inside the hero section content div (where the headline, tagline, and CTA buttons are), add a Sky Score inline display:

1. Add state:
```ts
const [heroSkyScore, setHeroSkyScore] = useState<{ score: number; grade: string; emoji: string } | null>(null);
```

2. Add fetch in an existing useEffect or new one:
```ts
useEffect(() => {
  const lat = location.lat || 41.6941;
  const lon = location.lon || 44.8337;
  fetch(`/api/sky/score?lat=${lat}&lon=${lon}`)
    .then(r => r.json())
    .then(d => { if (d?.score != null) setHeroSkyScore(d); })
    .catch(() => {});
}, [location.lat, location.lon]);
```

3. Insert this element between the tagline and the sub-copy paragraph in the hero:
```tsx
{heroSkyScore && (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 12,
    padding: '10px 20px', borderRadius: 999,
    background: heroSkyScore.score >= 70 ? 'rgba(52,211,153,0.08)' : heroSkyScore.score >= 50 ? 'rgba(255,209,102,0.08)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${heroSkyScore.score >= 70 ? 'rgba(52,211,153,0.2)' : heroSkyScore.score >= 50 ? 'rgba(255,209,102,0.2)' : 'rgba(255,255,255,0.08)'}`,
  }}>
    <span style={{ fontSize: 16 }}>{heroSkyScore.emoji}</span>
    <span style={{
      color: heroSkyScore.score >= 70 ? '#34d399' : heroSkyScore.score >= 50 ? '#FFD166' : 'rgba(255,255,255,0.5)',
      fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', lineHeight: 1,
    }}>{heroSkyScore.score}</span>
    <div>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600 }}>{heroSkyScore.grade} sky tonight</div>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Sky Score · Your location</div>
    </div>
  </div>
)}
```

---

### PROMPT H3 — Simplify hero CTA — remove 4 nav shortcut cards

The hero currently has: 2 CTA buttons + 4 nav shortcut cards (Sky, Missions, ASTRA, Shop). This is too many competing elements.

In `src/app/page.tsx`, find the "App nav shortcuts" block (the div containing the 4 Link cards with Sky/Missions/ASTRA/Shop). Remove it entirely.

The two CTA buttons ("Start Observing →" and "Tonight's Sky →") are sufficient. The nav shortcuts dilute the primary call-to-action and make the hero feel cluttered on mobile.

Do not remove the `LocationPicker` — keep it between the tagline and the CTAs.

---

### PROMPT H4 — Add Daily Check-In card to missions page top

The `DailyCheckIn` component exists at `src/components/dashboard/DailyCheckIn.tsx`. It is currently not used anywhere in the app — it's disconnected dead code.

In `src/app/missions/page.tsx`, in the authenticated view (inside the `return` block after the `if (!authenticated)` branch), import and render `DailyCheckIn` immediately after `<BackButton />` and before the `<section>` that contains the Missions heading:

```tsx
import DailyCheckIn from '@/components/dashboard/DailyCheckIn';

// In the authenticated return:
<BackButton />
<DailyCheckIn />  {/* ADD THIS */}
<section>
  ...
```

This surfaces the daily Duolingo-style mechanic — the single most important engagement driver — prominently where users will see it every day they open missions.

---

## SECURITY FIXES

---

### PROMPT S1 — Proxy Helius DAS API through a server route

The NFTs page calls Helius directly from the browser, exposing the RPC URL (which contains your API key) in the network tab.

1. Create `src/app/api/nfts/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address) return NextResponse.json({ error: 'address required' }, { status: 400 });

  const endpoint = process.env.HELIUS_RPC_URL ?? process.env.NEXT_PUBLIC_HELIUS_RPC_URL ?? 'https://api.devnet.solana.com';
  const collectionMint = process.env.NEXT_PUBLIC_COLLECTION_MINT_ADDRESS;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', id: 1,
      method: 'getAssetsByOwner',
      params: { ownerAddress: address, page: 1, limit: 100, displayOptions: { showUnverifiedCollections: true } },
    }),
  });

  if (!res.ok) return NextResponse.json({ error: 'upstream failed' }, { status: 502 });

  const data = await res.json();
  const items = data?.result?.items ?? [];
  const filtered = collectionMint
    ? items.filter((item: { grouping?: { group_key: string; group_value: string }[] }) =>
        item.grouping?.some(g => g.group_key === 'collection' && g.group_value === collectionMint)
      )
    : items;

  return NextResponse.json({ items: filtered });
}
```

2. Add `HELIUS_RPC_URL` (server-only, no `NEXT_PUBLIC_` prefix) to `.env.local` — same value as `NEXT_PUBLIC_HELIUS_RPC_URL`.

3. In `src/app/nfts/page.tsx`, replace the direct Helius fetch with:
```ts
const res = await fetch(`/api/nfts?address=${encodeURIComponent(address)}`);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
const filtered: NftAsset[] = data.items ?? [];
setNfts(filtered);
```
Remove the entire inner filtering logic (it now happens server-side).

---

## PAGE-SPECIFIC FIXES

---

### PROMPT P1 — Fix NFT page using raw img tag

In `src/app/nfts/page.tsx`, find the NFT star map image render:
```tsx
<img
  src={nftImageUrl}
  alt={target}
  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
  loading="lazy"
/>
```

Replace with Next.js Image component:
```tsx
import Image from 'next/image';

<div style={{ position: 'relative', width: '100%', height: 160 }}>
  <Image
    src={nftImageUrl}
    alt={target}
    fill
    unoptimized
    style={{ objectFit: 'cover' }}
    loading="lazy"
  />
</div>
```

Keep `unoptimized` because the NFT images are dynamically generated per-request by the `/api/nft-image` route — Next.js image optimization would break the dynamic generation pipeline.

---

### PROMPT P2 — Fix sky page hardcoded English text

In `src/app/sky/page.tsx`, line ~52, the planet section subheading is hardcoded:
```tsx
<p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
  Tap any planet for rise / transit / set details
</p>
```

1. The file already imports `getTranslations` and uses `const t = await getTranslations('sky')`.
2. Add to `src/messages/en.json` under the `sky` key:
```json
"planetHint": "Tap any planet for rise / transit / set details"
```
3. Add to `src/messages/ka.json` under the `sky` key:
```json
"planetHint": "შეეხეთ ნებისმიერ პლანეტას ამოსვლის / ტრანზიტის / ჩასვლის დეტალებისთვის"
```
4. Replace the hardcoded string with `{t('planetHint')}`.

---

### PROMPT P3 — Fix leaderboard showing wallet addresses instead of usernames

In `src/app/leaderboard/page.tsx`, the `shortWallet` function produces `Abcd...1234` for all entries. This is the opposite of a consumer-friendly experience.

1. Update the `/api/leaderboard/route.ts` to join against the users table:

In `src/app/api/leaderboard/route.ts`, find the query that fetches leaderboard data. After fetching wallet + stats, do a secondary lookup for display names:

```ts
// After getting leaderboard entries, enrich with display names
const wallets = entries.map(e => e.wallet);
// If you have a users table with wallet + email columns:
const userRows = await db
  .select({ wallet: users.wallet, email: users.email })
  .from(users)
  .where(inArray(users.wallet, wallets));

const nameMap = Object.fromEntries(userRows.map(u => [u.wallet, u.email?.split('@')[0] ?? null]));

return entries.map(e => ({
  ...e,
  displayName: nameMap[e.wallet] ?? null,
}));
```

2. In the leaderboard page, update `shortWallet` usage to prefer `displayName`:
```ts
handle: entry.displayName ?? shortWallet(entry.wallet),
```

If the users table schema doesn't have these columns yet, check `src/lib/db.ts` for the actual schema and adapt accordingly. If no name data exists, at minimum make the wallet display prettier: `⬡ ${wallet.slice(0,4)}…${wallet.slice(-4)}` with a wallet icon prefix.

---

### PROMPT P4 — Fix duplicate ProductCard in marketplace

`src/app/marketplace/page.tsx` defines a full `ProductCard` component inline (lines ~56-168) while `src/components/marketplace/ProductCard.tsx` exists as a shared component.

1. Read both files to compare their interfaces.
2. If the inline one has features the shared one lacks, merge the differences into `src/components/marketplace/ProductCard.tsx`.
3. Delete the inline `ProductCard` function from the marketplace page.
4. Import the shared component: `import ProductCard from '@/components/marketplace/ProductCard'`.
5. Verify the props interface matches — particularly `showDealer` and `dealerName` props which the shared component may not have. Add them if needed.

---

### PROMPT P5 — Fix confirmSignOut state reset on profile page

In `src/app/profile/page.tsx`, the `confirmSignOut` state never resets if a user navigates away and returns without signing out.

Add a cleanup effect:
```ts
useEffect(() => {
  return () => setConfirmSignOut(false);
}, []);
```

Place it with the other `useEffect` hooks at the top of the component. This ensures the "Confirm sign out?" state resets when the component unmounts.

---

### PROMPT P6 — Wire email subscribe to server endpoint

In `src/app/page.tsx`, the `EmailSubscribe` component stores emails in `localStorage` only. They're never collected.

1. Create `src/app/api/subscribe/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  }

  try {
    await db.execute(
      sql`INSERT INTO email_subscribers (email, created_at) VALUES (${email}, now()) ON CONFLICT (email) DO NOTHING`
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }
}
```

2. Create the DB table (run once, can be done in a migration or a setup script):
```sql
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

3. In the `EmailSubscribe` component in `src/app/page.tsx`, update `handleSubmit` to call the API:
```ts
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!email.includes('@')) { setStatus('error'); return; }
  try {
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setStatus('sent');
    setEmail('');
  } catch {
    setStatus('error');
  }
}
```

Remove the localStorage fallback entirely.

---

## POLISH UPGRADES (Demo readiness)

---

### PROMPT X1 — Add social proof copy to homepage hero sub-text

In `src/app/page.tsx`, the hero sub-copy currently reads:
```
"Photograph celestial objects from anywhere in the world. Earn Stars tokens, collect discovery NFTs, and shop telescopes at your local dealer."
```

This is accurate but generic. Replace with copy that emphasizes the real-world loop and the Astroman backstory:

```
"Observe the night sky. Get AI-verified by ASTRA. Earn Stars tokens and compressed NFTs sealed on Solana — redeemable for real telescopes at Astroman.ge and partner stores worldwide."
```

This communicates: utility → AI → blockchain → real reward. No jargon, just the chain of value.

---

### PROMPT X2 — Add Sky Score to the /sky page title metadata

In `src/app/sky/page.tsx`, the page currently has no dynamic `<title>` or OG metadata. Add a dynamic title based on tonight's Sky Score so that browser tabs and shares show useful context.

At the top of `SkyPage`, it's a server component so you can fetch data server-side:
```tsx
import { headers } from 'next/headers';

export async function generateMetadata() {
  // Fetch score server-side for the default location (Tbilisi)
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/sky/score?lat=41.6941&lon=44.8337`, {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    if (data?.score) {
      return {
        title: `Sky Score ${data.score}/100 — Stellar`,
        description: `${data.grade} sky conditions tonight. ${data.emoji} Check planet positions, 7-day forecast, and best observation windows.`,
      };
    }
  } catch {}
  return {
    title: 'Tonight\'s Sky — Stellar',
    description: 'Live sky conditions, planet tracker, and 7-day astronomy forecast.',
  };
}
```

---

### PROMPT X3 — Add missing How It Works animation keyframe to homepage

In `src/app/page.tsx`, the `hiw-card` elements use `animation: 'hiwSlideUp 0.6s ease forwards'` but the `@keyframes hiwSlideUp` definition is missing from the `<style>` block. This means the cards start invisible (opacity: 0) and never animate in.

In the `<style>` block inside `HomePage`, add:
```css
@keyframes hiwSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Verify this is not already defined (search for `hiwSlideUp` in the file). If absent, add it alongside the other `@keyframes` definitions.

---

### PROMPT X4 — Add "No crypto knowledge needed" trust line to ASTRA chat

In `src/app/chat/page.tsx`, the auth gate overlay text says:
```
"Sign in to chat with ASTRA"
"Free forever · No wallet needed"
```

"No wallet needed" is the right message but the wrong emphasis. Change the subline to:
```
"Free forever · No crypto knowledge needed"
```

This better addresses the real hesitation point for non-crypto users visiting the app.

---

### PROMPT X5 — Missions page — fix hardcoded English strings to use next-intl

In `src/app/missions/page.tsx`, these strings are hardcoded in English and bypass next-intl:
- `"Sky Missions"` (h2 title in unauthenticated view)
- `"Observe the Moon, Jupiter, Saturn and more. Earn Stars, mint NFTs."` (subtitle)
- `"Sign In →"` (button)
- `"Available Missions"` (section label)
- `"Tonight's Sky"` (section label)

1. Add translation keys to `src/messages/en.json` under a `missions` namespace:
```json
"missions": {
  "title": "Sky Missions",
  "subtitle": "Observe the Moon, Jupiter, Saturn and more. Earn Stars, mint NFTs.",
  "signIn": "Sign In →",
  "availableMissions": "Available Missions",
  "tonightsSky": "Tonight's Sky"
}
```

2. Add Georgian equivalents to `src/messages/ka.json`:
```json
"missions": {
  "title": "ცის მისიები",
  "subtitle": "დააკვირდი მთვარეს, იუპიტერს, სატურნს და სხვა ობიექტებს. გამოიმუშავე ვარსკვლავები, მოჭრე NFT-ები.",
  "signIn": "შესვლა →",
  "availableMissions": "ხელმისაწვდომი მისიები",
  "tonightsSky": "დღეს ღამის ცა"
}
```

3. The missions page is a client component. Add at the top:
```ts
const t = useTranslations('missions');
```

4. Replace each hardcoded string with the appropriate `t()` call.

---

## HACKATHON SUBMISSION CHECKLIST

After all prompts above are executed, verify:

- [ ] `/` homepage: no hardcoded fake data anywhere visible
- [ ] `/` homepage: Stars balance shows real number for logged-in users
- [ ] `/chat`: no "Powered by Claude" text visible
- [ ] `/sky`: all text renders in Georgian when locale=ka
- [ ] `/missions`: DailyCheckIn card visible at top for authenticated users
- [ ] `/leaderboard`: no wallet-only handles when usernames are available
- [ ] `/nfts`: Helius calls proxied through server route
- [ ] Live Stats Bar appears below hero with real numbers
- [ ] Sky Score visible in hero above fold on mobile (375px viewport)
- [ ] How It Works cards animate in correctly (hiwSlideUp keyframe)
- [ ] Email subscribe POSTs to real endpoint
- [ ] `confirmSignOut` resets on navigation
- [ ] All 3 languages (EN/KA) render without missing keys
- [ ] Vercel deployment builds without TypeScript errors
- [ ] Test on real iPhone (Safari) — safe-area-inset, dvh units, streaming chat

---

*Generated: April 15, 2026*
*Source: Full codebase audit + Colosseum winner pattern analysis*
*Frontier hackathon deadline: May 11, 2026*
