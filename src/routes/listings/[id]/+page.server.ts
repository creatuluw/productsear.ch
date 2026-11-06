import { error } from '@sveltejs/kit';
import { getStack } from '$lib/server/feed/stack';
import { listingStackLlmView } from '$lib/server/llmview';
import { FEED_TYPE_BY_SLUG, type FeedType } from '$lib/server/feed/types';
import type { PageServerLoad } from './$types';

// Listing stack page — the depth surface of The Drum: one listing, its feed
// items ("on the drum"), and The Walk (embedding nearest neighbors).
// Type display names resolved server-side (+page.svelte must not import
// from $lib/server).
export const load: PageServerLoad = async ({ params, url }) => {
	const id = Number(params.id);
	if (!Number.isInteger(id) || id <= 0) error(404, 'listing not found');

	const stack = await getStack(id);
	if (!stack) error(404, 'listing not found');

	const items = stack.items.map((i) => ({
		...i,
		typeName: FEED_TYPE_BY_SLUG.get(i.type as FeedType)?.name ?? i.type
	}));

	if (url.searchParams.get('view') === 'llm') {
		return { ...stack, items, llm: listingStackLlmView(stack) };
	}
	return { ...stack, items, llm: null };
};
