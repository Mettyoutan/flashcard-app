# /decks/[id] Detail Page — Design Spec

**Date:** 2026-07-12
**Scope:** `/decks/[id]` page — show one deck's cards, create/edit/delete cards. `DeckCard` on `/decks` becomes clickable, linking here.
**Out of scope (next sub-project):** `/decks/[id]/study` (study/flip view), deck edit/delete (the deck itself, not its cards).

## Why this scope now

`docs/ROADMAP.md` section 6 lists `/decks/[id]` as the step right after `/decks`. Backend is already fully ready for it — `api/src/cards/cards.controller.ts` has full CRUD (`GET/POST /decks/:deckId/cards`, `GET/PATCH/DELETE /decks/:deckId/cards/:cardId`), ownership-scoped and reviewed. `api/src/decks/decks.controller.ts` also already has `GET /decks/:id` for single-deck fetch. No backend work needed — this is a pure frontend build.

A stray empty file at this exact route (`web/src/app/decks/[id]/page.tsx`) was found and deleted during `/decks` cleanup (2026-07-12) — coincidentally the right path for this page, just accidentally created empty ahead of time.

## Architecture

Same reasoning as `/decks` (see `2026-07-09-decks-list-page-design.md` for the full argument): `access_token` lives in `localStorage`, a browser-only API, so this stays a **Client Component** with a **client-side guard**, no Server Component, no `middleware.ts`. Nothing new to decide here — this page inherits the pattern established by `/decks`.

**Route param:** the dynamic segment `[id]` (deck id) is read via `useParams()` (`next/navigation`), not `props.params` — this project's Next.js version reads route params client-side this way in Client Components (verify against `node_modules/next/dist/docs/` per this project's standing warning about breaking API changes).

## Frontend file structure

```
web/src/app/decks/[id]/page.tsx          — Client Component: guard, fetch deck + cards, compose everything below
web/src/types/card.ts                    — Card type (mirrors api/src/cards/schemas/card.schema.ts)
web/src/components/cards/CardItem.tsx    — one card: view mode + inline edit mode + delete
web/src/components/cards/CreateCardForm.tsx — controlled form, adds a card to the open deck
```

`components/cards/` is a new folder, same convention as `components/decks/` — one folder per backend domain module.

**Changed file:** `web/src/components/decks/DeckCard.tsx` — wrap the rendered `Card` in a `next/link` `<Link href={\`/decks/${deck.id}\`}>` so it's clickable from `/decks`. This is also what the unused `Link` import in `page.tsx` (found and removed during cleanup) was almost certainly meant for.

## Data model (frontend)

```ts
export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: string;
  updatedAt: string;
}
```

Mirrors `api/src/cards/schemas/card.schema.ts` (`front` max 100 chars, `back` max 300 chars, both `nonempty`). `createdAt`/`updatedAt` are `string`, same reasoning as `Deck` — JSON responses carry ISO date strings, not `Date` instances.

## Data flow

1. **Mount**: guard checks `access_token` — missing → `router.replace('/login')`. Present → proceed.
2. **Initial fetch**: one effect, one `ignore` flag, fetches deck + cards together via `Promise.all([apiFetch<Deck>(\`/decks/${id}\`), apiFetch<Card[]>(\`/decks/${id}/cards\`)])`. Success → `setDeck(deck)`, `setCards(cards)`. Either call `401` → `router.replace('/login')`. Other failure → inline error + "Coba lagi" (bumps a `retryTick`, same pattern as `/decks`).
3. **Create card**: `CreateCardForm` holds its own `front`/`back` state. Submit → `POST /decks/:deckId/cards` → returns the created `Card` → `onCreated(card)` → parent does `setCards(prev => [...prev, card])`. No refetch, same reasoning as deck creation.
4. **Edit card**: `CardItem` toggles into edit mode locally (own `isEditing`/`front`/`back` state, seeded from `card` on entering edit mode). Save → `PATCH /decks/:deckId/cards/:cardId` → returns updated `Card` → `onUpdated(card)` → parent does `setCards(prev => prev.map(c => c.id === card.id ? card : c))`. Cancel → discard local edits, exit edit mode, no API call.
5. **Delete card**: `CardItem`'s delete button → native `confirm("Hapus card ini?")` → if confirmed, `DELETE /decks/:deckId/cards/:cardId` → on success, `onDeleted(card.id)` → parent does `setCards(prev => prev.filter(c => c.id !== card.id))`.

All four mutations use `card.deckId` (or the route's `id` for create) to build the URL — no separate `deckId` prop threaded into `CardItem` beyond what's already on `card`.

## Component contracts

**`CardItem`** — owns its own edit-mode state and API calls, reports results upward via callbacks (parent owns the `cards` array, not the item).
```ts
type CardItemProps = {
  card: Card;
  onUpdated: (card: Card) => void;
  onDeleted: (cardId: string) => void;
};
```
View mode: renders `front`/`back` in a `Card`, "Edit" and "Hapus" buttons. Edit mode: two `Input`s (`front` `maxLength={100}`, `back` `maxLength={300}`, each with a live character counter — same pattern as `CreateDeckForm`), "Simpan"/"Batal" buttons. Own `error`/`isSubmitting` state for the edit-save and delete calls, shown inline within that card only — one card's failed edit doesn't affect the rest of the list.

**`CreateCardForm`** — mirrors `CreateDeckForm` exactly, one level down (card instead of deck).
```ts
type CreateCardFormProps = {
  deckId: string;
  onCreated: (card: Card) => void;
};
```
Fields: `front` (required, `maxLength={100}`), `back` (required, `maxLength={300}`), both with live counters. Submit disabled while in flight. Success → `onCreated`, clear both fields. Failure → inline error, fields not cleared.

## Error handling

- Initial fetch (deck or cards) fails non-401: inline error + "Coba lagi" retry, same shape as `/decks`.
- Initial fetch fails 401: redirect to `/login`, no error message (same reasoning as `/decks` — reads as "logged out," not "broke").
- Create/edit/delete fails: inline error in the owning component (`CreateCardForm` or the specific `CardItem`), using the existing `err instanceof ApiError ? err.message : '<fallback>'` pattern.
- **Explicit scope decision:** create/edit/delete do **not** special-case a `401` with a redirect — they show it as a plain error message, same as `CreateDeckForm` does today. This is an intentional inconsistency carried over from the existing pattern (only the page's own initial `GET` redirects on 401), not a new gap introduced by this page. If auto-redirect-on-401-for-mutations becomes a real need, it should be fixed for `CreateDeckForm` too, as a separate cross-cutting change.
- Empty card list (zero cards, no error): distinct empty-state message ("Belum ada card, bikin yang pertama di atas ↑" or similar), same convention as `/decks`.

## Testing

No automated frontend tests (unchanged project posture). Manual verification:
1. Click a deck from `/decks` — lands on `/decks/[id]`, shows the deck's title as a header.
2. Fresh deck (zero cards) — shows empty-state message, `CreateCardForm` visible above it.
3. Create a card — appears in the list immediately, no duplicate `GET` fires (network tab check).
4. Edit a card — toggles into edit mode with existing values pre-filled, save updates the card in place, cancel discards changes without an API call.
5. Delete a card — `confirm()` dialog appears; cancelling it leaves the card; confirming removes it from the list.
6. Visit `/decks/[id]` directly by URL while logged out — redirects to `/login`.
7. Expired/tampered token — `GET` on mount 401s → redirects to `/login`, not stuck loading.

## Definition of Done

- `/decks/[id]` renders the deck's title and its cards, or an empty-state message if none exist.
- Create/edit/delete all work without a full list refetch.
- Visiting while logged out redirects to `/login`.
- `DeckCard` on `/decks` links to `/decks/[id]`.
- `CardItem` and `CreateCardForm` are separate, independently-readable components under `web/src/components/cards/`.
- Typecheck (`tsc --noEmit`) and lint clean.
- Known, explicitly deferred (not blocking): study/flip view (`/decks/[id]/study`), deck-level edit/delete, 401-redirect-on-mutation (matches existing `CreateDeckForm` behavior, not a new gap).
