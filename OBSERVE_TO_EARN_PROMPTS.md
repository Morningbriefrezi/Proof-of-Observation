# STELLAR — Observe-to-Earn Build Prompts
## Photo Upload → AI Verify → Reward → Collect

**Stack:** Next.js 15 + React 19 + TypeScript + Privy + Solana + Claude API
**Prerequisite:** Core prompts 2–6 from LATEST_PROMPTS.md must be complete and working on devnet.
**What this adds:** Users photograph celestial objects (phone or telescope), AI verifies the image, rewards Stars tokens based on confidence, and mints an NFT with the photo attached.

> HOW TO USE: One new conversation per prompt. Run in order. Each prompt depends on the previous.
> These are additive — they extend the existing mission system, they do not replace it.

---

## PROMPT OTE-1 — Observation Upload API (AI Verification Pipeline)

```
I'm building Stellar, a Next.js 15 astronomy app. I need a server-side API route that accepts a user's photo of a celestial object, runs it through Claude Vision for verification, cross-checks against real astronomy data, and returns a confidence score + reward amount.

Read these files before writing anything:
  src/lib/types.ts
  src/lib/planets.ts (understand getPlanetPositions or similar — what astronomy data is available)
  src/lib/sky-data.ts (understand what sky/forecast data is available)
  src/app/api/sky/verify/route.ts (understand the existing sky oracle pattern)
  src/app/api/award-stars/route.ts (understand Stars token award pattern)

---

## STEP 1 — Add types to src/lib/types.ts (append, do not modify existing types)

Add these at the end of the file:

export type ObservationTarget = 'moon' | 'planet' | 'stars' | 'constellation' | 'deep_sky' | 'unknown'

export type VerificationConfidence = 'high' | 'medium' | 'low' | 'rejected'

export interface PhotoVerificationResult {
  accepted: boolean
  confidence: VerificationConfidence
  target: ObservationTarget
  identifiedObject: string          // e.g. "Waxing Gibbous Moon", "Jupiter", "Orion constellation"
  reason: string                    // human-readable explanation
  astronomyCheck: {
    objectVisible: boolean          // was this object above horizon at claimed time+location?
    expectedPhase?: string          // for moon: expected phase at that time
    expectedAltitude?: number       // degrees above horizon
  }
  imageAnalysis: {
    isScreenshot: boolean
    isAiGenerated: boolean
    hasNightSkyCharacteristics: boolean
    sharpness: 'high' | 'medium' | 'low'
  }
  starsAwarded: number              // 0 if rejected
  metadata: {
    fileHash: string
    capturedAt: string              // ISO timestamp (from EXIF or user-provided)
    lat: number
    lon: number
  }
}

export interface UserObservation {
  id: string
  photo: string                     // base64 thumbnail (resized, not full res)
  verification: PhotoVerificationResult
  mintTxId?: string
  createdAt: string
}

---

## STEP 2 — Create src/lib/astronomy-check.ts (new file)

This module cross-checks whether a claimed celestial object was actually visible at a given time and location.

Import from src/lib/planets.ts — read planets.ts first to understand the exact function signatures and return types. Adapt the imports below to match what actually exists:

export async function checkObjectVisibility(params: {
  target: ObservationTarget
  identifiedObject: string
  lat: number
  lon: number
  timestamp: Date
}): Promise<{ objectVisible: boolean; expectedAltitude?: number; expectedPhase?: string }>

Implementation:

For target === 'moon':
  - Use the existing astronomy-engine or planet calculation in planets.ts to get moon altitude at the given time+location
  - objectVisible = altitude > 0
  - Get moon phase (astronomy-engine MoonPhase or equivalent) → expectedPhase as string ("Waxing Gibbous", "Full", etc.)
  - Return { objectVisible, expectedAltitude: altitude, expectedPhase }

For target === 'planet':
  - Look up the identifiedObject name (Jupiter, Saturn, Mars, Venus, Mercury) in the planet positions
  - Get altitude at given time+location
  - objectVisible = altitude > 5 (planets need to be meaningfully above horizon)
  - Return { objectVisible, expectedAltitude: altitude }

For target === 'stars' or 'constellation':
  - Call the sky oracle: fetch the cloud cover for that location
  - objectVisible = cloudCover < 60 (if sky was clear enough, stars were plausibly visible)
  - Return { objectVisible }

For target === 'deep_sky':
  - Same as stars check + objectVisible only if cloudCover < 30 (deep sky needs darker skies)
  - Return { objectVisible }

For target === 'unknown':
  - Return { objectVisible: true } (benefit of the doubt — Claude couldn't identify but image looked real)

If any astronomy calculation fails, log the error and return { objectVisible: true } — never block a user due to our calculation failing.

---

## STEP 3 — Create src/app/api/observe/verify/route.ts

POST handler accepting multipart/form-data with fields:
  - file: image file (required)
  - lat: string (required)
  - lon: string (required)
  - capturedAt: string (optional — ISO timestamp; defaults to now)

Validation (400 if fails):
  - file must exist, must be image/* MIME type
  - file size max 50MB (50_000_000 bytes)
  - file size min 10KB (10_000 bytes) — reject tiny placeholder images
  - lat/lon must be finite numbers in valid ranges

Logic:

1. Read file as buffer. Compute SHA-256 hash (same pattern as observation-image/verify route if it exists).

2. Convert image to base64 for Claude. If file is larger than 5MB, note this but still send — Claude handles large images.

3. Call Claude Vision API (model: claude-sonnet-4-20250514, max_tokens: 500):

   System prompt:
   "You are an astronomy image verification system. You analyze photos of the night sky to determine what celestial object is shown and whether the image is authentic. Be generous but honest — phone photos of the moon are valid even if blurry. Screenshots and AI-generated images are not valid."

   User message (two content blocks):
   [
     {
       type: "image",
       source: { type: "base64", media_type: file.type, data: base64 }
     },
     {
       type: "text",
       text: `Analyze this image. The user claims it was taken at coordinates ${lat}, ${lon} at ${capturedAt}.

Determine:
1. What celestial object is shown? (moon, specific planet, stars/constellation pattern, deep sky object, or unknown)
2. Is this image authentic? Check for:
   - Screenshot indicators (status bar, UI elements, sharp rectangular edges, notification bar)
   - AI generation artifacts (too-perfect details, unnatural star patterns, impossible physics)
   - Night sky characteristics (noise grain, atmospheric distortion, realistic star sizes)
   - Image sharpness (phone photos are naturally less sharp — that's OK and expected)

Be GENEROUS with phone photos. A blurry phone photo of the moon is VALID.
A phone photo of Jupiter as a bright dot is VALID.
A phone photo showing star trails or constellations is VALID.
Only reject obvious fakes: screenshots of planetarium apps, downloaded wallpapers, AI art.

Return ONLY valid JSON, no markdown, no preamble:
{
  "target": "moon" | "planet" | "stars" | "constellation" | "deep_sky" | "unknown",
  "identifiedObject": "specific name like 'Waxing Gibbous Moon' or 'Jupiter' or 'Orion constellation'",
  "isScreenshot": false,
  "isAiGenerated": false,
  "hasNightSkyCharacteristics": true,
  "sharpness": "high" | "medium" | "low",
  "reason": "Brief explanation of what you see and why you believe it's authentic or not"
}`
     }
   ]

4. Parse Claude response. Extract fields. Handle parse failures gracefully:
   - If JSON parse fails, try extracting JSON from markdown code fences
   - If still fails, default to: { target: "unknown", identifiedObject: "Unidentified sky object", isScreenshot: false, isAiGenerated: false, hasNightSkyCharacteristics: true, sharpness: "low", reason: "Could not analyze — accepting with low confidence" }

5. Run astronomy cross-check:
   import { checkObjectVisibility } from '@/lib/astronomy-check'
   const astroCheck = await checkObjectVisibility({
     target: analysis.target,
     identifiedObject: analysis.identifiedObject,
     lat: Number(lat),
     lon: Number(lon),
     timestamp: new Date(capturedAt || Date.now())
   })

6. Compute confidence score:

   let confidence: VerificationConfidence = 'medium'  // default

   // Reject conditions
   if (analysis.isScreenshot || analysis.isAiGenerated) {
     confidence = 'rejected'
   }
   // High confidence
   else if (
     analysis.hasNightSkyCharacteristics &&
     !analysis.isScreenshot &&
     astroCheck.objectVisible &&
     analysis.target !== 'unknown'
   ) {
     confidence = analysis.sharpness === 'low' ? 'medium' : 'high'
   }
   // Low confidence
   else if (!astroCheck.objectVisible) {
     confidence = 'low'  // object wasn't visible — suspicious but not rejected
   }

7. Compute Stars reward:
   const REWARD_TABLE = {
     high: { base: 50, rare_bonus: 30 },    // 50 Stars, +30 for rare objects
     medium: { base: 25, rare_bonus: 15 },
     low: { base: 10, rare_bonus: 5 },
     rejected: { base: 0, rare_bonus: 0 }
   }
   const rareObjects = ['saturn', 'jupiter', 'mars', 'venus', 'mercury', 'deep_sky']
   const isRare = rareObjects.some(r => analysis.identifiedObject.toLowerCase().includes(r)) || analysis.target === 'deep_sky'
   const reward = REWARD_TABLE[confidence]
   const starsAwarded = reward.base + (isRare ? reward.rare_bonus : 0)

8. Build and return PhotoVerificationResult:
   {
     accepted: confidence !== 'rejected',
     confidence,
     target: analysis.target,
     identifiedObject: analysis.identifiedObject,
     reason: analysis.reason,
     astronomyCheck: astroCheck,
     imageAnalysis: {
       isScreenshot: analysis.isScreenshot,
       isAiGenerated: analysis.isAiGenerated,
       hasNightSkyCharacteristics: analysis.hasNightSkyCharacteristics,
       sharpness: analysis.sharpness
     },
     starsAwarded,
     metadata: { fileHash: hash, capturedAt: capturedAt || new Date().toISOString(), lat: Number(lat), lon: Number(lon) }
   }

On Claude API failure: return 500 { error: 'Verification service unavailable' }

Import: Anthropic from '@anthropic-ai/sdk', crypto from 'crypto'
```

---

## PROMPT OTE-2 — Upload UI + Camera Capture Component

```
I'm building Stellar, a Next.js 15 astronomy app. I need a full-screen observation upload flow where users can take a photo or select from gallery, then see the AI verification result and collect rewards.

Read these files before writing anything:
  src/lib/types.ts (PhotoVerificationResult, ObservationTarget, VerificationConfidence — added in previous prompt)
  src/components/sky/MissionActive.tsx (understand the existing step-based UI pattern, camera access, dark styling)
  src/app/missions/page.tsx (understand navigation + auth patterns)
  src/app/api/observe/verify/route.ts (understand the verification API)
  src/app/api/mint/route.ts (understand mint API)
  src/app/api/award-stars/route.ts (understand Stars award API)

---

## STEP 1 — Create src/components/observe/ObserveFlow.tsx

'use client' component.

Props:
  interface ObserveFlowProps {
    onClose: () => void
    walletAddress: string | null
  }

Internal step states (use useState<string>):
  'capture' → 'uploading' → 'result' → 'minting' → 'done'

State variables:
  const [step, setStep] = useState<'capture' | 'uploading' | 'result' | 'minting' | 'done'>('capture')
  const [photo, setPhoto] = useState<string | null>(null)         // base64 data URL
  const [photoFile, setPhotoFile] = useState<File | null>(null)   // original file for upload
  const [verification, setVerification] = useState<PhotoVerificationResult | null>(null)
  const [error, setError] = useState('')
  const [mintTxId, setMintTxId] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null)

On mount:
  - Request geolocation (navigator.geolocation.getCurrentPosition) → setLocation
  - If geolocation denied, default to { lat: 41.72, lon: 44.83 } (Tbilisi)

### step === 'capture' render:

Full-screen dark background (#070B14), centered content:

- Header: back arrow (onClick → onClose) + "Observe" title (serif, white)

- If cameraActive: show <video> element filling the card area (rounded-2xl, aspect-[3/4])
  Below video: "Capture" button (large, brass gradient, round) that:
    1. Draws video frame to hidden canvas
    2. canvas.toBlob → setPhotoFile(new File([blob], 'capture.jpg'))
    3. canvas.toDataURL → setPhoto(dataUrl)
    4. Stop camera stream
    5. setCameraActive(false)
    6. Proceed to upload: handleVerify()

- If not cameraActive: show two large tap targets stacked vertically (gap-4):

  Card 1: "Take Photo" (Camera icon from lucide-react)
    Teal border, dark bg, rounded-2xl, p-6
    Sub: "Point at the sky and capture"
    onClick:
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } })
      Set stream to videoRef, setCameraActive(true)

  Card 2: "Upload from Gallery" (ImagePlus icon from lucide-react)
    Slate border, dark bg, rounded-2xl, p-6
    Sub: "Select a photo you already took"
    onClick: fileInputRef.current?.click()

  Hidden file input:
    accept="image/jpeg,image/png,image/tiff,image/heic,image/heif"
    onChange:
      const file = e.target.files?.[0]
      if (!file) return
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = () => { setPhoto(reader.result as string); handleVerify(file) }
      reader.readAsDataURL(file)

- Bottom tip text (slate-500, text-xs, text-center):
  "Phone photos are welcome — even a blurry moon counts!"

### handleVerify(fileOverride?: File):

  1. setStep('uploading'), setError('')
  2. const file = fileOverride || photoFile
  3. if (!file) { setError('No photo selected'); setStep('capture'); return }
  4. Build FormData:
     formData.append('file', file)
     formData.append('lat', String(location?.lat ?? 41.72))
     formData.append('lon', String(location?.lon ?? 44.83))
     formData.append('capturedAt', new Date().toISOString())
  5. POST to /api/observe/verify (60s timeout via AbortController)
  6. If !res.ok: setError('Verification failed — try again'), setStep('capture'); return
  7. Parse result as PhotoVerificationResult
  8. setVerification(result)
  9. setStep('result')

### step === 'uploading' render:

  Centered dark card:
  - Thumbnail of captured photo (rounded-xl, max-h-48, object-cover, opacity-60)
  - Animated spinner below
  - "Analyzing your observation..." (white, text-sm)
  - Three rotating sub-texts (cycle every 2s using setInterval):
    "Identifying celestial object..."
    "Cross-checking star positions..."
    "Calculating reward..."

### step === 'result' render:

  Scrollable dark card:

  - Photo thumbnail (rounded-xl, max-h-40, object-cover, mx-auto)

  - Confidence badge (large, centered, mt-4):
    'high' → green bg, "✓ High Confidence"
    'medium' → amber bg, "● Medium Confidence"
    'low' → slate bg, "○ Low Confidence"
    'rejected' → red bg, "✗ Rejected"

  - Identified object: verification.identifiedObject (white, text-lg, serif, mt-2)

  - Reason text: verification.reason (slate-400, text-sm, mt-1)

  - Metric grid (2 columns, gap-3, mt-4):
    Row 1: "Object" → verification.identifiedObject | "Visible" → verification.astronomyCheck.objectVisible ? "Yes ✓" : "Not confirmed"
    Row 2: "Sharpness" → verification.imageAnalysis.sharpness | "Screenshot" → verification.imageAnalysis.isScreenshot ? "Detected ✗" : "None ✓"
    (If moon) Row 3: "Expected Phase" → verification.astronomyCheck.expectedPhase | "Altitude" → verification.astronomyCheck.expectedAltitude?.toFixed(1) + "°"

  - Reward display (centered, mt-4):
    If accepted:
      Large "+{verification.starsAwarded} ✦" in #FFD166, font-bold, text-2xl
      Sub: "Stars earned for this observation" (slate-500, text-xs)
    If rejected:
      "This image could not be verified" in red-400
      Sub: verification.reason

  - Buttons (mt-6):
    If accepted:
      Primary: "Seal on Solana ✦" (brass gradient, full width) → handleMintObservation()
      Ghost: "Collect Stars Only" → handleCollectOnly()
    If rejected:
      Primary: "Try Another Photo" → resetToCapture()
      Ghost: "Close" → onClose()

### handleMintObservation():
  1. setStep('minting')
  2. POST to /api/mint:
     {
       userAddress: walletAddress,
       target: verification.identifiedObject,
       timestampMs: new Date(verification.metadata.capturedAt).getTime(),
       lat: verification.metadata.lat,
       lon: verification.metadata.lon,
       cloudCover: 0,
       oracleHash: verification.metadata.fileHash.slice(0, 42),
       stars: verification.starsAwarded
     }
  3. If ok: setMintTxId(result.txId)
  4. Fire-and-forget Stars award:
     fetch('/api/award-stars', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ recipientAddress: walletAddress, amount: verification.starsAwarded, reason: `Photo: ${verification.identifiedObject}` }) }).catch(() => {})
  5. setStep('done')
  6. On error: setError('Mint failed'), setStep('result')

### handleCollectOnly():
  1. Fire-and-forget Stars award (same as above)
  2. setStep('done')

### step === 'minting' render:
  Centered: spinner + "Sealing your discovery on Solana..."

### step === 'done' render:
  Same pattern as MissionActive.tsx 'done' step:
  - Teal checkmark circle
  - "Discovery Sealed" (or "Stars Collected" if no mint)
  - Identified object name + emoji
  - "+{starsAwarded} ✦" in gold
  - If mintTxId: "View on Solana Explorer" link (teal, external link icon)
  - Buttons: "View NFTs" (→ /nfts) | "Observe Again" (→ resetToCapture()) | "Done" (→ onClose())

### resetToCapture():
  setPhoto(null), setPhotoFile(null), setVerification(null), setError(''), setMintTxId(''), setStep('capture')

### Cleanup:
  useEffect cleanup: stop camera stream if active (streamRef.current?.getTracks().forEach(t => t.stop()))

---

## STEP 2 — Create src/app/observe/page.tsx

'use client' page.

Import: usePrivy from @privy-io/react-auth, ObserveFlow component, useRouter from next/navigation

Auth: usePrivy() → { authenticated, login, user }

Get wallet address: same pattern as missions/page.tsx (from user.linkedAccounts or embeddedWallets)

If !authenticated:
  Centered card: Camera icon, "Sign in to start observing", login button (same style as missions page)

If authenticated:
  <ObserveFlow onClose={() => router.push('/')} walletAddress={walletAddress} />

Page metadata: title "Observe | Stellar"

---

## STEP 3 — Add navigation entry

Read whatever nav component exists (likely src/components/layout/BottomNav.tsx or similar nav file).

Add a new nav item:
  { href: '/observe', label: 'Observe', icon: Camera }
  Place it prominently — this is the primary user action.

If the nav uses a specific icon set, match it. Import Camera from lucide-react.

If there's a floating action button or primary CTA anywhere on the home page, consider making "Observe" the primary action.
```

---

## PROMPT OTE-3 — Daily Missions + Streak System

```
I'm building Stellar, a Next.js 15 astronomy app. I need to add daily observation targets and streak tracking to encourage habit formation.

Read these files before writing anything:
  src/app/missions/page.tsx (understand existing mission system)
  src/lib/types.ts (existing mission types)
  src/lib/mission-data.ts or wherever missions are defined (understand existing mission structure)
  src/lib/planets.ts (what planets are available)
  src/app/observe/page.tsx (the observe flow from previous prompt)

---

## STEP 1 — Create src/lib/daily-targets.ts

This module generates "tonight's targets" — objects the user should try to photograph.

import type { ObservationTarget } from '@/lib/types'

export interface DailyTarget {
  id: string
  name: string
  target: ObservationTarget
  emoji: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  bonusStars: number           // extra Stars for completing this specific target
  available: boolean           // is the object actually visible tonight?
  altitude?: number            // current altitude in degrees
}

export async function getTonightTargets(lat: number, lon: number): Promise<DailyTarget[]>

Implementation:
  1. Use the existing planet position logic from planets.ts to get all planet altitudes
  2. Always include the Moon (easy target, always good for phone photos):
     { id: 'moon', name: 'Moon', target: 'moon', emoji: '🌕', description: 'Photograph the Moon — any phase counts', difficulty: 'easy', bonusStars: 10, available: moonAltitude > 0, altitude: moonAltitude }
  3. For each visible planet (altitude > 10°):
     { id: planetName.toLowerCase(), name: planetName, target: 'planet', emoji: '🪐', description: `Capture ${planetName} — visible tonight at ${altitude.toFixed(0)}° altitude`, difficulty: 'medium', bonusStars: 30, available: true, altitude }
  4. Always include a "Stars & Constellations" general target:
     { id: 'stars', name: 'Stars & Constellations', target: 'stars', emoji: '✨', description: 'Photograph any star pattern or constellation', difficulty: 'easy', bonusStars: 15, available: true }
  5. Add a "Deep Sky Challenge" (hard):
     { id: 'deep_sky', name: 'Deep Sky Object', target: 'deep_sky', emoji: '🌌', description: 'Capture a nebula, galaxy, or star cluster — telescope recommended', difficulty: 'hard', bonusStars: 80, available: true }
  6. Sort: available first, then by difficulty (easy → hard)
  7. Return array

---

## STEP 2 — Create src/app/api/streak/route.ts

GET handler. Reads query param: walletAddress (required).

If NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set:
  Query Supabase table observation_log (create SQL in comment block):

  /*
   * SETUP — run in Supabase SQL editor:
   *
   * create table observation_log (
   *   id          uuid default gen_random_uuid() primary key,
   *   wallet      text not null,
   *   target      text not null,
   *   stars       int not null default 0,
   *   confidence  text not null,
   *   mint_tx     text,
   *   created_at  timestamptz default now()
   * );
   * create index idx_obs_wallet on observation_log(wallet);
   * alter table observation_log enable row level security;
   * create policy "public read own" on observation_log for select using (true);
   * create policy "service write" on observation_log for insert using (true);
   */

  Query: select created_at from observation_log where wallet = walletAddress order by created_at desc limit 60

  Calculate streak:
    - Group dates by calendar day (user's timezone or UTC)
    - Count consecutive days going backwards from today
    - streak = number of consecutive days with at least one observation
    - todayCompleted = whether there's an observation today

  Streak bonus Stars:
    - 3 days: +10
    - 7 days: +25
    - 14 days: +50
    - 30 days: +100

  Return: { streak: number, todayCompleted: boolean, bonusStars: number, totalObservations: number }

If Supabase not configured:
  Return: { streak: 0, todayCompleted: false, bonusStars: 0, totalObservations: 0 }

---

## STEP 3 — Create src/components/observe/TonightTargets.tsx

'use client' component.

Props:
  interface TonightTargetsProps {
    onStartObserve: () => void    // callback to navigate to /observe
    walletAddress: string | null
  }

On mount:
  - Get user location (geolocation API, default Tbilisi)
  - Call getTonightTargets(lat, lon) → set targets state
  - If walletAddress: fetch /api/streak?walletAddress=... → set streak state

Render:
  - Section title: "Tonight's Targets" (serif, white, text-lg)

  - If streak > 0: streak badge inline with title
    "🔥 {streak} day streak" (amber text, text-xs, ml-2)
    If streak bonus > 0: "+ {bonusStars} ✦ bonus" (gold, text-xs)

  - Target cards (vertical stack, gap-3):
    Each card (dark bg, rounded-xl, p-4, flex row):
      Left: emoji (text-2xl)
      Middle:
        Name (white, font-semibold, text-sm)
        Description (slate-400, text-xs)
        Difficulty pill: easy=green, medium=amber, hard=purple (text-[10px], rounded-full, px-2)
      Right:
        "+{bonusStars} ✦" (gold, text-sm, font-bold)
        If !available: "Below horizon" (red-400, text-[10px])

    Card onClick: onStartObserve() — any target tap opens the observe flow

  - "Observe Now" CTA button at bottom (brass gradient, full width, sticky bottom)

---

## STEP 4 — Integrate TonightTargets into the home page

Read the home page file (src/app/page.tsx or src/app/(home)/page.tsx — find it).

Add <TonightTargets> component in a visible position — ideally:
  - After the existing sky forecast section
  - Before the existing missions list (if both exist on home)

Only show TonightTargets if user is on the home/dashboard. Do not add it to the observe page itself.

Import TonightTargets from '@/components/observe/TonightTargets'
Pass onStartObserve={() => router.push('/observe')} and walletAddress from Privy.

---

## STEP 5 — Log observations to Supabase

Read src/components/observe/ObserveFlow.tsx (from previous prompt).

In handleMintObservation() and handleCollectOnly(), after the Stars award fire-and-forget, add another fire-and-forget:

  fetch('/api/observe/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wallet: walletAddress,
      target: verification.identifiedObject,
      stars: verification.starsAwarded,
      confidence: verification.confidence,
      mintTx: mintTxId || null
    })
  }).catch(() => {})

Create src/app/api/observe/log/route.ts:
  POST handler. Insert into observation_log table.
  If Supabase not configured, return { logged: false } (no error).
  On success: return { logged: true }
  On error: log it, return { logged: false }
```

---

## PROMPT OTE-4 — Observation History + Profile Integration

```
I'm building Stellar, a Next.js 15 astronomy app. I need to show the user's observation history with verification results and integrate the observe-to-earn stats into their profile.

Read these files before writing anything:
  src/app/profile/page.tsx (understand existing profile layout and data)
  src/app/nfts/page.tsx (understand existing NFT gallery pattern)
  src/lib/types.ts (PhotoVerificationResult, UserObservation types)
  src/app/api/streak/route.ts (streak data)

---

## STEP 1 — Create src/app/api/observe/history/route.ts

GET handler. Query param: walletAddress (required).

Fetch from Supabase observation_log:
  select * from observation_log where wallet = walletAddress order by created_at desc limit 50

Return: { observations: array of { id, target, stars, confidence, mint_tx, created_at } }

If Supabase not configured: return { observations: [] }

---

## STEP 2 — Create src/app/observations/page.tsx

'use client' page. Auth-gated (same pattern as missions page).

On mount: fetch /api/observe/history?walletAddress=...

States: loading, empty, loaded.

Page layout:
  - Header: "My Observations" (serif) + count badge
  - Stats row (3 cards): Total observations | Current streak | Total Stars earned (sum from observations)
  - Observation list (vertical stack, gap-3):
    Each card (dark bg, rounded-xl, p-4):
      - Target name (white, font-semibold)
      - Confidence badge (same colors as ObserveFlow result)
      - Stars earned: "+{stars} ✦" (gold)
      - Date: relative time (e.g., "2 hours ago", "Yesterday")
      - If mint_tx: small "On-chain ✓" badge (teal) + Explorer link

  - Empty state: Telescope icon + "No observations yet" + "Start Observing" button → /observe

---

## STEP 3 — Update src/app/profile/page.tsx (surgical additions)

Read the full file. Do not restructure — only add.

Find the stats/metrics section. Add these stats:
  - "Observations" → total count from /api/observe/history
  - "Streak" → from /api/streak
  - "Best Streak" → if available (or skip)

Add a "Recent Observations" section below existing content:
  Show last 3 observations (target name + confidence badge + stars + date)
  "View All →" link to /observations

Fetch observation data alongside existing profile data loading.

---

## STEP 4 — Add navigation link

Read the nav component. Add:
  { href: '/observations', label: 'History', icon: List } (or Clock icon)

This should be secondary to the "Observe" primary action from OTE-2.
```

---

## PROMPT OTE-5 — Double Capture Anti-Cheat (Optional Enhancement)

```
I'm building Stellar, a Next.js 15 astronomy app. I want to add an optional "live capture" verification mode where the user takes two quick photos 3 seconds apart. If both photos show the same celestial object with slight natural variation (hand movement, atmospheric changes), it strongly signals a live capture rather than a screenshot or downloaded image.

Read src/components/observe/ObserveFlow.tsx fully before editing.

This is a SINGLE surgical addition to the capture flow. Do not restructure the component.

---

## Changes to ObserveFlow.tsx:

Add state:
  const [doubleCapture, setDoubleCapture] = useState(false)
  const [firstFrame, setFirstFrame] = useState<string | null>(null)

When cameraActive and user taps "Capture":
  1. Capture first frame → setFirstFrame(base64)
  2. Show overlay: "Hold steady... capturing again in 3s" with countdown
  3. After 3 seconds, auto-capture second frame
  4. Combine both frames: send both to verify API

Update the verify API call:
  In FormData, append 'file2' with the first frame as a Blob (the second frame is 'file')

Update src/app/api/observe/verify/route.ts:
  If 'file2' exists in form data:
    - Send BOTH images to Claude Vision in the same message (two image blocks)
    - Add to the text prompt: "Two photos were taken 3 seconds apart. Check if they show the same object with natural slight variation (which confirms live capture). If both show the same object with natural differences, set liveCaptureConfirmed: true."
    - Parse liveCaptureConfirmed from response
    - If liveCaptureConfirmed: boost confidence by one level (low→medium, medium→high)
    - Add to metadata: { doubleCaptureVerified: true }

  If 'file2' does not exist: proceed as before (single image flow unchanged)

In the capture UI, add a small toggle below the camera preview:
  "Live Capture Mode" (toggle, default OFF)
  Sub text: "Takes 2 photos for stronger verification"
  When ON: setDoubleCapture(true), capture flow does the 3-second double capture
  When OFF: single capture as before

This must be non-blocking — if the user doesn't want double capture, the flow is identical to before.
```

---

## EXECUTION ORDER

| # | Prompt | What it adds | Depends on |
|---|--------|-------------|------------|
| OTE-1 | Verify API | AI verification pipeline + astronomy cross-check | Core prompts 2-6 |
| OTE-2 | Upload UI | Camera capture, gallery upload, full observe flow | OTE-1 |
| OTE-3 | Daily targets + streaks | Tonight's targets, streak tracking, Supabase logging | OTE-2 |
| OTE-4 | History + profile | Observation history page, profile stats integration | OTE-3 |
| OTE-5 | Double capture | Anti-cheat enhancement (optional) | OTE-2 |

---

## NEW ENV VARS

Add to .env.local after running these prompts:
```
# Already needed from core prompts:
ANTHROPIC_API_KEY=              ← used by /api/observe/verify for Claude Vision
NEXT_PUBLIC_SUPABASE_URL=       ← used by streak + observation log
NEXT_PUBLIC_SUPABASE_ANON_KEY=  ← used by client-side reads
SUPABASE_SERVICE_ROLE_KEY=      ← used by server-side writes
```

## SUPABASE TABLES

Run this SQL once before using OTE-3+:
```sql
create table observation_log (
  id          uuid default gen_random_uuid() primary key,
  wallet      text not null,
  target      text not null,
  stars       int not null default 0,
  confidence  text not null,
  mint_tx     text,
  created_at  timestamptz default now()
);
create index idx_obs_wallet on observation_log(wallet);
alter table observation_log enable row level security;
create policy "public read own" on observation_log for select using (true);
create policy "service write" on observation_log for insert using (true);
```
