# Prompt Pack Builder

Turn ideas into ready-to-use AI prompt packs. Create a set of structured
prompts for image, video, music or text generation, edit and organize
them, package them as a sellable product, and export in the format you
need.

**Core workflow:** Create Pack → Generate → Review → Edit → Package → Export

## Features

- **Create Pack wizard** — pick content type, AI model, category, style
  and prompt count, plus optional free-text instructions.
- **Structured prompts** — every prompt has a title, prompt text with
  reusable `[VARIABLE]` placeholders, a negative prompt, recommended
  settings, and tags.
- **Pack Editor** — compact prompt cards with copy, edit, regenerate
  (single prompt, not the whole pack) and delete. Add prompts manually.
- **Product Packaging** — turn a pack into a sellable product listing
  with AI-suggested (template-based) name, subtitle, description and
  sales copy, plus a live preview.
- **Export** — Markdown, TXT, JSON (full structure) and PDF.
- **Demo Mode** — the entire workflow works with zero configuration.
  When no AI API key is set, generation uses a built-in template engine
  instead of calling an external model. This is shown explicitly in the
  UI; nothing pretends to call a real API when it isn't.
- **My Packs** — open, duplicate, export or delete any pack.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Local persistence (browser `localStorage`) for the MVP — see
  [Moving to Supabase/Postgres](#moving-to-supabasepostgres) below
- Server-side `/api/generate` route with a provider abstraction
  (`lib/ai/provider.ts`)
- `jspdf` for client-side PDF export

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The app runs fully in Demo Mode with no
further setup.

## Environment variables

See `.env.example`.

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | If set, `/api/generate` calls the real OpenAI API. If unset, the app runs in Demo Mode using the built-in template engine. |
| `OPENAI_MODEL` | No | Defaults to `gpt-4o-mini`. |

Never commit a real key. `.env.local` is git-ignored.

## Demo mode

Demo Mode is not a special flag you have to enable — it's simply what
happens when `OPENAI_API_KEY` is absent, or if a configured provider
fails at runtime (the API route falls back to demo generation rather
than breaking the workflow). The UI always shows a **Demo Mode** badge
when the active pack was generated this way, so it's never ambiguous
whether a real model was called.

The demo template engine (`lib/ai/templates.ts`) produces varied,
structured prompts per content type and cycles through a bank of scene
concepts, so packs don't feel repetitive even at 50 prompts.

## AI provider setup

Generation is abstracted behind the `AIProvider` interface
(`lib/ai/provider.ts`):

```ts
export interface AIProvider {
  readonly id: string;
  readonly isConfigured: boolean;
  generatePacks(request: GenerateRequest): Promise<Prompt[]>;
}
```

`lib/ai/index.ts` is the factory: it returns `OpenAIProvider` when
`OPENAI_API_KEY` is set, otherwise `DemoProvider`. See
[How to add another AI provider](#how-to-add-another-ai-provider).

## Development

```bash
npm run dev      # local dev server
npm run lint     # eslint
```

## Build

```bash
npm run build
npm run start
```

> This sandbox has no network access, so `npm install` / `npm run
> build` could not be executed here to verify a clean install. Please
> run the install and build locally before deploying.

## Deployment

Any Next.js-compatible host (Vercel, etc.) works. Set `OPENAI_API_KEY`
as a server environment variable if you want real generation — it is
never sent to the browser, since all calls happen inside
`app/api/generate/route.ts`.

## Architecture

```
app/
  page.tsx                 Dashboard
  create/page.tsx           Create Pack wizard
  packs/page.tsx             My Packs
  packs/[id]/page.tsx         Pack Editor
  packs/[id]/package/page.tsx  Product Packaging
  settings/page.tsx          Settings
  api/generate/route.ts      Server-side generation endpoint
components/                 UI components (cards, modal, export menu, toasts)
lib/
  types.ts                  Domain model (PromptPack, Prompt, ProductPackage)
  store.ts                  localStorage persistence
  export.ts                 JSON / Markdown / TXT / PDF export
  ai/
    provider.ts              AIProvider interface
    demo-provider.ts          Template-based fallback provider
    openai-provider.ts        Real OpenAI provider
    index.ts                  Provider factory
    templates.ts               Scene banks + demo seed pack + product copy
```

### Data model

```ts
PromptPack { id, name, description, contentType, model, category, style,
             prompts[], metadata, status, createdAt, updatedAt }
Prompt     { id, title, prompt, negativePrompt, variables[],
             recommendedSettings, model, category, tags[], createdAt }
ProductPackage { id, packId, productName, subtitle, description, author,
                 salesCopy, whatsInside[], tags[], createdAt }
```

### Moving to Supabase/Postgres

`lib/store.ts` is the only place that talks to `localStorage`. To move
to a real backend:

1. Create tables matching `PromptPack` / `Prompt` / `ProductPackage` in
   Supabase/Postgres (prompts can be a JSONB column on the pack row, or
   a normalized child table).
2. Replace the body of each function in `lib/store.ts` with a Supabase
   client call, keeping the same function signatures — no page or
   component needs to change.
3. Move the functions that must run server-side (writes, in
   particular) into API routes if you want to keep the service key off
   the client.

### How to add another AI provider

1. Create `lib/ai/<name>-provider.ts` exporting a class that implements
   `AIProvider`.
2. Add its selection logic to `lib/ai/index.ts` (e.g. prefer it when a
   `CLAUDE_API_KEY` env var is present).
3. Nothing else changes — the API route, the wizard and the editor all
   depend only on the `AIProvider` interface.

## Quality checklist

- [x] Full workflow implemented end-to-end: Create → Generate → Edit →
      Add → Delete → Regenerate → Save → Package → Export
- [x] No fake buttons, no lorem ipsum, no TODOs in core flows
- [x] Demo Mode is explicit in the UI and never pretends to call a real
      API
- [x] Seeded demo pack: "Cinematic AI Product Ads" (Kling, Product
      Advertising, 20 prompts)
- [ ] `npm install` / `npm run build` — not run in this environment
      (no network access); please verify locally before deploying

## What's next after this MVP

- Real accounts + Supabase/Postgres persistence (multi-device, sharing)
- A real payment flow for selling packaged products
- Additional AI providers (Claude, Gemini, OpenRouter, local models)
- Marketplace / public pack discovery
- Team collaboration on a pack
