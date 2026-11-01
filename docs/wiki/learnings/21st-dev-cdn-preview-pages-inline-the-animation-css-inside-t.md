---
type: Learning
title: 21st.dev CDN preview pages inline the animation CSS inside the JS bundle, not the HTML
description: "When the user shares a component URL like `https://cdn.21st.dev/loading-ui/symmetric-wave/default/bundle.<id>.html`, the HTML page is just a **React bundle shel"
tags: [frontend, design, reverse-engineering, 21st.dev, gotcha]
timestamp: "2026-11-01T13:20:24.961Z"
---

# 21st.dev CDN preview pages inline the animation CSS inside the JS bundle, not the HTML

When the user shares a component URL like `https://cdn.21st.dev/loading-ui/symmetric-wave/default/bundle.<id>.html`, the HTML page is just a **React bundle shell** — fetching it yields no styles.

**The gotcha:** the actual animation CSS (`@keyframes`, bar structure, stagger delays) is **inlined inside the ~251KB JS chunk** the shell loads, not in the HTML or a separate `.css` file.

**How to extract:**

1. Fetch the shell HTML, find the inlined `<script>` / JS chunk reference.
2. Fetch the JS (it's one big inlined bundle) and search inside it for `@keyframes` — the CSS is embedded as strings.
3. Reconstruct the component structure (element counts, sizes, per-element `animation-delay`) from the React render code in the same bundle.

Found 2026-11-01 while reverse-engineering the symmetric-wave loading indicator.
