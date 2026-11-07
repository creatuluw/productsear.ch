import { drumCardSvg, ogResponse, renderOgPng } from '$lib/server/og';
import type { RequestHandler } from './$types';

// The drum's own OG card — corpus-readout feed items share the /feed URL
// (they have no listing to anchor to), so Bluesky unfurls need a designed
// image for that page too. Static copy, no DB hit; long cache.
export const GET: RequestHandler = async () => {
	return ogResponse(renderOgPng(drumCardSvg()), 86400);
};
