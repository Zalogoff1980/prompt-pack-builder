# CLAUDE.md

Guidance for Claude Code (or any agent) working on this repo.

## What this is

Prompt Pack Builder: a Next.js App Router MVP where a user creates a
`PromptPack`, generates structured `Prompt`s into it, edits them, packages
the pack as a `ProductPackage`, and exports it. See `README.md` for the
full feature list and architecture diagram before making changes.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

There is no test suite yet — if you add non-trivial logic (especially in
`lib/`), prefer small pure functions that are easy to unit test later,
and consider adding one.

## Ground rules

- **Keep the MVP boundaries.** Don't add auth, payments, a marketplace, a
  chat UI, or real-time collaboration unless explicitly asked — these are
  intentionally deferred (see README "What's next").
- **Don't rename the product's vocabulary.** The UI always says *Prompt*,
  *Prompt Pack*, *Prompt Editor*, *Product Package*, *Export* — never
  *chat*, *message*, or *response*. This is a deliberate product decision,
  not an oversight.
- **Provider abstraction stays intact.** All generation goes through the
  `AIProvider` interface (`lib/ai/provider.ts`). Never call an external
  AI API directly from a page/component, and never put an API key in
  client code — only `app/api/generate/route.ts` (server-side) reads
  `process.env.OPENAI_API_KEY`.
- **Demo Mode must keep working with zero config.** Any change to
  generation must leave the no-API-key path fully functional, and the UI
  must keep showing the Demo Mode badge whenever demo-generated content
  is on screen. Never let the UI imply a real model was called when it
  wasn't.
- **`lib/store.ts` is the only place that touches persistence.** If you
  migrate storage (e.g. to Supabase), change the implementations there
  and keep the exported function signatures stable so pages don't need
  to change. See README "Moving to Supabase/Postgres".
- **Keep exports in sync.** If you add a field to `Prompt` or
  `PromptPack`, update all four exporters in `lib/export.ts` (JSON,
  Markdown, TXT, PDF) — JSON should always carry the full structure.
- **Design system.** Dark graphite background, white/near-white type,
  restrained cyan (`#4fd8e0`) and violet (`#9b87f5`) accents, generous
  spacing, subtle glass/blur only where it clarifies hierarchy (see
  `.glass` in `app/globals.css`). Don't introduce new colors or a second
  accent pair without a reason.
- **No placeholder content in core flows.** No `TODO`, no lorem ipsum, no
  dead buttons in Create Pack, Pack Editor, Product Packaging, Export, or
  My Packs. If something isn't implemented yet, it shouldn't be a button
  that does nothing — either wire it up or leave it out.

## Where things live

See the "Architecture" section in `README.md` for the file tree and data
model — read it before adding new files so new code lands in the right
place (`lib/ai/` for generation, `lib/` root for cross-cutting utilities,
`components/` for shared UI, `app/` for routes).

## After making changes

1. `npm run lint` and fix anything it flags.
2. `npm run build` and confirm it completes without errors.
3. Manually walk the core loop: Create Pack → Generate → Edit a prompt →
   Regenerate a prompt → Add a prompt → Delete a prompt → Save → Create
   Product → Export (all four formats) → My Packs (duplicate, delete).
4. Update `README.md` if you changed setup, environment variables, or
   the architecture.
