// Target-User Pitch — the analysis metadata knows what a listing does; the LLM
// infers who it is FOR and pitches it in their voice (spec Q2-A: synthetic
// persona voices). Machine-drafted, no human wrote the first version — the
// trust convention lives in the type tag + methodology page, not a stamp.

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { usedListingIds } from '../queries';
import { draftJson } from '../llm';
import type { GeneratorResult } from '../types';

interface Draft {
	targetUser: string;
	pitch: string;
}

const SYSTEM = `You write for "the drum", a curated magazine of saved tools and resources.
Write a "Target-User Pitch": identify the specific person this listing is for
(e.g. "the freelance designer drowning in revision rounds"), then pitch the
listing directly to them in second person.
The pitch: max 60 words, concrete about their pain and what changes for them.
Voice: plain-spoken, specific, no hype words (game-changer, revolutionize, powerful).
Respond ONLY with a JSON object: {"targetUser": "...", "pitch": "..."}`;

export async function generatePitch(): Promise<GeneratorResult | null> {
	const used = await usedListingIds();

	const rows = await db.execute<{
		id: number;
		title: string;
		url: string;
		domain: string | null;
		purpose: string | null;
		category: string | null;
		archetypes: unknown;
	}>(sql`
		SELECT b.id, b.title, b.url, b.domain, a.purpose, a.category,
		       COALESCE(x.archetypes, '[]'::jsonb) AS archetypes
		FROM te9_dev.bookmarks b
		JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
		LEFT JOIN te9_dev.bookmark_archetypes x ON x.bookmark_id = b.id
		WHERE a.purpose IS NOT NULL AND a.purpose <> ''
		  AND NOT EXISTS (SELECT 1 FROM te9_dev.feed_items f WHERE f.listing_id = b.id)
		ORDER BY random()
		LIMIT 6`);
	if (rows.length === 0) return null;

	const pick = rows[0];
	const { data, provider } = await draftJson<Draft>(
		SYSTEM,
		`Title: ${pick.title}\nURL: ${pick.url}\nWhat it does: ${pick.purpose}\nCategory: ${pick.category ?? '—'}\nArchetypes: ${((pick.archetypes as string[]) ?? []).join(', ') || '—'}`
	);
	if (!data.pitch?.trim()) throw new Error('pitch: empty pitch');

	return {
		listingId: pick.id,
		body: {
			headline: pick.title,
			standfirst: data.pitch.trim(),
			listing: { id: pick.id, title: pick.title, url: pick.url, domain: pick.domain },
			paragraphs: [`For: ${data.targetUser?.trim() || 'the person who needs this'}.`]
		},
		signals: {
			generator: 'target-user-pitch',
			provider,
			targetUser: data.targetUser,
			voiceOrigin: 'synthetic persona — drafted from corpus analysis, not a human testimonial'
		}
	};
}
