import { SKILL_MD } from '$lib/server/skill-doc';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () =>
	new Response(SKILL_MD, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
