2# STELLAR — Audit Fix Prompts

**Generated:** April 14, 2026  
**Source audit:** `STELLAR_UNIFIED_AUDIT_1.md`  
**Method:** Every issue cross-referenced against actual codebase before writing prompts.  
**Approach:** One prompt per fresh Claude Code conversation. Surgical, 2-4 files per prompt.

---

## STEP 3 — Issue Verification Report

| Audit Issue ID | File(s) | Still Exists? | Severity | Notes |
|----------------|---------|---------------|----------|-------|
| FIX-C1 | `src/components/sky/MissionActive.tsx` | **YES** | CRITICAL | `handleCapture()` lines 73-119 calls only `/api/sky/verify`, never `/api/observe/verify`. Confirmed by reading both files. |
| FIX-C2 (NEXT_PUBLIC_ exposure) | `src/hooks/useUserSync.ts` | **RESOLVED** | — | `useUserSync.ts` now uses `getAccessToken()` Privy JWT — no `NEXT_PUBLIC_INTERNAL_API_SECRET` in any source file. |
| FIX-C2 (optional auth on endpoints) | `src/app/api/mint/route.ts`, `src/app/api/award-stars/route.ts` | **YES** | HIGH | Both use `if (secret && authHeader !== \`Bearer ${secret}\`)` on lines 12 and 17 respectively. If `INTERNAL_API_SECRET` is unset, auth is skipped entirely. |
| FIX-C2 (client calls /api/mint without auth) | `src/components/sky/MissionActive.tsx` | **YES** | HIGH | `handleMint()` line 142 calls `/api/mint` with only `Content-Type` header, no `Authorization`. `ObserveFlow.tsx` same pattern. |
| FIX-C3 | `src/components/shared/Nav.tsx` | **YES** | HIGH | Line 215: `(state.completedMissions.length * 50).toLocaleString()` — localStorage, not SPL balance. |
| FIX-C4 (demo account) | Manual process | **YES** | HIGH | No pre-populated demo data exists. Leaderboard, NFT gallery, Stars all show zero on first visit. |
| FIX-H1 | `src/app/page.tsx` | NOT VERIFIED IN FULL | HIGH | Audit reports 1,165 lines. Consistent with overall pattern seen. |
| FIX-H2 | `src/components/shared/Nav.tsx`, `src/components/shared/BottomNav.tsx` | **PARTIAL** | MEDIUM | BottomNav is already correct (Sky · Missions · Home · Shop · Profile). Desktop Nav still has Learn + Dark Sky in tabs. Drawer still has 7 items. |
| FIX-H3 | `src/app/observations/page.tsx`, nav components | YES | MEDIUM | Both `/nfts` and `/observations` exist. `/observe` and `/missions` are two separate flows. |
| FIX-H4 | `src/components/sky/MissionActive.tsx` | **YES** | MEDIUM | Line 371-376: shows "Saved locally — will sync when back online" for `sim_` txIds. No sync mechanism exists. |
| FIX-L1 | `src/hooks/useCamera.ts` | **YES** | HIGH | `generateSimPhoto()` lines 83-238 creates convincing canvas-drawn celestial images. Called automatically when camera denied (line 77) or frame is too dark (line 72-73). These are submitted as observations. |
| FIX-M1 (products.ts dead code) | `src/lib/products.ts` | **NOT CONFIRMED** | — | `products.ts` IS still imported by `ProductGrid.tsx`, `ProductDetail.tsx`, `ProductCard.tsx`, and `api/products/route.ts`. Not dead code. Skip this fix. |
| FIX-M2 (wallet extraction) | Multiple files | **YES** | LOW | Pattern duplicated in `Nav.tsx` line 46-49, `MissionActive.tsx` lines 50-53, `nfts/page.tsx` line 41, and others. |
| FIX-M3 (empty states) | `src/app/nfts/page.tsx`, `src/app/leaderboard/page.tsx`, `src/app/profile/page.tsx` | **YES** | MEDIUM | Pages render with zero data on first visit. No encouraging empty-state UI confirmed in leaderboard page. |
| FIX-M4 (success screen polish) | `src/components/sky/MissionActive.tsx` lines 290-458 | **PARTIAL** | LOW | Success screen exists with confetti, score ring, Explorer link, share buttons. Share OG image preview not confirmed present. |
| FIX-L4 (orphaned Club page) | `src/app/club/page.tsx`, nav | **YES** | LOW | Club page exists; confirm in nav links. |

---

## PHASE 1 — CRITICAL FIXES

Run these first, in order. Each depends on the previous.

---

### PHASE 1 · PROMPT 1 — Wire Photo Verification into Mission Flow

**Depends on:** None  
**Fixes:** FIX-C1  
**Risk level:** The `handleCapture` function signature and the verified/minting state machine in `MissionActive.tsx` will change. The `Verification.tsx` component display may need a new prop for photo confidence. Do not touch `ObserveFlow.tsx`.

**Read these files fully before writing anything:**
- `src/components/sky/MissionActive.tsx` — full file (597 lines)
- `src/components/sky/Verification.tsx` — understand its props interface
- `src/app/api/observe/verify/route.ts` — understand the request format (FormData with `file`, `lat`, `lon`, `capturedAt`) and response shape (`PhotoVerificationResult`)
- `src/lib/types.ts` — find the `PhotoVerificationResult` type definition

---

**Implementation:**

1. In `MissionActive.tsx`, add a new state variable after line 65:
   ```ts
   const [photoVerification, setPhotoVerification] = useState<PhotoVerificationResult | null>(null);
   ```
   Import `PhotoVerificationResult` from `@/lib/types`.

2. In `handleCapture()` (lines 73-119), after the sky check sets `sky` and before calling `setStep('verified')`, add the photo verification call:

   ```ts
   // After setSky(skyData) and setSkyScore(...), before setStep('verified'):
   try {
     const blob = await (await fetch(p)).blob();
     const file = new File([blob], 'observation.jpg', { type: 'image/jpeg' });
     const fd = new FormData();
     fd.append('file', file);
     fd.append('lat', String(lat));
     fd.append('lon', String(lon));
     fd.append('capturedAt', ts);
     const pvRes = await fetch('/api/observe/verify', { method: 'POST', body: fd });
     if (pvRes.ok) {
       const pv: PhotoVerificationResult = await pvRes.json();
       setPhotoVerification(pv);
       if (!pv.accepted) {
         setMintError(pv.reason ?? 'Photo rejected — please retake');
         setStep('camera');
         return;
       }
     }
   } catch {
     // Photo verification offline — allow but log low confidence
   }
   ```

   Note: The `p` parameter in `handleCapture(p: string)` is a base64 data URL. Convert it to a Blob via `fetch(p).then(r => r.blob())`.

3. In `handleMint()` (line 122), update the `confidence` field sent to `/api/observe/log` (line 188-196):
   ```ts
   confidence: photoVerification?.confidence ?? (sky?.verified ? 'medium' : 'low'),
   ```
   This ensures the confidence recorded in the DB reflects photo analysis, not just sky conditions.

4. In the `step === 'verified'` block (lines 566-588), add a small confidence badge below the `<Verification>` component showing the photo analysis result when `photoVerification` is not null:
   ```tsx
   {photoVerification && (
     <div className="mt-2 text-center">
       <span className={`text-xs px-2 py-0.5 rounded-full ${
         photoVerification.confidence === 'high' ? 'bg-green-500/20 text-green-400' :
         photoVerification.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400' :
         'bg-slate-500/20 text-slate-400'
       }`}>
         AI: {photoVerification.identifiedObject} · {photoVerification.confidence} confidence
       </span>
     </div>
   )}
   ```

5. In the loading step (`step === 'verifying'`, lines 559-564), update the message:
   ```tsx
   <LoadingRing size={72} message="Analyzing sky + photo..." facts={[]} />
   ```

---

**Validation:**
- [ ] Start the dev server and go to `/missions`. Select any mission, go through camera capture.
- [ ] On a device with camera: after capture, loading should say "Analyzing sky + photo..." and take 5-15s (Claude Vision call).
- [ ] On success: confidence badge appears below the verification card showing identified object.
- [ ] If a non-sky photo (e.g., blank wall) is captured: error message appears and step returns to `camera` — user cannot mint.
- [ ] Sky-only verification (`/api/sky/verify`) still runs as before.
- [ ] `ObserveFlow.tsx` is unchanged — verify it still works on `/observe`.

---

### PHASE 1 · PROMPT 2 — Fix API Authentication Model

**Depends on:** None (can run in parallel with Prompt 1)  
**Fixes:** FIX-C2 (remaining issues after `useUserSync` was already fixed)  
**Risk level:** Changing auth on `/api/mint` and `/api/award-stars`. If `INTERNAL_API_SECRET` is set in production `.env`, this changes behavior. Coordinate with env var configuration.

**Read these files fully before writing anything:**
- `src/app/api/mint/route.ts` — lines 9-13 (the auth check)
- `src/app/api/award-stars/route.ts` — lines 14-18 (the auth check)
- `src/components/sky/MissionActive.tsx` — `handleMint()` function (lines 122-233)
- `src/components/observe/ObserveFlow.tsx` — `handleMintObservation()` function

---

**Implementation:**

The right fix for a hackathon devnet demo is to make the auth model explicit and consistent, not to add complexity. There are two options; choose Option A for the hackathon:

**Option A (Recommended for hackathon — remove misleading optional auth):**

In `src/app/api/mint/route.ts`, replace lines 10-13:
```ts
// BEFORE:
const secret = process.env.INTERNAL_API_SECRET;
const authHeader = req.headers.get('authorization');
if (secret && authHeader !== `Bearer ${secret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// AFTER:
// Devnet: no auth required. Rate limiting + wallet validation provide sufficient protection.
// TODO: Add Privy JWT verification before mainnet launch.
```

Apply the same change to `src/app/api/award-stars/route.ts` lines 14-18.

**Rationale:** The current `if (secret && ...)` check is worse than no auth — it creates a false sense of security. Removing it makes the actual security posture explicit: these are open devnet endpoints with rate limiting. This is honest and safe for the hackathon. Add a `// TODO` comment for mainnet.

**Option B (Proper auth — only if you have time and `INTERNAL_API_SECRET` is configured):**

Do NOT use Option B during the hackathon. It requires server-to-server auth for every mint, which means the client can never call `/api/mint` directly. This would require a significant refactor of `MissionActive.tsx` and `ObserveFlow.tsx`.

---

**Validation:**
- [ ] `INTERNAL_API_SECRET` removed from auth check — confirmed by reading the updated file.
- [ ] Mint still works end-to-end: go through a full mission flow and confirm NFT mints.
- [ ] `award-stars` still works: confirm Stars balance increases after a mint.
- [ ] The audit finding about `NEXT_PUBLIC_INTERNAL_API_SECRET` is already resolved — grep across all `src/` files to confirm it appears nowhere.

---

### PHASE 1 · PROMPT 3 — Fix Nav Stars Badge to Show Real Balance

**Depends on:** None (can run in parallel with Prompts 1 and 2)  
**Fixes:** FIX-C3  
**Risk level:** Low. Adding a `useEffect` to `Nav.tsx`. Existing localStorage display is replaced with a live fetch.

**Read these files fully before writing anything:**
- `src/components/shared/Nav.tsx` — full file (299 lines), specifically lines 46-49 (wallet extraction) and lines 194-218 (stars badge render)
- `src/app/api/stars-balance/route.ts` — understand the request format (query param `address`) and response shape

---

**Implementation:**

1. In `Nav.tsx`, add `starsBalance` state after line 31:
   ```ts
   const [starsBalance, setStarsBalance] = useState<number | null>(null);
   ```

2. Add a `useEffect` after the existing `useEffect` at line 34 that fetches the real balance:
   ```ts
   useEffect(() => {
     if (!authenticated || !solanaWallet?.address) {
       setStarsBalance(null);
       return;
     }
     fetch(`/api/stars-balance?address=${solanaWallet.address}`)
       .then(r => r.ok ? r.json() : null)
       .then(data => { if (data?.balance != null) setStarsBalance(data.balance); })
       .catch(() => {});
   }, [authenticated, solanaWallet?.address]);
   ```

   Note: `solanaWallet` is already declared at line 46-49. Move its declaration above the new `useEffect` if needed (it's currently after the `useEffect` at line 34).

3. Replace line 215:
   ```tsx
   // BEFORE:
   {(state.completedMissions.length * 50).toLocaleString()}
   
   // AFTER:
   {starsBalance !== null ? starsBalance.toLocaleString() : (state.completedMissions.length * 50).toLocaleString()}
   ```
   This shows the real balance when available, falls back to localStorage estimate while loading.

---

**Validation:**
- [ ] Log in with an account that has a non-zero on-chain Stars balance. Confirm the nav badge shows the correct number.
- [ ] Log in with a new account (0 Stars). Confirm badge shows 0.
- [ ] Confirm the badge still renders for unauthenticated users — it should not show (it's inside `{authenticated && (...)}` already).
- [ ] No console errors about undefined wallet address.

---

### PHASE 1 · PROMPT 4 — Disable Simulated Photo Generation

**Depends on:** Prompt 1 (photo verification must be wired in first)  
**Fixes:** FIX-L1  
**Risk level:** Medium. Changes what happens when camera is denied. Users on desktop without camera will see a different UI. Do not remove `generateSimPhoto` entirely — keep it for potential testing use, but stop calling it automatically.

**Read these files fully before writing anything:**
- `src/hooks/useCamera.ts` — full file (239 lines), specifically the `capture()` function (lines 63-78) and `generateSimPhoto()` (lines 83-238)
- `src/components/sky/CameraCapture.tsx` — understand how it uses `useCamera()` and renders the permission-denied state

---

**Implementation:**

1. In `useCamera.ts`, modify the `capture()` function (lines 63-78):
   ```ts
   // BEFORE:
   const capture = useCallback((missionName: string): string => {
     if (videoRef.current && stream) {
       const canvas = document.createElement('canvas');
       canvas.width = 640;
       canvas.height = 480;
       const ctx = canvas.getContext('2d')!;
       ctx.drawImage(videoRef.current, 0, 0, 640, 480);
       if (isImageBlack(canvas)) {
         return generateSimPhoto(missionName);
       }
       return canvas.toDataURL('image/jpeg', 0.85);
     }
     return generateSimPhoto(missionName);
   }, [stream]);
   
   // AFTER:
   const capture = useCallback((_missionName: string): string | null => {
     if (videoRef.current && stream) {
       const canvas = document.createElement('canvas');
       canvas.width = 640;
       canvas.height = 480;
       const ctx = canvas.getContext('2d')!;
       ctx.drawImage(videoRef.current, 0, 0, 640, 480);
       if (isImageBlack(canvas)) {
         return null; // Too dark — caller must prompt user to try again
       }
       return canvas.toDataURL('image/jpeg', 0.85);
     }
     return null; // No camera stream — caller must show upload or retry UI
   }, [stream]);
   ```
   The return type changes from `string` to `string | null`.

2. In `CameraCapture.tsx`, find where `capture()` is called (it's called on the shutter button press). Update the handler to check for `null`:
   ```ts
   const photo = capture(missionName);
   if (photo === null) {
     // Show error: "Frame too dark or camera unavailable — please try again or move to a darker area"
     setError('Frame too dark — please point at the sky and try again');
     return;
   }
   onCapture(photo);
   ```

3. When `error === 'permission_denied'` in `CameraCapture.tsx`, show a clear message instead of the previous auto-generate fallback:
   ```tsx
   <div className="text-center p-6">
     <p className="text-amber-400 text-sm mb-2">Camera access required</p>
     <p className="text-slate-500 text-xs mb-4">Allow camera access in your browser settings to verify observations.</p>
     <p className="text-slate-600 text-xs">On desktop: use the /observe page to upload a photo file instead.</p>
   </div>
   ```

4. Keep `generateSimPhoto` exported from `useCamera.ts` but do not call it from within the hook. It can be used in Storybook or testing scenarios.

---

**Validation:**
- [ ] On a device with camera: normal capture still works.
- [ ] Deny camera permission: see the "Camera access required" message, not a generated fake image.
- [ ] Point camera at a completely dark/covered surface: see "Frame too dark" error, not a generated fake image.
- [ ] The `/observe` page flow is unaffected (it uses its own camera logic in `ObserveFlow.tsx`).

---

## PHASE 2 — UX TIGHTENING

Run after Phase 1 is confirmed working on devnet.

---

### PHASE 2 · PROMPT 5 — Shorten Homepage

**Depends on:** None (can run in parallel with Phase 1)  
**Fixes:** FIX-H1  
**Risk level:** High visual impact but isolated to `src/app/page.tsx`. Do not touch other pages.

**Read these files fully before writing anything:**
- `src/app/page.tsx` — full file (read in sections if needed). Identify: hero section, sky preview widget, "How It Works" strip, email subscribe, ASTRA promo, feature grid, and any other sections.
- `src/components/home/HomeSkyPreview.tsx` — understand what it renders (this should be kept)

---

**Implementation:**

The target is ~300 lines that fit this structure:
1. **Hero** — headline + 1-line sub + "Start Observing →" CTA button → `/missions`
2. **Live sky preview widget** — `HomeSkyPreview` component (keep as-is)
3. **"How It Works" — 3-step strip** — Observe → Verify → Earn (keep ultra-compact, ~40 lines)
4. **Single secondary CTA** — "Ask ASTRA what's visible tonight →" → `/chat`

**Cut entirely from `page.tsx`:**
- Email subscribe / newsletter section
- ASTRA detailed promo section (already has its own `/chat` page)
- Feature grid / capabilities section (move that content to README instead)
- Any `requestAnimationFrame` canvas star field — replace with the existing CSS `StarField` component or nothing

**Steps:**
1. Read the file top to bottom. Write down line ranges for each section.
2. Delete the sections listed above. Keep the hero, `HomeSkyPreview`, "How It Works" strip, and a footer CTA.
3. Target final line count: under 350 lines. Measure with `wc -l` after editing.
4. Do not change any imports that are still used. Remove unused imports.

---

**Validation:**
- [ ] `wc -l src/app/page.tsx` — confirm under 350 lines.
- [ ] Homepage loads without errors.
- [ ] "Start Observing" button navigates to `/missions`.
- [ ] `HomeSkyPreview` still shows live sky data.
- [ ] No 404 errors in console.
- [ ] Mobile layout: hero is readable, CTA is above the fold.

---

### PHASE 2 · PROMPT 6 — Simplify Navigation

**Depends on:** None  
**Fixes:** FIX-H2  
**Risk level:** Low. Only removes items from nav lists and changes CSS display. Pages themselves are untouched.

**Read these files fully before writing anything:**
- `src/components/shared/Nav.tsx` — full file (299 lines). Identify `tabs` array (lines 38-44) and `NAV_LINKS` array (lines 13-21).
- `src/components/shared/BottomNav.tsx` — already correct, read to confirm no changes needed.

---

**Implementation:**

1. In `Nav.tsx`, update the `tabs` array (lines 38-44) to remove Learn and Dark Sky:
   ```ts
   // BEFORE (5 items):
   const tabs = [
     { href: '/sky',         label: t('sky'),         icon: <CloudSun size={16} /> },
     { href: '/missions',    label: t('missions'),    icon: <Satellite size={16} /> },
     { href: '/learn',       label: 'Learn',          icon: <BookOpen size={16} /> },
     { href: '/darksky',     label: 'Dark Sky',       icon: <Map size={16} /> },
     { href: '/marketplace', label: t('marketplace'), icon: <ShoppingBag size={16} /> },
   ];
   
   // AFTER (4 items):
   const tabs = [
     { href: '/sky',         label: t('sky'),         icon: <CloudSun size={16} /> },
     { href: '/missions',    label: t('missions'),    icon: <Satellite size={16} /> },
     { href: '/chat',        label: 'ASTRA',          icon: <Satellite size={16} /> },
     { href: '/marketplace', label: t('marketplace'), icon: <ShoppingBag size={16} /> },
   ];
   ```
   Use an appropriate icon for ASTRA — import `MessageCircle` or `Bot` from lucide-react.

2. In `Nav.tsx`, update `NAV_LINKS` (drawer, lines 13-21) to remove Dark Sky Map and move Learn to the bottom:
   ```ts
   const NAV_LINKS = [
     { href: '/sky',         label: 'Sky Forecast',  desc: "Tonight's conditions" },
     { href: '/missions',    label: 'Missions',       desc: 'Observe & earn Stars' },
     { href: '/chat',        label: 'ASTRA AI',       desc: 'Your AI astronomer' },
     { href: '/marketplace', label: 'Marketplace',    desc: 'Shop telescopes' },
     { href: '/nfts',        label: 'Discoveries',    desc: 'Your on-chain NFTs' },
     { href: '/profile',     label: 'Profile',        desc: 'Account & stats' },
   ];
   ```
   Removes: Dark Sky Map. Removes: Leaderboard. Keeps 6 items (Club is implicitly removed).

3. Remove unused imports: `BookOpen`, `Map` from lucide-react if they're no longer used anywhere in the file.

4. `BottomNav.tsx` — read only. Confirm its 5 tabs (Sky · Missions · Home · Shop · Profile) are already correct. No changes needed.

---

**Validation:**
- [ ] Desktop nav shows 4 tabs: Sky, Missions, ASTRA, Marketplace.
- [ ] Hamburger drawer shows 6 links (no Dark Sky, no Leaderboard, no Club).
- [ ] ASTRA icon renders correctly.
- [ ] All 4 desktop tab links navigate correctly.
- [ ] Bottom nav unchanged: Sky · Missions · Home · Shop · Profile.
- [ ] Dark Sky, Learn, Club pages still exist at their URLs — they're just not in nav.

---

### PHASE 2 · PROMPT 7 — Merge Observation Pages / Unify Flows

**Depends on:** Phase 1 Prompt 1 (mission flow now does photo verification)  
**Fixes:** FIX-H3  
**Risk level:** Low. Only adds a redirect and hides `/observe` from nav. No deletion.

**Read these files fully before writing anything:**
- `src/app/observations/page.tsx` — full file (to understand what it currently shows)
- `src/app/nfts/page.tsx` — first 60 lines (confirms it's the canonical NFT gallery)
- `src/app/observe/page.tsx` — confirm it uses `ObserveFlow`

---

**Implementation:**

1. Replace the entire content of `src/app/observations/page.tsx` with a redirect:
   ```tsx
   import { redirect } from 'next/navigation';
   export default function ObservationsPage() {
     redirect('/nfts');
   }
   ```
   This is the entire file. All observation history is visible on `/nfts`.

2. In `src/app/observe/page.tsx`, add a comment at the top:
   ```tsx
   // Secondary observe flow — accessible via direct URL but not shown in nav.
   // Primary flow: /missions → MissionActive component.
   ```
   Do not delete or modify the functionality.

3. Confirm `/observe` is not in `NAV_LINKS` in `Nav.tsx` (it shouldn't be after Prompt 6).

---

**Validation:**
- [ ] Navigate to `/observations` — redirects to `/nfts`.
- [ ] `/observe` still works when navigated to directly.
- [ ] `/nfts` loads correctly and shows NFTs for a funded account.
- [ ] No broken links or 404s.

---

### PHASE 2 · PROMPT 8 — Add Graceful Empty States

**Depends on:** None  
**Fixes:** FIX-M3  
**Risk level:** Low. Additive only. Existing logic unchanged.

**Read these files fully before writing anything:**
- `src/app/nfts/page.tsx` — find where the empty state is rendered when `nfts.length === 0 && !loading`
- `src/app/leaderboard/page.tsx` — find where entries array is empty
- `src/app/profile/page.tsx` — find Stars balance display (may show 0 or null)

---

**Implementation:**

For each page, find the `nfts.length === 0` / `entries.length === 0` / zero-balance branch and replace it with a helpful empty state component. Keep it minimal — no new components needed, just inline JSX.

**`src/app/nfts/page.tsx` empty state:**
Find the existing empty state (likely a simple message or nothing). Replace or add:
```tsx
<div className="flex flex-col items-center justify-center py-20 px-6 text-center">
  <div className="text-4xl mb-4">🔭</div>
  <p className="text-white font-semibold mb-2">No discoveries yet</p>
  <p className="text-slate-500 text-sm mb-6">Complete your first mission to mint a verified observation NFT.</p>
  <Link href="/missions" className="px-5 py-2.5 rounded-xl text-sm font-medium"
    style={{ background: 'var(--gradient-accent)', color: 'var(--bg-base)' }}>
    Start a Mission →
  </Link>
</div>
```

**`src/app/leaderboard/page.tsx` empty state:**
Find where `entries.length === 0` is handled. Add:
```tsx
<div className="flex flex-col items-center justify-center py-20 px-6 text-center">
  <div className="text-4xl mb-4">✦</div>
  <p className="text-white font-semibold mb-2">Be the first on the board</p>
  <p className="text-slate-500 text-sm mb-6">Complete a mission to appear here.</p>
  <Link href="/missions" className="px-5 py-2.5 rounded-xl text-sm font-medium"
    style={{ background: 'rgba(56,240,255,0.12)', border: '1px solid rgba(56,240,255,0.3)', color: '#38F0FF' }}>
    Go to Missions →
  </Link>
</div>
```

**`src/app/profile/page.tsx`:**
Find where Stars balance is `0` or null. Add below the zero balance display:
```tsx
{starsBalance === 0 && (
  <p className="text-slate-600 text-xs mt-1">
    Complete a mission to earn your first Stars →
  </p>
)}
```

---

**Validation:**
- [ ] Log in with a fresh account. Go to `/nfts` — see the "No discoveries yet" empty state with CTA.
- [ ] Go to `/leaderboard` — if DB is empty, see the "Be the first" empty state.
- [ ] Profile page with 0 Stars shows the hint text.
- [ ] With a funded demo account: no empty states show (they're conditional).

---

## PHASE 3 — POLISH & RELIABILITY

Run after Phase 2 is confirmed working.

---

### PHASE 3 · PROMPT 9 — Fix Devnet Failure Messaging

**Depends on:** Phase 1 Prompt 1  
**Fixes:** FIX-H4  
**Risk level:** Low. Text changes only in `MissionActive.tsx`. No logic changes.

**Read these files fully before writing anything:**
- `src/components/sky/MissionActive.tsx` — the `step === 'done'` render block, lines 290-458

---

**Implementation:**

1. Find lines 371-376 in the `step === 'done'` block:
   ```tsx
   // BEFORE:
   <p className="text-xs animate-fade-in stagger-2" style={{ color: 'var(--text-muted)' }}>
     Saved locally — will sync when back online
   </p>
   
   // AFTER:
   <p className="text-xs animate-fade-in stagger-2" style={{ color: 'var(--text-muted)' }}>
     Transaction pending — check NFT gallery in a few minutes
   </p>
   ```

2. Below that message, add a retry button:
   ```tsx
   <button
     onClick={() => {
       setMintDone(false);
       setMintTxId('');
       setStep('verified');
     }}
     className="text-xs underline mt-1"
     style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
   >
     Retry mint →
   </button>
   ```

3. Also in `handleMint()`, find the `catch` block at the bottom (around line 174) where `txId` stays as `sim_`. Add a console log:
   ```ts
   } catch {
     console.warn('[mint] Network/timeout — observation saved as pending');
   }
   ```

---

**Validation:**
- [ ] Simulate a devnet timeout by temporarily setting the fetch timeout to 1ms. Confirm "Transaction pending" message appears with retry button.
- [ ] Retry button resets to `step === 'verified'` so the user can try minting again.
- [ ] On-chain success (real txId): still shows "✦ Sealed on Solana" — confirm not affected.

---

### PHASE 3 · PROMPT 10 — Polish Success Screen

**Depends on:** None  
**Fixes:** FIX-M4  
**Risk level:** Very low. Additive visual polish only.

**Read these files fully before writing anything:**
- `src/components/sky/MissionActive.tsx` — `step === 'done'` block, lines 290-458
- `src/lib/share.ts` — confirm `buildShareImageUrl()` signature and what URL it generates
- `src/app/api/share/og/route.tsx` — confirm the OG image endpoint accepts the same params

---

**Implementation:**

1. Find the share buttons section (lines 411-436). After the share buttons and before the action buttons, add a dynamic share image preview:
   ```tsx
   {ogImageUrl && (
     <div className="w-full rounded-xl overflow-hidden border border-white/10 animate-fade-in stagger-5">
       <img src={ogImageUrl} alt="Share preview" className="w-full" loading="lazy" />
     </div>
   )}
   ```
   `ogImageUrl` is already computed at line 294-301 using `buildShareImageUrl`.

2. Confirm `isOnChain` (line 291) and the Explorer link (lines 397-407) are working — read that block and verify the link href uses the correct devnet URL.

3. Check that `confettiColors` (line 302) and the 16-particle confetti burst (lines 311-330) are still rendering. If the CSS animation `confettiBurst` is defined in `globals.css`, verify it exists with `grep -r confettiBurst src/`.

4. Ensure "View My NFTs →" button (line 441-447) navigates to `/nfts` correctly. It currently calls `onClose()` then `router.push('/nfts')`.

---

**Validation:**
- [ ] Complete a full mission on devnet with a real on-chain mint. Confirm success screen shows: confetti, check circle, "Discovery Sealed", mission name, "✦ Sealed on Solana", stars count, score ring, Explorer link, share buttons, share image preview, "View My NFTs →" button.
- [ ] Click "View My NFTs →" — navigates to `/nfts` and shows the new NFT.
- [ ] Share on X button opens Twitter compose with correct text.
- [ ] Share preview image loads (it's an API-generated image).

---

### PHASE 3 · PROMPT 11 — Extract Shared Wallet Hook

**Depends on:** None  
**Fixes:** FIX-M2  
**Risk level:** Low but touches many files. Test each page after changes.

**Read these files fully before writing anything:**
- `src/hooks/useCamera.ts` — see if it's a good model for hook structure
- Every file that contains `wallets.find(w => ... chainType === 'solana')` — find them with grep: `grep -rn "chainType.*solana" src/`

---

**Implementation:**

1. Create `src/hooks/useSolanaWallet.ts`:
   ```ts
   'use client';
   import { useWallets } from '@privy-io/react-auth';
   
   export function useSolanaWallet() {
     const { wallets } = useWallets();
     const wallet = wallets.find(
       w => w.walletClientType === 'privy' && (w as { chainType?: string }).chainType === 'solana'
     );
     return { address: wallet?.address ?? null, wallet: wallet ?? null };
   }
   ```

2. Replace the inline wallet extraction in each file that has it. Files to update (confirmed by grep):
   - `src/components/shared/Nav.tsx` — lines 46-49
   - `src/components/sky/MissionActive.tsx` — lines 50-53
   - `src/app/nfts/page.tsx` — line 41
   - Any others found by the grep above

   In each file:
   ```ts
   // BEFORE:
   const { wallets } = useWallets();
   const solanaWallet = wallets.find(
     w => w.walletClientType === 'privy' && (w as { chainType?: string }).chainType === 'solana'
   );
   
   // AFTER:
   const { address: walletAddress, wallet: solanaWallet } = useSolanaWallet();
   ```
   Adjust variable names to match existing usage in each file.

3. Remove the `useWallets` import from any file where it's now unused.

---

**Validation:**
- [ ] `grep -rn "chainType.*solana" src/` — returns zero results in non-hook files.
- [ ] All affected pages load without errors.
- [ ] Wallet address displays correctly in Nav, MissionActive, NFT gallery.

---

### PHASE 3 · PROMPT 12 — Remove Orphaned Features from Nav

**Depends on:** Phase 2 Prompt 6 (nav already simplified)  
**Fixes:** FIX-L4  
**Risk level:** Low. Nav cleanup only. Pages remain at their URLs.

**Read these files fully before writing anything:**
- `src/components/shared/Nav.tsx` — confirm current state of `NAV_LINKS` after Prompt 6
- `src/app/club/page.tsx` — confirm it renders and understand what it shows
- `src/app/page.tsx` — check if Club or email subscribe are still referenced

---

**Implementation:**

1. Confirm `/club` is absent from `NAV_LINKS` in `Nav.tsx` (it should be after Prompt 6). If still present, remove it.

2. In `src/app/page.tsx`, find any email subscribe component or section. If present, remove the JSX block and any associated `useState` variables (`email`, `setEmail`, `subscribed`, etc.). Remove unused imports.

3. Find any `<Link href="/club">` or references to club membership in the homepage. Remove them.

4. Do not delete `src/app/club/page.tsx` — it still functions, it's just hidden from the nav.

---

**Validation:**
- [ ] No nav item or homepage link points to `/club`.
- [ ] `/club` still loads when navigated to directly — verify it renders without errors.
- [ ] Homepage has no email subscribe form.
- [ ] No TypeScript errors.

---

## PHASE 4 — SUBMISSION PREP

Run last. These are strategic/content tasks.

---

### PHASE 4 · PROMPT 13 — README Rewrite

**Depends on:** All previous phases complete  
**Fixes:** FIX-L5  
**Risk level:** None. Documentation only.

**Read these files fully before writing anything:**
- Current `README.md` in project root
- `CLAUDE.md` — for accurate tech stack and feature list
- `src/lib/mint-nft.ts` — to accurately describe the Bubblegum setup

---

**Implementation:**

Rewrite `README.md` to include:

1. **Hero section** — App name + tagline: "AI-verified telescope observations on Solana. Photograph → Verify → Mint NFT → Earn Stars."

2. **What Makes This Different** — 3 bullets:
   - Claude Vision anti-cheat photo verification (screenshot detection + double-capture liveness)
   - Compressed NFTs at ~$0.000005/mint via Metaplex Bubblegum (not just token gating)
   - Real Astroman.ge integration — Stars redeemable for physical telescope equipment (60K followers, active store)

3. **Live Demo** — Link to `stellarrclub.vercel.app`

4. **Architecture diagram** — ASCII or Mermaid:
   ```
   User → Privy Auth → Email/Google login → Embedded Solana wallet
   User → Camera → Claude Vision (/api/observe/verify) → Confidence score
   User → /api/sky/verify (Open-Meteo) → Oracle hash (SHA-256)
   Server → Bubblegum + Umi → Compressed NFT on Solana devnet
   Server → SPL Token → Stars minted to user wallet
   User → /api/stars-balance → Marketplace → Redeem discount codes
   ```

5. **Screenshots** — Add 3-4 screenshots: home/hero, mission+camera, success screen with Explorer link, ASTRA chat.

6. **Setup** — Minimal: `npm install` → copy `.env.example` → `npm run dev`. Link to `.env.example`.

7. **Tech Stack** — Accurate list from CLAUDE.md.

8. **Founder** — One sentence: "Built by Rezi Modebadze, founder of Astroman.ge — Georgia's first astronomy store."

---

**Validation:**
- [ ] README renders correctly on GitHub (check Markdown syntax).
- [ ] All links work.
- [ ] Architecture diagram is accurate.
- [ ] No placeholder text.

---

### PHASE 4 · PROMPT 14 — Demo Video Plan + Pitch Script

**Depends on:** All previous phases + demo account pre-populated  
**Fixes:** FIX-H5, FIX-L2  
**Risk level:** None. Script only, no code.

---

**Pitch Script (3 minutes):**

```
[0:00-0:20] — The Hook
"I'm Rezi. I run Astroman.ge — Georgia's first astronomy store, 
60,000 followers, physical inventory. Every night, customers ask: 
'Is tonight good for observing?' Now they can find out — and prove they went outside."

[0:20-0:50] — The Product (show app)
"Stellar gives you a 7-day sky forecast with real planet positions.
When conditions are right, you start a mission, photograph the sky,
and an AI verifies your photo — detecting screenshots, fake images, 
and checking the object is actually visible at your coordinates."

[0:50-1:20] — The Blockchain Layer (show minting)
"A verified observation mints a compressed NFT on Solana. 
Cost: $0.000005 per mint. That's not a typo. Metaplex Bubblegum.
The NFT includes an on-chain weather oracle hash — independently reproducible proof 
that you observed on that night, at those conditions."

[1:20-1:40] — The Business Model (show marketplace + Stars)
"Stars earned from observations are redeemable at Astroman.ge — 
real discounts on real telescopes. This closes the loop: 
you verify an observation, earn on-chain tokens, spend them at a store."

[1:40-2:00] — ASTRA AI (show chat)
"Ask ASTRA what's visible tonight and it calls live astronomy APIs — 
actual planet positions, actual sky forecast. It knows what you can see."

[2:00-2:20] — Differentiation
"Most crypto apps have no distribution. I have 60,000 astronomy followers,
a physical store in Tbilisi, and real products for rewards. 
The blockchain layer is invisible to users — they sign up with email, 
get a wallet automatically, and never see a seed phrase."

[2:20-2:45] — Hackathon + Roadmap
"Built in 5 weeks for Colosseum Frontier. Ships globally: 
Celestron for the Americas, Levenhuk for Europe, Astroman for the Caucasus.
Next: iOS app, mainnet, 3 regional dealer partnerships."

[2:45-3:00] — Close
"Stellar. Proof of observation on Solana."
```

**Demo video path (record in this exact order with a pre-funded account):**
1. Home page (2s)
2. Sky forecast with planet positions (5s)
3. Click mission — see Brief screen (3s)
4. Camera opens — capture sky (5s)
5. "Analyzing sky + photo..." loader (5s, let it run)
6. Verification result: confidence badge, identified object (5s)
7. "Seal Discovery" — mint animation (let it run)
8. Success screen: confetti, Explorer link, Stars earned (8s)
9. Click "View My NFTs" — gallery shows new NFT (5s)
10. ASTRA chat: type "What can I see tonight?" — live response with planet data (10s)
11. Marketplace — switch region, show products (5s)
12. Profile — Stars balance (3s)

**Total screen time: ~60s of actual demo**. Add voiceover from pitch script.

---

**Validation:**
- [ ] Pitch script fits in 3 minutes (read aloud with timer).
- [ ] Demo path has been tested live end-to-end with a pre-funded devnet account.
- [ ] Each step in the demo path works without errors.
- [ ] Share buttons produce correct URLs.

---

## PHASE 5 — PRIORITY ASSESSMENT

**If you only have 3 days left:**  
Run Prompts 1, 2, 3. Then record the demo video with a pre-funded account. Submit.

**If you have 7 days:**  
Run Prompts 1, 2, 3, 4, 5, 6. Then run Prompt 14 (demo). Submit.

**If you have 14 days:**  
Run Prompts 1–9 + 13. Record demo. Submit.

**If you have the full 27 days (now until May 11):**  
Run all prompts in order. Record polished video. Rehearse pitch 5+ times.

---

## Issues Found Not in Original Audit

### NEW-1: `sim_` prefix used in two different logic checks

In `MissionActive.tsx` line 222: `status: txId.startsWith('sim') ? 'pending' : 'completed'` and line 291: `const isOnChain = mintTxId && !mintTxId.startsWith('sim')`. These checks are duplicated across `handleMint()` and the render. If the `sim_` prefix convention changes, both must be updated. Low severity, but note for Prompt 9 if refactoring.

### NEW-2: Hardcoded Tbilisi coordinates as fallback

`MissionActive.tsx` lines 78 and 87: default `lat = 41.7151, lon = 44.8271` (Tbilisi). If GPS is unavailable and the user is outside Georgia, the oracle hash and astronomy check will be wrong. Consider logging a warning or showing "using default location" in the UI. Low severity for hackathon.

### NEW-3: `MissionActive.tsx` passes `mission.target === null ? 'Night Sky' : mission.name` inconsistently

Lines 149 and 189 both compute the target name but with slightly different logic. Should be extracted to a variable at the top of `handleMint()`. Low severity.
