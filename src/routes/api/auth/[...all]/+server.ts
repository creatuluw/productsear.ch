import { toSvelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from '$lib/server/auth';

// better-auth catch-all: GET/POST /api/auth/* (sign-in, sign-up, sign-out, session)
const handler = toSvelteKitHandler(auth);

export const GET = handler;
export const POST = handler;
