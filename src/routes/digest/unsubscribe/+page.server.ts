import { removeSubscriber } from '$lib/server/feed/digest';
import type { PageServerLoad } from './$types';

// Unsubscribe lands here from the one-click link in every digest email.
// GET-with-side-effect is the email-standard unsubscribe pattern.
export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token') ?? '';
	const removed = token ? await removeSubscriber(token) : null;
	return { removed: removed !== null };
};
