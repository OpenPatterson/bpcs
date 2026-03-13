# BPCS Rewrite Progress

## Completed
- [x] Clean repo and scaffold fresh Next.js 14+ (App Router, TS, Tailwind, shadcn/ui)
- [x] Prisma schema (Meeting, Agenda, AISummary, Translation, User, Auth, NotificationPreference, NotificationLog)
- [x] Seed script with 5 fake meetings
- [x] Env validation (lazy proxy), railway.toml, health endpoint
- [x] CivicPlus scraper (lib/scrapers/civicplus.ts + API route)
- [x] IQM2 legacy scraper (lib/scrapers/iqm2.ts + API route)
- [x] Agenda scraper route (fetches HTML, converts to MD)
- [x] AI summarize route (Claude API)
- [x] HTML-to-Markdown utility
- [x] Base shadcn/ui components (Button, Badge, Card, Input)
- [x] Navbar + Footer
- [x] UI components created by agents (meeting-card, meeting-type-badge, meeting-status-badge, countdown-timer, ai-summary-card, agenda-renderer, calendar-button, search-bar) — need review

## In Progress
- [ ] Core data layer: lib/db/meetings.ts, lib/db/users.ts
- [ ] Date utilities: lib/dates.ts
- [ ] Homepage with real data (app/(public)/page.tsx)
- [ ] Meetings archive page (app/(public)/meetings/page.tsx)
- [ ] Single meeting detail page (app/(public)/meetings/[id]/page.tsx)
- [ ] Calendar .ics API route (api/calendar/[id]/route.ts)

## TODO
- [ ] NextAuth v5 setup (login, signup, magic link)
- [ ] Your Gov section (overview, council, districts map, how-it-works)
- [ ] Full-text search with pg_trgm
- [ ] AI features (translation, chat widget, "explain this item")
- [ ] Notifications (Resend email + Twilio SMS + preferences UI + cron dispatch)
- [ ] Account pages (profile, notification preferences)
- [ ] Admin dashboard (stats, scraper controls, AI management)
- [ ] About page
- [ ] Search page
- [ ] Auth pages (login, signup, verify)
- [ ] SEO (generateMetadata, sitemap.xml, robots.txt, OG tags)
- [ ] RSS feed (feed.xml)
- [ ] Print styles
- [ ] Custom error pages (not-found.tsx, error.tsx)
- [ ] Rate limiting on /api/ai/* and /api/auth/*
- [ ] Plausible analytics integration
