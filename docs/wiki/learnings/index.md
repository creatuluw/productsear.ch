# Learnings

_Captured learnings will be listed here._
- [Vercel AI SDK v4 streamText exposes async textStream, not toReadableStream()](./vercel-ai-sdk-v4-streamtext-exposes-async-textstream-not-tor.md) - In AI SDK v4, `streamText(...)` exposes a **`textStream`** property (an async iterable of string chunks), not a `toReadableStream()` method. To stream a respons
- [postgres-js db.execute() returns rows directly, not { rows }](./postgres-js-db-execute-returns-rows-directly-not-rows.md) - When using Drizzle's postgres-js driver, `db.execute(sql\`...\`)` returns the **row array directly**, not an object with a `.rows` property (unlike the `pg`/nod
tandalone script run via `tsx` (e.
- [SvelteKit dev server does not populate process.env from .env — load dotenv yourself](./sveltekit-dev-server-does-not-populate-process-env-from-env-.md) - SvelteKit's Vite dev server does **not** populate `process.env` from your `.env` file. That is what the `$env/*` virtual modules are for. If your server modules
