// One Save — the daily habit anchor: one listing, one short paragraph on why
// it was worth saving, one question to the reader. The LLM writes the voice;
// the corpus supplies the facts (title, purpose, how/when analysis).

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { usedListingIds } from '../queries';
import { draftJson } from '../llm';
import type { GeneratorResult } from '../types';

interface Draft {
	standfirst: string;
	question: string;
}

const SYSTEM = `You write for "the drum", a curated magazine of saved tools and resources.
Write the daily "One Save" card: a single short paragraph (max 45 words) on why this
just-saved listing deserves attention, plus one short question for the reader that
invites them to imagine using it.
Voice: warm, precise, a little wry. No hype words (game-changer, revolutionize, powerful).
Respond ONLY with a JSON object: {"standfirst": "...", "question": "..."}`;

export async function generateOneSave(): Promise<GeneratorResult | null> {
	const used = await usedListingIds();

	const rows = await db.execute<{
		id: number;
		title: string;
		url: string;
		domain: string | null;
		created: string | null;
		purpose: string | null;
		how_to_use: string | null;
		when_to_use: string | null;
		archetypes: unknown;
	}>(sql`
		SELECT b.id, b.title, b.url, b.domain, b.raindrop_created_at::text AS created,
		       a.purpose, a.how_to_use, a.when_to_use,
		       COALESCE(x.archetypes, '[]'::jsonb) AS archetypes
		FROM te9_dev.bookmarks b
		JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
		LEFT JOIN te9_dev.bookmark_archetypes x ON x.bookmark_id = b.id
		WHERE a.purpose IS NOT NULL AND a.purpose <> ''
		  AND NOT EXISTS (SELECT 1 FROM te9_dev.feed_items f WHERE f.listing_id = b.id)
		ORDER BY b.raindrop_created_at DESC NULLS LAST
		LIMIT 5`);
	if (rows.length === 0) return null;

	const pick = rows.find((r) => !used.has(r.id)) ?? rows[0];

	const { data, provider } = await draftJson<Draft>(
		SYSTEM,
		`Title: ${pick.title}\nURL: ${pick.url}\nWhat it does: ${pick.purpose}\nHow to use: ${pick.how_to_use ?? '—'}\nWhen to use: ${pick.when_to_use ?? '—'}\nSaved: ${pick.created?.slice(0, 10) ?? 'recently'}`
	);
	if (!data.standfirst?.trim()) throw new Error('one-save: empty standfirst');

	return {
		listingId: pick.id,
		body: {
			headline: pick.title,
			standfirst: data.standfirst.trim(),
			listing: { id: pick.id, title: pick.title, url: pick.url, domain: pick.domain, created: pick.created },
			question: data.question?.trim() || 'What would you do with 30 minutes and this?'
		},
		signals: { generator: 'one-save', provider, archetypes: (pick.archetypes as string[]) ?? [] }
	};
}
