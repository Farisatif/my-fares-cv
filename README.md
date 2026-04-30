# Fares Ahmed — Personal Portfolio

A bilingual (English / Arabic, RTL-aware) personal portfolio and CV built with **TanStack Start**, **React 19**, **Vite 7**, **Tailwind CSS v4**, **Drizzle ORM** and **PostgreSQL**. Includes an interactive physics-based skill cloud (Matter.js), animated section transitions (Framer Motion), a built-in CMS for editing every section, a public guestbook, and a live GitHub activity feed.

## Tech stack

| Area | Library |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, SSR) |
| Routing / data | TanStack Router, TanStack React Query |
| Build | Vite 7 |
| Styling | Tailwind CSS v4, `tw-animate-css` |
| Animation | Framer Motion, Matter.js |
| Database | PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/) (`pg` driver) |
| Validation | Zod |
| Auth (CMS) | bcryptjs-hashed admin password |

## Project layout

```
src/
  routes/                   # File-based routes (TanStack Router)
    __root.tsx              # Global shell: nav, footer, route transitions
    index.tsx               # Home page (Hero, About, Skills, etc.)
    explore.tsx             # Projects + GitHub activity
    comments.tsx            # Public guestbook
  components/               # App components
    cms/                    # Admin-only CMS drawer + per-section forms
    ui/                     # shadcn-style primitives (only the ones used)
  utils/*.functions.ts      # TanStack server functions
  lib/                      # Small client utilities
shared/
  schema.ts                 # Drizzle schema (comments, site_settings, admin_settings)
server/
  db.ts                     # Drizzle client + pg pool
  storage.ts                # IStorage interface + DbStorage implementation
drizzle.config.ts           # Drizzle Kit config (reads DATABASE_URL)
server-prod.mjs             # Production Node entry
```

## Prerequisites

- **Node.js 22+**
- **PostgreSQL 14+** (a connection string in `DATABASE_URL`)

## Getting started

```bash
# 1. Clone
git clone https://github.com/Farisatif/my-fares-cv.git
cd my-fares-cv

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
#   then edit .env and set DATABASE_URL + SETTINGS_ADMIN_PASSWORD

# 4. Push the schema to your database
npm run db:push

# 5. Run the dev server (http://localhost:5000)
npm run dev
```

## Environment variables

See [`.env.example`](./.env.example) for the full list. Required:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by the app and by Drizzle Kit. |
| `SETTINGS_ADMIN_PASSWORD` | Initial password used to seed the CMS admin gate on first run. After the first request the value is stored hashed in the database — change it before deploying. |
| `PORT` | (optional) Port the production server binds to. Default `5000`. |
| `HOST` | (optional) Host the production server binds to. Default `0.0.0.0`. |

> Do **not** commit your `.env` file. It is already excluded by `.gitignore`.

## NPM scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Type-check and build the production bundle. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint across the project. |
| `npm run format` | Run Prettier with `--write`. |
| `npm run db:push` | Apply the Drizzle schema to the configured database. |

## CMS (settings drawer)

The footer contains a discreet "Site settings" trigger. The first time you open it, enter the value of `SETTINGS_ADMIN_PASSWORD` from your environment — it is then hashed and stored in the `admin_settings` table. From the drawer you can edit the personal section, hero, skills, languages, experience, education, achievements, projects, navigation, and tech marquee, plus moderate the guestbook.

## Deployment

The project ships with `server-prod.mjs`, a small `srvx`-based Node server that serves the built SSR output and static assets. Any Node 22+ host works (Replit, Render, Fly.io, a VPS, etc.).

```bash
npm run build
node server-prod.mjs
```

Make sure `DATABASE_URL` and `SETTINGS_ADMIN_PASSWORD` are set in the deployment environment.

## License

This is a personal portfolio. Code is provided as-is — see the repository owner for any reuse questions.
