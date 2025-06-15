# Toot'n Totum Location Data Service

A centralized location data service built with Next.js and Cloudflare Workers.

## Project Structure

```
├── frontend/          # Next.js application (Vercel)
├── backend/           # Cloudflare Worker API
├── docs/              # Project documentation
├── memory-bank/       # Project context and planning
└── .clinerules/       # Development guidelines
```

## Getting Started

### Frontend (Next.js)
```bash
cd frontend
npm run dev
```

### Backend (Cloudflare Worker)
```bash
cd backend
npm run dev
```

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Cloudflare Workers, TypeScript
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth

## Development Status

✅ Project scaffolding complete
🔄 Authentication setup (in progress)
⏳ Database schema design
⏳ API endpoints
⏳ Admin dashboard
⏳ Public website
