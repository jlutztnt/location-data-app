import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDB } from "../db";
import type { D1Database } from "../types";

export function createAuth(database: D1Database, secret?: string, baseURL?: string) {
  const db = createDB(database);
  
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is required");
  }
  
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    
    secret: secret,
    baseURL: baseURL || "http://localhost:8787",
    
    emailAndPassword: {
      enabled: true,
      disableSignUp: false, // Temporarily enable for admin creation
    },
    
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    
    trustedOrigins: ["http://localhost:3000", "https://location-data-app.vercel.app"],
    
    advanced: {
      generateId: () => crypto.randomUUID(),
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
