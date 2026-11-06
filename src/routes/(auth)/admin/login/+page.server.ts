import { redirect } from '@sveltejs/kit';
import { auth, isAdminEmail } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

// Already signed in as an allowlisted admin? Straight to the console.
export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (session && isAdminEmail(session.user.email)) redirect(303, '/admin');
	return {};
};
