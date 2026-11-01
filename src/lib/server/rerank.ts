// Voyage AI rerank client. Re-scores candidate docs against a query with a
// cross-encoder — far stronger relevance than bi-encoder cosine alone.
// ponytail: raw fetch, no SDK. Shares VOYAGE_API_KEY with embeddings.

const RERANK_URL = 'https://api.voyageai.com/v1/rerank';
const RERANK_MODEL = process.env.RERANK_MODEL ?? 'rerank-2.5-lite';

export interface RerankHit {
	index: number;
	score: number;
}

/**
 * Rerank documents against a query. Returns hits (index into `documents` +
 * relevance score on a 0–1 scale), best-first, length min(topK, documents.length).
 * Scores are exposed so callers can apply a relevance floor — honest counts.
 */
export async function rerank(query: string, documents: string[], topK: number): Promise<RerankHit[]> {
	const res = await fetch(RERANK_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`
		},
		body: JSON.stringify({
			query,
			documents,
			model: RERANK_MODEL,
			top_k: topK,
			truncation: true
		}),
		signal: AbortSignal.timeout(30_000)
	});
	if (!res.ok) throw new Error(`Voyage rerank ${res.status}: ${await res.text()}`);
	const json = (await res.json()) as { data: { index: number; relevance_score: number }[] };
	return json.data.map((d) => ({ index: d.index, score: d.relevance_score }));
}

export { RERANK_MODEL };
