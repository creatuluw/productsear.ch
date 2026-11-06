import { listPublished } from '$lib/server/feed/queries';
import { nextDueInfo } from '$lib/server/feed/rotation';
import { feedLlmView } from '$lib/server/llmview';
import { FEED_TYPE_BY_SLUG, type FeedType } from '$lib/server/feed/types';
import type { PageServerLoad } from './$types';

// The Drum — the corpus feed. Stream of published items, newest first, plus
// the rotation state (cadence, next draw, next type) for the drum header.
// Type display names are resolved server-side: +page.svelte must not import
// from $lib/server (SvelteKit blocks it in client code).
export const load: PageServerLoad = async ({ url }) => {
	const typeInfo = await nextDueInfo();
	const typeName = (t: FeedType) => FEED_TYPE_BY_SLUG.get(t)?.name ?? t;
	// identical shape in both branches — SvelteKit types PageData from the union
	// of load returns, so a diverging llm branch poisons item/due typing.
	const items = (await listPublished(50)).map((i) => ({ ...i, typeName: typeName(i.type) }));
	const due = { ...typeInfo, nextTypeName: typeInfo.nextType ? typeName(typeInfo.nextType) : null };

	if (url.searchParams.get('view') === 'llm') {
		return { items, due, llm: feedLlmView(items, typeInfo) };
	}
	return { items, due, llm: null };
};
