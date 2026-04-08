# Codex Prompts
STELLAR audit + execution plan
Last reviewed: April 7, 2026

## Ground Rules

- Do not redesign the app.
- Do not remove current flows unless a bug forces it.
- Keep the dark cosmic visual language.
- Prefer minimal diffs and behavior-preserving fixes.
- Animations are allowed only if they use cheap properties like `opacity` and `transform`, respect `prefers-reduced-motion`, and do not add noticeable input lag.

## Audit Snapshot

### What looks good already

- The app structure is coherent and easy to extend.
- `next-intl`, Privy, sky forecast, planet tracker, marketplace, profile, missions, and chat are all wired in at a usable demo level.
- `npm run build` passes successfully in the current repo state.
- The visual system is consistent across pages and already has decent motion primitives.

### High-priority issues I found

1. `AstroChat` is out of sync with `/api/chat`.
   - `src/app/chat/page.tsx` expects streamed SSE.
   - `src/components/shared/AstroChat.tsx` still expects `{ reply }` JSON.
   - Result: the floating assistant is effectively broken against the current API contract.

2. Observation identity is too coarse and can overwrite user data.
   - `useAppState.addMission()` replaces entries by `mission.id`.
   - `pollinet` queue storage also keys records by `id`.
   - Result: multiple observations of the same target can collide, overwrite, or disappear.

3. Pollinet sync is registered in more than one place.
   - `src/hooks/useAppState.ts` and `src/app/missions/page.tsx` both initialize queue draining.
   - Result: queued observations can be processed twice or race each other when the app comes back online.

4. The app still has a lot of hardcoded English and stale wallet copy.
   - Missions, club, proof, sky details, error states, CTA text, and modal strings are not consistently translated.
   - Some copy still references Phantom or local email-wallet behavior that no longer matches Privy.

5. Locale handling is inconsistent.
   - `src/components/nav/LanguageToggle.tsx` forces a full reload.
   - `src/app/chat/page.tsx` uses `navigator.language` instead of the chosen app locale.
   - Several components hardcode `en-US` date/time formatting.

6. Marketplace media assets are missing from `public`.
   - Product records point to `/images/products/...`, but those files are not present.
   - The cards fall back to icons, so the page does not fully match the intended product experience.

### Medium-priority issues

1. Several “on-chain” flows are still simulated.
   - Membership and telescope steps are local-only.
   - Observation proofs can still present themselves as more real than they are.
   - This is okay for demo mode, but the UI should be more honest and internally consistent.

2. There are multiple `alert()` and `window.location.reload()` fallbacks.
   - They work, but they feel rough compared to the rest of the app.

3. Shared components duplicate logic that should be centralized.
   - Wallet detection, locale handling, and response parsing are repeated in multiple places.

## Execution Order

### Phase A — Stability First

Goal: fix behavior bugs without changing design.

Files likely involved:
- `src/components/shared/AstroChat.tsx`
- `src/app/api/chat/route.ts`
- `src/app/chat/page.tsx`
- `src/hooks/useAppState.ts`
- `src/lib/pollinet.ts`
- `src/app/missions/page.tsx`
- `src/lib/types.ts`

Expected outcomes:
- One shared chat client behavior for both full-page chat and floating chat.
- Unique observation records per submission.
- Only one queue-drain owner for offline sync.
- No silent overwrites for repeated mission completions.

Prompt:

```md
Read CODEX_PROMPTS.md and CLAUDE.md first.

Implement Phase A only.

Goals:
1. Fix the mismatch between `src/components/shared/AstroChat.tsx` and `src/app/api/chat/route.ts` so both the floating chat and full-page chat work with the same streaming contract.
2. Refactor mission/proof persistence so each observation has its own unique submission id, instead of using the mission id as the storage key.
3. Consolidate Pollinet queue draining so it is owned in one place only. Avoid duplicate processing when the app comes back online.
4. Preserve current design and layout exactly.

Rules:
- Minimal diffs only.
- Do not redesign the chat UI.
- Do not remove offline support.
- Keep the current app behavior wherever it is not broken.

After changes:
- Run `npm run build`
- Summarize exactly what was fixed and any remaining risk
```

### Phase B — i18n and Copy Integrity

Goal: make the shipped app language-consistent without changing visuals.

Files likely involved:
- `src/messages/en.json`
- `src/messages/ka.json`
- `src/app/missions/page.tsx`
- `src/app/club/page.tsx`
- `src/app/proof/page.tsx`
- `src/components/sky/*`
- `src/components/shared/ErrorBoundary.tsx`
- `src/components/shared/AstroChat.tsx`
- `src/components/nav/LanguageToggle.tsx`

Expected outcomes:
- No important user-facing strings hardcoded in English.
- Georgian mode feels intentional instead of partial.
- App-selected locale drives chat responses and date/time formatting.

Prompt:

```md
Read CODEX_PROMPTS.md and CLAUDE.md first.

Implement Phase B only.

Goals:
1. Replace hardcoded user-facing strings in the club, missions, proof, shared error, floating chat, and sky detail flows with translation keys.
2. Use the actual app locale everywhere instead of `navigator.language` or hardcoded `en-US` formatting.
3. Preserve layout and styling exactly.
4. Keep translations concise and natural in both English and Georgian.

Rules:
- No redesign.
- No route restructuring.
- Keep existing spacing, colors, and hierarchy.

After changes:
- Run `npm run build`
- List any strings that were intentionally left hardcoded and why
```

### Phase C — Product Truthfulness and Data Cleanup

Goal: improve trust and consistency without adding risky new infrastructure.

Files likely involved:
- `src/app/profile/page.tsx`
- `src/app/proof/page.tsx`
- `src/components/club/MembershipStep.tsx`
- `src/components/club/TelescopeStep.tsx`
- `src/components/marketplace/ProductCard.tsx`
- `src/components/marketplace/ProductDetail.tsx`
- `src/lib/products.ts`

Expected outcomes:
- No outdated Phantom/email-wallet messaging.
- Clear distinction between simulated proof and confirmed on-chain proof.
- Marketplace looks intentional even if product photos are still unavailable.

Prompt:

```md
Read CODEX_PROMPTS.md and CLAUDE.md first.

Implement Phase C only.

Goals:
1. Remove stale wallet copy that mentions Phantom or old email-wallet assumptions where Privy is now the real auth path.
2. Make proof-related messaging honest when a result is simulated or local-only.
3. Improve marketplace fallback behavior for missing product images without changing the design system.
4. Replace raw `alert()` flows with lightweight in-app UI feedback where possible.

Rules:
- Do not add checkout infrastructure.
- Do not change page layout.
- Keep current cards, buttons, and color palette.

After changes:
- Run `npm run build`
- Summarize trust/UX improvements
```

### Phase D — Safe Micro-Polish

Goal: add a little more life without hurting performance.

Files likely involved:
- `src/app/globals.css`
- `src/components/shared/Nav.tsx`
- `src/components/shared/BottomNav.tsx`
- `src/components/sky/*`
- `src/components/marketplace/*`

Expected outcomes:
- Slightly smoother page feel.
- No heavy animation loops beyond what already exists.
- Better perceived quality on mobile.

Prompt:

```md
Read CODEX_PROMPTS.md and CLAUDE.md first.

Implement Phase D only.

Goals:
1. Add subtle micro-animations that use only `opacity`, `transform`, and existing gradients/shadows.
2. Improve perceived responsiveness for cards, panels, and overlays.
3. Respect `prefers-reduced-motion`.
4. Do not change layout, typography choices, or overall visual style.

Rules:
- No animation libraries.
- No large background effects.
- Do not slow scrolling or input responsiveness.

After changes:
- Run `npm run build`
- Briefly note every animation added
```

### Phase E — Final QA Sweep

Goal: verify the app is consistent and demo-safe.

Prompt:

```md
Read CODEX_PROMPTS.md and CLAUDE.md first.

Perform a QA-focused review only. Do not add new features.

Check:
1. Chat page and floating ASTRA both work.
2. Repeated mission submissions do not overwrite older observations.
3. Offline queue sync does not double-process.
4. English and Georgian both render correctly on key pages.
5. Marketplace still works when product images are missing.
6. All touched flows still pass `npm run build`.

Output:
- Findings first, ordered by severity
- Then a short pass/fail summary
```

## Recommended Start

Start with Phase A. It has the highest chance of preventing embarrassing demo failures while keeping the app visually unchanged.
