import type { BookmarkAnalysis, BookmarkContent, Bookmark } from './db';

/**
 * Build the single searchable text blob for a bookmark.
 *
 * This SAME text feeds both the embedding and the full-text tsvector, so that
 * semantic and keyword relevance operate over identical content. Including the
 * AI-generated analysis fields (purpose, how_to_use, relevance) is what lets a
 * query like "packages to build a SaaS" match bookmarks that were never tagged
 * that way but whose analysis describes that use.
 */
export function buildSearchText(
	b: Pick<Bookmark, 'title' | 'domain' | 'tags' | 'excerpt' | 'note'>,
	content: Pick<BookmarkContent, 'markdown'> | undefined,
	analysis: Pick<BookmarkAnalysis, 'purpose' | 'howToUse' | 'relevance' | 'category' | 'tags'> | undefined
): string {
	// ponytail: hard cap content at ~1500 chars — embedding-3-small handles long input
	// but analysis + metadata are the high-signal parts for our query type.
	const contentSnippet = (content?.markdown ?? '').slice(0, 1500);
	const parts = [
		`Title: ${b.title}`,
		b.domain ? `Domain: ${b.domain}` : '',
		b.tags ? `Tags: ${b.tags}` : '',
		b.excerpt ? `Excerpt: ${b.excerpt}` : '',
		b.note ? `Note: ${b.note}` : '',
		analysis?.category ? `Category: ${analysis.category}` : '',
		analysis?.purpose ? `Purpose: ${analysis.purpose}` : '',
		analysis?.howToUse ? `How to use: ${analysis.howToUse}` : '',
		analysis?.relevance ? `Relevance: ${analysis.relevance}` : '',
		analysis?.tags ? `Analysis tags: ${analysis.tags}` : '',
		contentSnippet ? `Content: ${contentSnippet}` : ''
	].filter(Boolean);
	return parts.join('\n');
}
