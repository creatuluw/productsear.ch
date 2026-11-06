import { json } from '@sveltejs/kit';
import { auth, isAdminEmail } from '$lib/server/auth';
import { drawNext } from '$lib/server/feed/rotation';
import { FEED_TYPE_BY_SLUG } from '$lib/server/feed/types';
import type { RequestHandler } from './$types';

// POST /api/feed/draw         — run the drum (only when due)
// POST /api/feed/draw?force=1 — draw regardless of the cadence clock
// Admin-allowlist gated (same gate as the admin console actions).
export const POST: RequestHandler = async ({ request, url }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session || !isAdminEmail(session.user.email)) {
		return json({ error: 'admin only' }, { status: 403 });
	}

	const force = url.searchParams.get('force') === '1';
	const item = await drawNext(force);
	if (!item) {
		return json({ drawn: null, reason: force ? 'all generators came up empty' : 'not due' });
	}
	return json({
		drawn: {
			id: item.id,
			type: item.type,
			typeName: FEED_TYPE_BY_SLUG.get(item.type)?.name ?? item.type,
			status: item.status,
			listingId: item.listingId,
			headline: item.body.headline
		}
	});
};
