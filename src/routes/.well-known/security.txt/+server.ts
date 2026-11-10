import type { RequestHandler } from './$types';

// /.well-known/security.txt (RFC 9116) — how to report security issues.
// NOTE: the Contact address below is a convention-based placeholder; point it
// at a mailbox that is actually read before relying on it.
const CONTACT = 'mailto:security@productsear.ch';
const EXPIRES = '2027-12-31T23:59:00.000Z'; // re-arm annually

export const GET: RequestHandler = async () => {
	const body = `Contact: ${CONTACT}
Expires: ${EXPIRES}
Canonical: https://productsear.ch/.well-known/security.txt
Preferred-Languages: en
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
