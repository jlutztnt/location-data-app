import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDB } from "../db";
import type { D1Database } from "../types";

export function createAuth(database: D1Database, secret?: string, baseURL?: string) {
  console.log('createAuth called with:', {
    hasDatabase: !!database,
    secretLength: secret?.length,
    secretType: typeof secret,
    baseURL: baseURL
  });
  
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is required");
  }
  
  // Ensure secret is a string and has proper length
  const cleanSecret = String(secret).trim();
  if (cleanSecret.length < 32) {
    throw new Error(`BETTER_AUTH_SECRET must be at least 32 characters, got ${cleanSecret.length}`);
  }
  
  console.log('Using secret with length:', cleanSecret.length);
  
  try {
    const db = createDB(database);
    console.log('Database connection created successfully');
    
    const adapter = drizzleAdapter(db, {
      provider: "sqlite",
    });
    console.log('Drizzle adapter created successfully');
    
    const authConfig = {
      database: adapter,
      secret: cleanSecret,
      baseURL: baseURL || "http://localhost:8787",
      emailAndPassword: {
        enabled: true,
        disableSignUp: false,
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
      },
      trustedOrigins: ["http://localhost:3000", "https://location-data-app.vercel.app"],
    };
    
    console.log('Auth config prepared, creating betterAuth instance...');
    const auth = betterAuth(authConfig);
    console.log('BetterAuth instance created successfully');
    
    return auth;
  } catch (error) {
    console.error('Error in createAuth:', error);
    throw error;
  }
}

export type Auth = ReturnType<typeof createAuth>;
