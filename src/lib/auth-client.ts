import { createAuthClient } from 'better-auth/svelte';

// Browser client for /admin (login form, sign-out). Talks to /api/auth/*
// same-origin; cookies are handled automatically.
export const authClient = createAuthClient();
