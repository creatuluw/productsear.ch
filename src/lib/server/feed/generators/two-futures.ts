// Two Futures — a two-column micro-story: your Tuesday without the listing
// vs. your Tuesday with it. Concrete scenes, present tense — the emotional
// register of the drum (spec: real-life before/after).

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { usedListingIds } from '../queries';
import { draftJson } from '../llm';
import type { GeneratorResult } from '../types';

interface Draft {
	without: string;
	with: string;
}

const SYSTEM = `You write for "the drum", a curated magazine of saved tools and resources.
Write a "Two Futures" card: two concrete micro-scenes of the same ordinary day
(a Tuesday), present tense, second person — WITHOUT the tool, then WITH it.
Each scene: max 40 words, specific and physical (what happens on the screen,
in the workflow, in the person's mood). No hype words.
Respond ONLY with a JSON object: {"without": "...", "with": "..."}`;

export async function generateTwoFutures(): Promise<GeneratorResult | null> {
	const used = await usedListingIds();

	const rows = await db.execute<{
		id: number;
		title: string;
		url: string;
		domain: string | null;
		purpose: string | null;
		how_to_use: string | null;
		when_to_use: string | null;
	}>(sql`
		SELECT b.id, b.title, b.url, b.domain, a.purpose, a.how_to_use, a.when_to_use
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
		`Tool: ${pick.title} — ${pick.url}\nWhat it does: ${pick.purpose}\nHow to use: ${pick.how_to_use ?? '—'}\nWhen to use: ${pick.when_to_use ?? '—'}`
	);
	if (!data.without?.trim() || !data.with?.trim()) throw new Error('two-futures: empty scenes');

	return {
		listingId: pick.id,
		body: {
			headline: pick.title,
			standfirst: 'Same Tuesday. Two futures.',
			listing: { id: pick.id, title: pick.title, url: pick.url, domain: pick.domain },
			items: [
				{ label: 'Without it', note: data.without.trim() },
				{ label: 'With it', note: data.with.trim() }
			]
		},
		signals: { generator: 'two-futures', provider }
	};
}
