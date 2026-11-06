import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// /compendium was renamed to /collections (2026-11) — keep old links working.
export const load: PageServerLoad = ({ url }) => {
	redirect(308, `/collections${url.search}`);
};
