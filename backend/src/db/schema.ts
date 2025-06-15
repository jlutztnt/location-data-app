import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// BETTER AUTH TABLES (Required for authentication)
// ============================================================================

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }),
});

// ============================================================================
// LOCATION DATA TABLES (Core business logic)
// ============================================================================

export const locations = sqliteTable('locations', {
  id: text('id').primaryKey(),
  storeNumber: text('store_number').notNull().unique(),
  storeName: text('store_name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  phoneNumber: text('phone_number'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  googlePlaceId: text('google_place_id'),
  districtId: text('district_id').references(() => districts.id),
  storeManagerId: text('store_manager_id').references(() => managers.id),
  districtManagerId: text('district_manager_id').references(() => managers.id),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const districts = sqliteTable('districts', {
  id: text('id').primaryKey(),
  districtNumber: text('district_number').notNull().unique(),
  districtName: text('district_name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const managers = sqliteTable('managers', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email'),
  phoneNumber: text('phone_number'),
  role: text('role').notNull(), // 'store_manager' | 'district_manager'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const storeHours = sqliteTable('store_hours', {
  id: text('id').primaryKey(),
  locationId: text('location_id').notNull().references(() => locations.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday, 1 = Monday, etc.
  openTime: text('open_time'), // Format: "HH:MM" (24-hour)
  closeTime: text('close_time'), // Format: "HH:MM" (24-hour)
  isClosed: integer('is_closed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ============================================================================
// RELATIONS
// ============================================================================

// Better Auth Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
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

// Location Data Relations
export const locationRelations = relations(locations, ({ one, many }) => ({
  district: one(districts, {
    fields: [locations.districtId],
    references: [districts.id],
  }),
  storeManager: one(managers, {
    fields: [locations.storeManagerId],
    references: [managers.id],
    relationName: 'storeManager',
  }),
  districtManager: one(managers, {
    fields: [locations.districtManagerId],
    references: [managers.id],
    relationName: 'districtManager',
  }),
  hours: many(storeHours),
}));

export const districtRelations = relations(districts, ({ many }) => ({
  locations: many(locations),
}));

export const managerRelations = relations(managers, ({ many }) => ({
  storeLocations: many(locations, { relationName: 'storeManager' }),
  districtLocations: many(locations, { relationName: 'districtManager' }),
}));

export const storeHoursRelations = relations(storeHours, ({ one }) => ({
  location: one(locations, {
    fields: [storeHours.locationId],
    references: [locations.id],
  }),
}));
