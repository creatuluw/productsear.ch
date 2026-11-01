// Archetype roll-up: maps the messy 1,320 raw analysis categories onto a
// curated set of modern workforce / business-domain / tool-type archetypes.
// Deterministic (regex rules over category + purpose + tags + title + domain),
// multi-entry: a bookmark may carry up to 4 archetypes.
// Stored on the app-owned te9_dev.bookmark_archetypes table (source tables are
// read-only mirrors of the external Raindrop sync).

export interface Archetype {
	slug: string;
	name: string;
	/** ordered rules — specific archetypes must be listed before general ones */
	patterns: RegExp[];
}

export const ARCHETYPES: Archetype[] = [
	{ slug: 'ai-coding-agent', name: 'AI Coding Agent', patterns: [/\bai coding\b|coding agent|dev(eloper)? agent|code (generation|gen)\b|copilot|code assistant/i] },
	{ slug: 'agent-framework', name: 'AI Agent Framework', patterns: [/agent (framework|orchestrat|runtime)|agentic|multi-?agent|\bagents?\b.*\b(build|framework|orchestrat|deploy)|computer[- ]use|browser[- ]use|mcp\b/i] },
	{ slug: 'llm-model-api', name: 'LLM & Model API', patterns: [/\bllm\b|model (provider|api|serving)|inference (api|engine)|openai|anthropic|openrouter|ollama|deepseek|llama|\bgpt\b|fine-?tun|prompt/i] },
	{ slug: 'rag-search', name: 'RAG & Search', patterns: [/\brag\b|retrieval|semantic search|search (engine|api)|embedding|rerank|reciprocal rank|full[- ]text|hybrid search|perplexity/i] },
	{ slug: 'vector-db', name: 'Vector Database', patterns: [/vector (database|db|search|store)|pgvector|qdrant|pinecone|weaviate|milvus|ann index/i] },
	{ slug: 'scraping-extraction', name: 'Web Scraping & Extraction', patterns: [/scrap|crawl|\bspider\b|headless|html to (markdown|text)|url to (markdown|text)|content extraction|web extract|reader (api|mode)|unblock|parse (html|page)/i] },
	{ slug: 'video-motion', name: 'Video & Motion', patterns: [/video|motion graphics|animation|ffmpeg|\bmp4\b|video edit|subtitle|caption|screen ?record|remotion|timeline edit/i] },
	{ slug: 'audio-voice', name: 'Audio, Voice & Speech', patterns: [/\baudio\b|\bvoice\b|\btts\b|text to speech|speech|podcast|\bmusic\b|sound (design|effect)|transcri|asr\b/i] },
	{ slug: 'image-vision', name: 'Image & Vision AI', patterns: [/image (gen|generation|edit)|\bvision\b|\bocr\b|diffusion|midjourney|\bdall-e\b|photo (edit|gen)|upscale|background remov|text to image|img2/i] },
	{ slug: '3d-game-dev', name: '3D & Game Dev', patterns: [/\b3d\b|three\.?js|webgl|\bwgpu\b|\bgltf\b|shader|voxel|\bgame\b|godot|unity|unreal/i] },
	{ slug: 'design-prototyping', name: 'Design & Prototyping', patterns: [/design tool|figma|prototype|mockup|wireframe|\bfonts?\b|typography|\bicons?\b|illustrat|color (palette|picker)|sketch/i] },
	{ slug: 'frontend-ui', name: 'Frontend & UI', patterns: [/frontend|front-end|ui (kit|library|component)|component lib|css|tailwind|svelte|\breact\b|\bvue\b|web component|design system|widget|html template/i] },
	{ slug: 'devops-deploy', name: 'DevOps & Deployment', patterns: [/deploy|hosting|ci\/cd|devops|docker|kubernetes|container|reverse proxy|\bnginx\b|terraform|build pipeline|release/i] },
	{ slug: 'cloud-infra', name: 'Cloud Infrastructure', patterns: [/\bcloud\b|serverless|\baws\b|\bgcp\b|vercel|netlify|railway|fly\.io|infrastructure|\bcdn\b|edge (network|function)|compute/i] },
	{ slug: 'security-auth', name: 'Security & Auth', patterns: [/security|\bauth\b|oauth|vulnerab|encrypt|csrf|xss|pentest|firewall|secrets? (manage|vault)|\bcve\b|zero trust|sbom/i] },
	{ slug: 'database-orm', name: 'Database & ORM', patterns: [/database|\bsql\b|postgres|mysql|sqlite|mongodb|\borm\b|drizzle|prisma|\bredis\b|migration|schema/i] },
	{ slug: 'data-etl', name: 'Data & ETL', patterns: [/\betl\b|data pipeline|dataset|spreadsheet|\bcsv\b|ingest|warehouse|data (clean|process|transform|sync)|airflow/i] },
	{ slug: 'analytics-viz', name: 'Analytics & Visualization', patterns: [/analytics|visualization|\bcharts?\b|dashboard|metrics|tracking|telemetry|business intelligence|\bbi\b|report(ing)? tool/i] },
	{ slug: 'automation-workflow', name: 'Automation & Workflow', patterns: [/automation|workflow|zapier|ifttt|scheduler|\bcron\b|trigger|rpa\b|pipeline automat/i] },
	{ slug: 'no-code-builder', name: 'No-Code Builder', patterns: [/no-?code|low-?code|app builder|website builder|form builder|page builder|visual (build|develop)/i] },
	{ slug: 'knowledge-mgmt', name: 'Knowledge Management', patterns: [/knowledge|wiki|second brain|zettel|obsidian|\bpkm\b|note[- ]?taking|research (tool|assistant)|bookmark|read[- ]?later|highlights/i] },
	{ slug: 'browser-extension', name: 'Browser Extension', patterns: [/browser extension|chrome extension|firefox (add-?on|extension)|edge add|userscript|web ?ext/i] },
	{ slug: 'productivity', name: 'Productivity', patterns: [/productivity|\bnotes?\b|to-?do|task (manage|list)|calendar|clipboard|launcher|time (track|manage)|focus|pomodoro/i] },
	{ slug: 'dev-tool', name: 'Developer Tool', patterns: [/dev(eloper)? tool|sdk|toolkit|\bide\b|linter|debugger|code (editor|review)|version control|git(hub)? (action|cli)|terminal util|cli tool/i] },
	{ slug: 'cli-terminal', name: 'CLI & Terminal', patterns: [/\bcli\b|terminal|shell|\btty\b|command[- ]line|prompt|tmux|zsh|bash/i] },
	{ slug: 'saas-api', name: 'SaaS & API Service', patterns: [/api (service|platform)|saas|web service|platform as a service|integration platform|rest api|json api/i] },
	{ slug: 'oss-library', name: 'Open Source Library', patterns: [/open[- ]source|\boss\b|(library|package|module|repo) (for|that|to)|github\.com/i] },
	{ slug: 'docs-learning', name: 'Docs & Learning', patterns: [/documentation|tutorial|course|learning|guide|cheat ?sheet|\bdocs\b|handbook|playbook|reference/i] },
	{ slug: 'finance-payments', name: 'Finance & Payments', patterns: [/payment|billing|invoice|stripe|finance|accounting|budget|crypto|wallet|trading/i] },
	{ slug: 'utility-other', name: 'Utility & Other', patterns: [] }
];

export const ARCHETYPE_BY_SLUG = new Map(ARCHETYPES.map((a) => [a.slug, a]));

export const FALLBACK_ARCHETYPES = ['utility-other'];

export interface ClassifiableBookmark {
	title: string | null;
	domain: string | null;
	tags: string | null;
	category: string | null;
	purpose: string | null;
	analysisTags?: string | null;
}

/** Deterministic multi-label classification. Returns archetype slugs (≤4). */
export function classifyBookmark(b: ClassifiableBookmark): string[] {
	const hay = [b.category, b.purpose, b.tags, b.analysisTags, b.title, b.domain]
		.filter(Boolean)
		.join(' \u00b7 ');
	const out: string[] = [];
	for (const a of ARCHETYPES) {
		if (out.length >= 4) break;
		if (a.patterns.length > 0 && a.patterns.some((p) => p.test(hay))) out.push(a.slug);
	}
	return out.length > 0 ? out : FALLBACK_ARCHETYPES;
}
