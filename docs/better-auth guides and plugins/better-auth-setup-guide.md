# Better Auth Setup Guide (Next.js, Drizzle, Neon)

This guide details the steps to set up Better Auth for authentication in a Next.js (App Router) project using Drizzle ORM and a PostgreSQL database (like Neon). This setup focuses on email/password authentication where user accounts are created by an administrator (i.e., public sign-up is disabled).

## 1. Prerequisites

*   A Next.js project initialized (this guide assumes it's in a `frontend` subdirectory).
*   Drizzle ORM already set up with:
    *   A main schema file (e.g., `frontend/src/db/schema.ts`).
    *   A Drizzle configuration file (e.g., `frontend/drizzle.config.ts`).
    *   A migration script (e.g., `frontend/src/scripts/migrate.ts`).
*   A PostgreSQL database (e.g., Neon) and its connection string.

## 2. Installation

Navigate to your project's `frontend` directory and install the necessary packages:

```bash
# Install Better Auth
npm install better-auth

# Install CLI tools for running commands with .env variables and TypeScript execution
npm install --save-dev dotenv-cli tsx
```
*   `better-auth`: The main authentication library.
*   `dotenv-cli`: Used to ensure `.env.local` variables are loaded when running CLI commands (like `drizzle-kit` or `@better-auth/cli`).
*   `tsx`: For running TypeScript scripts directly (like the Drizzle migration script).

## 3. Environment Variables

Add the following variables to your `frontend/.env.local` file:

```env
# Database Connection (already should exist for Drizzle)
DATABASE_URL="your_postgresql_connection_string"

# Better Auth Configuration
BETTER_AUTH_SECRET="generate_a_strong_random_secret_32_chars_or_more"
BETTER_AUTH_URL="http://localhost:3000" # Base URL of your app during development

# Next.js Public Variable for Client-Side Auth Config
NEXT_PUBLIC_APP_URL="http://localhost:3000" # Full public URL of your app
```
**Important:**
*   Replace placeholder values with your actual data.
*   Generate a strong, unique secret for `BETTER_AUTH_SECRET` (e.g., using `openssl rand -base64 32` or a password manager).
*   Adjust URLs for production environments.

## 4. Configure Better Auth Server Instance

Create a file at `frontend/src/lib/auth.ts` to configure the Better Auth server instance:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // Path to your Drizzle db instance (e.g., from src/db/index.ts)

export const auth = betterAuth({
  // Adapter for Drizzle ORM with PostgreSQL
  database: drizzleAdapter(db, {
    provider: "pg", // 'pg' for PostgreSQL
  }),

  // Enable email and password authentication
  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // Public sign-ups are disabled; accounts are admin-created.
                         // Can be temporarily set to 'false' for initial test user creation.
  },

  // Better Auth automatically uses BETTER_AUTH_SECRET and BETTER_AUTH_URL
  // from environment variables.
  
  appName: "Your Application Name", // Optional: For display purposes (e.g., in emails if configured)
});
```
This setup uses the Drizzle adapter for PostgreSQL and enables email/password authentication with public sign-ups disabled.

## 5. Define Database Schema for Better Auth

Better Auth requires specific tables in your database (user, session, account, verification).

### 5.1. Generate Better Auth Schema with CLI

Run the Better Auth CLI to generate the Drizzle schema definitions for these tables. This command points to your `auth.ts` config and uses `dotenv-cli` to load environment variables:

```bash
cd frontend
npx dotenv -e .env.local -- npx @better-auth/cli@latest generate --config ./src/lib/auth.ts
```
This will prompt: `? Do you want to generate the schema to ./auth-schema.ts? » (y/N)`.
Respond `y`. If the file exists, it will ask to overwrite; respond `y` again.
This creates/overwrites `frontend/auth-schema.ts`.

### 5.2. Merge Schema into Main Drizzle File

Manually copy the table definitions (`user`, `session`, `account`, `verification`) from the generated `frontend/auth-schema.ts` into your main Drizzle schema file (e.g., `frontend/src/db/schema.ts`).

**Key considerations during merge:**
*   **Imports:** Ensure all necessary types (`pgTable`, `text`, `timestamp`, `boolean`, etc.) are imported from `drizzle-orm/pg-core`.
*   **Timestamps:** For consistency, it's recommended to use `timestamp('column_name', { withTimezone: true })` for all timestamp fields. The CLI might not add `{ withTimezone: true }` by default.
*   **Linking to Existing Tables (Example):** If you have an existing `employees` table and want to link employees to system user accounts, add a foreign key to your employee table:
    ```typescript
    // In your dimension_employee table definition (or similar)
    // ... other employee fields
    authUserId: text('auth_user_id').references(() => user.id, { onDelete: 'set null' }), // Links to Better Auth user.id
    ```
*   **Define Relations:** Add Drizzle `relations` for the new Better Auth tables and any links you've created:
    ```typescript
    // In frontend/src/db/schema.ts, after all table definitions:
    import { relations } from 'drizzle-orm';

    // ... your existing relations ...

    // Better Auth Relations
    export const userRelations = relations(user, ({ many }) => ({
      sessions: many(session),
      accounts: many(account),
      // Example if linking to dimension_employee:
      // employees: many(dimension_employee, { relationName: 'userToEmployee' }),
    }));

    export const sessionRelations = relations(session, ({ one }) => ({
      user: one(user, {
        fields: [session.userId],
        references: [user.id],
      }),
    }));

    export const accountRelations = relations(account, ({ one }) => ({
      user: one(user, {
        fields: [account.userId],
        references: [user.id],
      }),
    }));
    ```

## 6. Generate and Apply Database Migrations

With the main schema file (`frontend/src/db/schema.ts`) updated:

### 6.1. Generate Drizzle Migration

Create a new SQL migration file based on the schema changes:
```bash
cd frontend
npx dotenv -e .env.local -- npx drizzle-kit generate
```
This will create a new file in your Drizzle migrations directory (e.g., `frontend/drizzle/0001_...sql`).

### 6.2. Apply Migration

Run your Drizzle migration script to apply the changes to the database:
```bash
cd frontend
npx dotenv -e .env.local -- tsx src/scripts/migrate.ts 
```
(Ensure `src/scripts/migrate.ts` correctly points to your migrations folder, e.g., `./drizzle`).

## 7. Mount API Route Handler

Create an API route handler for Better Auth in your Next.js App Router project. Create the file `frontend/src/app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/lib/auth"; // Path to your auth.ts instance
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
```
This handles all requests to `/api/auth/*`.

## 8. Create Client Instance

Create a client-side instance of Better Auth for your frontend components. Create `frontend/src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

const appBaseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: appBaseURL,
  // plugins: [ /* client plugins if any */ ],
});

// Optional: export const { signIn, signOut, useSession } = authClient;
```
Ensure `NEXT_PUBLIC_APP_URL` is set in `frontend/.env.local`.

## 9. Initial User Creation (Admin Task)

Since public sign-up is disabled (`disableSignUp: true` in `auth.ts`), an administrator must create initial user accounts.

**Method for creating a test/admin user:**
1.  **Temporarily Enable Sign-up:**
    *   In `frontend/src/lib/auth.ts`, change `disableSignUp: true` to `disableSignUp: false`.
2.  **Create a Basic Sign-up Page:**
    *   Add a route like `/signup` (e.g., `frontend/src/app/signup/page.tsx`).
    *   Create a form component (`frontend/src/components/signup-form.tsx`) with fields for name, email, and password.
    *   Use `authClient.signUp.email({ name, email, password })` to handle form submission.
3.  **Run the App and Sign Up:**
    *   Start your dev server (`npm run dev`).
    *   Navigate to `/signup` and create the initial admin/test user.
4.  **CRITICAL: Disable Sign-up Again:**
    *   Immediately change `disableSignUp: false` back to `disableSignUp: true` in `frontend/src/lib/auth.ts`.
    *   Restart your dev server if it doesn't auto-reload the config change.

Future user creation would ideally be done via an admin interface or a secure script.

## 10. Basic UI for Testing (Example)

*   **Login Page (`/login`):** Use a form that calls `authClient.signIn.email({ email, password })`. Redirect to `/dashboard` on success.
*   **Dashboard Page (`/dashboard`):**
    *   Make it a client component (`"use client";`).
    *   Use `authClient.useSession()` to get session data.
    *   Redirect to `/login` if no session.
    *   Display user info and a logout button (`authClient.signOut()`).

## 11. Troubleshooting Tips

*   **`DATABASE_URL not set` errors when running CLIs:** Always prefix CLI commands (`drizzle-kit`, `@better-auth/cli`, `tsx`) with `npx dotenv -e .env.local -- ` if they need to access environment variables and aren't picking them up automatically.
*   **`ENOENT` (command not found) for CLIs like `tsx` or `@better-auth/cli` when used with `dotenv-cli`:** Try nesting `npx`: `npx dotenv -e .env.local -- npx your-command-here ...`. Ensure the tool (`tsx`, `@better-auth/cli`) is installed or accessible via `npx`.
*   **Invalid `DATABASE_URL` format:** Ensure the URL in `.env.local` is just `postgresql://...` without prefixes like `psql ` or extra quotes within the value.
*   **ESLint/Prettier Formatting Errors:** These are common after file generation or modification. They are usually fixed automatically by lint-staged on commit, or by running your lint/format scripts manually.
*   **TypeScript Path Alias Issues:** Ensure `tsconfig.json` (`baseUrl`, `paths`) is correctly configured for aliases like `@/*`. Use relative paths if aliases cause issues in specific files.

This guide should provide a solid foundation for setting up and managing Better Auth in your project.
