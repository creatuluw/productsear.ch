// The Pulse — the 20% data section: what the corpus says this month.
// v1 covers archetype drift + rising domains. Repo obituaries (spec) are
// deferred until repo-activity data lands in the DB — the repo-scan split
// lives in gitignored CSVs, so CI generators cannot read it (backlog item).

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { ARCHETYPE_BY_SLUG } from '../../../archetypes';
import type { GeneratorResult } from '../types';

interface Mover {
	label: string;
	note: string;
}

export async function generatePulse(): Promise<GeneratorResult | null> {
	// archetype drift: last 30 days vs the 90 days before that
	const drift = await db.execute<{ archetype: string; n30: number; n90: number }>(sql`
		SELECT t.archetype,
		       count(*) FILTER (WHERE b.raindrop_created_at >= now() - interval '30 days')::int AS n30,
		       count(*) FILTER (WHERE b.raindrop_created_at <  now() - interval '30 days'
		                         AND b.raindrop_created_at >= now() - interval '120 days')::int AS n90
		FROM te9_dev.bookmarks b
		JOIN te9_dev.bookmark_archetypes x ON x.bookmark_id = b.id,
		     jsonb_array_elements_text(x.archetypes) AS t(archetype)
		WHERE b.raindrop_created_at >= now() - interval '120 days'
		GROUP BY t.archetype`);

	// normalize per archetype against its own 90-day baseline, then rank
	const movers = drift
		.map((d) => {
			const rate30 = d.n30 / 30;
			const rate90 = d.n90 / 90;
			const lift = rate90 > 0 ? rate30 / rate90 : rate30 > 0 ? Infinity : 0;
			return { slug: d.archetype, n30: d.n30, n90: d.n90, lift: lift === Infinity ? 9.99 : lift };
		})
		.filter((d) => d.n30 >= 2 && d.lift >= 1.3)
		.sort((a, b) => b.lift - a.lift)
		.slice(0, 3);

	const items: Mover[] = movers.map((m) => ({
		label: `${ARCHETYPE_BY_SLUG.get(m.slug)?.name ?? m.slug} — up ${Math.round((m.lift - 1) * 100)}%`,
		note: `${m.n30} saves in the last 30 days vs ${m.n90} in the 90 before`
	}));

	// rising domains: busy in the last 30 days, quiet before that
	const domains = await db.execute<{ domain: string; n30: number; n270: number }>(sql`
		SELECT b.domain,
		       count(*) FILTER (WHERE b.raindrop_created_at >= now() - interval '30 days')::int AS n30,
		       count(*) FILTER (WHERE b.raindrop_created_at <  now() - interval '30 days'
		                         AND b.raindrop_created_at >= now() - interval '300 days')::int AS n270
		FROM te9_dev.bookmarks b
		WHERE b.domain IS NOT NULL AND b.raindrop_created_at >= now() - interval '300 days'
		GROUP BY b.domain
		HAVING count(*) FILTER (WHERE b.raindrop_created_at >= now() - interval '30 days') >= 3
		   AND count(*) FILTER (WHERE b.raindrop_created_at <  now() - interval '30 days') <= 1
		ORDER BY n30 DESC
		LIMIT 3`);

	const rising = domains.map((d) => ({
		label: `${d.domain} — ${d.n30} new saves`,
		note: d.n270 === 0 ? 'first appearance in the corpus' : `only ${d.n270} in the 10 months before`
	}));

	if (items.length === 0 && rising.length === 0) return null;

	return {
		body: {
			headline: `The Pulse — what the saves say (${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`,
			standfirst: 'Market intelligence from a newsroom that happens to be a database — archetype drift first, then the domains nobody is talking about yet.',
			items: [...items, ...rising]
		},
		signals: {
			generator: 'pulse',
			movers,
			risingDomains: domains,
			note: 'repo obituaries deferred until repo-activity data is queryable in the DB'
		}
	};
}
