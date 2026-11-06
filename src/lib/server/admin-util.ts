/** URL-safe slug for extension/agent names. Falls back to 'item' when empty. */
export function slugify(s: string): string {
	const slug = s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 64);
	return slug || 'item';
}
