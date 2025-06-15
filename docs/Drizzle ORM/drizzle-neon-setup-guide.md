# Setting Up Drizzle ORM with Neon PostgreSQL

This guide provides step-by-step instructions for setting up Drizzle ORM with Neon PostgreSQL in a Next.js project. It covers installation, configuration, schema definition, migrations, and common troubleshooting tips.

## Table of Contents

1. [Installation](#installation)
2. [Environment Setup](#environment-setup)
3. [Database Connection](#database-connection)
4. [Schema Definition](#schema-definition)
5. [Drizzle Configuration](#drizzle-configuration)
6. [Migrations](#migrations)
7. [Usage Examples](#usage-examples)
8. [Troubleshooting](#troubleshooting)

## Installation

Install the required packages:

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit dotenv
```

## Environment Setup

Create a `.env` file in your project root with your Neon database connection string:

```
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

## Database Connection

Create a database connection file (e.g., `src/lib/db/index.ts`):

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the database connection
neonConfig.fetchConnectionCache = true;
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// Export the schema and sql for use in other files
export { schema, sql };

/**
 * Helper function to check database connection
 * @returns {Promise<boolean>} True if connection is successful
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Simple query to check if the database is accessible
    const result = await sql`SELECT 1 as connected`;
    return result[0]?.connected === 1;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}
```

## Schema Definition

Create a schema file (e.g., `src/lib/db/schema.ts`):

```typescript
import { pgTable, serial, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define your tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));
```

## Drizzle Configuration

Create a Drizzle configuration file (e.g., `drizzle.config.ts`):

```typescript
import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
```

> **Important**: The `dialect` property must be set to `'postgresql'` (not `'postgres'` or `'pg'`). This is a common source of errors.

## Migrations

### Generate Migrations

To generate SQL migration files based on your schema:

```bash
npx drizzle-kit generate
```

This will create SQL migration files in the `./drizzle` directory.

### Apply Migrations

Create a migration script (e.g., `src/scripts/migrate.ts`):

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  try {
    console.log('Running migrations...');
    
    // Initialize a new connection for migrations
    const migrationClient = neon(process.env.DATABASE_URL);
    const migrationDb = drizzle(migrationClient);
    
    // Apply migrations
    await migrate(migrationDb, { migrationsFolder: 'drizzle' });
    
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
```

Run the migration script:

```bash
npx tsx src/scripts/migrate.ts
```

## Usage Examples

### Query Data

```typescript
import { db } from '@/lib/db';

// Get all users
const allUsers = await db.query.users.findMany();

// Get a specific user with their posts
const userWithPosts = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.id, 1),
  with: {
    posts: true,
  },
});
```

### Insert Data

```typescript
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

// Insert a new user
const newUser = await db.insert(users).values({
  name: 'John Doe',
  email: 'john@example.com',
}).returning();
```

### Update Data

```typescript
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Update a user
await db.update(users)
  .set({ name: 'Jane Doe' })
  .where(eq(users.id, 1));
```

### Delete Data

```typescript
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Delete a user
await db.delete(users).where(eq(users.id, 1));
```

## Troubleshooting

### Common Issues and Solutions

1. **Error: No database connection string was provided to `neon()`**
   - Make sure your `.env` file is being loaded correctly
   - Verify that `dotenv.config()` is called before accessing `process.env.DATABASE_URL`
   - Check that the `.env` file is in the correct location

2. **Error: Please specify 'dialect' param in config file**
   - Ensure your `drizzle.config.ts` includes `dialect: 'postgresql'`
   - The dialect must be exactly `'postgresql'` (not `'postgres'` or `'pg'`)

3. **Error: Can't find meta/_journal.json file**
   - This occurs when trying to run migrations before generating them
   - Run `npx drizzle-kit generate` first, then run your migration script

4. **Error: Invalid input for driver**
   - Remove the `driver` property from your `drizzle.config.ts` file
   - Only use `dialect: 'postgresql'` and `dbCredentials: { connectionString: ... }`

5. **Error: Connection refused**
   - Check that your Neon database is active and accessible
   - Verify that your connection string is correct
   - Ensure that `sslmode=require` is included in the connection string

6. **Error: Relation does not exist**
   - This occurs when trying to query a table that hasn't been created yet
   - Make sure you've run your migrations before querying the database

### Best Practices

1. **Always load environment variables first**
   - Call `dotenv.config()` at the top of your files that use environment variables

2. **Use a connection helper function**
   - Implement a `checkDatabaseConnection()` function to verify connectivity

3. **Handle connection errors gracefully**
   - Wrap database operations in try/catch blocks
   - Provide meaningful error messages

4. **Keep schema and migrations in sync**
   - Generate new migrations whenever you change your schema
   - Run migrations as part of your deployment process

5. **Use TypeScript for type safety**
   - Leverage Drizzle's TypeScript support for type-safe queries
   - Define proper relations between tables

## Conclusion

By following this guide, you should have a working setup of Drizzle ORM with Neon PostgreSQL in your Next.js project. This configuration provides a solid foundation for building database-driven applications with modern TypeScript tooling.

Remember to keep your dependencies updated, as both Drizzle and Neon are actively developed and may introduce breaking changes or new features over time.
