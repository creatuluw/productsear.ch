---
type: Decision
title: Set up utobo as transactional email sender for productsear.ch; DMARC downgraded to p=none (temporarily)
description: Context
tags: [email, dns, dmarc, utobo, godaddy, infrastructure]
status: accepted
timestamp: "2026-11-06T13:37:08.760Z"
---

# Set up utobo as transactional email sender for productsear.ch; DMARC downgraded to p=none (temporarily)

## Context

productsear.ch needs to send email from its own domain (verification/delivery mail) via **utobo** (utobo.com). Utobo's sending-domain setup required four DNS records at GoDaddy. Inspection of the zone before writing revealed the domain already carried a **strict DMARC policy** — `v=DMARC1; p=reject` (a GoDaddy/SecureServer default) — which would have broken third-party sending during setup.

## The choice

- productsear.ch is now a **verified sending domain on utobo**. The four records, all live on GoDaddy (verified via authoritative NS poll on 2026-11-06):
  - `TXT utobozgb9pzudt3k1._domainkey` — DKIM public key (234 chars, single TXT string, under GoDaddy's 255-char/string limit)
  - `CNAME send` → `send.utobo.com`
  - `TXT _dmarc` → `v=DMARC1; p=none; rua=mailto:dmarc@productsear.ch`
  - `MX @` → `mx.inbound.utobo.com`, priority 10 (zone previously had **no MX records** — nothing was clobbered)
- **DMARC was deliberately downgraded from `p=reject` to `p=none`** per utobo's setup requirements: third-party sends must pass alignment before the domain can verify, and strict DMARC rejects them.
- Website DNS (A `@`, `www` → Railway) untouched.

## Alternatives considered

- Keeping `p=reject` and delegating mail to a subdomain instead — rejected: utobo's flow verifies the apex domain and its instructions specify the apex `_dmarc` record.
- Using a different mail provider — rejected: utobo is the service the user chose (plan with 50 sending domains, 4 in use).

## Rationale

`p=none` is required by utobo's onboarding contract; refusing it means the domain never verifies and no mail can be sent. The downgrade is understood to be temporary — `p=none` only monitors (reports to `rua=mailto:dmarc@productsear.ch`), it does not protect against spoofing.

## Consequences

- **Follow-up owed**: once utobo sending is proven healthy, move DMARC back toward enforcement (`p=quarantine`, then `p=reject`) — otherwise the domain is spoofable again.
- The `send` CNAME, DKIM TXT, and inbound MX must stay in place or utobo sending/receiving breaks.
- Any future "why is DMARC p=none on this domain?" answer lives here, not in the zone.
