// Voyage AI rerank client. Re-scores candidate docs against a query with a
// cross-encoder — far stronger relevance than bi-encoder cosine alone.
// ponytail: raw fetch, no SDK. Shares VOYAGE_API_KEY with embeddings.

const RERANK_URL = 'https://api.voyageai.com/v1/rerank';
const RERANK_MODEL = process.env.RERANK_MODEL ?? 'rerank-2.5-lite';

/**
 * Rerank documents against a query. Returns indices into `documents`,
 * best-first, of length min(topK, documents.length).
 */
export async function rerank(
	query: string,
	documents: string[],
	topK: number
): Promise<number[]> {
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
		})
	});
	if (!res.ok) throw new Error(`Voyage rerank ${res.status}: ${await res.text()}`);
	const json = (await res.json()) as { data: { index: number }[] };
	return json.data.map((d) => d.index);
}

export { RERANK_MODEL };
