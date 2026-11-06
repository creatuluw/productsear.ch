import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { ARCHETYPES } from '$lib/archetypes';
import { collectionsIndexLlmView } from '$lib/server/llmview';
import type { PageServerLoad } from './$types';

// The collections index: every archetype group with its live count.
export const load: PageServerLoad = async ({ url }) => {
	const rows = await db.execute<{ archetype: string; n: number }>(sql`
		SELECT t.archetype, count(*)::int AS n
		FROM te9_dev.bookmark_archetypes x,
		     jsonb_array_elements_text(x.archetypes) AS t(archetype)
		GROUP BY t.archetype
		ORDER BY n DESC
	`);

	const counts = new Map(rows.map((r) => [r.archetype, r.n]));
	const groups = ARCHETYPES.map((a) => ({ slug: a.slug, name: a.name, n: counts.get(a.slug) ?? 0 }))
		.filter((g) => g.n > 0)
		.sort((a, b) => b.n - a.n);

	if (url.searchParams.get('view') === 'llm') {
		return { groups, llm: collectionsIndexLlmView(groups) };
	}
	return { groups, llm: null };
};
