import { pipeline } from '@huggingface/transformers';

const MODEL_ID = process.env.EMBEDDING_MODEL ?? 'Xenova/all-MiniLM-L6-v2';
const DIM = Number(process.env.EMBEDDING_DIMENSIONS ?? 384);

// ponytail: one global pipeline instance — model loads once (~25MB ONNX) and
// stays in process memory. Cold start is a few seconds; warm calls are fast.
let extractorPromise: Promise<Awaited<ReturnType<typeof pipeline>>> | null = null;

async function extractor() {
	if (!extractorPromise) {
		extractorPromise = pipeline('feature-extraction', MODEL_ID);
	}
	return extractorPromise;
}

/**
 * Embed a batch of texts with a local model (default all-MiniLM-L6-v2, 384-dim).
 * Mean-pools token embeddings and L2-normalizes, matching the model's intended
 * sentence-embedding recipe. Free, offline, no API key.
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
	if (texts.length === 0) return [];
	const ext = await extractor();
	const output = (await ext(texts, { pooling: 'mean', normalize: true })) as {
		data: Float32Array | number[];
		dims: number[];
	};
	const dim = output.dims.at(-1) ?? DIM;
	const flat = output.data as Float32Array;
	const out: number[][] = [];
	for (let i = 0; i < texts.length; i++) {
		out.push(Array.from(flat.slice(i * dim, (i + 1) * dim)));
	}
	return out;
}

export async function embedQuery(text: string): Promise<number[]> {
	const [v] = await embedTexts([text]);
	return v;
}

export { MODEL_ID as EMBEDDING_MODEL, DIM as EMBEDDING_DIM };
