import { fail } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/admin-guard';
import {
	deleteItem,
	getFeedSettings,
	listAllItems,
	patchItemBody,
	setItemApproval,
	setItemStatus,
	updateFeedSettings
} from '$lib/server/feed/queries';
import { drawNext, nextDueInfo } from '$lib/server/feed/rotation';
import { getDigestState, sendDigest, subscriberCount } from '$lib/server/feed/digest';
import { DEFAULT_TYPE_ORDER, FEED_TYPES, FEED_TYPE_BY_SLUG, type FeedItemBody, type FeedType } from '$lib/server/feed/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const rows = await listAllItems(200);
	const settings = await getFeedSettings();
	const due = await nextDueInfo();
	const digest = await getDigestState();
	// display names resolved here — admin svelte must not import $lib/server
	const items = rows.map((i) => ({ ...i, typeName: FEED_TYPE_BY_SLUG.get(i.type)?.name ?? i.type }));
	return { items, settings, due, digest, types: FEED_TYPES, defaultOrder: DEFAULT_TYPE_ORDER };
};

export const actions: Actions = {
	/** Inline editor save — patches the editable body fields, untouched keys survive. */
	save: async ({ request }) => {
		await requireAdmin(request.headers);
		const fd = await request.formData();
		const id = String(fd.get('id') ?? '');
		if (!id) return fail(400, { error: 'missing id' });
		const patch: Partial<FeedItemBody> = {
			headline: String(fd.get('headline') ?? '').trim(),
			standfirst: String(fd.get('standfirst') ?? '').trim(),
			question: String(fd.get('question') ?? '').trim() || undefined,
			// textarea: paragraphs separated by blank lines
			paragraphs: String(fd.get('paragraphs') ?? '')
				.split(/\n{2,}/)
				.map((p) => p.trim())
				.filter(Boolean)
		};
		if (!patch.headline) return fail(400, { error: 'headline is required' });
		await patchItemBody(id, patch);
		return { ok: true, saved: id };
	},

	/** The per-item approval dial (spec Q12). */
	toggleApproval: async ({ request }) => {
		await requireAdmin(request.headers);
		const fd = await request.formData();
		const id = String(fd.get('id') ?? '');
		const requiresApproval = String(fd.get('requires_approval') ?? '') === '1';
		if (!id) return fail(400, { error: 'missing id' });
		await setItemApproval(id, requiresApproval);
		return { ok: true };
	},

	publish: async ({ request }) => {
		await requireAdmin(request.headers);
		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'missing id' });
		await setItemStatus(id, 'published');
		return { ok: true };
	},

	retract: async ({ request }) => {
		await requireAdmin(request.headers);
		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'missing id' });
		await setItemStatus(id, 'draft');
		return { ok: true };
	},

	delete: async ({ request }) => {
		await requireAdmin(request.headers);
		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'missing id' });
		await deleteItem(id);
		return { ok: true };
	},

	/** Run the drum right now (bypasses the cadence clock). */
	drawNow: async ({ request }) => {
		await requireAdmin(request.headers);
		const item = await drawNext(true);
		if (!item) return fail(400, { error: 'Nothing to draw — every generator came up empty.' });
		return { ok: true, drawn: `${item.type}: ${item.body.headline}` };
	},

	/** Send the digest right now — real emails to real subscribers, admin-explicit. */
	sendDigestNow: async ({ request }) => {
		await requireAdmin(request.headers);
		const result = await sendDigest({ force: true });
		if (!result.sent) return fail(400, { error: `Digest not sent — ${result.reason}` });
		return { ok: true, digestSent: `${result.subject} — ${result.reason}` };
	},

	/** Cadence + digest toggle + round-robin order (slug per line, validated). */
	settings: async ({ request }) => {
		await requireAdmin(request.headers);
		const fd = await request.formData();
		const cadenceHours = Number(fd.get('cadence_hours') ?? 48);
		if (!Number.isInteger(cadenceHours) || cadenceHours < 1 || cadenceHours > 24 * 30) {
			return fail(400, { error: 'cadence must be an integer between 1 and 720 hours' });
		}
		const digestEnabled = String(fd.get('digest_enabled') ?? '') === 'on';
		const navEnabled = String(fd.get('nav_enabled') ?? '') === 'on';
		const homepageCardsEnabled = String(fd.get('homepage_cards_enabled') ?? '') === 'on';
		const validSlugs = new Set(FEED_TYPES.map((t) => t.slug as string));
		const requested = String(fd.get('type_order') ?? '')
			.split(/[\n,]+/)
			.map((s) => s.trim())
			.filter(Boolean) as FeedType[];
		const unknown = requested.filter((s) => !validSlugs.has(s));
		if (unknown.length > 0) return fail(400, { error: `unknown type slug(s): ${unknown.join(', ')}` });
		const seen = new Set<string>();
		const typeOrder = requested.filter((s) => (seen.has(s) ? false : (seen.add(s), true)));
		await updateFeedSettings({
			cadenceHours,
			digestEnabled,
			typeOrder: typeOrder.length > 0 ? typeOrder : undefined,
			navEnabled,
			homepageCardsEnabled
		});
		return { ok: true, settingsSaved: true };
	}
};
