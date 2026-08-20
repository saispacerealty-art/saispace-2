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
