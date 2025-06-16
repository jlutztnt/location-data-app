# Tech Context: Location Data Service

This document outlines the technologies, architecture, and development practices for the Toot'n Totum Location Data Service.

## Core Technology Stack

| Layer | Technology | Implementation Details |
| :--- | :--- | :--- |
| **Frontend** | Next.js (React) | Hosted on Vercel. Uses the App Router. |
| **Backend** | Cloudflare Workers | Serverless functions for API logic. |
| **Database** | Cloudflare D1 | A SQLite-based database, accessed via Drizzle ORM. |
| **ORM** | Drizzle ORM | Provides type-safe database access. Configured for Cloudflare D1. |
| **Authentication** | `SimpleAuth` | A custom-built, lightweight authentication system using the Web Crypto API for hashing and session management. |
| **UI/Styling** | shadcn/ui | Component library built on Radix UI and Tailwind CSS. |

## Development & Deployment

*   **Version Control:** Git with a feature-branching workflow (e.g., `feature/name`). Commits should follow the Conventional Commits standard.
*   **Deployment:**
    *   Frontend is deployed to Vercel.
    *   Backend is deployed to Cloudflare Workers via Wrangler CLI.
*   **Environment Variables:** All secrets (API keys, database URLs, auth secrets) must be stored in `.env.local` files and configured in Vercel/Cloudflare environments. They should never be committed to version control.

## Architectural Notes

*   **Frontend-Backend Separation:** The frontend is a distinct Next.js application that communicates with the backend via authenticated API calls.
*   **Database Driver:** The system uses `drizzle-orm/d1` to connect the Cloudflare Worker to the D1 database.
*   **Authentication Flow:**
    *   The `SimpleAuth` system has public sign-ups disabled by design.
    *   User accounts are intended to be created by an administrator.
    *   API routes are protected, requiring a valid token (JWT) for access.
*   The frontend uses a custom auth client (`auth-client.ts`) to manage sessions and interact with protected routes.

## User Preferences & Ground Rules

*   **Experience Level:** The primary user is a new coder. Explanations should be clear, detailed, and broken down into small, testable steps.
*   **Contradictory Preferences:** The user's personal ground rules mention preferences for Supabase/Neon (PostgreSQL). However, this project's core specification mandates **Cloudflare D1 (SQLite)**. All development will proceed based on the D1 specification. This decision should be communicated if confusion arises.
*   **Workflow:** Work should proceed in incremental steps, with clear "why" explanations for technical decisions.

## Implementation Status ✅

**Status: `SimpleAuth` Migration & Production Deployment Complete**

### Completed Implementation
- ✅ **Project Scaffolding**: Stable frontend and backend architecture.
- ✅ **Database Setup**: Cloudflare D1 database is live and migrated.
- ✅ **Authentication System**: Custom `SimpleAuth` system is implemented, tested, and deployed.
- ✅ **Production Deployment**: Both frontend and backend are deployed and confirmed working.

### Technology Stack Implemented
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Cloudflare Workers with Hono framework for routing.
- **Database**: Cloudflare D1 with Drizzle ORM.
- **Authentication**: Custom `SimpleAuth` with admin-only user creation.
- **Development**: PowerShell-compatible commands, local development servers.

### Key Technical Achievements
- **`SimpleAuth` Migration**: Successfully replaced Better Auth with a lightweight, custom solution, removing dependencies and resolving compatibility issues.
- **Production Deployment**: Deployed the full stack to Vercel and Cloudflare Workers.
- **Session Management**: Implemented secure, cookie-based session management.
- **Database Cleanup**: Simplified the database schema by removing unnecessary tables.

### Next Phase: Location Data Management
The project is now on a stable, production-ready foundation. The next step is to build the core location data management features.
