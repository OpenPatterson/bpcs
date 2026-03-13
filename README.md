# Better Patterson Council Site (BPCS)

A civic-tech web application making Patterson, CA local government accessible to every resident.

Built by [Open Patterson](https://openpatterson.org), a volunteer civic-tech organization.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: PostgreSQL on [Neon](https://neon.tech) via Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: NextAuth.js v5
- **AI**: Anthropic Claude for agenda summarization, translation, and Q&A
- **Notifications**: Resend (email) + Twilio (SMS)
- **Hosting**: Railway

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

## Project Structure

```
src/
├── app/          # Next.js App Router pages and API routes
├── components/   # Reusable React components
│   └── ui/       # shadcn/ui base components
├── lib/          # Utilities, database queries, scrapers, AI
└── styles/       # Global CSS
prisma/
├── schema.prisma # Database schema
├── seed.ts       # Seed script for local dev
└── migrations/   # Prisma migrations
```

## License

MIT — see [LICENSE](LICENSE).
