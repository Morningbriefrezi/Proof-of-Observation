# RAG corpus sources

The on-device astronomy corpus for Stellar Field lives in `../corpus/index.json` as a hand-curated array of chunks.

This directory (`sources/`) is reserved for the future authoring workflow when the corpus grows past what's comfortable to maintain in a single JSON file. The format will be one Markdown file per topic, with `## H2` headings splitting it into chunks. Run `npm run build:rag` to regenerate `corpus/index.json` from the markdown files (and optionally embed them via QVAC if a build-time embedder is available).

## Why this isn't wired up yet

For Day 1–2 of the hackathon plan the hand-curated JSON is the right form factor — small enough to read end to end, easy to edit precisely, no build step. The build script in `apps/field/scripts/build-rag-index.ts` exists as a forward-compatible scaffold but does not run as part of any current workflow.

## Format spec for future contributors

Each Markdown file should be named `<source>-<short-name>.md`. The leading word becomes the chunk's `source` field (one of: `messier`, `constellation`, `telescope-faq`, `astroman`, `observation-tips`).

```markdown
## M31 — Andromeda Galaxy

magnitude: 3.4
season: autumn
hemisphere: north
instrument: naked
keywords: galaxy, spiral, andromeda

M31, the Andromeda Galaxy, is the nearest large spiral galaxy to the Milky Way at 2.5 million light-years…
```

The first line after the heading can be a list of `key: value` metadata. Anything after a blank line is the chunk text.

## Until then

Edit `corpus/index.json` directly. Keep entries in roughly the same shape as existing chunks. Validate with `npx tsc --noEmit` after editing — the chunk type is enforced by `lib/rag.ts`.
