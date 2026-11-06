import { getFeedSettings } from '$lib/server/feed/queries';
import type { LayoutServerLoad } from './$types';

// Feed feature flags for site-wide chrome (spec: feed subsystems arrive behind
// admin switches). The nav hides the feed link when nav_enabled is off.
export const load: LayoutServerLoad = async () => {
	const settings = await getFeedSettings();
	return {
		feedNav: settings.navEnabled,
		feedHomepageCards: settings.homepageCardsEnabled
	};
};
