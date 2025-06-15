import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import type { D1Database } from '../types';

export function createDB(database: D1Database) {
  return drizzle(database, { schema });
}

export type DB = ReturnType<typeof createDB>;
export { schema };
