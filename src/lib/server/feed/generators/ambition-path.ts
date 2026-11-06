// Ambition Path — several listings chained into a route toward one named
// ambition. Data side picks the cluster and the raw steps; the LLM names the
// ambition and orders/annotates the steps (order validated against known ids
// — the model picks, it does not invent).

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { usedListingIds } from '../queries';
import { draftJson } from '../llm';
import type { GeneratorResult } from '../types';

const STEPS = 5;

interface Draft {
	ambition: string;
	steps: Array<{ id: number; note: string }>;
}

const SYSTEM = `You write for "the drum", a curated magazine of saved tools and resources.
Write an "Ambition Path": a named ambition a reader could actually pursue, built
from the given listings as ordered steps. Name the ambition in <= 10 words,
order the steps into a real progression (foundations first, advanced last),
one short note per step (max 18 words) on what it contributes.
You must only use the given step ids — do not invent listings.
Respond ONLY with a JSON object: {"ambition": "...", "steps": [{"id": 123, "note": "..."}, ...]}`;

export async function generateAmbitionPath(): Promise<GeneratorResult | null> {
	const used = await usedListingIds();

	// cluster: archetype with enough analyzed, undrawn listings to build a path
	const clusters = await db.execute<{ archetype: string; n: number }>(sql`
		SELECT t.archetype, count(DISTINCT b.id)::int AS n
		FROM te9_dev.bookmark_archetypes x
		JOIN jsonb_array_elements_text(x.archetypes) AS t(archetype) ON true
		JOIN te9_dev.bookmarks b ON b.id = x.bookmark_id
		JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id AND a.purpose IS NOT NULL AND a.purpose <> ''
		WHERE NOT EXISTS (SELECT 1 FROM te9_dev.feed_items f WHERE f.listing_id = b.id)
		GROUP BY t.archetype
		HAVING count(DISTINCT b.id) >= ${STEPS}
		ORDER BY n DESC
		LIMIT 5`);
	if (clusters.length === 0) return null;

	const cluster = clusters[0].archetype;
	const steps = await db.execute<{
		id: number;
		title: string;
		url: string;
		domain: string | null;
		purpose: string | null;
	}>(sql`
		SELECT * FROM (
			SELECT DISTINCT b.id, b.title, b.url, b.domain, a.purpose
			FROM te9_dev.bookmarks b
			JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id AND a.purpose IS NOT NULL AND a.purpose <> ''
			JOIN te9_dev.bookmark_archetypes x ON x.bookmark_id = b.id,
			     jsonb_array_elements_text(x.archetypes) AS t(archetype) -- SRF last: JOIN binds tighter than commas, a later JOIN could not see b
			WHERE t.archetype = ${cluster}
			  AND NOT EXISTS (SELECT 1 FROM te9_dev.feed_items f WHERE f.listing_id = b.id)
		) candidates
		ORDER BY random()
		LIMIT ${STEPS}`);
	if (steps.length < 3) return null; // not enough to form a path

	const { data, provider } = await draftJson<Draft>(
		SYSTEM,
		`Cluster context: these ${steps.length} listings share the "${cluster}" archetype.\n` +
			steps
				.map((s) => `id ${s.id}: ${s.title} — ${s.purpose?.slice(0, 160)}`)
				.join('\n')
	);

	const byId = new Map(steps.map((s) => [s.id, s]));
	// validate: only known ids, deduped; fall back to data-side order
	const validSteps = (data.steps ?? [])
		.filter((s) => byId.has(Number(s.id)))
		.map((s) => ({ id: Number(s.id), note: String(s.note ?? '').slice(0, 140) }));
	const deduped = [...new Map(validSteps.map((s) => [s.id, s])).values()];
	const finalSteps = deduped.length >= 3 ? deduped : steps.map((s, i) => ({ id: s.id, note: i === 0 ? 'start here' : 'next step' }));
	const ordered = finalSteps.map((s) => byId.get(s.id)!);

	return {
		listingId: ordered[0].id,
		body: {
			headline: `The path: ${data.ambition?.trim() || 'from saved to shipped'}`,
			standfirst: `${ordered.length} listings from the corpus, ordered as a route toward one ambition. Start at step one.`,
			listing: { id: ordered[0].id, title: ordered[0].title, url: ordered[0].url, domain: ordered[0].domain },
			items: finalSteps.map((s, i) => ({
				id: s.id,
				label: `${i + 1}. ${ordered[i].title}`,
				note: s.note,
				url: ordered[i].url
			}))
		},
		signals: { generator: 'ambition-path', provider, cluster, ambition: data.ambition }
	};
}
