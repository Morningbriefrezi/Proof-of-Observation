# QA Fix Prompts — Stellar
> Generated from full audit on 2026-04-15. Execute in order using /executor.

---

## Prompt 1 — Auth gate on `/api/chat`

```
In src/app/api/chat/route.ts, add Privy authentication to the POST handler.

Import PrivyClient from '@privy-io/server-auth' and instantiate it the same 
way it's done in src/app/api/mint/route.ts (lines 10-13).

At the top of the POST function, before any other logic, read the 
Authorization header, extract the Bearer token, and call 
privy.verifyAuthToken(token). If missing or invalid, return 
NextResponse.json({ error: 'Unauthorized' }, { status: 401 }).

Do not change any other logic in the file.
```

---

## Prompt 2 — Fix SSE newline stripping in non-tool-use path

```
In src/app/api/chat/route.ts, the sseStream() function at line 73 replaces 
all newlines with spaces (.replace(/\n/g, ' ')). This destroys ASTRA's 
formatted responses when no tool use is triggered.

Replace the sseStream() shortcut entirely. Instead of returning the full 
response as a single SSE frame, use client.messages.stream() for non-tool 
responses too, so both code paths stream character by character.

Remove the sseStream() function. In the block at lines 148-154 where 
stop_reason !== 'tool_use', replace the sseStream(text) call with the same 
streaming ReadableStream pattern used at lines 180-208, but pass only the 
direct message (no tool results in messages).

Do not change the tool-use path (lines 156 onward).
```

---

## Prompt 3 — Fix SSE encoding for newlines in streamed output

```
In src/app/api/chat/route.ts, inside the ReadableStream that streams the 
final response (the block starting around line 189), the SSE frame is built 
as:

  `data: ${chunk.delta.text}\n\n`

If chunk.delta.text contains a newline character, it breaks the SSE protocol 
(a bare \n inside a data: line terminates the event prematurely).

Fix this by replacing newline characters in chunk.delta.text with a sentinel 
before encoding, and having the client decode them back. Use \u2028 (line 
separator) as the sentinel:

Server: replace \n with \u2028 before inserting into the SSE frame
Client (src/app/chat/page.tsx line 90): after reading payload, replace 
\u2028 back to \n before appending to message content

Apply this to both the streaming path and the (now-unified) non-tool path 
from Prompt 2.
```

---

## Prompt 4 — Unify `stars` vs `points` schema inconsistency

```
Three files cast `(m as any).points` as a fallback for `m.stars`:
- src/app/proof/page.tsx line 26
- src/components/sky/ObservationLog.tsx line 49
- src/components/sky/StatsBar.tsx line 14

First, read src/lib/types.ts (or wherever the Mission/CompletedMission type 
is defined) and src/lib/constants.ts to confirm the field name used there.

If the type uses `stars`, remove the `(m as any).points ?? 0` fallbacks in 
all three files — use only `m.stars ?? 0`.

If the type has both fields, add `points?: number` to the type definition 
and remove the `as any` cast while keeping the fallback: 
`m.stars ?? m.points ?? 0`.

Either way, eliminate all three `as any` casts.
```

---

## Prompt 5 — Add error boundaries to Sky page Suspense blocks

```
In src/app/sky/page.tsx, the five Suspense blocks (TonightHighlights, 
SunMoonBar, ForecastGrid, PlanetGrid, BestTargets) have no error handling. 
If any server component throws, the whole page crashes.

Read src/components/shared/ErrorBoundary.tsx to understand the existing 
error boundary component.

Wrap each Suspense block with the ErrorBoundary component. Each ErrorBoundary 
should show a minimal fallback — a small rounded card with muted text like 
"Couldn't load section". Use the same height/style as the existing skeleton 
fallbacks so layout doesn't shift.

Do not change the Suspense fallback skeletons — keep them inside Suspense, 
just add ErrorBoundary as the outer wrapper.
```

---

## Prompt 6 — Fix hardcoded strings that bypass i18n

```
The following visible strings are hardcoded in components instead of using 
translation keys. Fix each one:

1. src/app/missions/page.tsx line 143: 
   'Good for observing tonight' and 'Cloudy tonight' 
   → add keys missions.goodConditions and missions.cloudyTonight to 
   src/messages/en.json and src/messages/ka.json, then use t()

2. src/app/missions/page.tsx line 179: 
   "Missions" heading 
   → already has t('title') nearby — confirm it's used or replace with t('title')

3. src/app/missions/page.tsx line 223: 
   "Knowledge Quizzes" section header 
   → add key missions.knowledgeQuizzes, use t('knowledgeQuizzes')

4. src/app/marketplace/page.tsx line 72: 
   "Marketplace" heading 
   → add key marketplace.title, use t('title') (add useTranslations if not 
   already imported)

5. src/app/chat/page.tsx line 141: 
   'AI Astronomer · Online' 
   → add key chat.subtitle, use t('subtitle') instead of the locale ternary

For each Georgian translation, provide the correct Georgian text:
- goodConditions: "დღეს კარგი პირობებია"
- cloudyTonight: "დღეს მოღრუბლულია"
- knowledgeQuizzes: "ცოდნის ვიქტორინები"
- marketplace.title: "მარკეტპლეისი"
- chat.subtitle: "AI ასტრონომი · ონლაინ"
```

---

## Prompt 7 — Show location fallback warning when coordinates are default

```
In src/app/missions/page.tsx at line 174, the DailyCheckIn component receives 
`lat={location.lat ?? 41.6941} lon={location.lon ?? 44.8337}`. When the user's 
real location is unavailable, Tbilisi coordinates are used silently.

Also in src/app/chat/page.tsx at lines 35-38 and the same pattern elsewhere.

Fix for missions/page.tsx:
- Import useLocation if not already imported (it is, line 9)
- Check if location.lat and location.lon are null/undefined
- If so, render a small banner above the DailyCheckIn using the existing 
  LocationPicker component (already imported in marketplace — check if it 
  should be added here too), or show a one-line text prompt: 
  "Using approximate location — tap to set yours" that opens LocationPicker

Keep the fallback coordinates as-is for the actual data fetch. Only add the 
UI hint. Do not refactor location logic.
```

---

## Prompt 8 — Add DB unique constraint to prevent double star awards

```
In src/lib/schema.ts, find the observationLog table definition.

Add a unique index on (wallet, mintTx) so that a second insert with the same 
idempotency key fails at the database level, not just at the application level.

Use Drizzle's uniqueIndex() helper:
  uniqueIndex('observation_log_wallet_mint_tx_unique').on(
    observationLog.wallet, 
    observationLog.mintTx
  )

Then in src/app/api/award-stars/route.ts at the bottom of the idempotency 
insert (lines 122-130), catch the unique constraint violation specifically and 
return { success: true, txId: 'already_awarded', cached: true } instead of 
logging it as an error.

Do not change the Drizzle migration files — just update the schema definition. 
Note in a comment that a migration must be run to apply the constraint.
```

---

## Prompt 9 — Fix Stars balance source of truth in Marketplace

```
In src/app/marketplace/page.tsx line 80:

  <StarsRedemption starsBalance={starsBalance || totalStars} ... />

When starsBalance is 0 (API not yet loaded), it falls back to totalStars 
(local state). This shows stale data.

Fix: pass starsBalance directly without the || totalStars fallback. If 
starsBalance is 0 and the address exists, it means the API is still loading — 
pass a loading prop or undefined so StarsRedemption can show a skeleton.

Read src/components/shared/StarsRedemption.tsx first to understand what props 
it accepts, then make the minimal change to pass undefined (or a loading 
boolean) while the balance is fetching.

Remove the totalStars computation on line 43-44 if it's only used for this 
fallback and nowhere else on the page.
```

---

## Prompt 10 — Fix email subscribe form success check

```
In src/app/page.tsx, in the EmailSubscribe component (around line 28), the 
handleSubmit function calls fetch('/api/subscribe') and sets status 'sent' 
regardless of whether the response was successful.

Fix: after await fetch(...), check res.ok. If false, throw so the catch block 
sets status 'error'. 

Change:
  await fetch('/api/subscribe', { ... });
  setStatus('sent');

To:
  const res = await fetch('/api/subscribe', { ... });
  if (!res.ok) throw new Error('subscribe_failed');
  setStatus('sent');

No other changes.
```

---

## Prompt 11 — Add note about in-memory rate limiting limitation

```
In src/middleware.ts, add a comment above the rateLimitMap declaration 
explaining the limitation:

// NOTE: In-memory rate limit — resets on server restart and is not shared 
// across serverless instances. Sufficient for hackathon demo; upgrade to 
// Vercel KV (@vercel/kv) before production launch.

No code changes — documentation only. This is a known acceptable tradeoff 
for the hackathon timeline.
```

---

## Prompt 12 — Delete unused redirect pages

```
Delete the following three files — they contain only a redirect() call and 
add dead routes to the app:

- src/app/gallery/page.tsx  (redirects to /nfts)
- src/app/observe/page.tsx  (redirects to /missions)  
- src/app/observations/page.tsx  (redirects to /nfts)

Before deleting, grep the entire codebase for href="/gallery", href="/observe", 
and href="/observations" to confirm no navigation links still point to these 
routes. If any are found, update them to point to the correct destination 
(/nfts or /missions) before deleting the files.
```
