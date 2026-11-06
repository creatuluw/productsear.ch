import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// /compendium/<slug> was renamed to /collections/<slug> (2026-11) — keep old links working.
export const load: PageServerLoad = ({ params, url }) => {
	redirect(308, `/collections/${params.slug}${url.search}`);
};
