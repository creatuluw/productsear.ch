import { methodologyLlmView } from '$lib/server/llmview';
import type { PageServerLoad } from './$types';

// How this drum works — the trust surface of The Drum (spec Q10-B). A document,
// not a data surface: every view (human + raw) renders the same markdown.
export const load: PageServerLoad = async () => {
	return { md: methodologyLlmView() };
};
