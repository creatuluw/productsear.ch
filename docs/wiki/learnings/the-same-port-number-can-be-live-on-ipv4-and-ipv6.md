---
type: Learning
title: The same port number can be live on IPv4 and IPv6 with different owners — hit 127.0.0.1 explicitly
description: Discovered 2026-11-06 during the mobile-adaptation preview loop. On Windows, two different processes can simultaneously own the SAME port number on different st
tags: [networking, ports, debugging, windows, processes]
timestamp: "2026-11-06T23:46:41.433Z"
---

# The same port number can be live on IPv4 and IPv6 with different owners — hit 127.0.0.1 explicitly

Discovered 2026-11-06 during the mobile-adaptation preview loop. On Windows, two different processes can simultaneously own the SAME port number on different stacks: the productsear.ch `node build` preview held IPv4 `127.0.0.1:4173` (PID 25332) while a concurrent session's vite preview (monstrous.dev) held `[::1]:4173` (PID 38196). `localhost` resolved to IPv6, so the browser fetched the OTHER app's 404 page — indistinguishable from "my server is broken".

This extends [[rules/verify-the-serving-process-on-a-test-port-before-trusting-sm]]: run `netstat -ano | findstr :<port>` and expect BOTH stacks in the output; address `127.0.0.1` explicitly to hit the IPv4 listener; and never kill the other session's PID — identify it, leave it alone (global no-name-kill rule).
