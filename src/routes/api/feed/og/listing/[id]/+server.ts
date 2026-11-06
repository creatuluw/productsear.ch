import { sql } from 'drizzle-orm';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { db } from '$lib/server/db';
import { Resvg } from '@resvg/resvg-js';
import type { RequestHandler } from './$types';

// Receipt card (spec slice D): a 1200×630 PNG that carries the argument, not
// just the title — type tag + headline + standfirst + the listing it is
// anchored to. Hand-built SVG rendered by resvg (no JSX, no wasm shenanigans).
// Colors are the site's light-theme identity as hex: this is an image asset,
// not app CSS — the semantic-token rule doesn't reach into SVG.
const CANVAS = '#F9FBFA';
const INK = '#262B27';
const INK_SOFT = '#6E7A72';
const INK_FAINT = '#9AA5A0';
const ACCENT = '#0021FF';
const HAIRLINE = '#262B2719'; // ink/10

const W = 1200;
const H = 630;

function esc(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function hostOf(url: string): string {
	try {
		return new URL(url).host;
	} catch {
		return url;
	}
}

/** naive width-based word wrap (Hanken Grotesk averages ~0.52em per char) */
function wrap(text: string, size: number, maxWidth: number, maxLines: number): string[] {
	if (!text) return [];
	const maxChars = Math.floor(maxWidth / (size * 0.52));
	const words = text.trim().split(/\s+/);
	const lines: string[] = [];
	let cur = '';
	for (const w of words) {
		const cand = cur ? `${cur} ${w}` : w;
		if (cand.length > maxChars && cur) {
			lines.push(cur);
			cur = w;
			if (lines.length === maxLines) break;
		} else {
			cur = cand;
		}
	}
	if (lines.length < maxLines && cur) lines.push(cur);
	// leftover words? mark truncation on the last line
	if (lines.length > 0 && lines.join(' ').length < text.trim().length) {
		lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*\S*$/, '').trimEnd() + ' …';
	}
	return lines.slice(0, maxLines);
}

interface CardData {
	typeName: string;
	headline: string;
	standfirst: string | null;
	domain: string | null;
	listingUrl: string;
}

function cardSvg(d: CardData): string {
	const inner = W - 72 - 40;
	const headlineLines = wrap(d.headline, 52, inner, 3).map(esc);
	const standfirstLines = d.standfirst ? wrap(d.standfirst, 24, inner, 2).map(esc) : [];

	const headY = 300;
	const headlineTspans = headlineLines
		.map((l, i) => `<tspan x="112" dy="${i === 0 ? 0 : 64}">${l}</tspan>`)
		.join('');
	const standfirstTspans = standfirstLines
		.map((l, i) => `<tspan x="112" dy="${i === 0 ? 0 : 34}">${l}</tspan>`)
		.join('');

	const chipWidth = Math.min(d.typeName.length * 11 + 40, 420);

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
	<rect width="${W}" height="${H}" fill="${CANVAS}"/>
	<rect x="0" y="0" width="8" height="${H}" fill="${ACCENT}"/>
	<rect x="72" y="64" width="${chipWidth}" height="40" rx="20" fill="none" stroke="${HAIRLINE}"/>
	<text x="92" y="90" font-family="Hanken Grotesk" font-weight="600" font-size="17" letter-spacing="1.5" fill="${INK_SOFT}">${esc(d.typeName.toUpperCase())}</text>
	<text x="112" y="${headY}" font-family="Hanken Grotesk" font-weight="600" font-size="52" fill="${INK}">${headlineTspans}</text>
	${standfirstLines.length > 0 ? `<text x="112" y="${headY + 74}" font-family="Hanken Grotesk" font-weight="400" font-size="24" fill="${INK_SOFT}">${standfirstTspans}</text>` : ''}
	<line x1="72" y1="${H - 110}" x2="${W - 72}" y2="${H - 110}" stroke="${HAIRLINE}"/>
	<text x="72" y="${H - 62}" font-family="Hanken Grotesk" font-weight="400" font-size="22" fill="${INK_FAINT}">${esc(d.domain ?? hostOf(d.listingUrl))}</text>
	<text x="${W - 72}" y="${H - 62}" text-anchor="end" font-family="Hanken Grotesk" font-weight="600" font-size="22" fill="${ACCENT}">productsear.ch · the drum</text>
</svg>`;
}

export const GET: RequestHandler = async ({ params }) => {
	const listingId = Number(params.id);
	if (!Number.isInteger(listingId) || listingId <= 0) {
		return new Response('bad listing id', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
	}

	const rows = await db.execute<{
		type: string;
		headline: string;
		standfirst: string | null;
		domain: string | null;
		listing_url: string;
	}>(sql`
		SELECT f.type, f.body->>'headline' AS headline, f.body->>'standfirst' AS standfirst,
		       b.domain, b.url AS listing_url
		FROM te9_dev.feed_items f
		JOIN te9_dev.bookmarks b ON b.id = f.listing_id
		WHERE f.listing_id = ${listingId} AND f.status = 'published'
		ORDER BY f.published_at DESC NULLS LAST, f.created_at DESC
		LIMIT 1`);

	if (!rows[0]) {
		return new Response('no published card for this listing', {
			status: 404,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' }
		});
	}

	const svg = cardSvg({
		typeName: rows[0].type,
		headline: rows[0].headline,
		standfirst: rows[0].standfirst,
		domain: rows[0].domain,
		listingUrl: rows[0].listing_url
	});

const resvg = new Resvg(svg, {
	fitTo: { mode: 'width', value: W },
	font: {
		fontFiles: [
			path.join(process.cwd(), 'static', 'fonts', 'HankenGrotesk-Regular.ttf'),
			path.join(process.cwd(), 'static', 'fonts', 'HankenGrotesk-SemiBold.ttf')
		],
		loadSystemFonts: false,
		defaultFontFamily: 'Hanken Grotesk'
	}
});
	const png = resvg.render().asPng();

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
