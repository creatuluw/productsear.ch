---
type: Entity
title: utobo Email (transactional email service)
description: **utobo Email** is the email service powering outbound (and optionally inbound) mail for productsear.ch — transactional, marketing, and sequences, built on AWS 
tags: [email, utobo, api, smtp, webhooks, transactional-email, infrastructure]
timestamp: "2026-11-06T13:39:59.486Z"
---

# utobo Email (transactional email service)

**utobo Email** is the email service powering outbound (and optionally inbound) mail for productsear.ch — transactional, marketing, and sequences, built on AWS SES. Accounts live at `email.utobo.com`; docs at `https://utobo.com/email/docs`. The productsear.ch sending domain was **verified on 2026-11-06** (see [the utobo sending-domain decision](../../decisions/set-up-utobo-as-transactional-email-sender-for-productsear-c.md) for the DNS contract and the DMARC p=none tradeoff). Any server code that sends email from this project should use this service.

## Details

- **Service**: utobo Email (utobo.com) — REST API + SMTP relay + dashboard (campaigns, sequences, contacts)
- **Base URL**: `https://api.email.utobo.com` (HTTPS only; legacy path `/functions/v1/send-email` still works)
- **Auth**: `Authorization: Bearer ut_live_…` — keys are `ut_live_` + 64 hex chars, shown once at creation. Store as `UTOBO_EMAIL_API_KEY` env var. Key permissions: **Send only** (production) vs **Full access** (contacts/lists/domains admin).
- **Node SDK**: `npm install utobo-email` → `new UtoboEmail()` reads `UTOBO_EMAIL_API_KEY` from env. Returns `{ data, error }` discriminated union (no try/catch needed). Full TS types exported. Optional `@react-email/render` peer dep lets you pass `react:` components instead of `html:`.
- **Also official SDKs for**: Python (`pip install utobo-email`, note `from_` param), Ruby, Go (`github.com/myutobo/utobo-email-go`), PHP (Guzzle/cURL).

### REST API surface

| Endpoint | Method | Purpose |
|---|---|---|
| `/v1/emails` | POST | Send email. `from` (`Name <addr>`), `to`/`cc`/`bcc` (≤50 total), `subject`, `html` xor `text`, `reply_to`, `headers` (object), `attachments` (base64 `{filename, content, contentType}`). Returns `{ id: UUID, message }`. |
| `/v1/emails/:id` | GET | Delivery status: `status` = `sent` \| `failed`, plus `ses_message_id`, `created_at`. Org-scoped (other orgs' ids → 404). |
| `/functions/v1/manage-contacts` | POST | `action`: `unsubscribe` (suppresses; idempotent) \| `resubscribe` \| `delete` (erases, does NOT suppress) \| `get`. Unsubscribe stops campaigns/sequences but not transactional mail. |
| `/functions/v1/manage-sequence` | POST | Dashboard-built sequences; `action`: `list` \| `get` \| `enroll` \| `enroll_list` \| `unenroll` (needs `sequence_id` + `emails[]`). Enrolling twice is a no-op; unenroll cancels pending steps. Scope: `sequences:write`. |
| `/functions/v1/manage-received` | POST | Inbound mail readout (MX `@` → `mx.inbound.utobo.com` is already set): `list` (limit ≤100, `before` cursor, `unread_only`) \| `get` \| `attachment` (id + 0-based `index` → raw bytes). Scope: `inbox:read`. Subscribe to `email.received` webhook (metadata-only payload) first. |

### SMTP relay

- Host `smtp.mail.utobo.com`, port **587 STARTTLS** (recommended) or 465 SSL
- Username: literal `apikey` — Password: the API key
- Same verified-domain + 50-recipient rules as the API; suppressed recipients dropped automatically

### Webhooks

- Add endpoint in dashboard (Account → Webhooks) or via `manage-webhooks` (scope `webhooks:manage`)
- Events: `contact.*` (created/updated/deleted/added_to_list/removed_from_list/unsubscribed/suppressed), `email.*` (sent/delivered/opened/clicked/bounced/complained), `campaign.completed`, `sequence.enrolled`, `email.received` (inbound)
- Envelope: `{ id, type, created_at, data }`; headers `x-utobo-event`, `x-utobo-delivery`, `x-utobo-timestamp` (ms epoch), `x-utobo-signature` (`sha256=<hex>`)
- **Signature check**: HMAC-SHA256 over `timestamp + "." + rawBody` with the `whsec_…` signing secret; reject if timestamp >5 min old; constant-time compare
- Respond 2xx within 10 s. Retries ×6 with backoff 1m→5m→30m→2h→6h→24h; **auto-disabled after 50 consecutive failures** (one success resets)

### Rate limits & sending caps

- 100 req/min per key · 500 req/min per org · 10 req/min per unauthenticated IP
- **Daily send cap (warm-up, per recipient, resets 00:00 UTC)**: day 1: 1,000 → days 2–4: 5,000 → days 5–8: 25,000 → days 9–15: 100,000 → day 16+: 250,000/day
- Over-cap: HTTP 429 with `name: "daily_cap"`, `retry_after`, and a `Retry-After` header (SMTP: temporary 451)

### Error model — branch on `name`, never on message text

| name | Status | Meaning |
|---|---|---|
| `validation_error` | 400 | Missing/malformed field |
| `unauthorized` | 401 | Key missing/invalid/revoked |
| `insufficient_scope` | 403 | Key lacks required scope |
| `quota_exceeded` | 403 | Monthly allowance used up |
| `sending_paused` | 403 | Account paused/under review |
| `domain_not_verified` | 422 | `from` domain unverified |
| `all_recipients_suppressed` | 422 | Every recipient suppressed |
| `rate_limit_exceeded` | 429 | Retry per `Retry-After` |
| `daily_cap` | 429 | Warm-up cap hit; retry at next 00:00 UTC |
| `idempotency_conflict` | 409 | Same `Idempotency-Key`, different payload |
| `internal_error` | 500 | Transient — retry after a few seconds |

Dashboard-only endpoints (domains, API keys) return plain `{ "error": "…" }` without `name`.

### Gotchas

- Bulk sending belongs in dashboard **Campaigns**, not the API
- Hard bounces: remove immediately (keep bounce rate <1.5% or SES throttles you); soft bounces retry after 24–48h, treat 3–5 as hard. Bounce log lives in dashboard → Delivery Issues
- A send may carry exactly **one** From address
- Never expose keys client-side; one key per environment (dev/staging/prod), send-only for prod

### Configuration for this project

- Env var: `UTOBO_EMAIL_API_KEY` (add to `.env` when first integrating)
- DNS contract (all live at GoDaddy, verified 2026-11-06): DKIM TXT `utobozgb9pzudt3k1._domainkey`, CNAME `send` → `send.utobo.com` (SPF), TXT `_dmarc` (currently `p=none` — enforcement follow-up owed), MX `@` → `mx.inbound.utobo.com` (receiving)
- Plan: 50 sending domains, 4 in use

- [the utobo sending-domain decision](../../decisions/set-up-utobo-as-transactional-email-sender-for-productsear-c.md) — the ADR covering why utobo was chosen and the DMARC downgrade tradeoff

## Lifecycle

- First added: 2026-11-06 — sending domain verified (DKIM/CNAME/DMARC/MX live on GoDaddy)
- Next: integrate API key + a send-only key when first transactional email feature ships (e.g., verification/delivery mail); revisit DMARC enforcement once sending is proven healthy
