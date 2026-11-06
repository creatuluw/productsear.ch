---
type: Entity
title: utobo email platform
description: "utobo.com (**utobo Email**) — the external SaaS that provides productsear.ch's outbound email infrastructure: transactional email, newsletters, campaigns, and a"
tags: [email, utobo, saas, transactional-email, marketing, infrastructure]
timestamp: "2026-11-06T13:41:10.653Z"
---

# utobo email platform

utobo.com (**utobo Email**) — the external SaaS that provides productsear.ch's outbound email infrastructure: transactional email, newsletters, campaigns, and automations on one platform and one bill. productsear.ch is a **verified sending domain** there since 2026-11-06.

## What is it?

An all-in-one email platform marketed as "the email platform built for startups. API, marketing, and automation in one tool." It combines developer-facing transactional sending (email API / SMTP with custom sending domains) and marketer-facing tools (audience management, newsletters, campaigns, automations) in one workspace — "one workspace and one contact list for developers and marketers." It also ships an AI assistant (**Draper**, "your AI employee") plus an **AI Writer** for drafting emails. (utobo Inc. also sells a separate store/commerce product line — "Sell online with a store, grow with email" — not in use by this project.)

## Why it matters?

It is the only way productsear.ch sends email (verification/delivery mail today, marketing later). This page is the capability inventory: when the project needs a new email capability (e.g. user-facing newsletters, drip sequences, bounce handling), check here **before** evaluating other providers — the sending-domain plumbing already exists.

## Feature inventory (as of 2026-11-06, from utobo.com)

- **Transactional email / Email API** — programmatic sending from verified custom sending domains; the channel productsear.ch currently uses. Plans "from $9/mo" for transactional only; "all three channels" (transactional + newsletters + campaigns/automations) from $42.30/mo.
- **Multiple custom sending domains** — "Your own domains", each with its own DKIM and SPF. Our plan covers 50 sending domains (4 in use per the setup decision).
- **Newsletters, campaigns, automations** — broadcast/one-off sends, campaigns, and automated sequences; the marketing surface we have NOT yet used.
- **Audience management** — "Lists, tags and segments": group contacts the way you send, one shared contact list across the workspace.
- **Deliverability tooling** — **Domain health score** and a single place to "Check SPF, DKIM and DMARC" — directly useful for the DMARC-enforcement follow-up owed on this domain.
- **Automatic suppression** — "Bounces and complaints removed for you"; hard bounces and spam complaints are suppressed automatically.
- **Inbound email** — our MX points at `mx.inbound.utobo.com`, so utobo also receives mail for the domain (e.g. `dmarc@productsear.ch` DMARC reports).
- **Draper (AI employee) + AI Writer** — AI drafts campaign copy and proposes sends (e.g. win-back drafts: "212 customers haven't ordered in 90 days. I drafted a win-back email… Send Tuesday at 10 AM?").

## Details

- **Location**: external service — https://utobo.com ; credentials/account are NOT in the repo
- **Integration surface for this project**: the four DNS records ([utobo-sending-domain-dns-records](./utobo-sending-domain-dns-records.md)) plus utobo-side sending via the verified `productsear.ch` domain; no app code depends on utobo yet
- **Configuration**: sending-domain DNS must stay in place (DKIM TXT, `send` CNAME, `_dmarc`, inbound MX) or sending/receiving breaks
- **Known follow-up**: DMARC is `p=none` (monitor-only) — see the decision; use utobo's domain-health/DMARC checks while proving sending, then restore `p=quarantine` → `p=reject`

## Relationships

- [utobo-sending-domain-dns-records](./utobo-sending-domain-dns-records.md) — the DNS contract that makes productsear.ch a verified sending domain
- [set-up-utobo-as-transactional-email-sender-for-productsear-c](../../decisions/set-up-utobo-as-transactional-email-sender-for-productsear-c.md) — why utobo was chosen and why DMARC sits at `p=none`
- [verify-godaddy-dns-writes-by-polling-the-authoritative-names](../../learnings/verify-godaddy-dns-writes-by-polling-the-authoritative-names.md) — verification method used during setup

## Lifecycle

- First added: 2026-11-06 — sending domain verified after the four DNS records went live; this feature-inventory page requested by the user the same day.
- Not yet used: newsletters/campaigns/automations/Draper — candidates if the project ever needs outbound marketing email.

## Source

- https://utobo.com/ — homepage scrape 2026-11-06 (titles, feature headings, FAQ, pricing line)
- [utobo-sending-domain-dns-records](./utobo-sending-domain-dns-records.md) — the live GoDaddy record set proving the integration
