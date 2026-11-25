// The Pulse — the monthly data section: what the saves said last month.
// Published once per calendar month, leading the first draw of the month
// (the rotation's month-opener preference), covering the previous calendar
// month: archetype drift + rising domains. Repo obituaries (spec) are
// deferred until repo-activity data lands in the DB — the repo-scan split
// lives in gitignored CSVs, so CI generators cannot read it (backlog item).

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { ARCHETYPE_BY_SLUG } from '../../../archetypes';
import type { GeneratorResult } from '../types';

/** The Pulse opens the month: it may draw only during the first week, and
 * only once per calendar month (demoted from the round-robin's ~10-day slot
 * to monthly, 2026-11-25). The rotation leads with it while eligible; once
 * the month has its Pulse — or the window passed — it returns null and the
 * rotation falls through, per catch-and-skip semantics. */
export const PULSE_WINDOW_DAYS = 7;

export interface PulseCalendar {
	/** `YYYY-MM` of today in the editorial clock (Europe/Amsterdam) */
	ym: string;
	/** day of month in the editorial clock */
	day: number;
	/** first instant of the covered (previous) month */
	coveredStart: Date;
	/** first instant of the current month */
	coveredEnd: Date;
	/** first instant of the month three months before the covered month */
	baseStart: Date;
	/** first instant of the month ten months before the covered month */
	longStart: Date;
	/** e.g. "November 2026" — the month this edition covers */
	coveredLabel: string;
	/** number of days in the covered month (28–31), the drift denominator */
	coveredDays: number;
}

/** Calendar facts for today in the site's editorial clock. The scheduled
 * draw lands at 06:00 Amsterdam, but a manual draw-now can happen any hour —
 * so month boundaries are derived in Amsterdam time, not UTC. */
export function pulseCalendar(now = new Date()): PulseCalendar {
	const [y, m, d] = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Amsterdam',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	})
		.format(now)
		.split('-')
		.map(Number);
	// JS months are 0-based: UTC(y, m-2, 1) is the covered month's first day
	const coveredStart = new Date(Date.UTC(y, m - 2, 1));
	const coveredEnd = new Date(Date.UTC(y, m - 1, 1));
	return {
		ym: `${y}-${String(m).padStart(2, '0')}`,
		day: d,
		coveredStart,
		coveredEnd,
		baseStart: new Date(Date.UTC(y, m - 5, 1)),
		longStart: new Date(Date.UTC(y, m - 12, 1)),
		coveredLabel: coveredStart.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC'
		}),
		coveredDays: Math.round((coveredEnd.getTime() - coveredStart.getTime()) / 86_400_000)
	};
}

/** `YYYY-MM` (Amsterdam) of the most recently published Pulse, or null. */
async function lastPublishedPulseMonth(): Promise<string | null> {
	const rows = await db.execute<{ t: string | null }>(
		sql`SELECT max(published_at)::text AS t FROM te9_dev.feed_items WHERE type = 'pulse' AND status = 'published'`
	);
	const t = rows[0]?.t;
	if (!t) return null;
	const [y, m] = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Amsterdam',
		year: 'numeric',
		month: '2-digit'
	})
		.format(new Date(t))
		.split('-')
		.map(Number);
	return `${y}-${String(m).padStart(2, '0')}`;
}

/** The covered-month label carried by the most recently published Pulse, or
 * null — editions drawn before the monthly rule carry no label, and a missing
 * label must never silently block the monthly rhythm. */
async function lastPublishedPulseCoveredLabel(): Promise<string | null> {
	const rows = await db.execute<{ month: string | null }>(
		sql`SELECT signals->>'month' AS month FROM te9_dev.feed_items
			WHERE type = 'pulse' AND status = 'published'
			ORDER BY published_at DESC NULLS LAST, created_at DESC
			LIMIT 1`
	);
	return rows[0]?.month ?? null;
}

/** True when the next drum draw should open with The Pulse: we are inside
 * the first-week window of a month that has not published its Pulse yet,
 * and the month about to be covered has not had its edition already. */
export async function pulseEligible(cal = pulseCalendar()): Promise<boolean> {
	if (cal.day > PULSE_WINDOW_DAYS) return false;
	if ((await lastPublishedPulseMonth()) === cal.ym) return false; // once per calendar month
	return (await lastPublishedPulseCoveredLabel()) !== cal.coveredLabel; // never re-cover a month
}

interface Mover {
	label: string;
	note: string;
}

/** Compose the monthly edition — queries + copy, no eligibility gate.
 * Exported so verification can exercise the covered-month windows without
 * waiting for the first-week window. */
export async function buildPulseEdition(cal = pulseCalendar()): Promise<GeneratorResult | null> {
	const at = (d: Date) => d.toISOString();

	// archetype drift: the covered month vs the three months before it
	const drift = await db.execute<{ archetype: string; n_cur: number; n_base: number }>(sql`
		SELECT t.archetype,
		       count(*) FILTER (WHERE b.raindrop_created_at >= ${at(cal.coveredStart)}::timestamptz
		                        AND b.raindrop_created_at <  ${at(cal.coveredEnd)}::timestamptz)::int AS n_cur,
		       count(*) FILTER (WHERE b.raindrop_created_at >= ${at(cal.baseStart)}::timestamptz
		                        AND b.raindrop_created_at <  ${at(cal.coveredStart)}::timestamptz)::int AS n_base
		FROM te9_dev.bookmarks b
		JOIN te9_dev.bookmark_archetypes x ON x.bookmark_id = b.id,
		     jsonb_array_elements_text(x.archetypes) AS t(archetype)
		WHERE b.raindrop_created_at >= ${at(cal.baseStart)}::timestamptz
		GROUP BY t.archetype`);

	// normalize per archetype against its own three-month baseline, then rank
	const baseDays = Math.round((cal.coveredStart.getTime() - cal.baseStart.getTime()) / 86_400_000);
	const movers = drift
		.map((d) => {
			const curRate = d.n_cur / cal.coveredDays;
			const baseRate = d.n_base / baseDays;
			const lift = baseRate > 0 ? curRate / baseRate : curRate > 0 ? 9.99 : 0;
			return { slug: d.archetype, nCur: d.n_cur, nBase: d.n_base, lift };
		})
		.filter((d) => d.nCur >= 2 && d.lift >= 1.3)
		.sort((a, b) => b.lift - a.lift)
		.slice(0, 3);

	const items: Mover[] = movers.map((m) => ({
		label: `${ARCHETYPE_BY_SLUG.get(m.slug)?.name ?? m.slug} — up ${Math.round((m.lift - 1) * 100)}%`,
		note: `${m.nCur} saves in ${cal.coveredLabel} vs ${m.nBase} in the three months before`
	}));

	// rising domains: busy in the covered month, quiet in the ten months before it
	const domains = await db.execute<{ domain: string; n_cur: number; n_before: number }>(sql`
		SELECT b.domain,
		       count(*) FILTER (WHERE b.raindrop_created_at >= ${at(cal.coveredStart)}::timestamptz
		                        AND b.raindrop_created_at <  ${at(cal.coveredEnd)}::timestamptz)::int AS n_cur,
		       count(*) FILTER (WHERE b.raindrop_created_at >= ${at(cal.longStart)}::timestamptz
		                        AND b.raindrop_created_at <  ${at(cal.coveredStart)}::timestamptz)::int AS n_before
		FROM te9_dev.bookmarks b
		WHERE b.domain IS NOT NULL AND b.raindrop_created_at >= ${at(cal.longStart)}::timestamptz
		GROUP BY b.domain
		HAVING count(*) FILTER (WHERE b.raindrop_created_at >= ${at(cal.coveredStart)}::timestamptz
		                        AND b.raindrop_created_at <  ${at(cal.coveredEnd)}::timestamptz) >= 3
		   AND count(*) FILTER (WHERE b.raindrop_created_at >= ${at(cal.longStart)}::timestamptz
		                        AND b.raindrop_created_at <  ${at(cal.coveredStart)}::timestamptz) <= 1
		ORDER BY n_cur DESC
		LIMIT 3`);

	const rising = domains.map((d) => ({
		label: `${d.domain} — ${d.n_cur} new saves`,
		note: d.n_before === 0 ? 'first appearance in the corpus' : `only ${d.n_before} in the 10 months before`
	}));

	if (items.length === 0 && rising.length === 0) return null;

	return {
		body: {
			headline: `The Pulse — what the saves say (${cal.coveredLabel})`,
			standfirst: `Market intelligence from a newsroom that happens to be a database — ${cal.coveredLabel}'s archetype drift first, then the domains nobody is talking about yet. Once a month, at the top of the month.`,
			items: [...items, ...rising]
		},
		signals: {
			generator: 'pulse',
			month: cal.coveredLabel,
			movers,
			risingDomains: domains,
			note: 'monthly edition — opens each month covering the previous; repo obituaries deferred until repo-activity data is queryable in the DB'
		}
	};
}

export async function generatePulse(): Promise<GeneratorResult | null> {
	// monthly cadence — outside the opening window, or the month already has
	// its Pulse? hand the slot to the next type
	if (!(await pulseEligible())) return null;
	return buildPulseEdition();
}
