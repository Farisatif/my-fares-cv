# Fares Ahmed CV / Portfolio (TanStack Start)

## Overview
A personal portfolio / CV web application built with TanStack Start (React + SSR), TypeScript, Tailwind CSS v4, shadcn/ui (new-york), Framer Motion, and a Supabase backend. The original project was scaffolded by Lovable using `@lovable.dev/vite-tanstack-config`.

## Tech Stack
- **Runtime**: Node.js 22
- **Framework**: TanStack Start (React 19) with TanStack Router & React Query
- **Build tool**: Vite 7
- **Styling**: Tailwind CSS v4, shadcn/ui, tw-animate-css
- **Backend**: Supabase (project `zhqstdrgmtayullvuekn`)
- **Animation**: Framer Motion, Matter.js
- **Forms / validation**: react-hook-form + zod

## Project Structure
- `src/routes/` — file-based routes (`__root.tsx`, `index.tsx`, `comments.tsx`, `explore.tsx`)
- `src/components/` — UI components (shadcn/ui in `components/ui`, app components, providers)
- `src/integrations/supabase/` — Supabase client
- `src/utils/*.functions.ts` — TanStack Start server functions (`createServerFn`)
- `src/lib/`, `src/hooks/`, `src/data/`, `src/assets/` — utilities, hooks, data, static assets
- `supabase/migrations/` — SQL migrations for the Supabase project
- `vite.config.ts` — uses `@lovable.dev/vite-tanstack-config` (cloudflare disabled, host `0.0.0.0`, port `5000`)
- `server-prod.mjs` — production Node server entry (serves built SSR output + static assets via `srvx`)

## Replit Setup
- **Workflow**: `Start application` runs `npm run dev` and serves on port 5000 (webview).
- **Dev server**: Vite is configured to bind `0.0.0.0:5000` with `allowedHosts: true` so the Replit iframe proxy works.
- **Production**: `npm run build` produces `dist/client` (static assets) and `dist/server/server.js` (SSR fetch handler). `server-prod.mjs` wraps the handler with `srvx/node` and serves both static files and SSR.
- **Deployment**: Configured for Replit Autoscale — build `npm run build`, run `node server-prod.mjs`.

## Environment Variables
Stored in `.env` (already populated for the existing Supabase project):
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`

## Notes
- The original config targets Cloudflare Workers (`wrangler.jsonc`); the Replit setup disables the Cloudflare Vite plugin and serves with Node instead.
- Tailwind CSS v4 is loaded via `@tailwindcss/vite` (already wired by the Lovable preset).
