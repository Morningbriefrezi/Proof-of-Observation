# Visual Audit — 2026-04-25

Read-only inventory of visual drift across Stellar's main pages. No code modified.

---

## Reference Page

**Recommended canonical reference: `src/app/sky/page.tsx`** (NOT the homepage).

The Outcome V1 prompt suggests using `src/app/page.tsx` as the canonical reference, but the homepage is a large drift point in this codebase, not the reference:

- The homepage hero (`.home-hero-wrap`) is dark, but `.home-page` itself sets `background: #FFFFFF; color: #0F172A` (white card sections) — this is the only page in the app with a white surface theme. Every other page is dark cosmic. (`stellar-tokens.css:2053-2057`)
- The homepage hero CTAs are white-button-on-dark, while every other page's primary CTA is a gradient or indigo treatment.
- The homepage h1 uses `var(--font-display)` (Public Sans) at 30px / 700 — but pages like /marketplace and /profile use `var(--font-serif)` (Source Serif 4) for h1 at 36-40px / 500. The page-level h1 voice is split between display-sans and serif.
- `CLAUDE.md` and `.impeccable.md` describe a dark, "nasa.gov-style" identity with anti-reference Polymarket. The homepage's white-strip sections read as Polymarket, the very anti-reference.

Picking the homepage as reference would propagate Polymarket-light into every other page. The /sky page best embodies the design contract: dark, serif verdict, mono kicker, no glass-on-glass, no gradients.

### Key reference patterns (from /sky)

- **Page wrapper:** `.sky-page` — dark, full-bleed, dark starfield background inherits from layout.
- **Hero:** `.sky-hero` — full-width section with verdict score block + verdict head + body, planet card grid below.
- **Section title (h2):** `.sky-section-title` paired with `.sky-section-meta` (right-aligned mono caption like "Open-Meteo · updated hourly"). Verdict head uses serif at large size.
- **Detail cards (3-up / 4-up grid):** `.sky-detail-card` / `.sky-plan-card` — surface-on-dark, dim border, mono detail label above large value above muted sub-line.
- **Tile cards (7-night strip):** `.sky-night-tile` — square-ish, dimmed when "skip", glow when "best", click-only when actionable.
- **Section spacing:** `.sky-section` with `.sky-content` inner — consistent vertical rhythm between sections.
- **Bottom CTA bar:** `.sky-bottom-ctas` — two link buttons side-by-side.

The audit below treats `.sky-*` classes (and the broader dark cosmic system) as the canonical pattern. Drift is everything else.

---

## Token system — the foundational issue

Three CSS files define overlapping token systems and load in this order from `layout.tsx`:

1. `src/app/globals.css` — defines `--bg-*`, `--text-*`, `--accent-*`, `--stellar-*`, `--gradient-*`. Body font is `--font-display` (resolves to Public Sans via `@theme inline`). Defines `--font-serif: 'Cormorant Garamond'` in `:root`, but `@theme inline` block (line 216) re-declares it as Source Serif 4. The `:root` value is dead in practice, but readers will be confused.
2. `src/styles/design-tokens.css` — defines `--color-nebula-*`, `--color-star-*`, `--color-sky-*`, `--color-bortle-*`. Largely unreferenced or redundant with globals.css aliases.
3. `src/styles/stellar-tokens.css` — defines `--stl-*` namespace + every `.home-*`, `.sky-*`, `.mis-*`, `.mkt-*` page-scoped class. 4,758 lines. This file is doing the work of both a tokens file and an entire stylesheet.

### Token name vs. value mismatch (semantic drift)

| Token | Value | What the name implies |
|---|---|---|
| `--accent-teal` | `#818cf8` (indigo) | "teal" should be cyan/green-blue |
| `--accent-cyan` | `#818cf8` (indigo) | "cyan" should be cyan |
| `--stellar-teal` | `#818cf8` (indigo) | same issue |
| `--stl-teal` | `#38F0FF` (real cyan) | finally cyan |
| `--stl-green` | `#34d399` (mint) | the green from the Outcome V2 prompt |
| `--accent-emerald` | `#34D399` | duplicates `--stl-green` |
| `--success` | `#34D399` | duplicates `--stl-green` and `--accent-emerald` |
| `--color-aurora-green` | `#34D399` | duplicates the above three |
| `--color-sky-go` | `#34D399` | duplicates the above four |

The single mint-green color `#34D399` appears under five different token names. The single indigo `#818cf8` appears under at least four names ("teal", "cyan", "stellar-teal", "accent"). This is the "make all teals the same shade" problem from the V2 prompt — currently impossible without grep-replacing all five aliases.

### Font system contradictions

- `layout.tsx` loads Source Serif 4 + Public Sans + JetBrains Mono via `next/font` (correct).
- `globals.css :root` declares `--font-display: 'Geist'` and `--font-serif: 'Cormorant Garamond'` — the `@theme inline` block overrides, but the raw values remain present.
- `CLAUDE.md` design context says: "Do NOT use Cormorant Garamond, Inter, Fraunces, Space Grotesk, or any font on Impeccable's reflex-reject list." Cormorant is currently in the global stylesheet.
- 10 occurrences of inline `'Georgia, serif'` (a fallback that means "no serif loaded"), mostly in `profile/page.tsx`.
- 13 occurrences of inline `'monospace'` (no font-family loaded).
- 3 occurrences of inline `'"Source Serif 4", Georgia, serif'` in `marketplace/page.tsx`.
- 3 occurrences of inline `'JetBrains Mono, ui-monospace, monospace'` in `marketplace/page.tsx`.

Inline font literals defeat the purpose of next/font and bypass the token system. Should all route through `var(--font-serif)`, `var(--font-display)`, `var(--font-mono)`.

---

## Drift by Page

### / (homepage)

The homepage's `HeroSection` and `SkyOutlook` are well-built but stylistically isolated — they live in their own `.home-*` namespace and re-implement spacing, type, color from scratch.

- **Theme drift (critical):** `.home-page` sets `background: #FFFFFF; color: #0F172A` (`stellar-tokens.css:2053`) — the only page in the app with a white surface theme. Sky-outlook strip uses white cards with `#E2E5EC` borders. | Fix: switch to dark surfaces (`var(--bg-card)` / `var(--stl-bg-surface)`) or move the white-card layout to /sky's pattern.
- **Hero h1 typography:** `.home-hero-headline` is `var(--font-display)` (Public Sans) at 30px / 700. Other pages with a serif h1 (marketplace 36-40px, profile 26px) use `var(--font-serif)`. | Fix: pick one. If voice = serif verdict, use serif. If voice = sans display, change marketplace + profile to match.
- **Hero CTA primary:** `.home-hero-cta-primary` is `background: white; color: #0F172A; border-radius: 8px`. The global `.btn-primary` is gradient indigo + 12px radius. | Fix: align to `.btn-primary` or vice versa, but they cannot coexist as "primary."
- **Hero CTA radius drift:** Hero buttons are 8px. Global radii used elsewhere: 12px (`--radius-md`), 16px (`--radius-lg`), 24px (`--radius-xl`), 9999px (`--radius-full`). 8px is `--radius-sm`. | Fix: lift to `--radius-md` or `--radius-full` (pill) to match the broader app.
- **Microcopy below 12px (banned by CLAUDE.md):** `.home-hero-trust` 11px, `.home-hero-sky-header` 10px, `.home-hero-planet-data` 10px, `.home-hero-cond-label` 9px, `.home-hero-cond-value` 14px, `.home-hero-verdict` 11px. | Fix: minimum 12px per the design contract.
- **Color drift:** Hero verdict "good" color `#4ADE80` (Tailwind green-400) doesn't match any token. App success uses `#34D399` (`--success` / `--stl-green`). | Fix: route through `var(--success)`.
- **Color drift:** Hero gradient `linear-gradient(170deg, #070B18 0%, #0E1528 35%, #162040 65%, #1C2A52 100%)` uses four colors not in any token file. | Fix: define `--gradient-hero-night` once or simplify to `var(--bg-deep)`.

### /sky (recommended reference)

Most coherent page. Drift to flag:

- **Theme toggle is per-page:** `localStorage` key `stellar-sky-theme` is independent of `/markets` (`stellar-markets-theme`) and `/missions` (`stellar-missions-theme`). User toggling theme on /sky does not propagate. There is also a global `ThemeProvider` in `layout.tsx` reading `stellar_theme`. | Fix: remove the three per-page keys; use the global ThemeProvider only.
- **Inline color literal:** `#FB7185` (rose-400) hardcoded for error text at line 697. Token equivalent would be `var(--error)` (`#F87171`) — close but not identical. | Fix: use `var(--error)`.
- **Score ring color picker (line 191-196):** uses `#4ADE80`, `#FBBF24`, `#FB923C`, `#FB7185` — none of which match the four `--color-sky-*` tokens (`#34D399`, `#F59E0B`, `#EF4444`). | Fix: route through tokens.

### /missions

Uses `mis-*` namespace classes in `stellar-tokens.css`. Independent of every other page's class system.

- **Class namespace drift:** `mis-section`, `mis-section-title`, `mis-tile`, `mis-prime`, `mis-qtile` etc. None of these classes are reusable elsewhere. | Fix: rename or re-base on a shared system (e.g., `.section-title`, `.tile-card`).
- **Theme drift:** `localStorage` key `stellar-missions-theme` — third independent theme state.
- **Difficulty colors:** `.mis-diff.easy/.med/.hard/.expert` likely defined locally in `stellar-tokens.css`. Outcome V4 prompt expects `--color-accent-teal/--color-accent-gold/--color-accent-warning` semantics. | Fix: confirm difficulty colors route through `var(--success)` / `var(--warning)` / `var(--error)` (or define `--diff-easy/med/hard` if semantically distinct).
- **Hardcoded font reference:** Likely none in TSX itself, but the `.mis-*` classes may use raw values — see token consolidation work.
- **`MeteorIcon` etc imported from `MarketIcons`:** Cross-page icon dependency. Fine, but icon stroke color is set via `currentColor` in the SVG and inherits whichever class color the parent provides — so icon tint drifts with parent's text color drift.

### /markets

Uses `mkt-*` namespace classes. Most polished after /sky.

- **Theme drift:** `localStorage` key `stellar-markets-theme` — fourth independent theme state. Light is default for this page (`useState<Theme>('light')`).
- **Class namespace drift:** `mkt-shell`, `mkt-layout`, `mkt-trending-chip`, `mkt-row`, `mkt-tab` etc. Same isolation issue as `mis-*`.
- **Inline error block (line 451-460):** uses Tailwind utilities (`text-slate-400`, `text-teal-400`) instead of `mkt-*` styles. Breaks namespace consistency within the same file.
- **Yes/No pill colors:** Markets uses on-brand `--success` and `--error`. ✓
- **Sidebar:** `mkt-sidebar` cards use one card style. No nested-card drift here. ✓

### /marketplace

Hybrid: Tailwind utilities + inline styles + hardcoded color/font literals. Low coherence with the rest of the app.

- **Hardcoded local accent:** `const ACCENT = '#7C3AED'` (line 37). Different from `var(--accent)` (`#818cf8`) and from `--accent-purple` (`#a855f7`). This is a fourth purple in the app. | Fix: use `var(--accent)` or a defined token.
- **Inline font-family literal:** `'"Source Serif 4", Georgia, serif'` repeated on h1 (line 118) and h2 (line 137). | Fix: `var(--font-serif)`.
- **Inline font-family literal:** `'JetBrains Mono, ui-monospace, monospace'` for kicker (line 112) and stars number (line 163). | Fix: `var(--font-mono)`.
- **h1 size/weight:** `text-3xl sm:text-4xl` + `font-weight: 500` (serif). Profile h1 is 26px / 400 (serif). Sky verdict head is custom larger. | Fix: pick one h1 spec and unify (recommend `text-3xl md:text-4xl` serif weight 500 for content pages).
- **Tier-card border color:** uses local `ACCENT_BORDER` (`rgba(124,58,237,0.32)`) for unlocked, `rgba(255,255,255,0.06)` for locked. | Fix: route through `var(--accent-border)` and `var(--border-subtle)`.
- **Inline button styles:** Sign-in / claim buttons constructed with style={{...}} blocks. Should use a shared button class (`btn-primary` / `btn-ghost` / `btn-accent-ghost` already defined in globals.css).
- **Microcopy below 12px:** `text-[10px]`, `text-[11px]` repeated through tier rows.

### /profile

Worst inline-style offender. Almost every element is an inline `style={{...}}` block, not class-based.

- **No `.profile-*` namespace exists:** unlike /sky, /missions, /markets, this page has zero styled-class layer. All visual decisions are co-located in JSX.
- **Avatar gradient ring:** hardcoded `linear-gradient(135deg,#FFD166,#F59E0B)`, `linear-gradient(135deg,#A855F7,#6366F1)`, `linear-gradient(135deg,#818cf8,#8B5CF6)` (line 181-184). Three rank gradients defined inline; matching tokens `--gradient-rank-celestial/pathfinder/observer` exist in globals.css but are not used. | Fix: replace with `var(--gradient-rank-*)`.
- **Avatar inner background:** `background: '#0F1623'` — not in any token. | Fix: `var(--bg-deep)` or define a token.
- **Initial font:** `fontFamily: 'Georgia, serif'` (line 187) — Georgia is the fallback, not Source Serif 4. | Fix: `var(--font-serif)`.
- **Page h1 "Your Observatory" (auth-gate state):** 26px / 400 / serif (line 88-91). `.home-hero-headline` is 30px / 700 / sans. `marketplace` h1 is `text-3xl sm:text-4xl` / 500 / serif. Three independent h1 specs.
- **Stats cards:** `borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)'` inline — duplicates `.card-base` from globals.css 6 times in this file. | Fix: use `.card-base`.
- **Stat number font:** `fontFamily: 'monospace'` (line 233) — bare keyword, not the loaded JetBrains Mono. | Fix: `var(--font-mono)`.
- **Settings list rows:** mix of `var(--text-primary)`, `var(--text-muted)`, `var(--accent)` (correct token usage), but also raw `#818cf8`, `#FFD166`, `#8B5CF6` for icon tints. | Fix: tokens.
- **Lightbox:** hardcoded `rgba(7,11,20,0.92)` overlay, `rgba(122,95,255,0.25)` border (a fifth purple value). | Fix: tokens.
- **Sign-out button:** inline-style "secondary" button — should be `.btn-ghost`.

### /chat

Hybrid: classes (`card-base`, `btn-primary`, `btn-ghost`) + inline styles for messages + Tailwind for layout.

- **Message bubbles (lines 234-285):** built inline with style={{...}}. User bubble uses `var(--accent-dim)` + `var(--accent-border)` (correct), assistant uses `rgba(255,255,255,0.04)` + `var(--border-default)` (mostly correct but mixes raw rgba with token border). | Fix: pull into a `.chat-bubble.user / .chat-bubble.assistant` class pair.
- **Send button (line 414-429):** inline style with `var(--gradient-accent)` — should be reusable as a `.btn-icon-primary` class.
- **Typing indicator dots:** `background: 'rgba(255,255,255,0.3)'` for dots (line 313). The Outcome V4 prompt's "moment" expectation: teal (per their token system, real cyan / `var(--stl-teal)`) for typing dots. | Fix: change to `var(--accent)` or `var(--stl-teal)`.
- **Online indicator:** `var(--success)` ✓
- **Input border color:** `var(--accent-border)` on focus, `var(--border-default)` otherwise. ✓
- **Input bar background:** `rgba(7,11,20,0.9)` raw — close to `var(--bg-base)` but not equal. | Fix: token.
- **Microcopy below 12px:** `fontSize: 10` for "Online" indicator. Per CLAUDE.md, banned.

### /nfts

Hybrid like chat — Tailwind utilities + inline styles + hardcoded hex colors.

- **NFT card surface:** uses `card-base` + Tailwind. Mixed: some cards use `style={{ background: '#0a0e1a' }}` (line 148), others use `var(--bg-card)`. | Fix: pick one.
- **Hardcoded card background:** `#0B0E17` (line 115 of detail overlay). Not a token. The closest is `var(--bg-deep)` (`oklch(0.11 0.008 260)`) — but the inline literal won't match in light mode. | Fix: token.
- **NFT image frame:** `aspect-ratio: '4 / 3'` + `#0a0e1a` bg + `rgba(255,255,255,0.08)` border. Should be a reusable `.nft-frame` class.
- **Border radii:** `rounded-2xl` (16px) on overlay, `rounded-xl` (12px) on smaller cards, raw `borderRadius: 16/18/20` inline. | Fix: stick to `--radius-lg` (16px) for cards.
- **Buttons:** mix of Tailwind classes + inline + global `.btn-*`. | Fix: lean on `.btn-primary` / `.btn-ghost`.

---

## Token Issues

### Three competing token systems

- `globals.css :root` — `--bg-*`, `--text-*`, `--accent-*`, `--stellar-*`, `--gradient-*` (legacy + current).
- `design-tokens.css :root` — `--color-nebula-*`, `--color-star-*`, `--color-sky-*`, `--color-bortle-1..7`. Largely unreferenced; appears to be dead inventory or aspirational.
- `stellar-tokens.css :root` — `--stl-*`. Plus 4,500+ lines of page-scoped classes (`home-*`, `sky-*`, `mis-*`, `mkt-*`).

Three sources of truth for the same colors. Pick one.

### Duplicate values across token names

| Color value | Aliases (count) |
|---|---|
| `#34D399` | `--stl-green`, `--success`, `--accent-emerald`, `--color-aurora-green`, `--color-sky-go` |
| `#818cf8` | `--accent`, `--accent-cyan`, `--accent-teal`, `--stellar-teal`, `--color-nebula-teal`, `--color-oracle-blue` |
| `#FFD166` | `--stars`, `--accent-gold`, `--stellar-brass`, `--stl-gold`, `--color-star-gold` |
| `#F59E0B` | `--accent-amber`, `--color-solar-amber`, `--color-sky-maybe` |
| `#EF4444` / `#F87171` | `--error`, `--accent-red`, `--color-mars-red`, `--color-sky-skip` (mixed two values) |

### Hardcoded values that should be tokens

- 432 occurrences of hardcoded hex colors across 91 .tsx files in `src/app` and `src/components` (matched against `#34d399`, `#FFD166`, `#38F0FF`, `#818cf8`, `#7C3AED`, `#0a0a0a`, `#0B0E17`, `#070B14`).
- 341 occurrences of raw `rgba(255, 255, 255, 0.0X)` for backgrounds and borders. Most should be `var(--color-bg-card)` / `var(--color-border-subtle)`.
- 10 inline `Georgia, serif` font literals; 13 inline `monospace` literals; 3 inline `'"Source Serif 4", Georgia, serif'`; 3 inline `'JetBrains Mono, ui-monospace, monospace'`.

### Banned patterns from CLAUDE.md found in current code

- **Cormorant Garamond:** declared in `globals.css :root` as `--font-serif` value (line 103). Even though `@theme inline` overrides it, the raw declaration is wrong per `.impeccable.md` reflex-reject list.
- **Microcopy below 12px:** `9px` on `.home-hero-cond-label`, `10px` on multiple homepage labels, planet data, `.mis-skymap` labels, profile stat labels, chat "Online" indicator, NFT date captions.
- **Glass-card-on-glass-card nesting:** `.glass-card` defined globally (`globals.css:338`) with backdrop-blur. Not yet observed nested, but the pattern is one mistake away in /profile and /nfts.
- **Gradient text (`background-clip: text`):** not yet seen in this read; needs verification with a separate grep.
- **`border-left: N solid` accent stripe:** not seen in this sample.

### Theme state fragmentation

Five theme storage keys exist:

1. `stellar_theme` — `ThemeProvider` (global, `layout.tsx:108`) — light/dark toggle for the whole app.
2. `stellar-sky-theme` — `/sky` page only.
3. `stellar-missions-theme` — `/missions` page only.
4. `stellar-markets-theme` — `/markets` page only.
5. (No per-page key on /marketplace, /profile, /chat, /nfts — they follow global only.)

A user who switches theme on /markets does not affect /sky, and vice versa. The bottom-nav theme button (if it exists) likely toggles `stellar_theme` but cannot reach into the page-local keys. | Fix: delete the three page-local keys, route everything through `ThemeProvider`.

---

## Summary

- **Total inconsistencies cataloged:** 60+ specific drift items across 9 pages and 3 token files.
- **Severity breakdown:**
  - **Critical (visible to users):** ~25 — homepage white-theme island, h1 spec disagreement across pages, multiple primary-button styles, fragmented theme toggle, banned microcopy sizes, duplicate token names that block "change one color" workflows.
  - **Minor (developer-only):** ~35 — namespace fragmentation, dead token files, raw rgba/hex usage, inline font literals.

### Top 3 things to fix first (V2 should target these, in order)

1. **Resolve the homepage theme drift.** Either (a) change `.home-page` to dark surfaces matching the rest of the app, or (b) commit fully to a hybrid where the hero is dark and the home-content sections genuinely belong as a light surface variant — but only after confirming with `.impeccable.md` design contract that this is intended. As written, the white sections look like Polymarket and contradict CLAUDE.md's anti-reference.

2. **Consolidate token files into one source of truth.** Pick one: either `--stl-*` or the `globals.css` system. Delete the loser. Within the survivor, eliminate duplicate aliases (one canonical name per color value). This is the prerequisite for V2 — without it, V2 cannot finish.

3. **Unify primary button + h1 spec across pages.** Right now there are at least three primary-button visual treatments (homepage white pill, global indigo gradient, marketplace inline purple) and three h1 specs (Public Sans 30/700, Source Serif 36-40/500, Source Serif 26/400). The user's eye reads these as "different products." Choose one of each and remove the others. This is V3 work but the decision should be made before V2 token consolidation.

### Things V2-V4 should NOT touch

- The on-chain code paths in `/markets/page.tsx` (Privy adapter, `useReadOnlyProgram`, market sync logic) — visual polish only, no behavior changes.
- The `getCategoryIcon` SVG icon set — already consistent.
- The `ThemeProvider` flash-prevention script in `layout.tsx:108` — works correctly.
- The `next/font` loading in `layout.tsx:9-34` — already correct; the drift is elsewhere referencing it.

### Acceptance gate before starting V2

V2 token consolidation must include: (a) a decision on which of the three token files survives, (b) a decision on whether the homepage joins the dark theme or stays a hybrid, (c) a written list of which token names are authoritative for the duplicates above. Without those three decisions made first, V2 will recreate the fragmentation it set out to fix.
