# Learnings

_Captured learnings will be listed here._
- [Vercel AI SDK v4 streamText exposes async textStream, not toReadableStream()](./vercel-ai-sdk-v4-streamtext-exposes-async-textstream-not-tor.md) - In AI SDK v4, `streamText(...)` exposes a **`textStream`** property (an async iterable of string chunks), not a `toReadableStream()` method. To stream a respons
- [postgres-js db.execute() returns rows directly, not { rows }](./postgres-js-db-execute-returns-rows-directly-not-rows.md) - When using Drizzle's postgres-js driver, `db.execute(sql\`...\`)` returns the **row array directly**, not an object with a `.rows` property (unlike the `pg`/nod
tandalone script run via `tsx` (e.
- [SvelteKit dev server does not populate process.env from .env — load dotenv yourself](./sveltekit-dev-server-does-not-populate-process-env-from-env-.md) - SvelteKit's Vite dev server does **not** populate `process.env` from your `.env` file. That is what the `$env/*` virtual modules are for. If your server modules
- [agentos-sdk.dev is a light warm-paper theme, not dark](./agentos-sdk-dev-is-a-light-warm-paper-theme-not-dark.md) - When extracting the design system from https://agentos-sdk.dev/, the `:root` CSS contains leftover shadcn dark-mode HSL variables (e.g. `--background: 240 10% 3
- [Voyage free-tier rate limit (3 RPM / 10K TPM) blocks bulk backfill without a payment method](./voyage-free-tier-rate-limit-3-rpm-10k-tpm-blocks-bulk-backfi.md) - Gotcha
- [Postgres FTS "word too long" NOTICE for >2047-char tokens is harmless](./postgres-fts-word-too-long-notice-for-2047-char-tokens-is-ha.md) - When populating a `tsvector` / `search_tsv` column, Postgres may emit a NOTICE like:
