import type { Handle } from '@sveltejs/kit';
import { wantsRawMarkdown, llmMarkdown } from '$lib/server/llms';

// ?view=llm content negotiation: LLM/API clients (no Accept: text/html, raw=1,
// or an LLM/script user agent — see MARKDOWN_USER_AGENTS) get raw text/markdown
// straight from the server; browsers fall through to the page, which renders
// the same markdown styled.
//
// Also the site-wide visibility layer: X-Robots-Tag keeps private surfaces out
// of indexes (robots.txt prevents crawling but not indexing), and the HTTP
// Link header advertises llms.txt / sitemap / RSS to clients that never parse
// HTML (spec.website Agent Readiness).

// never index admin chrome, auth endpoints, or digest internals (narrower
// than /api wholesale so the /api/feed/og image endpoints stay unfurlable)
const PRIVATE_PREFIXES = ['/admin', '/api/auth', '/api/digest', '/digest'];

const LINK_DISCOVERY = [
	'</llms.txt>; rel="llms-txt"; type="text/markdown"',
	'</sitemap.xml>; rel="sitemap"; type="application/xml"',
	'</feed.xml>; rel="alternate"; type="application/rss+xml"; title="The Drum"'
].join(', ');

export const handle: Handle = async ({ event, resolve }) => {
	// never intercept SvelteKit's client-navigation data requests (event.url is
	// normalized to the route, so /?view=llm data fetches look like the page) —
	// they must return data JSON or the router throws a 500
	if (event.isDataRequest) return resolve(event);
	if (wantsRawMarkdown(event.url, event.request)) {
		const md = await llmMarkdown(event.url);
		if (md) return md;
	}
	const res = await resolve(event);
	if (PRIVATE_PREFIXES.some((p) => event.url.pathname.startsWith(p))) {
		res.headers.set('X-Robots-Tag', 'noindex, nofollow');
	}
	if ((res.headers.get('content-type') ?? '').includes('text/html')) {
		res.headers.append('Link', LINK_DISCOVERY);
	}
	return res;
};
