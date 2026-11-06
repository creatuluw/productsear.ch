import { eq } from 'drizzle-orm';
import { db, adminFeatures, adminSettings } from './db';

/**
 * Read-side helpers for values managed in /admin → settings & features.
 * 30s in-memory cache — SMB scale, single instance; clearSettingsCache() after
 * admin writes so console changes apply immediately.
 */

const TTL_MS = 30_000;
const cache = new Map<string, { v: unknown; at: number }>();

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
	const hit = cache.get(key);
	if (hit && Date.now() - hit.at < TTL_MS) return hit.v as T;
	const v = await load();
	cache.set(key, { v, at: Date.now() });
	return v;
}

export function clearSettingsCache() {
	cache.clear();
}

/** String setting by key (empty string when unset). */
export async function getSetting(key: string, fallback = ''): Promise<string> {
	return cached(`s:${key}`, async () => {
		const [row] = await db
			.select({ value: adminSettings.value })
			.from(adminSettings)
			.where(eq(adminSettings.key, key))
			.limit(1);
		return row?.value ?? fallback;
	});
}

/** Feature flag by key (falls back when the flag doesn't exist). */
export async function getFlag(key: string, fallback = false): Promise<boolean> {
	return cached(`f:${key}`, async () => {
		const [row] = await db
			.select({ enabled: adminFeatures.enabled })
			.from(adminFeatures)
			.where(eq(adminFeatures.key, key))
			.limit(1);
		return row?.enabled ?? fallback;
	});
}
