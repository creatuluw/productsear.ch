import { homeCardSvg, ogResponse, renderOgPng } from '$lib/server/og';
import type { RequestHandler } from './$types';

// Homepage OG card — what shares of the root URL unfurl. Static copy, no DB
// hit; long cache (bump the ?v=N cache-bust on the og:image URL in the page
// head when the copy changes — Bluesky caches cards per share URL).
export const GET: RequestHandler = async () => {
	return ogResponse(renderOgPng(homeCardSvg()), 86400);
};
