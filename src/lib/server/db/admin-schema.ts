import { sql } from 'drizzle-orm';
import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * App-owned admin-panel tables backing /admin (extensions · agents · settings
 * · features). All live in te9_dev, created by scripts/migration-admin.sql.
 */

const uuidPk = () =>
	text('id')
		.primaryKey()
		.default(sql`gen_random_uuid()::text`);

export const adminExtensions = pgTable('admin_extensions', {
	id: uuidPk(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	enabled: boolean('enabled').notNull().default(false),
	config: jsonb('config').notNull().default({}),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const adminAgents = pgTable('admin_agents', {
	id: uuidPk(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	systemPrompt: text('system_prompt').notNull().default(''),
	model: text('model'),
	enabled: boolean('enabled').notNull().default(false),
	config: jsonb('config').notNull().default({}),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const adminSettings = pgTable('admin_settings', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
	description: text('description'),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const adminFeatures = pgTable('admin_features', {
	key: text('key').primaryKey(),
	label: text('label').notNull(),
	description: text('description'),
	enabled: boolean('enabled').notNull().default(false),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export type AdminExtension = typeof adminExtensions.$inferSelect;
export type AdminAgent = typeof adminAgents.$inferSelect;
export type AdminSetting = typeof adminSettings.$inferSelect;
export type AdminFeature = typeof adminFeatures.$inferSelect;
