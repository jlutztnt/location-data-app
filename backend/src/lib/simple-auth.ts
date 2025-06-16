import { createDB } from "../db";
import type { D1Database } from "../types";
import { user, account } from "../db/schema";
import { eq } from "drizzle-orm";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
}

export class SimpleAuth {
  private db: ReturnType<typeof createDB>;
  private secret: string;

  constructor(database: D1Database, secret: string) {
    this.db = createDB(database);
    this.secret = secret;
  }

  // Hash password using Web Crypto API (available in Cloudflare Workers)
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + this.secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Generate session token
  private generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Verify password
  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hash = await this.hashPassword(password);
    return hash === hashedPassword;
  }

  // Sign in user
  async signIn(email: string, password: string): Promise<{ user: AuthUser; sessionToken: string } | null> {
    try {
      // Find user by email and get account with password
      const userResult = await this.db
        .select({
          id: user.id,
          email: user.email,
          name: user.name,
          password: account.password
        })
        .from(user)
        .leftJoin(account, eq(account.userId, user.id))
        .where(eq(user.email, email))
        .limit(1);
      
      if (userResult.length === 0) {
        return null; // User not found
      }

      const userData = userResult[0];
      
      if (!userData) {
        return null; // User not found
      }
      
      // Verify password
      if (!userData.password || !(await this.verifyPassword(password, userData.password))) {
        return null; // Invalid password
      }

      // Generate session token
      const sessionToken = this.generateSessionToken();
      
      // Create session (we'll store it in a simple way for now)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      return {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
        },
        sessionToken
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return null;
    }
  }

  // Create user (for admin creation)
  async createUser(email: string, password: string, name?: string): Promise<AuthUser | null> {
    try {
      const hashedPassword = await this.hashPassword(password);
      const userId = crypto.randomUUID();
      const accountId = crypto.randomUUID();

      // Insert user
      await this.db.insert(user).values({
        id: userId,
        email,
        name: name || "Admin User",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Insert account with password
      await this.db.insert(account).values({
        id: accountId,
        accountId: userId,
        providerId: "credential",
        userId: userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        id: userId,
        email,
        name: name || "Admin User",
      };
    } catch (error) {
      console.error('Create user error:', error);
      return null;
    }
  }

  // Verify session token (simplified - in production you'd store sessions in DB)
  async verifySession(sessionToken: string): Promise<AuthUser | null> {
    // For now, we'll implement a simple JWT-like verification
    // In a full implementation, you'd store sessions in the database
    try {
      // This is a simplified implementation
      // In production, you'd decode and verify a proper session token
      return null; // Placeholder
    } catch (error) {
      console.error('Verify session error:', error);
      return null;
    }
  }
}

export function createSimpleAuth(database: D1Database, secret: string): SimpleAuth {
  return new SimpleAuth(database, secret);
}
