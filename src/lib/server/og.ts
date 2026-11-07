import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

// OG receipt cards — designed image assets for Bluesky/social unfurls.
// Hex identity colors are deliberate: an OG image is an asset, not app CSS,
// so the semantic-token rule doesn't reach into SVG (see
// docs/wiki/decisions/receipt-card-og-images-hand-built-svg-resvg-resvg-js-replace.md).
// Fonts: self-hosted TTFs in static/fonts (Hanken Grotesk = content,
// Martian Mono = data/labels — the site's two voices).
const CANVAS = '#F9FBFA';
const INK = '#262B27';
const INK_SOFT = '#6E7A72';
const INK_FAINT = '#9AA5A0';
const ACCENT = '#0021FF';
const HAIRLINE = '#262B2719'; // ink/10

export const OG_W = 1200;
export const OG_H = 630;

const MARGIN = 72;
const TEXT_W = 868; // text column — the right band belongs to the mascot

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

/** naive width-based word wrap; sizes are per-face averages, slightly conservative */
function wrap(text: string, size: number, maxWidth: number, maxLines: number, em = 0.52): string[] {
	if (!text) return [];
	const maxChars = Math.floor(maxWidth / (size * em));
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

const MASCOT_PNG = readFileSync(path.join(process.cwd(), 'static', 'mascot-product-search.png')).toString('base64');

interface CardCopy {
	chip: string;
	headline: string;
	standfirst: string | null;
	footerLeft: string;
}

/** The receipt card: chip → accent tick → big headline → standfirst → hairline footer, mascot at right. */
function cardSvg(d: CardCopy): string {
	const headlineLines = wrap(d.headline, 60, TEXT_W, 3, 0.56).map(esc);
	const sfBudget = headlineLines.length >= 3 ? 1 : 2;
	const standfirstLines = d.standfirst ? wrap(d.standfirst, 25, TEXT_W, sfBudget).map(esc) : [];

	const headY = 266;
	const headDy = 70;
	const sfY = headY + headDy * (headlineLines.length - 1) + 76;

	const headlineTspans = headlineLines
		.map((l, i) => `<tspan x="${MARGIN}" dy="${i === 0 ? 0 : headDy}">${l}</tspan>`)
		.join('');
	const standfirstTspans = standfirstLines
		.map((l, i) => `<tspan x="${MARGIN}" dy="${i === 0 ? 0 : 38}">${l}</tspan>`)
		.join('');

	const chipW = Math.min(d.chip.length * 15.5 + 52, 480);

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">
	<rect width="${OG_W}" height="${OG_H}" fill="${CANVAS}"/>

	<!-- chip: the card's type tag -->
	<rect x="${MARGIN}" y="84" width="${chipW}" height="44" rx="22" fill="none" stroke="${HAIRLINE}"/>
	<text x="${MARGIN + 26}" y="113" font-family="Martian Mono Std Rg" font-weight="400" font-size="22" letter-spacing="2" fill="${INK_SOFT}">${esc(d.chip.toUpperCase())}</text>

	<!-- accent tick: one precise mark of color -->
	<rect x="${MARGIN}" y="188" width="44" height="5" rx="2" fill="${ACCENT}"/>

	<!-- headline: the figure -->
	<text x="${MARGIN}" y="${headY}" font-family="Hanken Grotesk" font-weight="600" font-size="60" letter-spacing="-0.5" fill="${INK}">${headlineTspans}</text>

	<!-- standfirst: the support -->
	${standfirstLines.length > 0 ? `<text x="${MARGIN}" y="${sfY}" font-family="Hanken Grotesk" font-weight="400" font-size="25" fill="${INK_SOFT}">${standfirstTspans}</text>` : ''}

	<!-- mascot: the brand's charm, bottom-right of the text band -->
	<image href="data:image/png;base64,${MASCOT_PNG}" x="988" y="168" width="140" height="220"/>

	<!-- footer: hairline + meta -->
	<line x1="${MARGIN}" y1="544" x2="${OG_W - MARGIN}" y2="544" stroke="${HAIRLINE}"/>
	<text x="${MARGIN}" y="588" font-family="Martian Mono Std Rg" font-weight="400" font-size="22" fill="${INK_FAINT}">${esc(d.footerLeft)}</text>
	<text x="${OG_W - MARGIN}" y="588" text-anchor="end" font-family="Martian Mono Std Rg" font-weight="700" font-size="22" fill="${ACCENT}">productsear.ch · the drum</text>
</svg>`;
}

/** Receipt card for a drum item anchored to a listing. */
export function listingCardSvg(d: {
	typeName: string;
	headline: string;
	standfirst: string | null;
	domain: string | null;
	listingUrl: string;
}): string {
	return cardSvg({
		chip: d.typeName,
		headline: d.headline,
		standfirst: d.standfirst,
		footerLeft: d.domain ?? hostOf(d.listingUrl)
	});
}

/** The drum's own card — what non-listing shares (which point at /feed) unfurl. */
export function drumCardSvg(): string {
	return cardSvg({
		chip: 'the drum',
		headline: 'The corpus drafts. The drum keeps time.',
		standfirst: 'One draw every 48h — a feed of item types, each showing how a listing can change or enrich a life and its ambitions.',
		footerLeft: 'productsear.ch/feed'
	});
}

/** Render an OG SVG to PNG bytes with the self-hosted brand fonts. */
export function renderOgPng(svg: string): Buffer {
	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: OG_W },
		font: {
			fontFiles: [
				'HankenGrotesk-Regular.ttf',
				'HankenGrotesk-SemiBold.ttf',
				'MartianMono-StdRg.ttf',
				'MartianMono-StdBd.ttf'
			].map((f) => path.join(process.cwd(), 'static', 'fonts', f)),
			loadSystemFonts: false,
			defaultFontFamily: 'Hanken Grotesk'
		}
	});
	return resvg.render().asPng();
}

export function ogResponse(png: Buffer, maxAge = 3600): Response {
	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': `public, max-age=${maxAge}`
		}
	});
}
