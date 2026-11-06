import type { Handle } from '@sveltejs/kit';
import { wantsRawMarkdown, llmMarkdown } from '$lib/server/llms';

// ?view=llm content negotiation: LLM/API clients (no Accept: text/html, raw=1,
// or an LLM/script user agent — see MARKDOWN_USER_AGENTS) get raw text/markdown
// straight from the server; browsers fall through to the page, which renders
// the same markdown styled.
export const handle: Handle = async ({ event, resolve }) => {
	// never intercept SvelteKit's client-navigation data requests (event.url is
	// normalized to the route, so /?view=llm data fetches look like the page) —
	// they must return data JSON or the router throws a 500
	if (event.isDataRequest) return resolve(event);
	if (wantsRawMarkdown(event.url, event.request)) {
		const md = await llmMarkdown(event.url);
		if (md) return md;
	}
	return resolve(event);
};
