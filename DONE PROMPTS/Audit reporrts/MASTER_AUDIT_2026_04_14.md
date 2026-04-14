# STELLARR — MASTER AUDIT REPORT
*April 14, 2026 | Colosseum Frontier, Consumer Track*
*4-agent audit: Technical Code Quality + Feature/UX + On-Chain Security + Strategy*

---

## VERDICT

**Winnable — but not yet.** The concept is genuinely strong and the founder angle is the best asset in the room. However, 5 critical bugs would kill the demo in front of judges. Fix those first, then execute 2 high-impact missing features. Do NOT make Stars tradeable before the hackathon.

---

## 1. CRITICAL — FIX BEFORE DEMO

These are demo-killers. Judges will find them.

### `sim_` tx fallback → explorer 404s
When the fee payer wallet isn't configured, mints return fake `sim_xxxxxxx` transaction IDs. Any judge who clicks "View on Solana Explorer" sees a 404. Instant credibility wipe for "sealed on-chain" claims.
**Fix:** Return an actual error instead of a fake tx. Gate the mint button UI until the wallet is configured.

### `NEXT_PUBLIC_INTERNAL_API_SECRET` exposed client-side
`src/hooks/useUserSync.ts:21` — this secret is prefixed `NEXT_PUBLIC_`, meaning it ships to the browser and is readable by anyone. Attackers can call your internal APIs directly, redirect Stars mints to their own wallet, or drain your fee payer.
**Fix:** Move to a server-only env var, call via a protected API route instead.

### `/api/users/upsert` has no auth guard
No authentication check. Open endpoint anyone can POST to.
**Fix:** Verify the Privy JWT or INTERNAL_API_SECRET before processing.

### Hardcoded Tbilisi coordinates for all users
Every user — including judges in New York, Austin, or London — sees Tbilisi sky data. Destroys the "global app" narrative at the demo moment.
**Fix:** Default to browser geolocation with a fallback prompt, not hardcoded lat/lng.

### Fake leaderboard seed data
9 hardcoded Georgian usernames in the leaderboard. Judges see a ghost-town app. No label distinguishing real vs. demo users.
**Fix:** Replace with real DB query, add a "No observers yet this week" empty state, or add a visible "Demo data" label if you must seed.

---

## 2. SECURITY

| Issue | Severity | Location |
|---|---|---|
| `NEXT_PUBLIC_INTERNAL_API_SECRET` in client bundle | **Critical** | `src/hooks/useUserSync.ts:21` |
| `/api/users/upsert` unauthenticated | **Critical** | `api/users/upsert/route.ts` |
| Verify `.env.local` is NOT in git history | **High** | `FEE_PAYER_PRIVATE_KEY` |
| Exposed discount codes in source (`MOONLAMP25`, `STELLAR10`) | **High** | Hardcoded strings |
| Public devnet RPC, no rate limiting | **Medium** | `src/lib/solana.ts:36` |
| No Merkle proof validation on observation verify | **Medium** | `src/lib/mint-nft.ts:49` |

---

## 3. FEATURE STATUS

| Feature | Status | Key Gap |
|---|---|---|
| Privy Auth + embedded wallet | Done | — |
| 7-day sky forecast | Partial | No error state / retry if API fails |
| Planet tracker | Partial | No offline/error state |
| AI Companion (ASTRA) | Done | Excellent UX |
| Marketplace | Done | Card pay works; Solana Pay **not integrated** |
| Discovery Attestations (cNFT) | Partial | API exists; UI minting flow from observations missing |
| Missions / Quizzes | Done | EN + KA, all 3 quizzes |
| Digital Star Maps | Missing | Not implemented at all |
| Mobile responsiveness | Done | — |
| Dark cosmic theme | Done | — |
| i18n EN/KA | Partial | Hardcoded strings in Dashboard, AstroChat, chat page |

**Solana Pay is not integrated.** `package.json` has no `@solana/pay`. Marketplace checkout only writes to localStorage.

---

## 4. CODE QUALITY

### Critical

**i18n breakage — hardcoded English strings:**
- `src/components/dashboard/Dashboard.tsx:41-54` — `getGreeting()` and `getRank()` return hardcoded English ("Good morning", "Observer", "Pathfinder")
- `src/components/shared/AstroChat.tsx:12-38` — `getSuggestions()` hardcodes English suggestions
- `src/app/chat/page.tsx:11-16` — `SUGGESTIONS` array not translated

Georgian users see a mixed-language UI. These all need to go through `t('namespace.key')`.

**Missing env vars in .env.example:**
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Error handling gaps:**
- `src/app/api/observe/verify/route.ts:201` — no fallback if Claude API fails
- `src/app/api/chat/route.ts:144` — streaming can fail silently mid-stream

### Major

- `src/components/shared/Nav.tsx:46` — unsafe `chainType` cast on Privy wallet; silently fails to detect Solana wallets in edge cases
- `src/components/dashboard/Dashboard.tsx:70` — `toLocaleDateString('en-US')` hardcoded, ignores locale
- Dashboard: 3 parallel API calls in useEffect with no Suspense → layout jank on mobile
- Large client components over 150-line CLAUDE.md limit:
  - `ObserveFlow.tsx` 300+ lines
  - `AstroChat.tsx` 250+ lines
  - `Dashboard.tsx` 250+ lines

### Minor

- Streaming SSE in AstroChat splits on `\n` only; malformed events silently drop
- No timeout handling on profile page parallel API calls
- Error messages not in `en.json`/`ka.json` — API errors hit users untranslated

**Overall code health: 75%** — TypeScript strict mode, no `any` types, Privy properly integrated. Main gaps are i18n completeness, env documentation, error handling.

---

## 5. ON-CHAIN IMPLEMENTATION

### What's working correctly
- Privy embedded wallets: config correct (`solana: { createOnLogin: 'users-without-wallets' }`)
- Gasless fee-payer pattern: correctly implemented across `/api/mint`, `/api/award-stars`, `/api/club/activate`
- Metaplex Bubblegum cNFT minting: Umi + Bubblegum correct
- Stars SPL token: `STARS_TOKEN_MINT` configured, award-stars mints to user ATA
- Idempotency: implemented via `idempotencyKey` check on `observationLog.mintTx`
- Devnet-only: no mainnet references, explorer links correctly point to `?cluster=devnet`

### What's missing / broken
- **Solana Pay**: not in `package.json`, not implemented anywhere
- **`sim_` fallback**: fake txIds returned when fee payer unconfigured (see Critical above)
- **Merkle tree address**: hardcoded in env, not dynamically configurable
- **No tx verification**: Merkle proof validation skipped in `mint-nft.ts:49`

---

## 6. STRATEGIC ASSESSMENT

### What's genuinely strong

- **Founder-market fit is the #1 asset.** Rezi isn't a crypto developer who built an astronomy feature — he's an astronomy entrepreneur who added crypto. 60K followers, $150K inventory, physical store in Tbilisi, 2nd place at Superteam Georgia. This is the story judges fund.
- **"Utility first, crypto second."** Users sign up with email, never see gas fees, never install Phantom. The Solana layer is invisible until you choose to reveal it. Exactly what consumer-track judges want.
- **Technical moat.** cNFT minting + Claude vision verification is non-trivial. Hard to replicate in 3 weeks.
- **Bilingual from day one.** Shows global intent.

### What judges will penalize

1. Explorer links that 404 (`sim_` fallback)
2. Tbilisi coordinates for everyone
3. Discount codes visible in source
4. Fake leaderboard
5. Open auth endpoint

### On making Stars tradeable

**Don't. Not for the hackathon.**

- Turns the consumer narrative into a speculative token play — exactly what consumer-track judges don't want
- Compliance risk
- Opens the door to farming bots that ruin missions and leaderboard integrity
- Consumer-track judges trust utility over token innovation

Post-hackathon path: Stars → in-app cosmetics (profile badges, constellation skins) → governance polls → then consider trading. Build product value first.

---

## 7. TOP 3 HIGHEST-IMPACT MISSING FEATURES

Ranked by win probability delta:

### #1 — Shareable Observation Proof card (est. 3 days)
After a mission completes: a generated social card with the target, date, Stars earned, and a real Solana explorer link. One-click share to X/Farcaster. This is the moment a judge understands the magic — real app, real crypto, real social proof. If a judge shares it during the demo, you win the room.

### #2 — Real leaderboard with 7-day filter (est. 2 days)
Replace seed data with live DB query. "This Week" tab shows real observers. Judge submits an observation, sees themselves ranked. Proof the app has users, not just a concept.

### #3 — Solana Pay integration for marketplace (est. 4 days)
Currently there's no actual Solana payment path — only localStorage. Even a basic SOL payment QR code at checkout completes the story: "buy a telescope with crypto, earn Stars, mint an NFT of your first observation."

---

## 8. EXECUTION PRIORITY

```
Week 1 (now):  Fix all 5 critical bugs
               - sim_ fallback → real error + UI gate
               - Move NEXT_PUBLIC_INTERNAL_API_SECRET server-only
               - Auth guard on /api/users/upsert
               - Geolocation instead of hardcoded Tbilisi
               - Real leaderboard or labeled demo data

Week 2:        High-impact features
               - Shareable observation proof cards
               - i18n fixes (getGreeting, getSuggestions, SUGGESTIONS)
               - Solana Pay basic integration
               - Error states on sky forecast + planet tracker

Week 3:        Polish + demo prep
               - Split large components (ObserveFlow, AstroChat, Dashboard)
               - .env.example completeness
               - Rehearse full demo flow end-to-end
               - Stress test on mobile
```

**Overall app health: 72%** — solid foundation, clear gaps, all fixable before May 11.
