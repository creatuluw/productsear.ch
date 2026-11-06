import { redirect } from '@sveltejs/kit';
import { auth, isAdminEmail } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

// Guard for every /admin/* page load (login lives outside this group, in
// (auth)/admin/login, so it can't loop). Form actions additionally guard
// themselves via requireAdmin() — they can be POSTed without a load.
export const load: LayoutServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) redirect(303, '/admin/login');
	if (!isAdminEmail(session.user.email)) {
		return { user: null, denied: true };
	}
	return {
		user: { name: session.user.name, email: session.user.email },
		denied: false
	};
};
