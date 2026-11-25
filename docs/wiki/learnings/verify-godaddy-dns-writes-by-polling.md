---
type: Learning
title: Verify GoDaddy DNS writes by polling the authoritative nameservers — API writes are visible instantly
description: "Discovered 2026-11-06 while setting up the utobo sending-domain records for productsear.ch via the GoDaddy Domains API:"
tags: [dns, godaddy, email, verification, gotcha]
timestamp: "2026-11-06T13:37:17.565Z"
---

# Verify GoDaddy DNS writes by polling the authoritative nameservers — API writes are visible instantly

Discovered 2026-11-06 while setting up the utobo sending-domain records for productsear.ch via the GoDaddy Domains API:

- **GoDaddy API writes appear on the authoritative nameservers instantly.** After `PUT`-ing the four mail records, polling `ns59.domaincontrol.com` directly (`dig @ns59.domaincontrol.com <name> <type>`) showed all records passing on the **first poll**. Polling authoritative NS bypasses resolver caches entirely, so it shows the true zone state — the state any third-party checker (utobo's verification, MXToolbox) will converge to. No "wait for propagation" needed.
- **Existing zone surprise**: the domain already had a `_dmarc` TXT with `p=reject` (GoDaddy/SecureServer default) — always inspect the full zone before writing, or you can silently downgrade/upgrade a security policy. (Here it was a deliberate, recorded downgrade — see the utobo sending-domain decision.)
- **GoDaddy TXT strings cap at 255 chars per string.** The utobo DKIM key (234 chars incl. `v=DKIM1; k=rsa; p=…`) fit as a single string; longer DKIM keys would need to be split into multiple quoted strings.
- The zone had **no MX records at all** before this — the `MX @ → mx.inbound.utobo.com` add was clean (skill rule: never clobber existing MX without checking).
