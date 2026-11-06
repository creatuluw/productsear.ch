// The Drum — DB access for feed_items / feed_settings / search_misses.
// Raw schema-qualified SQL via db.execute (returns rows directly — postgres-js).
// Relative imports only: this module is also imported by scripts/feed-draw.ts
// under tsx, which does not resolve $lib aliases.

import { sql } from 'drizzle-orm';
import { db } from '../db';
import { DEFAULT_CADENCE_HOURS, type FeedItem, type FeedItemBody, type FeedType } from './types';

export interface FeedSettings {
	cadenceHours: number;
	digestEnabled: boolean;
	typeOrder: FeedType[];
}

export async function getFeedSettings(): Promise<FeedSettings> {
	const rows = await db.execute<{ cadence_hours: number; digest_enabled: boolean; type_order: unknown }>(
		sql`SELECT cadence_hours, digest_enabled, type_order FROM te9_dev.feed_settings WHERE id = true`
	);
	const row = rows[0];
	const order = (row?.type_order as FeedType[] | undefined) ?? [];
	return {
		cadenceHours: row?.cadence_hours ?? DEFAULT_CADENCE_HOURS,
		digestEnabled: row?.digest_enabled ?? false,
		typeOrder: order.length > 0 ? order : []
	};
}

export async function updateFeedSettings(patch: {
	cadenceHours?: number;
	digestEnabled?: boolean;
	typeOrder?: FeedType[];
}): Promise<void> {
	await db.execute(sql`
		UPDATE te9_dev.feed_settings SET
			cadence_hours = ${patch.cadenceHours ?? sql`cadence_hours`},
			digest_enabled = ${patch.digestEnabled ?? sql`digest_enabled`},
			type_order = ${patch.typeOrder ? JSON.stringify(patch.typeOrder) : sql`type_order`}::jsonb,
			updated_at = now()
		WHERE id = true`);
}

function mapItem(r: {
	id: string;
	type: string;
	listing_id: number | null;
	body: unknown;
	status: string;
	requires_approval: boolean;
	published_at: string | null;
	signals: unknown;
	created_at: string;
}): FeedItem {
	return {
		id: r.id,
		type: r.type as FeedType,
		listingId: r.listing_id,
		body: (r.body ?? {}) as FeedItemBody,
		status: r.status as FeedItem['status'],
		requiresApproval: r.requires_approval,
		publishedAt: r.published_at,
		signals: (r.signals ?? {}) as Record<string, unknown>,
		createdAt: r.created_at
	};
}

const ITEM_SELECT = sql`
	SELECT id, type, listing_id, body, status, requires_approval,
	       published_at::text AS published_at, signals, created_at::text AS created_at
	FROM te9_dev.feed_items`;

/** Published stream, newest first — the /feed surface. */
export async function listPublished(limit = 50): Promise<FeedItem[]> {
	const rows = await db.execute<Parameters<typeof mapItem>[0]>(
		sql`${ITEM_SELECT} WHERE status = 'published' ORDER BY published_at DESC NULLS LAST, created_at DESC LIMIT ${limit}`
	);
	return rows.map(mapItem);
}

/** All published items anchored to one listing — its stack page. */
export async function listByListing(listingId: number): Promise<FeedItem[]> {
	const rows = await db.execute<Parameters<typeof mapItem>[0]>(
		sql`${ITEM_SELECT} WHERE status = 'published' AND listing_id = ${listingId} ORDER BY published_at DESC NULLS LAST, created_at DESC`
	);
	return rows.map(mapItem);
}

/** Every listing already drawn into the feed — generators exclude these. */
export async function usedListingIds(): Promise<Set<number>> {
	const rows = await db.execute<{ listing_id: number }>(
		sql`SELECT DISTINCT listing_id FROM te9_dev.feed_items WHERE listing_id IS NOT NULL`
	);
	return new Set(rows.map((r) => r.listing_id));
}

export async function totalDraws(): Promise<number> {
	const rows = await db.execute<{ n: number }>(sql`SELECT count(*)::int AS n FROM te9_dev.feed_items`);
	return rows[0]?.n ?? 0;
}

export async function lastDrawAt(): Promise<string | null> {
	const rows = await db.execute<{ t: string | null }>(
		sql`SELECT max(created_at)::text AS t FROM te9_dev.feed_items`
	);
	return rows[0]?.t ?? null;
}

export interface InsertFeedItemInput {
	type: FeedType;
	listingId?: number;
	body: FeedItemBody;
	signals?: Record<string, unknown>;
	requiresApproval?: boolean;
}

/** Every item regardless of status — the admin queue, newest first. */
export async function listAllItems(limit = 200): Promise<FeedItem[]> {
	const rows = await db.execute<Parameters<typeof mapItem>[0]>(
		sql`${ITEM_SELECT} ORDER BY created_at DESC LIMIT ${limit}`
	);
	return rows.map(mapItem);
}

export async function setItemApproval(id: string, requiresApproval: boolean): Promise<void> {
	await db.execute(sql`UPDATE te9_dev.feed_items SET requires_approval = ${requiresApproval} WHERE id = ${id}`);
}

/** status transition; publishing stamps published_at, retracting clears it. */
export async function setItemStatus(id: string, status: 'draft' | 'published'): Promise<void> {
	await db.execute(sql`
		UPDATE te9_dev.feed_items
		SET status = ${status}, published_at = ${status === 'published' ? sql`now()` : null}
		WHERE id = ${id}`);
}

export async function deleteItem(id: string): Promise<void> {
	await db.execute(sql`DELETE FROM te9_dev.feed_items WHERE id = ${id}`);
}

/** Patch editable body fields in place (jsonb_set chain — untouched keys survive). */
export async function patchItemBody(
	id: string,
	patch: { headline?: string; standfirst?: string; paragraphs?: string[]; question?: string }
): Promise<void> {
	let body = sql`body`;
	if (patch.headline !== undefined) body = sql`jsonb_set(${body}, '{headline}', ${JSON.stringify(patch.headline)}::jsonb)`;
	if (patch.standfirst !== undefined) body = sql`jsonb_set(${body}, '{standfirst}', ${JSON.stringify(patch.standfirst)}::jsonb)`;
	if (patch.paragraphs !== undefined) body = sql`jsonb_set(${body}, '{paragraphs}', ${JSON.stringify(patch.paragraphs)}::jsonb)`;
	if (patch.question !== undefined) body = sql`jsonb_set(${body}, '{question}', ${JSON.stringify(patch.question)}::jsonb)`;
	await db.execute(sql`UPDATE te9_dev.feed_items SET body = ${body} WHERE id = ${id}`);
}

export async function insertFeedItem(input: InsertFeedItemInput): Promise<FeedItem> {
	const requiresApproval = input.requiresApproval ?? false;
	const status = requiresApproval ? 'draft' : 'published';
	const rows = await db.execute<Parameters<typeof mapItem>[0]>(sql`
		INSERT INTO te9_dev.feed_items (type, listing_id, body, status, requires_approval, published_at, signals)
		VALUES (${input.type}, ${input.listingId ?? null}, ${JSON.stringify(input.body)}::jsonb, ${status}, ${requiresApproval},
		        ${status === 'published' ? sql`now()` : null}, ${JSON.stringify(input.signals ?? {})}::jsonb)
		RETURNING id, type, listing_id, body, status, requires_approval,
		          published_at::text AS published_at, signals, created_at::text AS created_at`);
	return mapItem(rows[0]);
}
