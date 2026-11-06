// Shared LLM drafting helper for The Drum's editorial generators.
// Same provider chain as scripts/analyze-bookmarks.js: z.ai (GLM-5) primary,
// Railway-hosted fallback — but for prose drafting, not corpus analysis.
// Returns raw text or parsed JSON; throws so the rotation can skip the draw.

import 'dotenv/config';

interface Provider {
	name: string;
	url: string;
	apiKey: string;
	model: string;
}

const PROVIDERS: Provider[] = [
	{
		name: 'z.ai',
		url: process.env.ZAI_LLM_URL || 'https://api.z.ai/api/coding/paas/v4',
		apiKey: process.env.ZAI_API_KEY || '',
		model: 'glm-5'
	},
	{
		name: 'railway-gateway',
		url: process.env.LLM_GATEWAY_URL || 'https://llm-gateway-production-91d5.up.railway.app/v1',
		apiKey: process.env.LLM_GATEWAY_KEY || '',
		model: process.env.LLM_GATEWAY_MODEL || 'unsloth/Qwen3.5-2B-GGUF'
	}
];

async function callProvider(p: Provider, system: string, user: string, maxTokens: number, json: boolean): Promise<string> {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (p.apiKey) headers['Authorization'] = `Bearer ${p.apiKey}`;

	const res = await fetch(`${p.url}/chat/completions`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			model: p.model,
			messages: [
				{ role: 'system', content: system },
				{ role: 'user', content: user }
			],
			temperature: 0.8,
			max_tokens: maxTokens,
			...(json ? { response_format: { type: 'json_object' as const } } : {}),
			stream: false
		})
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`${p.name} API error ${res.status}: ${body.slice(0, 200)}`);
	}
	const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
	const content = data.choices?.[0]?.message?.content;
	if (!content) throw new Error(`${p.name}: empty response`);
	return content;
}

/** Raw prose draft (no JSON mode). Throws when every provider fails. */
export async function draftText(system: string, user: string, maxTokens = 600): Promise<{ text: string; provider: string }> {
	const errors: string[] = [];
	for (const p of PROVIDERS) {
		if (!p.apiKey && p.name !== 'railway-gateway') continue; // unconfigured primary
		try {
			return { text: (await callProvider(p, system, user, maxTokens, false)).trim(), provider: p.name };
		} catch (e) {
			errors.push(`${p.name}: ${e instanceof Error ? e.message : String(e)}`);
		}
	}
	throw new Error(`all draft providers failed — ${errors.join(' | ')}`);
}

/** JSON-mode draft, parsed and lightly repaired (code fences stripped). Throws on garbage. */
export async function draftJson<T>(
	system: string,
	user: string,
	maxTokens = 700
): Promise<{ data: T; provider: string }> {
	const errors: string[] = [];
	for (const p of PROVIDERS) {
		if (!p.apiKey && p.name !== 'railway-gateway') continue;
		try {
			const raw = await callProvider(p, system, user, maxTokens, true);
			const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
			return { data: JSON.parse(cleaned) as T, provider: p.name };
		} catch (e) {
			errors.push(`${p.name}: ${e instanceof Error ? e.message : String(e)}`);
		}
	}
	throw new Error(`all draft providers failed — ${errors.join(' | ')}`);
}
