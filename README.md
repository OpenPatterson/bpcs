# Better Patterson Council Site (BPCS)

A civic-tech web application making Patterson, CA local government accessible to every resident.

Built by [Open Patterson](https://openpatterson.org), a volunteer civic-tech organization.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Database**: PostgreSQL on [Neon](https://neon.tech) via Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: NextAuth.js v5
- **AI**: Anthropic Claude for agenda summarization, translation, and Q&A
- **Notifications**: Resend (email) + Twilio (SMS)
- **Hosting**: Railway

## Architecture

BPCS is a **monolithic full-stack app**. There is no separate backend server — Next.js serves both the frontend pages and the backend API from a single process. The "backend" lives inside the same codebase, specifically in `src/app/api/` (HTTP endpoints) and `src/lib/` (business logic, database access, scrapers).

### How the frontend and backend fit together

```
Browser request
       │
       ▼
┌─────────────────────────────────────────────────┐
│  Next.js server (single process)                │
│                                                 │
│  ┌───────────────────┐  ┌────────────────────┐  │
│  │  Pages (frontend)  │  │  API routes        │  │
│  │  src/app/(public)/ │  │  src/app/api/      │  │
│  │  src/app/(auth)/   │  │    /ai/chat        │  │
│  │  src/app/(account)/│  │    /ai/translate    │  │
│  │  src/app/(admin)/  │  │    /scrape/*        │  │
│  │                    │  │    /search          │  │
│  │  Server Components │  │    /notifications/* │  │
│  │  can call lib/db   │  │    /calendar/[id]   │  │
│  │  directly — no     │  │    /auth/*          │  │
│  │  HTTP round-trip   │  │    /health          │  │
│  └────────┬───────────┘  └─────────┬──────────┘  │
│           │                        │             │
│           ▼                        ▼             │
│  ┌──────────────────────────────────────────┐    │
│  │  src/lib/  (shared backend logic)        │    │
│  │    db/prisma.ts   → Prisma client        │    │
│  │    db/meetings.ts → meeting queries      │    │
│  │    db/users.ts    → user queries         │    │
│  │    scrapers/      → CivicPlus & IQM2     │    │
│  │    auth.ts        → NextAuth config      │    │
│  │    env.ts         → env var validation    │    │
│  └──────────────────┬───────────────────────┘    │
│                     │                            │
└─────────────────────┼────────────────────────────┘
                      ▼
              ┌──────────────┐
              │  PostgreSQL   │
              │  (Neon)       │
              └──────────────┘
```

**Key concept: Server Components vs API routes.** Pages like the meetings archive are React Server Components — they run on the server and call database functions in `src/lib/db/` directly during rendering. No fetch to an API endpoint is needed. The API routes in `src/app/api/` exist for things the _client_ (browser) needs to call: the AI chat stream, search-as-you-type, scraper triggers, notification preferences, etc.

### Data flow examples

**Viewing a meeting page** (server-side, no API call):
1. Browser requests `/meetings/abc123`
2. Next.js runs the Server Component at `src/app/(public)/meetings/[id]/page.tsx`
3. That component calls `getMeetingById("abc123")` from `src/lib/db/meetings.ts`
4. Prisma queries PostgreSQL, returns the meeting
5. The component renders HTML and sends it to the browser

**AI chat** (client-side, uses API route):
1. User types a question in the chat widget (Client Component)
2. Browser POSTs to `/api/ai/chat` with the message history
3. The API route at `src/app/api/ai/chat/route.ts` checks rate limits, calls the Anthropic Claude API with streaming
4. Streams Server-Sent Events (SSE) back to the browser
5. The chat widget renders tokens as they arrive

**Scraping meeting data** (API route, triggered by admin or cron):
1. POST to `/api/scrape/civicplus` with a Bearer token
2. The route calls scraper logic in `src/lib/scrapers/civicplus.ts`
3. Scraper fetches pages from pattersonca.gov, parses HTML with Cheerio
4. Upserts meetings into PostgreSQL via Prisma

### Project structure

```
src/
├── app/                        # Next.js App Router
│   ├── (public)/               # Public pages (no auth required)
│   │   ├── page.tsx            #   Homepage
│   │   ├── meetings/           #   Meetings archive + detail
│   │   ├── search/             #   Full-text search
│   │   ├── about/              #   About page
│   │   └── your-gov/           #   Government info, council, districts, how-it-works
│   ├── (auth)/                 # Auth pages (login, signup)
│   ├── (account)/              # Logged-in user pages (profile, notification prefs)
│   ├── (admin)/                # Admin dashboard (stats, scraper controls, AI mgmt)
│   ├── api/                    # ← THIS IS THE BACKEND API
│   │   ├── ai/                 #   Chat (streaming) + translation endpoints
│   │   ├── auth/               #   NextAuth handlers + signup
│   │   ├── scrape/             #   CivicPlus, IQM2, agenda fetch, AI summarize
│   │   ├── calendar/[id]/      #   .ics file download
│   │   ├── search/             #   Search API for client-side use
│   │   ├── notifications/      #   Preference CRUD + send dispatch (cron)
│   │   └── health/             #   Health check for Railway
│   ├── feed.xml/               # RSS feed (route handler)
│   ├── sitemap.ts              # Dynamic sitemap
│   ├── robots.ts               # robots.txt
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── globals.css             # Global styles + CSS variables
│   ├── not-found.tsx           # 404 page
│   └── error.tsx               # Error boundary
│
├── components/                 # React components
│   ├── ui/                     #   shadcn/ui primitives (Button, Badge, Card, Input)
│   ├── navbar.tsx              #   Site header with mobile menu
│   ├── footer.tsx              #   Site footer
│   ├── meeting-card.tsx        #   Meeting list item card
│   ├── meeting-type-badge.tsx  #   Colored badge per meeting type
│   ├── meeting-status-badge.tsx#   Status badge (upcoming, final, etc.)
│   ├── countdown-timer.tsx     #   Live countdown to next meeting
│   ├── ai-summary-card.tsx     #   AI-generated summary display
│   ├── agenda-renderer.tsx     #   Markdown→HTML agenda rendering
│   ├── calendar-button.tsx     #   "Add to calendar" .ics download
│   ├── search-bar.tsx          #   Search input with Cmd+K shortcut
│   ├── district-map.tsx        #   Leaflet map of council districts
│   └── district-map-loader.tsx #   Client wrapper for dynamic import (no SSR)
│
├── lib/                        # ← SHARED BACKEND LOGIC
│   ├── db/
│   │   ├── prisma.ts           #   Prisma client singleton
│   │   ├── meetings.ts         #   All meeting queries (list, filter, search, detail)
│   │   └── users.ts            #   User + notification preference queries
│   ├── scrapers/
│   │   ├── civicplus.ts        #   Scrapes pattersonca.gov/AgendaCenter (Oct 2025+)
│   │   ├── iqm2.ts             #   Scrapes pattersonca.iqm2.com (legacy, pre-Oct 2025)
│   │   └── html-to-markdown.ts #   Converts agenda HTML to Markdown
│   ├── auth.ts                 #   NextAuth v5 config (credentials, JWT, PrismaAdapter)
│   ├── env.ts                  #   Zod env validation (lazy proxy — validates at runtime, not build)
│   ├── constants.ts            #   Meeting types, badge colors, supported languages
│   ├── dates.ts                #   Pacific timezone date formatting utilities
│   ├── rate-limit.ts           #   In-memory sliding window rate limiter
│   └── utils.ts                #   cn() helper (clsx + tailwind-merge)
│
├── middleware.ts                # Auth gate for /account/* and /admin/*
└── types/
    └── next-auth.d.ts          # Type augmentation for session (adds id, role)

prisma/
├── schema.prisma               # Database models (12 tables)
├── seed.ts                     # Dev seed data
└── migrations/                 # SQL migrations
```

### Route groups explained

The parenthesized folders `(public)`, `(auth)`, `(account)`, `(admin)` are Next.js **route groups**. They don't affect URLs — they just let each group have its own layout. For example, `(public)` pages get the navbar + footer, while `(auth)` pages (login/signup) get a minimal centered layout.

### Auth and middleware

`src/middleware.ts` runs on every request matching `/account/*` or `/admin/*`. It uses NextAuth to check the session — unauthenticated users get redirected to `/login`. Admin routes additionally check for `role === "admin"` in the JWT.

### Environment variables

All env vars are validated by Zod in `src/lib/env.ts`. It uses a **lazy proxy** pattern: validation doesn't run at import time (which would crash the build), it runs on first property access at runtime. See `.env.example` for the full list of required variables.

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your .env values

# Run database migrations
npx prisma migrate dev

# Seed the database (optional, for local dev)
npm run db:seed

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

MIT — see [LICENSE](LICENSE).
