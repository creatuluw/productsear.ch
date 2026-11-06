import { betterAuth } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { authSchema } from './db/auth-schema';

/**
 * better-auth instance backing /admin (email + password).
 *
 * Admin gate: `ADMIN_EMAILS` (comma-separated allowlist). Sign-up is rejected
 * server-side for any other address, so the public site has no open
 * registration surface — only allowlisted emails can create an account.
 */

export const adminEmails = (process.env.ADMIN_EMAILS ?? '')
	.split(',')
	.map((e) => e.trim().toLowerCase())
	.filter(Boolean);

export const isAdminEmail = (email: string) =>
	adminEmails.includes(email.trim().toLowerCase());

const extraOrigins = (process.env.TRUSTED_ORIGINS ?? '')
	.split(',')
	.map((o) => o.trim())
	.filter(Boolean);

export const auth = betterAuth({
	appName: 'productsear.ch',
	database: drizzleAdapter(db, { provider: 'pg', schema: authSchema }),
	emailAndPassword: { enabled: true },
	// production origin + any extra origins (proxies, preview domains);
	// local ports are allowed outside production so dev previews work
	trustedOrigins: [
		'https://productsear.ch',
		...(process.env.NODE_ENV === 'production'
			? []
			: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173']),
		...extraOrigins
	],
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path === '/sign-up/email') {
				const email = String((ctx.body as { email?: string } | undefined)?.email ?? '');
				if (!isAdminEmail(email)) {
					throw new APIError('FORBIDDEN', {
						message: 'Sign-up is restricted to platform admins (ADMIN_EMAILS allowlist).'
					});
				}
			}
		})
	}
});

export type Session = typeof auth.$Infer.Session;
