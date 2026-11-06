// Impress the Boss — the artifact a listing produces for the job role that
// benefits. Origin-tagged honestly (spec Q11-D): v1 artifacts are DESCRIBED
// from the analysis, not captured — real captures are a later upgrade.

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { usedListingIds } from '../queries';
import { draftJson } from '../llm';
import type { GeneratorResult } from '../types';

interface Draft {
	role: string;
	artifact: string;
	description: string;
}

const SYSTEM = `You write for "the drum", a curated magazine of saved tools and resources.
Write an "Impress the Boss" card: name the job role that benefits, the concrete
artifact/deliverable this tool lets them produce (a thing their boss can look at),
and a 1-2 sentence description of producing it.
Voice: concrete, workplace-real. No hype words.
Respond ONLY with a JSON object: {"role": "...", "artifact": "...", "description": "..."}`;

export async function generateImpressTheBoss(): Promise<GeneratorResult | null> {
	const used = await usedListingIds();

	const rows = await db.execute<{
		id: number;
		title: string;
		url: string;
		domain: string | null;
		purpose: string | null;
		how_to_use: string | null;
	}>(sql`
		SELECT b.id, b.title, b.url, b.domain, a.purpose, a.how_to_use
		FROM te9_dev.bookmarks b
		JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
		WHERE a.purpose IS NOT NULL AND a.purpose <> ''
		  AND NOT EXISTS (SELECT 1 FROM te9_dev.feed_items f WHERE f.listing_id = b.id)
		ORDER BY random()
		LIMIT 6`);
	if (rows.length === 0) return null;

	const pick = rows[0];
	const { data, provider } = await draftJson<Draft>(
		SYSTEM,
		`Tool: ${pick.title} — ${pick.url}\nWhat it does: ${pick.purpose}\nHow to use: ${pick.how_to_use ?? '—'}`
	);
	if (!data.artifact?.trim() || !data.description?.trim()) throw new Error('impress-the-boss: empty artifact');

	return {
		listingId: pick.id,
		body: {
			headline: pick.title,
			standfirst: `The deliverable: ${data.artifact.trim()}`,
			listing: { id: pick.id, title: pick.title, url: pick.url, domain: pick.domain },
			paragraphs: [data.description.trim()],
			question: `For ${data.role?.trim() || 'the right role'} — worth a demo?`
		},
		signals: {
			generator: 'impress-the-boss',
			provider,
			role: data.role,
			artifact: data.artifact,
			artifactOrigin: 'described-from-analysis' // honest origin tag (spec Q11-D); real captures later
		}
	};
}
