# Sai Space Realty

Find Your Space. Build Your Future.

A real estate website and admin panel built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Public site** — home, property listings with search/filters, property detail pages, developer projects, blog, services, about, and contact.
- **Admin panel** (`/admin`) — cookie-session protected dashboard for managing properties, projects, blog posts, incoming messages, and site content (hero copy, contact details, socials).
- **Data layer** — JSON-file backed by default (`src/lib/data/`), isolated behind a `DataRepository` interface (`src/lib/repository.ts`) so it can be swapped for a real database (e.g. Supabase) without touching any page or API route.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

Admin credentials are set via environment variables — see `.env.example`. Copy it to `.env.local` and set your own values before deploying.

## Tech Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion

## Changelog

### Admin panel fixes
- **Fixed delete buttons not working** (Properties, Projects, Blog, Messages, Content lists). The confirm popup relied on the browser's native `window.confirm()`, which some browser environments (including in-app preview panes) silently suppress — clicking "OK" did nothing, with no error shown. Replaced it with a custom in-app confirmation dialog (`src/components/admin/ConfirmDialog.tsx`) that works consistently everywhere.
- **Added real route protection for `/admin`.** There was no server-side auth guard — admin pages rendered even without a valid session, while write actions (save/delete) silently failed with 401 once the session expired, with no explanation. Added `src/proxy.ts` (Next.js 16's `middleware.ts` equivalent) to redirect unauthenticated visitors straight to `/admin/login`.
- **Surfaced errors instead of failing silently.** Every Save/Add/Delete action across the admin panel now shows a red error banner naming the actual problem (e.g. "Unauthorized") if the request fails, instead of doing nothing.

### New page
- **Added a Careers page** (`/careers`) — open roles, "why join us" perks, and an apply-by-email CTA. Linked in the header nav and footer, and manageable from **Admin → Navigation** like any other nav link.

### Planned
- **Supabase integration** — migrating the JSON-file data layer (`src/lib/data/`) to Supabase, behind the existing `DataRepository` interface so no page or API route needs to change.
