// The Drum — feed subsystem types.
// 11 item types from the converged spec (docs/specs/the-drum.md). Each draw
// produces one feed_items row whose jsonb body is self-contained (it snapshots
// the listing it points at, so a feed card never breaks when the mirror moves).

export type FeedType =
	| 'one-save'
	| 'target-user-pitch'
	| 'two-futures'
	| 'ambition-path'
	| 'pulse'
	| 'resurrections'
	| 'walk'
	| 'tombola'
	| 'floor'
	| 'impress-the-boss';

export interface FeedTypeDef {
	slug: FeedType;
	name: string;
	/** one-line angle the card carries (methodology page copy) */
	blurb: string;
	/** true once a generator exists — types without one are skipped by rotation */
	implemented: boolean;
}

export const FEED_TYPES: FeedTypeDef[] = [
	{ slug: 'one-save', name: 'One Save', blurb: 'one listing, one paragraph, one question to the reader', implemented: false },
	{ slug: 'target-user-pitch', name: 'Target-User Pitch', blurb: 'who this is for, in the voice of the people it helps', implemented: false },
	{ slug: 'two-futures', name: 'Two Futures', blurb: 'your Tuesday without it vs. with it', implemented: false },
	{ slug: 'ambition-path', name: 'Ambition Path', blurb: 'several listings chained into a route toward one ambition', implemented: false },
	{ slug: 'pulse', name: 'The Pulse', blurb: 'what the corpus says this month — drift, obituaries, rising domains', implemented: true },
	{ slug: 'resurrections', name: 'Resurrections', blurb: 'a save untouched for months gets a second life', implemented: true },
	{ slug: 'walk', name: 'The Walk', blurb: 'a trail of listings connected by embedding hops', implemented: false },
	{ slug: 'tombola', name: 'The Tombola', blurb: 'drawn from the last 10 saves, picked by corpus signals', implemented: true },
	{ slug: 'floor', name: 'The Floor', blurb: 'what searchers wanted and the corpus cannot describe yet — themes only', implemented: true },
	{ slug: 'impress-the-boss', name: 'Impress the Boss', blurb: 'the artifact a listing produces for the role that benefits', implemented: false }
];

export const FEED_TYPE_BY_SLUG = new Map(FEED_TYPES.map((t) => [t.slug, t]));

/** Fixed round-robin order (spec Q13-A); admin can reorder via feed_settings.type_order. */
export const DEFAULT_TYPE_ORDER: FeedType[] = [
	'pulse',
	'resurrections',
	'tombola',
	'floor',
	'one-save',
	'target-user-pitch',
	'two-futures',
	'ambition-path',
	'walk',
	'impress-the-boss'
];

export const DEFAULT_CADENCE_HOURS = 48;

/** Common base of every item body — jsonb in feed_items.body. */
export interface FeedItemBody {
	headline: string;
	/** one-paragraph intro under the headline */
	standfirst?: string;
	/** the listing this card is anchored to (snapshot — denormalized on purpose) */
	listing?: {
		id: number;
		title: string;
		url: string;
		domain: string | null;
		created?: string | null;
	};
	/** list-shaped bodies: Pulse movers, Walk trails, Path steps */
	items?: Array<{
		id?: number;
		label: string;
		note?: string;
		url?: string;
	}>;
	/** extra body copy paragraphs */
	paragraphs?: string[];
	/** reader question (One Save style) */
	question?: string;
}

export interface FeedItem {
	id: string;
	type: FeedType;
	listingId: number | null;
	body: FeedItemBody;
	status: 'draft' | 'published';
	requiresApproval: boolean;
	publishedAt: string | null;
	signals: Record<string, unknown>;
	createdAt: string;
}

/** What a generator returns — rotation turns it into a feed_items row. */
export interface GeneratorResult {
	listingId?: number;
	body: FeedItemBody;
	signals: Record<string, unknown>;
	/** default false → auto-publish (the approval gate is opt-in per item, spec Q12) */
	requiresApproval?: boolean;
}
