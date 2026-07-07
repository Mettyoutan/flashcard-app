# Web Auth Setup — Design Spec

**Date:** 2026-07-07
**Scope:** First `web` (Next.js) sub-project — Tailwind/shadcn setup + login/register/logout pages, wired to the existing NestJS `auth` module.
**Out of scope (next sub-project):** `/decks` list page, route protection middleware, deck/card pages, study view.

## Why this scope first

`docs/ROADMAP.md` step 6 lists the full frontend build order. Building all of it in one spec is too large — this spec covers only the foundation (setup + auth), since nothing else works without a working login/register/logout flow. Route protection (middleware redirecting unauthenticated users) is deferred to the `/decks` sub-project, where there's an actual protected page to protect — building it now against nothing would be wasted/unverifiable work.

## Architecture

The browser talks to the NestJS API **directly** (no Next.js proxy/BFF layer). This is a deliberate choice, made after discovering `api/src/auth/auth.controller.ts` already sets `refresh_token` as an httpOnly cookie server-side (`res.cookie(...)` in `saveRefreshToCookie`) — the codebase was already built around direct cross-origin cookies, not a proxy pattern.

```
Browser (Client Component)
   │ fetch(`${NEXT_PUBLIC_API_URL}/auth/login`, { credentials: 'include' })
   ▼
NestJS API (different origin in production: web on Vercel, api on Render/Railway)
   │ Set-Cookie: refresh_token (httpOnly, sameSite=none, secure)   ← server-managed, JS never touches it
   │ response body: { access, user }
   ▼
Browser: stores `access` token in localStorage, stores nothing manually for refresh_token (cookie is automatic)
```

**Why direct cross-origin instead of a proxy**: matches existing backend code, avoids introducing a second new Next.js concept (Route Handlers) on top of CORS/cookies, which are already new. Confirmed current browser behavior via web search (2026-07-07): Chrome reversed its third-party-cookie-deprecation plan and third-party cookies remain enabled by default, so a correctly configured `SameSite=None; Secure` cross-origin cookie works in mainstream browsers today.

**Access token placement**: kept in `localStorage` (not React Context/in-memory), a deliberate simplicity trade-off — in-memory would require introducing React Context + an on-mount silent-refresh effect, two more new concepts, for a short-lived token whose leak blast radius is small. The sensitive long-lived token (`refresh_token`) is already httpOnly-protected regardless of this choice.

## Required backend changes (small, 2 files)

Current state (found during this session, not yet fixed):
- `api/src/auth/auth.controller.ts::saveRefreshToCookie` sets `sameSite: 'strict'` — this **silently breaks** cross-origin cookie delivery (browser never sends it when `web` and `api` are different origins). Same for the cookie-clearing call in `logout()`.
- `api/src/main.ts:9-12` already calls `app.enableCors({ origin: [], credentials: true })` — but `origin: []` is an empty allowlist, so **no origin is currently permitted**. Must be populated with the `web` origin(s).

Changes needed:
1. `auth.controller.ts`: both `res.cookie(...)` calls (`saveRefreshToCookie` and the clear-cookie call in `logout`) → `sameSite: 'none'`, add `secure: true`.
2. `main.ts`: `origin: []` → `origin: [process.env.FRONTEND_URL]` (or a small array for dev + prod), read from env, not hardcoded.
3. **Local dev port collision**: `api` defaults to port 3000 (`process.env.PORT ?? 3000`), and `web`'s `next dev` also defaults to port 3000 — they can't both run on 3000 locally. Resolution: run `web` on 3001 (`next dev -p 3001` or a `PORT=3001` env), keep `api` on 3000. `FRONTEND_URL` for local dev = `http://localhost:3001`.

## Frontend file structure

```
web/src/app/(auth)/login/page.tsx        — Client Component, useState-based form
web/src/app/(auth)/register/page.tsx     — Client Component, useState-based form
web/src/app/(auth)/layout.tsx            — optional shared layout (centered card, no nav) — nice-to-have, not blocking
web/src/lib/api.ts                       — fetch helper: reads NEXT_PUBLIC_API_URL, attaches Authorization header from localStorage when present
web/.env.local                           — NEXT_PUBLIC_API_URL=http://localhost:3000 (dev)
```

`(auth)` is a Next.js Route Group — parentheses mean the segment is excluded from the URL, so routes remain `/login` and `/register` while the files live grouped together. Confirmed against this project's bundled Next.js docs (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md`) since this Next.js version has other breaking changes vs. training data.

shadcn/ui: run init, add `button`, `input`, `label`, `card` components — enough for two simple forms.

## Data flow

**Register**: form (username, email, password, useState) → submit → `POST /auth/signin` with `credentials:'include'` → on 201, store `access` in localStorage, redirect to `/` → on 409 (email exists), show inline error under the form.

**Login**: form (email, password) → `POST /auth/login` with `credentials:'include'` → on 200, store `access`, redirect to `/` → on 401/404 (wrong credentials), show inline error.

**Logout**: button on `/` (shown only if `access` present in localStorage) → `POST /auth/logout` with `credentials:'include'` (browser auto-attaches `refresh_token` cookie) → on success, remove `access` from localStorage, refresh UI to logged-out state.

Note: `refresh` endpoint (silent access-token renewal) is **not** wired up in this phase — access token is simply re-obtained via a fresh login if it expires. Wiring `/auth/refresh` into the fetch helper is deferred to the `/decks` phase, where long-lived sessions actually matter.

## Error handling

All three flows: `fetch` response checked for `!res.ok`; on failure, parse the error body's `message` (NestJS default error shape) and render it as inline text under the form. No toast/notification library — keeps scope minimal.

## Testing

No automated frontend tests in this phase (matches project's current testing posture — backend specs are also still placeholder-only, tracked in memory). Verification is manual: register a real account against the running API, confirm `refresh_token` cookie appears in browser devtools (Application → Cookies) with `httpOnly` + `SameSite=None` flags, confirm `access` in localStorage, confirm login/logout round-trip, confirm wrong-password/duplicate-email errors render.

## Definition of Done

- `sameSite`/`secure` fixed in `auth.controller.ts`, CORS origin populated in `main.ts`, dev port collision resolved
- `/login`, `/register` pages functional against the real (locally running) NestJS API
- Successful register/login → `access` in localStorage, `refresh_token` cookie set, redirect to `/`
- Logout clears both
- Wrong-password / duplicate-email errors surface inline in the UI
- Typecheck (`tsc --noEmit`) and lint clean on both `api` (changed files) and `web`
