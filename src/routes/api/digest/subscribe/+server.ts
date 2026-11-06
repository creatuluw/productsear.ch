import { json } from '@sveltejs/kit';
import { addSubscriber, isValidEmail } from '$lib/server/feed/digest';
import type { RequestHandler } from './$types';

// Digest opt-in. Public (no auth) — it's a subscribe endpoint. Resubscribing
// after an unsubscribe clears the flag and rotates the token.
export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json().catch(() => ({}))) as { email?: string };
	const email = String(body.email ?? '').trim();
	if (!isValidEmail(email)) {
		return json({ error: 'that does not look like an email address' }, { status: 400 });
	}
	await addSubscriber(email);
	return json({ ok: true });
};
