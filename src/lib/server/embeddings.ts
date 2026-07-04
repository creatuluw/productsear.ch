// Voyage AI embedding client. Default model voyage-4-large (1024-dim, 32k ctx).
// ponytail: raw fetch over the REST endpoint — no SDK dependency, scripts + app
// both import this. Uses input_type=query|document so Voyage prepends the right
// retrieval instruction server-side. Retries 429/5xx with exponential backoff
// (free-tier limits are 3 RPM / 10K TPM until a payment method is on file).

const VOYAGE_URL = 'https://api.voyageai.com/v1/embeddings';
const MODEL_ID = process.env.EMBEDDING_MODEL ?? 'voyage-4-large';
const DIM = Number(process.env.EMBEDDING_DIMENSIONS ?? 1024);

export type VoyageInputType = 'query' | 'document' | undefined;

// Chunk to 50 to stay safely under Voyage's per-call token ceiling on long blobs.
const CHUNK = 50;

// Strip characters Voyage rejects: lone UTF-16 surrogates (can't round-trip to UTF-8)
// and C0 control chars except \n / \t. Scraped markdown sometimes carries these.
function clean(t: string): string {
	return t
		.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, '')
		.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '');
}

async function embedChunk(texts: string[], inputType: VoyageInputType): Promise<number[][]> {
	const body = JSON.stringify({
		input: texts.map(clean),
		model: MODEL_ID,
		input_type: inputType,
		output_dimension: DIM,
		truncation: true
	});
	for (let attempt = 0; attempt < 6; attempt++) {
		const res = await fetch(VOYAGE_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`
			},
			body
		});
		if (res.ok) {
			const json = (await res.json()) as { data: { embedding: number[] }[] };
			return json.data.map((d) => d.embedding);
		}
		const text = await res.text();
		const retryable = res.status === 429 || res.status >= 500;
		if (!retryable || attempt === 5) throw new Error(`Voyage embeddings ${res.status}: ${text}`);
		const wait = Math.min(32000, 2000 * 2 ** attempt);
		console.error(`Voyage ${res.status}, retry ${attempt + 1}/5 in ${wait}ms`);
		await new Promise((r) => setTimeout(r, wait));
	}
	throw new Error('Voyage embeddings: exhausted retries');
}

/** Embed a batch of texts. Pass inputType='document' for corpus, 'query' for search. */
export async function embedTexts(
	texts: string[],
	inputType: VoyageInputType = 'document'
): Promise<number[][]> {
	if (texts.length === 0) return [];
	const out: number[][] = [];
	for (let i = 0; i < texts.length; i += CHUNK) {
		out.push(...(await embedChunk(texts.slice(i, i + CHUNK), inputType)));
	}
	return out;
}

/** Embed a single search query (uses input_type='query'). */
export async function embedQuery(text: string): Promise<number[]> {
	const [v] = await embedTexts([text], 'query');
	return v;
}

export { MODEL_ID as EMBEDDING_MODEL, DIM as EMBEDDING_DIM };
