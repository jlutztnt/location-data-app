o connect Drizzle ORM with Cloudflare D1, follow these steps:

Install the required packages
Use your preferred package manager:
bash
npm i drizzle-orm
npm i -D drizzle-kit
Or with yarn, pnpm, or bun as needed1.
Configure your Wrangler file
Set up either wrangler.json or wrangler.toml for your D1 database. Example for wrangler.toml:
toml
name = "YOUR_PROJECT_NAME"
main = "src/index.ts"
compatibility_date = "2022-11-07"
node_compat = true
[[ d1_databases ]]
binding = "BINDING_NAME"
database_name = "YOUR_DB_NAME"
database_id = "YOUR_DB_ID"
migrations_dir = "drizzle/migrations"
Replace placeholders with your actual project/database details.
Connect Drizzle to Cloudflare D1 in your code
Use the following structure in your Worker:
typescript
import { drizzle } from 'drizzle-orm/d1';
export interface Env {
  <BINDING_NAME>: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
    const result = await db.select().from(users).all()
    return Response.json(result);
  },
};
Replace <BINDING_NAME> with the binding from your wrangler config and ensure users refers to your table.
Define your schema (optional but recommended)
Example of a schema file (schema.ts):
typescript
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});
This helps with type safety and migration management2.
More details and example code are available at the official guide:
Drizzle <> Cloudflare D1

Sources
Drizzle <> Cloudflare D1
DocsConnectCloudflare D1
Get Started with Drizzle and D1
Docsmeet drizzleGet started
