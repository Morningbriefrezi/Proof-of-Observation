Bug Fix Prompt — Stellarr (2026-04-10)
Context: Stellarr is a Next.js 15 + Solana astronomy app. A UX/debug audit flagged several bugs. Many have already been fixed in the current codebase — this prompt covers only the ones confirmed still present by direct code inspection.

Bug 1 — Cross-route import in /api/mint (fragile coupling)
File: src/app/api/mint/route.ts line 6


import { awardStarsOnChain } from '../observe/log/route';
This imports a function from another Next.js API route file, which is an anti-pattern — route files may have request-scoped module state and Next.js may tree-shake them unpredictably.

Fix:

Extract awardStarsOnChain and its constants (MAX_STARS_BY_CONFIDENCE, DAILY_STARS_CAP) out of src/app/api/observe/log/route.ts and into a new file src/lib/stars.ts.
Update src/app/api/observe/log/route.ts to import awardStarsOnChain from @/lib/stars.
Update src/app/api/mint/route.ts to import awardStarsOnChain from @/lib/stars instead of the route file.
Bug 2 — simResult() silently fakes successful mints
File: src/lib/solana.ts lines 23–28 and line 86

The simResult() function returns { success: true, method: 'simulated' }. It is called in createOnChainProof when any non-user-rejection error occurs (line 86):


return { ...simResult(), error: msg };
This means a failed Solana transaction reports as success: true to the UI — users think their observation is sealed on-chain when it isn't.

Fix:

Change line 86 so it returns success: false:

return { success: false, txId: '', method: 'simulated', error: msg };
Keep simResult() only for the cases where simulation is intentional (email-only auth flow where sendTransaction is null). Those callers in mintMembership and similar functions that pass null for sendTransaction may still return simulated results with success: true since the user has no wallet — that's acceptable and expected behavior.
Bug 3 — HEIC image gets wrong mediaType sent to Claude
File: src/app/api/observe/verify/route.ts lines 89–98

Line 89–90 correctly detects HEIC by magic bytes:


const isHeic = buffer.length >= 12 && buffer[4] === 0x66 && ...
if (!isJpeg && !isPng && !isWebp && !isHeic) { ... }
But line 98 casts file.type directly:


const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
A HEIC file has file.type === 'image/heic' which is not in that union — Claude receives image/heic as the media_type, which it doesn't support. The Claude Messages API only accepts image/jpeg, image/png, image/gif, image/webp.

Fix:
Replace line 98 with logic that maps HEIC to JPEG for the Claude API call:


const rawType = file.type;
const mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' =
  rawType === 'image/heic' || rawType === 'image/heif' || isHeic
    ? 'image/jpeg'
    : (rawType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp');
Bug 4 — Cloud cover fallback defaults to 15% (clear sky) when oracle is down
File: src/app/api/observe/verify/route.ts line 198


let cloudCover = 15; // safe default
If Open-Meteo is unreachable, this defaults to 15% cloud cover (clear sky), allowing observations to pass even during 90% overcast conditions. It's optimistic when it should be conservative.

Fix:
Change the default to a conservative value and return an error if the oracle is unavailable:


let cloudCover: number | null = null;
try {
  const skyUrl = `...`;
  const skyRes = await fetch(skyUrl, { signal: AbortSignal.timeout(5000) });
  if (skyRes.ok) {
    const skyData = await skyRes.json();
    cloudCover = skyData?.current?.cloud_cover ?? null;
  }
} catch { /* non-fatal */ }

if (cloudCover === null) {
  return NextResponse.json({ error: 'Sky conditions unavailable — try again shortly' }, { status: 503 });
}
Bug 5 — Marketplace ProductGrid renders empty
File: src/components/marketplace/ProductGrid.tsx

The load() function calls both /api/products and /api/price/sol in Promise.all. Even though /api/price/sol has a fallback, if either prodRes.json() or priceRes.json() throws (e.g. due to a runtime parse error or non-200 from products API), the entire load() call goes to the catch which sets error = true. The error state does render PRODUCTS fallback — but investigate why on the live site no cards appear at all.

Fix:

Add console.error inside the catch block of load() to surface the actual failure reason.
Decouple the two fetches — fetch products and price independently so a price failure never blocks products from rendering:

const [prodsRes, priceRes] = await Promise.allSettled([
  fetch('/api/products'),
  fetch('/api/price/sol'),
]);
const prods = prodsRes.status === 'fulfilled' && prodsRes.value.ok
  ? (await prodsRes.value.json() as Product[])
  : PRODUCTS;
const price = priceRes.status === 'fulfilled' && priceRes.value.ok
  ? (await priceRes.value.json() as { solPerGEL: number })
  : { solPerGEL: 0.00135 };
setProducts(prods);
setSolPerGEL(price.solPerGEL);
Remove the setError(true) path entirely — the component always has products to show (either live or static PRODUCTS fallback).
Bug 6 — Planets section renders empty
File: src/components/sky/PlanetGrid.tsx, src/app/api/sky/planets/route.ts, src/lib/planets.ts

The API route calls getVisiblePlanets(lat, lng, new Date()). If this throws (e.g. the astronomy-engine library crashes on a specific celestial body calculation), the route returns a 500 and PlanetGrid sets error = true — which does show static fallback cards. However the live site shows empty.

Fix:

In src/app/api/sky/planets/route.ts, wrap the getVisiblePlanets call per-body so one failing planet calculation doesn't crash the whole response:
If getVisiblePlanets already handles this, add a try/catch that returns an empty array with a warning header rather than a 500.
In PlanetGrid, when error || planets.length === 0 renders, verify STATIC_PLANETS (filtered from MISSIONS) is non-empty by adding a temporary console.log('[PlanetGrid] static fallback count:', STATIC_PLANETS.length) to rule out the MISSIONS constant being empty.
The useLocation hook correctly falls back to Tbilisi coordinates — this is not the issue.
Priority order
#	Bug	Files
1	Cross-route import → extract to lib/stars.ts	api/mint/route.ts, api/observe/log/route.ts
2	Marketplace empty → decouple fetches with Promise.allSettled	components/marketplace/ProductGrid.tsx
3	simResult() fakes mints → return success: false	lib/solana.ts
4	HEIC wrong mediaType → remap to image/jpeg	api/observe/verify/route.ts
5	Cloud cover fallback too optimistic → 503 when oracle down	api/observe/verify/route.ts
6	Planets section empty → investigate and add per-body error isolation	api/sky/planets/route.ts, lib/planets.ts
Note: The following items from the original audit are already fixed in the current codebase and do NOT need action: Profile getStarsBalance (already uses /api/stars-balance), WalletStep ensureDevnetSol (already removed), duplicate AstroChat in layout (already removed), missing DB packages (already in package.json), hardcoded Privy App ID fallback (already throws if env var missing).