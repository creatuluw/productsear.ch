// The Drum's rotation brain: fixed round-robin over the type order (spec
// Q13-A), gated by the cadence clock (1 item / 2 days by default, admin-
// configurable, spec Q8). A generator returning null skips to the next type.

import { DEFAULT_TYPE_ORDER, type FeedItem, type FeedType } from './types';
import { getFeedSettings, insertFeedItem, lastDrawAt, totalDraws } from './queries';
import { sendApprovalRequest } from './approval';
import { GENERATORS } from './generators';

export interface DueInfo {
	due: boolean;
	/** the type the rotation would draw next (null when no order) */
	nextType: FeedType | null;
	lastDrawAt: string | null;
	/** ISO timestamp of when the next draw comes due (null when nothing drawn yet) */
	nextDrawAt: string | null;
	cadenceHours: number;
	typeOrder: FeedType[];
}

export async function nextDueInfo(): Promise<DueInfo> {
	const settings = await getFeedSettings();
	const order = settings.typeOrder.length > 0 ? settings.typeOrder : DEFAULT_TYPE_ORDER;
	const cadenceHours = settings.cadenceHours;
	const last = await lastDrawAt();
	const draws = await totalDraws();

	let nextDrawAt: string | null = null;
	let due = true;
	if (last) {
		const nextMs = new Date(last).getTime() + cadenceHours * 3_600_000;
		nextDrawAt = new Date(nextMs).toISOString();
		due = Date.now() >= nextMs;
	}

	return {
		due,
		nextType: order.length > 0 ? order[draws % order.length] : null,
		lastDrawAt: last,
		nextDrawAt,
		cadenceHours,
		typeOrder: order
	};
}

/**
 * Run the drum: when due (or forced), walk the round-robin from the cursor and
 * try each implemented generator until one produces a draw. Returns the new
 * feed item, or null when not due / nothing could be drawn.
 */
export async function drawNext(force = false): Promise<FeedItem | null> {
	const info = await nextDueInfo();
	if (!force && !info.due) return null;

	const draws = await totalDraws();
	for (let i = 0; i < info.typeOrder.length; i++) {
		const type = info.typeOrder[(draws + i) % info.typeOrder.length];
		const generate = GENERATORS[type];
		if (!generate) continue; // type not implemented yet — rotation skips it
		try {
			const draft = await generate();
			if (!draft) continue; // nothing to draw for this type right now
			// approval-by-email: every draw lands as a draft and is mailed to the
			// operator for approve / regenerate / skip before it publishes. A failed
			// send must never lose the item — it stays a draft for the admin console.
			const item = await insertFeedItem({ type, ...draft, requiresApproval: true });
			try {
				const mail = await sendApprovalRequest(item);
				console.log(`[feed] approval ${mail.sent ? 'sent' : 'NOT sent'}: ${mail.reason}`);
			} catch (e) {
				console.error('[feed] approval email failed — item stays draft:', e);
			}
			return item;
		} catch (e) {
			// a broken generator must never stall the drum — log and move on
			console.error(`[feed] generator ${type} failed:`, e);
		}
	}
	return null;
}
