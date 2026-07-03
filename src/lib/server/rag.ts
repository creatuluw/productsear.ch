import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { hybridSearch, type SearchResult } from './search';

// DeepSeek exposes an OpenAI-compatible chat API. Swap baseURL + key to use
// OpenAI, OpenRouter, or any compatible provider.
const provider = createOpenAI({
	apiKey: process.env.DEEPSEEK_API_KEY ?? process.env.OPENAI_API_KEY,
	baseURL: process.env.CHAT_BASE_URL ?? 'https://api.deepseek.com/v1'
});
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'deepseek-chat';

export interface AskResult {
	stream: ReadableStream<Uint8Array>;
	sources: SearchResult[];
}

const SYSTEM = `You are a research assistant for a personal corpus of ~2,300 web bookmarks
(open-source projects, tools, articles, SaaS products). The user asks questions
or asks for ideas grounded in what they have saved.

Rules:
- Answer ONLY from the provided bookmarks. If none are relevant, say so.
- Synthesize, don't list verbatim. For "ideas" prompts, propose concrete ideas
  that combine or extend the retrieved tools/packages, each tied to named sources.
- Cite sources inline as [n] where n is the bookmark's number in the context.
- Keep it tight: a short framing, then numbered ideas/points.`;

export async function ask(query: string): Promise<AskResult> {
	const top = await hybridSearch(query, 12);

	if (top.length === 0) {
		const empty = new TextEncoder().encode(
			'No relevant bookmarks found in the corpus for that query.'
		);
		return {
			sources: [],
			stream: new ReadableStream({
				start(controller) {
					controller.enqueue(empty);
					controller.close();
				}
			})
		};
	}

	const context = top
		.map(
			(b, i) =>
				`[${i + 1}] ${b.title}\n` +
				`URL: ${b.url}\n` +
				(b.domain ? `Domain: ${b.domain}\n` : '') +
				(b.purpose ? `Purpose: ${b.purpose}\n` : '') +
				(b.excerpt ? `Excerpt: ${b.excerpt}\n` : '')
		)
		.join('\n');

	const result = streamText({
		model: provider(CHAT_MODEL),
		system: SYSTEM,
		prompt: `User question: ${query}\n\nRelevant bookmarks from the corpus:\n\n${context}`,
		temperature: 0.6
	});

	return { stream: await toStream(result), sources: top };
}

// ponytail: consume the SDK's async text iterable into a byte ReadableStream.
async function toStream(
	result: Awaited<ReturnType<typeof streamText>>
): Promise<ReadableStream<Uint8Array>> {
	const encoder = new TextEncoder();
	return new ReadableStream({
		async start(controller) {
			for await (const delta of result.textStream) {
				controller.enqueue(encoder.encode(delta));
			}
			controller.close();
		}
	});
}
