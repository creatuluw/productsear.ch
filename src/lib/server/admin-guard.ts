import { fail, redirect } from '@sveltejs/kit';
import { auth, isAdminEmail } from './auth';
import type { Session } from './auth';

/**
 * Guard for /admin form actions: requires a valid better-auth session whose
 * email is on the ADMIN_EMAILS allowlist. (Page *loads* are guarded by the
 * (admin)/admin/+layout.server.ts; actions must guard themselves because they
 * run before loads and can be POSTed directly.)
 */
export async function requireAdmin(headers: Headers): Promise<Session> {
	const session = await auth.api.getSession({ headers });
	if (!session) redirect(303, '/admin/login');
	if (!isAdminEmail(session.user.email)) {
		fail(403, { message: 'Admin access denied — your email is not on the ADMIN_EMAILS allowlist.' });
	}
	return session;
}
