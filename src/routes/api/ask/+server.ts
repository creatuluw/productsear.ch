import { error } from '@sveltejs/kit';
import { ask } from '$lib/server/rag';
import type { RequestHandler } from './$types';

// POST { q: string } -> a streaming text/plain body of the synthesized answer,
// followed by a JSON line of sources. The UI appends chunks as they arrive and
// renders source cards from the trailing sources line.
export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json().catch(() => null)) as { q?: string } | null;
	const q = body?.q?.trim();
	if (!q) error(400, 'Missing "q"');
	if (q.length > 1000) error(400, 'Query too long');

	const { stream, sources } = await ask(q);

	const sourcesLine =
		'\n\n__SOURCES__\n' +
		JSON.stringify(
			sources.map((s) => ({
				id: s.id,
				title: s.title,
				url: s.url,
				domain: s.domain,
				rrf: Number(s.rrf.toFixed(5))
			}))
		);

	const combined = new ReadableStream<Uint8Array>({
		async start(controller) {
			const reader = stream.getReader();
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				controller.enqueue(value);
			}
			controller.enqueue(new TextEncoder().encode(sourcesLine));
			controller.close();
		}
	});

	return new Response(combined, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Accel-Buffering': 'no' }
	});
};
