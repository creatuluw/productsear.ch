---
type: Decision
title: Use Plausible for privacy-friendly site analytics, wired in app.html
description: Context
tags: [analytics, plausible, frontend, app-html]
status: accepted
timestamp: "2026-11-01T13:33:42.918Z"
---

# Use Plausible for privacy-friendly site analytics, wired in app.html

## Context

productsear.ch had no usage measurement. We want to know how much traffic the site gets (and later, which features are used) without adding a cookie-consent banner or shipping personal data.

## Choice

Use **Plausible Analytics** (hosted, plausible.io), wired site-wide via its new tokenized script in `src/app.html`:

```html
<script async src="https://plausible.io/js/pa-wy3y_Tr88wMGSxJ0WPXrO.js"></script>
<script>
  window.plausible = window.plausible || function(){...}; plausible.init();
</script>
```

- Placed in the `<head>` of `src/app.html`, **before** `%sveltekit.head%` — the one place guaranteed to be server-rendered into every page's initial HTML. A `<script src>` tag in Svelte component markup is not reliable (not executed when injected client-side), so `app.html` is the canonical home for site-wide third-party scripts in this SvelteKit app.
- The script URL embeds a **per-site token** (`pa-<token>.js`); there is no `data-domain` attribute in the new script format. The token is bound to the productsear.ch site in the Plausible dashboard.

## Alternatives considered

- **Google Analytics** — heavyweight, requires cookie consent (GDPR banner), contradicts the minimal/privacy-friendly product direction.
- **Self-hosted Plausible / Umami / Fathom** — extra infra to operate for marginal benefit; hosted Plausible is cookieless and consent-free.
- **No analytics** — flying blind on whether the corpus/search is actually used.

## Rationale

Plausible is privacy-friendly and cookieless by design, so no consent banner is needed; the integration is two script tags with zero bundle impact.

## Consequences

- Every page load sends a pageview to plausible.io (the async script loads in the background).
- The site token is site-bound — if the domain changes, regenerate the snippet in the Plausible dashboard.
- Custom events (e.g. tracking searches, ask/skill usage) would be added later via `plausible(...)` calls; none are wired yet.
- Verify data shows up in the Plausible dashboard for the productsear.ch site.
