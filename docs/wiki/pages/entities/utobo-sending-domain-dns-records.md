---
type: Entity
title: Utobo sending-domain DNS records
description: The four DNS records at GoDaddy that make productsear.ch a **verified sending domain on utobo** (utobo.com) — the email-sending infrastructure for the site. Wri
tags: [email, dns, utobo, godaddy, dkim, spf, dmarc]
timestamp: "2026-11-06T13:37:29.355Z"
---

# Utobo sending-domain DNS records

The four DNS records at GoDaddy that make productsear.ch a **verified sending domain on utobo** (utobo.com) — the email-sending infrastructure for the site. Written and verified live on 2026-11-06 via the GoDaddy Domains API.

## What is it?

A concrete DNS configuration surface owned by the domain (not the app repo): the utobo onboarding contract for sending mail from `@productsear.ch` addresses and receiving inbound mail. Any future session touching the domain's zone must treat these records as load-bearing for email delivery.

## Details

- **Location**: GoDaddy DNS zone for `productsear.ch` (managed via GoDaddy Domains API; keys in `E:/productsear.ch/.env`)
- **Records**:
  - `TXT utobozgb9pzudt3k1._domainkey` → DKIM public key (234 chars, single string)
  - `CNAME send` → `send.utobo.com`
  - `TXT _dmarc` → `v=DMARC1; p=none; rua=mailto:dmarc@productsear.ch` — **downgraded from `p=reject`**; policy rationale and planned path back to enforcement in the linked decision
  - `MX @` → `mx.inbound.utobo.com`, priority 10 (zone previously had no MX)
- **Verification**: poll authoritative nameservers directly (`dig @ns59.domaincontrol.com ...`) — instant, cache-free state. Re-usable poll script kept at `.work/poll-mail-dns.mjs` (scratch, gitignored).
- **Untouched**: website records (A `@`, `www` → Railway).

## Relationships

- [set-up-utobo-as-transactional-email-sender-for-productsear-c](../../decisions/set-up-utobo-as-transactional-email-sender-for-productsear-c.md) — the decision recording why these records exist and why DMARC is `p=none`
- [verify-godaddy-dns-writes-by-polling-the-authoritative-names](../../learnings/verify-godaddy-dns-writes-by-polling-the-authoritative-names.md) — the verification method used to confirm the records

## Lifecycle

- First added: 2026-11-06 — utobo sending-domain setup executed via GoDaddy API; all four records verified on first authoritative poll.
- Follow-up owed: restore DMARC enforcement (`p=quarantine`/`p=reject`) once utobo sending is proven healthy.

## Source

- GoDaddy DNS zone for `productsear.ch` — the live record set
- `.work/poll-mail-dns.mjs` — the poll script used for verification
