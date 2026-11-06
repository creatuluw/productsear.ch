// The Floor — transparency about what searchers wanted and the corpus cannot
// describe yet: queries that fell below the relevance floor (0.45) with zero
// results. Privacy-safe by construction: only aggregated theme tokens are
// ever published, never raw queries (spec Q10 / trust convention).

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import type { GeneratorResult } from '../types';

const STOPWORDS = new Set([
	'the', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'with', 'is', 'are',
	'how', 'what', 'best', 'tool', 'tools', 'app', 'apps', 'free', 'open', 'source'
]);

const WINDOW_DAYS = 30;

export async function generateFloor(): Promise<GeneratorResult | null> {
	const misses = await db.execute<{ query: string; n: number }>(sql`
		SELECT lower(query) AS query, count(*)::int AS n
		FROM te9_dev.search_misses
		WHERE created_at >= now() - interval '30 days'
		GROUP BY lower(query)`);

	if (misses.length === 0) return null;

	const total = misses.reduce((sum, m) => sum + m.n, 0);

	// theme tokens: shared words across miss queries, most frequent first
	const freq = new Map<string, number>();
	for (const m of misses) {
		const seen = new Set<string>();
		for (const token of m.query.split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !STOPWORDS.has(t))) {
			if (seen.has(token)) continue;
			seen.add(token);
			freq.set(token, (freq.get(token) ?? 0) + m.n);
		}
	}
	const themes = [...freq.entries()]
		.filter(([, n]) => n >= 2)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 6);

	if (themes.length === 0) return null;

	return {
		body: {
			headline: `The Floor — ${total} search${total === 1 ? '' : 'es'} fell through this month`,
			standfirst: `These are the queries that returned nothing above the relevance floor in the last ${WINDOW_DAYS} days. Themes only — raw queries are never published. Every gap here is an invitation: if you know the tool, it should be in the corpus.`,
			items: themes.map(([token, n]) => ({
				label: `"${token}" — wanted ${n}×`,
				note: 'recurring shape in zero-result searches'
			})),
			question: 'Know something the corpus is missing? Tell the curator.'
		},
		signals: {
			generator: 'floor',
			windowDays: WINDOW_DAYS,
			totalMisses: total,
			distinctMisses: misses.length,
			themes
		}
	};
}
