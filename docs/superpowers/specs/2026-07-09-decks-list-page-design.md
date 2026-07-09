# /decks List Page — Design Spec

**Date:** 2026-07-09
**Scope:** `/decks` page — list the logged-in user's decks, create new decks. First protected page in `web`; also the first route-protection guard.
**Out of scope (next sub-project):** `/decks/[id]` (card list + add/edit card), `/decks/[id]/study` (study view), deck edit/delete.

## Why this scope first

`docs/ROADMAP.md` section 6 lists `/decks` as the next build step after auth. It's the first page that needs real user data and the first page that needs to be protected from logged-out access — everything after this (`/decks/[id]`, study view) builds on the same list/create/guard patterns established here, so getting this page right first de-risks the rest.

## Architecture

### The localStorage vs. Server Component conflict (why this isn't a Server Component)

`docs/ROADMAP.md` originally described `/decks` as "server component fetch + auth check." That's not achievable as designed: the access token lives in `localStorage`, which is a browser-only API — a Next.js Server Component runs on the server during render and has no access to it. The backend's `JwtGuard` (`api/src/auth/strategies/jwt.strategy.ts`) only accepts `Authorization: Bearer <token>` via `ExtractJwt.fromAuthHeaderAsBearerToken()` — no cookie-based auth path exists for protected routes. A Server Component fetching `/decks` server-side would have no token to send.

Fixing this properly (e.g. also mirroring the access token into a plain readable cookie so the server can forward it) would reopen the already-approved auth-setup design (`2026-07-07-web-auth-setup-design.md`), which deliberately keeps `access` in `localStorage` only. Not worth reopening for one page.

**Decision: `/decks` is a Client Component**, consistent with every page built so far (`/signin`, `/login`, `/`). Data fetch happens in the browser via `apiFetch`, same as the auth pages.

### Route protection (also not literally "middleware")

For the same reason, Next.js `middleware.ts` can't gate this route either — middleware runs at the edge and can only read cookies/headers, not `localStorage`. Real middleware-based protection is deferred again (would need the cookie-mirroring change above).

**Decision: client-side guard.** On mount, `/decks/page.tsx` checks `localStorage.getItem('access_token')`. If absent, `router.replace('/login')` (not `push`, so the back button doesn't return to the protected page). This is the same shape as the existing home-page login check, just redirecting instead of toggling UI.

**Explicitly not handled in this phase:** expired-but-present tokens. If a token exists but is expired, the guard passes (token is present), the `GET /decks` call will 401, and the page shows the generic fetch-error state (see Error handling). Silent refresh / interceptor-based retry is deferred again — it needs a second real 401 case to design against, and this page provides that, but wiring it is scoped out to keep this page shippable. Tracked as follow-up.

## Frontend file structure

```
web/src/app/decks/page.tsx                    — Client Component: auth guard, fetch list, holds `decks` state, composes the two components below
web/src/components/decks/DeckCard.tsx         — presentational, props: { deck: Deck }
web/src/components/decks/CreateDeckForm.tsx   — controlled form, props: { onCreated: (deck: Deck) => void }
```

`components/decks/` is a new folder, separate from `components/ui/` (shadcn primitives) — one folder per domain, mirroring the backend's `api/src/decks/` module convention.

No new shadcn components needed: `description` is capped at 50 chars server-side (`DeckSchema`), so the existing `Input` covers it — no need to add `Textarea`.

## Data model (frontend)

```ts
interface Deck {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
```

Mirrors `api/src/decks/schemas/deck.schema.ts`. `createdAt`/`updatedAt` are `string`, not `Date` — same reasoning as `AuthResponse` in the auth-setup spec: the API response is JSON, dates arrive as ISO strings, not `Date` instances.

## Data flow

1. **Mount**: guard checks `access_token`. Missing → `router.replace('/login')`. Present → proceed.
2. **List fetch**: `apiFetch<Deck[]>('/decks')` (`GET`, `JwtGuard`-protected, `Authorization` header attached automatically by `apiFetch`). Success → `setDecks(result)`. Render: loading state while pending, then either the deck list or an empty-state message if `decks.length === 0`.
3. **Create**: `CreateDeckForm` holds its own `title`/`description` state (`useState`, matching every prior form). Submit → `apiFetch<Deck>('/decks', { method: 'POST', body: { title, description } })`. `POST /decks` returns the full created `Deck` (`DecksController.create` → `Promise<Deck>`). Success → call `onCreated(deck)` → parent page does `setDecks(prev => [...prev, deck])` and the form resets its own fields. **No refetch of the list** — the POST response is already the authoritative new record, so appending it locally is correct and saves a round trip.
4. **List `401`**: treated as an auth failure — `router.replace('/login')`, same as the missing-token case at mount. (This conflates "never logged in" and "token expired" into one redirect for now; splitting them is exactly the deferred refresh work noted above.)

## Component contracts

**`DeckCard`** — pure/presentational, no state, no API calls.
```ts
type DeckCardProps = { deck: Deck };
```
Renders `deck.title` and `deck.description` (if present) inside a shadcn `Card`. Nothing clickable yet — linking to `/decks/[id]` is next sub-project's scope.

**`CreateDeckForm`** — owns its own form state, calls the API itself, reports success upward via callback (parent owns the list, not the form).
```ts
type CreateDeckFormProps = { onCreated: (deck: Deck) => void };
```
Fields: `title` (required, `maxLength={100}`, matches `DeckSchema`), `description` (optional, `maxLength={50}`). Submit disabled while in flight (`isSubmitting`, same pattern as every auth form). On success: call `onCreated`, then clear both fields. On failure: inline error under the form, fields **not** cleared (so the user doesn't retype) — same convention as login/signin.

## Error handling

- List fetch fails with non-401 (e.g. 500, network error): inline error message in place of the list, with a "Coba lagi" button that re-runs the fetch. No auto-retry.
- List fetch fails with 401: redirect to `/login` (see Data flow, point 4) — no error message shown, since this reads as "you got logged out," not "something broke."
- Create fails: inline error under `CreateDeckForm`, using the same `err instanceof ApiError ? err.message : '<generic fallback>'` pattern as every prior form.
- Empty list (zero decks, no error): distinct empty-state message ("Belum ada deck, bikin yang pertama di atas ↑" or similar) — not the same UI as an error.

## Testing

No automated frontend tests (unchanged project posture). Manual + Playwright verification:
1. Log in, navigate to `/decks` — confirm empty-state message (fresh account, zero decks).
2. Create a deck via the form — confirm it appears in the list immediately, confirm no duplicate `GET /decks` fires (check network tab / request count — proves point 3 of Data flow, no refetch).
3. Log out, then navigate to `/decks` directly by URL — confirm redirect to `/login` (guard works without ever having been on an authenticated page in this browser session).
4. While logged in with an expired token (simulate by clearing/corrupting the stored token, or waiting out `ACCESS_EXPIRES_IN` if short enough in dev) — confirm `401` on `GET /decks` redirects to `/login` rather than showing a raw error or infinite loading spinner.

## Definition of Done

- `/decks` renders the logged-in user's decks, or an empty-state message if none exist.
- Create-deck form adds a new deck to the list without a full refetch.
- Visiting `/decks` while logged out redirects to `/login`.
- `DeckCard` and `CreateDeckForm` are separate, independently-readable components under `web/src/components/decks/`.
- Typecheck (`tsc --noEmit`) and lint clean.
- Known, explicitly deferred (not blocking): expired-token silent refresh, `/decks/[id]` navigation from `DeckCard`, deck edit/delete.
