import { sql } from 'drizzle-orm';
import {
	check,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	vector
} from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
// ponytail: process.env + dotenv/config instead of $env/dynamic/private so scripts can
// import this module too. dotenv won't override vars already set (e.g. by scripts/CI).

/**
 * DB schema for the te9_dev bookmark corpus.
 *
 * The three source tables (bookmarks, bookmark_content, bookmark_analysis) are
 * READ-ONLY to this app — we never mutate them. We only add a new
 * `bookmark_embeddings` table (with a denormalized `search_tsv` for full-text)
 * owned entirely by this app's backfill script.
 */

const schemaName = process.env.DB_SCHEMA ?? 'te9_dev';

// --- Source tables (read-only mirrors of the existing Raindrop-synced schema) ---

export const bookmarks = pgTable(
	'bookmarks',
	{
		id: integer('id').primaryKey(),
		raindropId: integer('raindrop_id').notNull(),
		title: text('title').notNull(),
		url: text('url').notNull(),
		excerpt: text('excerpt'),
		cover: text('cover'),
		tags: text('tags'),
		type: text('type'),
		domain: text('domain'),
		note: text('note'),
		raindropCreatedAt: timestamp('raindrop_created_at', { withTimezone: true }),
		raindropUpdatedAt: timestamp('raindrop_updated_at', { withTimezone: true }),
		syncedAt: timestamp('synced_at', { withTimezone: true }).notNull()
	},
	(t) => ({ idIdx: index('bookmarks_id_idx').on(t.id) })
);

export const bookmarkContent = pgTable('bookmark_content', {
	id: integer('id').primaryKey(),
	bookmarkId: integer('bookmark_id').notNull(),
	markdown: text('markdown'),
	tokenCount: integer('token_count'),
	status: text('status').notNull(),
	error: text('error'),
	crawledAt: timestamp('crawled_at', { withTimezone: true }).notNull()
});

export const bookmarkAnalysis = pgTable('bookmark_analysis', {
	id: integer('id').primaryKey(),
	bookmarkId: integer('bookmark_id').notNull(),
	relevance: text('relevance'),
	purpose: text('purpose'),
	howToUse: text('how_to_use'),
	whenToUse: text('when_to_use'),
	tags: text('tags'),
	category: text('category'),
	analyzedAt: timestamp('analyzed_at', { withTimezone: true }).notNull()
});

// --- App-owned embeddings table (pgvector) ---

export const bookmarkEmbeddings = pgTable(
	'bookmark_embeddings',
	{
		id: integer('id').primaryKey(),
		bookmarkId: integer('bookmark_id').notNull().unique(),
		embedding: vector('embedding', { dimensions: 1024 }).notNull(),
		searchTsv: text('search_tsv'),
		model: text('model').notNull(),
		embeddedAt: timestamp('embedded_at', { withTimezone: true }).notNull().defaultNow()
	},
	(t) => ({
		bookmarkIdIdx: index('bookmark_embeddings_bookmark_id_idx').on(t.bookmarkId),
		modelCheck: check('bookmark_embeddings_model_check', sql`${t.model} <> ''`)
	})
);

export type Bookmark = typeof bookmarks.$inferSelect;
export type BookmarkAnalysis = typeof bookmarkAnalysis.$inferSelect;
export type BookmarkContent = typeof bookmarkContent.$inferSelect;

export const schema = {
	bookmarks,
	bookmarkContent,
	bookmarkAnalysis,
	bookmarkEmbeddings
};

// ponytail: single shared client. SMB scale, single instance — no pool tuning needed yet.
const queryClient = postgres(process.env.DATABASE_URL!, { max: 10, prepare: false });

export const db = drizzle(queryClient, { schema, casing: 'snake_case' });

export { schemaName };
