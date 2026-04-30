# Fares Ahmed CV / Portfolio (TanStack Start)

## Overview
A personal portfolio / CV web application built with TanStack Start (React + SSR), TypeScript, Tailwind CSS v4, shadcn/ui (new-york), Framer Motion, and a PostgreSQL backend. Originally scaffolded by Lovable using `@lovable.dev/vite-tanstack-config`; migrated to run on Replit.

## Tech Stack
- **Runtime**: Node.js 22
- **Framework**: TanStack Start (React 19) with TanStack Router & React Query
- **Build tool**: Vite 7
- **Styling**: Tailwind CSS v4, shadcn/ui, tw-animate-css
- **Database**: Replit-managed PostgreSQL accessed via Drizzle ORM (`drizzle-orm`, `pg`)
- **Animation**: Framer Motion, Matter.js
- **Forms / validation**: react-hook-form + zod

## Project Structure
- `src/routes/` — file-based routes (`__root.tsx`, `index.tsx`, `comments.tsx`, `explore.tsx`)
- `src/components/` — UI components (shadcn/ui in `components/ui`, app components, providers, CMS drawer)
- `src/utils/*.functions.ts` — TanStack Start server functions (`createServerFn`)
  - `comments.functions.ts` — public read/post for the guestbook
  - `site-settings.functions.ts` — public read for the CMS-edited resume JSON
  - `settings.functions.ts` — admin-protected CMS operations (bcrypt password gate)
  - `github.functions.ts` — server-side GitHub REST proxy with in-memory cache
- `shared/schema.ts` — Drizzle schema (`comments`, `site_settings`, `admin_settings`)
- `server/db.ts` — Drizzle client + `pg` connection pool
- `server/storage.ts` — `IStorage` interface + `DbStorage` implementation
- `drizzle.config.ts` — Drizzle Kit config (uses `DATABASE_URL`)
- `src/lib/`, `src/hooks/`, `src/data/`, `src/assets/` — utilities, hooks, data, static assets
- `vite.config.ts` — uses `@lovable.dev/vite-tanstack-config` (cloudflare disabled, host `0.0.0.0`, port `5000`)
- `server-prod.mjs` — production Node server entry (serves built SSR output + static assets via `srvx`)

## Replit Setup
- **Workflow**: `Start application` runs `npm run dev` and serves on port 5000 (webview).
- **Dev server**: Vite is configured to bind `0.0.0.0:5000` with `allowedHosts: true` so the Replit iframe proxy works.
- **Production**: `npm run build` produces `dist/client` (static assets) and `dist/server/server.js` (SSR fetch handler). `server-prod.mjs` wraps the handler with `srvx/node` and serves both static files and SSR.
- **Deployment**: Configured for Replit Autoscale — build `npm run build`, run `node server-prod.mjs`.

## Database
- Provisioned by Replit; `DATABASE_URL` (and `PG*` vars) are set automatically.
- Apply schema changes with `npm run db:push` (Drizzle Kit; no manual migration files).
- Tables:
  - `comments` — guestbook entries (`status` flag for moderation, default `pending`).
  - `site_settings` — singleton row holding the CMS-edited resume JSON in `data jsonb`.
  - `admin_settings` — singleton row holding bcrypt-hashed admin password + recovery code (server-only).

## Live Updates
The original Supabase project used `postgres_changes` subscriptions for live comments and settings updates. After the migration those are replaced with simple polling (every 10–15s via `setInterval`), which is sufficient for this low-volume use case and avoids needing a websocket layer.

## Environment Variables / Secrets
- `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` — managed by Replit, do not edit.
- `SETTINGS_ADMIN_PASSWORD` — optional Replit Secret. On first request to any admin endpoint, the `admin_settings` row is auto-seeded from this value (bcrypt-hashed) and a recovery code is logged once to the server console.

## Migration Notes (Supabase → Replit Postgres)
- Removed `@supabase/supabase-js` and the entire `src/integrations/supabase/` directory.
- Removed `supabase/migrations/` (schema is now in `shared/schema.ts`).
- Removed Cloudflare-specific bits (`@cloudflare/vite-plugin`, `wrangler.jsonc`, `vercel.json`).
- Browser code no longer talks directly to the database; all reads/writes go through TanStack Start server functions.

## Performance — Lazy Loading & Code Splitting
TanStack Router already splits each route into its own chunk. On top of that, heavy components are split into independent chunks and only downloaded when needed:
- `src/components/LazyOnVisible.tsx` — generic helper that pairs `React.lazy` with an `IntersectionObserver` sentinel (default `rootMargin: 300px`) so a component is only mounted when the user scrolls near it. Wraps in `<Suspense fallback={null}>` and reserves height via a placeholder to prevent layout shift.
- **Home (`src/routes/index.tsx`)**: `Hero`, `Marquee`, `AboutSection` stay in the route bundle (above the fold). `LanguagesSection`, `SkillsSection`, `ExperienceSection`, `AchievementsSection`, `ContactSection` are all `React.lazy` + `LazyOnVisible`.
- **Explore (`src/routes/explore.tsx`)**: `ProjectsSection`, `TechMarquee`, `GithubActivitySection` (recharts ~575 lines) are lazy + `LazyOnVisible`.
- **Component-level**: `PhysicsPills` (matter-js, ~1148 lines) inside `SkillsSection`, `PageEndCircle` (matter-js) inside `ContactSection`, and `SettingsDrawer` (admin CMS, only opens on user action) inside `Footer` are all `React.lazy`-loaded with appropriate gating.
- **Image hints**: Hero portrait (`Hero.tsx`) and explore-splash (`explore.tsx`) use `loading="eager"` + `fetchPriority="high"` + `decoding="async"` since they're LCP candidates. `GithubActivitySection` avatar already uses `loading="lazy"`.

## SEO & Metadata
- `src/lib/seo.ts` — central helpers `buildMeta()` and `buildPersonJsonLd()`. Every route head should call `buildMeta({ title, description, path })` instead of hand-rolling tags so OG / Twitter / canonical stay consistent.
- `__root.tsx` injects a `Person` JSON-LD `<script>` (built from `resume.json`) plus `theme-color`, `color-scheme`, manifest link, and the global title/description defaults.
- `public/robots.txt`, `public/sitemap.xml`, `public/site.webmanifest` are static files served from the Vite/Nitro public directory. Update the sitemap when new routes are added.

## Accessibility
- `__root.tsx` renders a `.skip-link` "Skip to content" anchor as the first body element; targets `<main id="main-content">` which wraps `<AnimatedOutlet />`. CSS for the link lives at the bottom of `src/styles.css`.

## Print / CV mode
- Bottom of `src/styles.css` has an `@media print` block that strips chrome (nav, footer, decorations), kills animations/transforms, forces a white palette, prints link URLs after each anchor, and tightens typography. Hitting Ctrl/Cmd+P produces a recruiter-friendly single-column CV.

## Command Palette
- `src/components/CommandPalette.tsx` — global ⌘K / Ctrl+K overlay. Provides bilingual search across pages, home-section anchors, theme toggle, language toggle, and external links (GitHub, LinkedIn). Mounted once in `RootComponent`.

## Custom 404
- `src/components/NotFoundPage.tsx` — branded 404 with gradient blobs, Framer Motion entrance, three navigation CTAs and a Ctrl+K hint. Wired through `notFoundComponent: NotFoundPage` in `__root.tsx`.
