# Tech Context: Location Data Service

This document outlines the technologies, architecture, and development practices for the Toot'n Totum Location Data Service.

## Core Technology Stack

| Layer | Technology | Implementation Details |
| :--- | :--- | :--- |
| **Frontend** | Next.js (React) | Hosted on Vercel. Uses the App Router. |
| **Backend** | Cloudflare Workers | Serverless functions for API logic. |
| **Database** | Cloudflare D1 | A SQLite-based database, accessed via Drizzle ORM. |
| **ORM** | Drizzle ORM | Provides type-safe database access. Configured for Cloudflare D1. |
| **Authentication** | Better Auth | Manages user sessions and protects API endpoints. Will be adapted for Drizzle/D1. |
| **UI/Styling** | shadcn/ui | Component library built on Radix UI and Tailwind CSS. |

## Development & Deployment

*   **Version Control:** Git with a feature-branching workflow (e.g., `feature/name`). Commits should follow the Conventional Commits standard.
*   **Deployment:**
    *   Frontend is deployed to Vercel.
    *   Backend is deployed to Cloudflare Workers via Wrangler CLI.
*   **Environment Variables:** All secrets (API keys, database URLs, auth secrets) must be stored in `.env.local` files and configured in Vercel/Cloudflare environments. They should never be committed to version control.

## Architectural Notes

*   **Frontend-Backend Separation:** The frontend is a distinct Next.js application that communicates with the backend via authenticated API calls.
*   **Database Driver:** The system uses `drizzle-orm/d1` to connect the Cloudflare Worker to the D1 database. The Better Auth adapter will need to be configured for SQLite compatibility (`drizzleAdapter(db, { provider: "sqlite" })`), not PostgreSQL.
*   **Authentication Flow:**
    *   Better Auth is configured with public sign-ups disabled.
    *   User accounts are intended to be created by an administrator.
    *   API routes are protected, requiring a valid token (JWT) for access.
    *   The frontend uses a client-side instance of Better Auth to manage sessions and interact with protected routes.

## User Preferences & Ground Rules

*   **Experience Level:** The primary user is a new coder. Explanations should be clear, detailed, and broken down into small, testable steps.
*   **Contradictory Preferences:** The user's personal ground rules mention preferences for Supabase/Neon (PostgreSQL). However, this project's core specification mandates **Cloudflare D1 (SQLite)**. All development will proceed based on the D1 specification. This decision should be communicated if confusion arises.
*   **Workflow:** Work should proceed in incremental steps, with clear "why" explanations for technical decisions.

## Implementation Status ✅

**Status: Authentication Foundation Complete**

### Completed Implementation
- ✅ **Project Scaffolding**: Frontend (Next.js) and backend (Cloudflare Workers) established
- ✅ **Database Setup**: Cloudflare D1 database created and migrated with complete schema
- ✅ **Authentication System**: Better Auth fully implemented and tested
- ✅ **Hono Framework**: Clean API routing with proper error handling
- ✅ **Admin Dashboard**: Professional UI with 6 management sections
- ✅ **Development Environment**: Local servers running and tested

### Technology Stack Implemented
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Cloudflare Workers with Hono framework for routing
- **Database**: Cloudflare D1 with Drizzle ORM (SQLite-compatible)
- **Authentication**: Better Auth with admin-only user creation
- **Development**: PowerShell-compatible commands, local development servers

### Key Technical Achievements
- **Better Auth Integration**: Successfully configured for SQLite/D1 compatibility
- **CORS Configuration**: Proper cross-origin setup for frontend/backend communication
- **Session Management**: 7-day sessions with automatic redirects and protection
- **Database Schema**: Complete schema with Better Auth + location data tables
- **Admin User Creation**: Script-based admin user creation working

### Next Phase: Location Data Management
Ready to implement CRUD operations for store locations, data import functionality, and public API endpoints.
