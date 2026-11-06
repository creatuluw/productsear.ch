import { count, eq } from 'drizzle-orm';
import {
	adminAgents,
	adminExtensions,
	adminFeatures,
	adminSettings,
	bookmarkAnalysis,
	bookmarkEmbeddings,
	bookmarks,
	db
} from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [bm, emb, ana, ext, extOn, agents, agentsOn, flags, flagsOn, settings] = await Promise.all([
		db.select({ n: count() }).from(bookmarks),
		db.select({ n: count() }).from(bookmarkEmbeddings),
		db.select({ n: count() }).from(bookmarkAnalysis),
		db.select({ n: count() }).from(adminExtensions),
		db.select({ n: count() }).from(adminExtensions).where(eq(adminExtensions.enabled, true)),
		db.select({ n: count() }).from(adminAgents),
		db.select({ n: count() }).from(adminAgents).where(eq(adminAgents.enabled, true)),
		db.select({ n: count() }).from(adminFeatures),
		db.select({ n: count() }).from(adminFeatures).where(eq(adminFeatures.enabled, true)),
		db.select({ n: count() }).from(adminSettings)
	]);

	const pct = (part: number, total: number) => (total === 0 ? 0 : Math.round((part / total) * 100));

	return {
		stats: {
			listings: bm[0].n,
			embedded: emb[0].n,
			embedPct: pct(emb[0].n, bm[0].n),
			analyzed: ana[0].n,
			analyzePct: pct(ana[0].n, bm[0].n),
			extensions: { total: ext[0].n, enabled: extOn[0].n },
			agents: { total: agents[0].n, enabled: agentsOn[0].n },
			features: { total: flags[0].n, enabled: flagsOn[0].n },
			settings: settings[0].n
		}
	};
};
