# /decks/[id]/study — Flip-Card Study View Design Spec

**Date:** 2026-07-14
**Scope:** `/decks/[id]/study` page — study one deck's cards one at a time (flip front/back, next/prev navigation). "Mulai Belajar" link added to `/decks/[id]` (manage page) to reach it.
**Out of scope (deferred, not this sub-project):** SM-2 spaced repetition, animated CSS flip, shuffle/randomized order, session progress persistence, deck-level edit/delete.

## Why this scope now

`docs/ROADMAP.md` section 6 lists study view as the last frontend piece before deploy (section 7). Backend needs **zero changes** — `GET /decks/:deckId/cards` (`api/src/cards/cards.controller.ts:27-35`) already returns everything needed (`id`, `front`, `back`). The roadmap originally proposed a dedicated `GET /decks/:deckId/study` endpoint, but it would return an identical shape to the existing cards endpoint (no SM-2/difficulty/order fields exist on `Card` yet — that's deferred to a later project in the roadmap), so building a second endpoint would be pure duplication. Decision: reuse the existing cards endpoint.

## Architecture

Same reasoning as `/decks` and `/decks/[id]` (see those specs for the full argument): `access_token` lives in `localStorage`, browser-only, so this stays a **Client Component** with a **client-side guard**, no Server Component, no `middleware.ts`. Nothing new to decide — inherits the established pattern.

## Frontend file structure

```
web/src/app/decks/[id]/study/page.tsx   — Client Component: guard, fetch deck+cards, own study-session state, render
```

**Changed file:** `web/src/components/decks` is untouched; the only modified file is `web/src/app/decks/[id]/page.tsx` — add a "Mulai Belajar" link near the deck title.

**No new component decomposition.** Unlike `/decks` and `/decks/[id]`, this page does not split into a `types/`+`Item`+`Form` set: there's exactly one card visible at a time, it makes zero API calls of its own, and it isn't repeated in a `.map`. A separate `StudyCard.tsx` would just be prop-drilling (`front`, `back`, `isFlipped`, `onFlip`) with no independent behavior — not worth the indirection. Reuses the existing `Card`/`CardHeader`/`CardTitle`/`CardContent` primitives from `web/src/components/ui/card.tsx` directly in the page.

**No new type file.** Reuses `web/src/types/card.ts` (`Card`) and `web/src/types/deck.ts` (`Deck`) verbatim.

## Flip interaction: plain text toggle, no animation

**Decision (confirmed directly with user):** clicking the card toggles a boolean; the displayed text switches from `card.front` to `card.back` (and back). No CSS 3D transform (`rotateY`, `backface-visibility`, `perspective`).

**Why:** no flip-capable UI primitive exists in this codebase to copy from (`card.tsx` is a plain div). A real 3D flip is genuinely fiddly CSS with several interacting properties, easy to get subtly wrong — and the user has said he's weak in CSS. The roadmap asks for a flip *interaction*, not a flip *animation*. This is the same "toggle what's rendered" pattern `CardItem` already uses for its edit/view mode. An animated flip is a legitimate future polish item, deliberately deferred the same way SM-2 is — not an oversight.

**Affordance so it still reads as intentional:** the whole card area is clickable (`cursor-pointer`), a small label above the text says "Depan"/"Belakang" (same words already used for front/back elsewhere in this project), and a hint line under the card ("Klik untuk lihat jawaban") is shown only while unflipped.

## Data model (frontend)

No new types. Reuses:
```ts
// web/src/types/card.ts (unchanged)
export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: string;
  updatedAt: string;
}
```

## Data flow

1. **Mount**: guard checks `access_token` — missing → `router.replace('/login')`. Present → proceed.
2. **Initial fetch**: one effect, one `ignore` flag, fetches deck + cards together via `Promise.all([apiFetch<Deck>('/decks/${id}'), apiFetch<Card[]>('/decks/${id}/cards')])` — the exact same two calls `/decks/[id]/page.tsx` already makes. Success → `setDeck`, `setCards`, and reset `currentIndex` to `0` / `isFlipped` to `false` (defensive — matters if `retryTick` triggers a refetch after the user had already moved around). Either call `401` → redirect `/login`. Other failure → inline error + "Coba lagi" (bumps `retryTick`, same pattern as every prior page).
3. **Flip**: click card → `setIsFlipped(f => !f)`. No API call.
4. **Next**: `setCurrentIndex(i => i + 1)` **and** `setIsFlipped(false)`, together in one handler — a new card always starts showing its front. Disabled when `currentIndex === cards.length - 1`.
5. **Prev**: `setCurrentIndex(i => i - 1)` **and** `setIsFlipped(false)`, same handler shape. Disabled when `currentIndex === 0`.
6. **`currentCard`** is derived at render time (`cards[currentIndex]`), never stored as its own state — can't go stale relative to `cards`/`currentIndex`.

No wraparound at the boundaries — disabling is unambiguous and doesn't require inventing an "end of session" state, which is out of scope here.

## Component contracts

Single page component, no props (route-driven via `useParams`). Internal state:
```ts
const [deck, setDeck] = useState<Deck | null>(null);
const [cards, setCards] = useState<Card[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [isFlipped, setIsFlipped] = useState(false);
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(true);
const [retryTick, setRetryTick] = useState(0);
```

**"Mulai Belajar" link** on `/decks/[id]/page.tsx` — `Button` (`web/src/components/ui/button.tsx`) is a `@base-ui/react` primitive rendering a native `<button>` with no `asChild` prop, so a button-*styled link* uses the exported `buttonVariants` directly on a `Link`:
```tsx
<Link href={`/decks/${id}/study`} className={buttonVariants({ variant: "default" })}>
  Mulai Belajar
</Link>
```
Not `<Button><Link>...` nor `<Link><Button>...` (both nest two interactive elements, which is invalid semantics for one clickable action). Placed next to the `<h1>{deck?.title}</h1>` in a flex row. Left enabled even when `cards.length === 0` — the study page's own empty state (below) handles that, no extra conditional needed on the manage page.

## Error handling

- Initial fetch (deck or cards) fails non-401: inline error + "Coba lagi" retry, same shape as `/decks` and `/decks/[id]`.
- Initial fetch fails 401: redirect to `/login`, no error message (same reasoning as every other protected page).
- Empty deck (`cards.length === 0`, no error): message ("Belum ada card di deck ini, tambahkan dulu di halaman deck.") with a link back to `/decks/[id]`. No flip/Next/Prev UI rendered — there's nothing to operate on.

## Testing

No automated frontend tests (unchanged project posture). Manual verification:
1. From `/decks/[id]`, click "Mulai Belajar" — lands on `/decks/[id]/study`, deck title shown, first card's front visible, "Kartu 1 dari N" shown.
2. Click the card — flips to back ("Belakang" label + `card.back` text). Click again — flips back to front.
3. Click Next — moves to card 2, front showing (flip state reset even if card 1 was left flipped), position indicator updates to "Kartu 2 dari N".
4. Click Prev repeatedly back to card 1 — Prev button disabled at index 0.
5. Navigate to the last card — Next button disabled.
6. Deck with zero cards — empty-state message shown, no flip/Next/Prev controls, link back to `/decks/[id]` works.
7. Visit `/decks/[id]/study` directly by URL while logged out — redirects to `/login`.
8. Expired/tampered token — initial `GET` 401s → redirects to `/login`, not stuck loading.

## Definition of Done

- `/decks/[id]/study` shows one card at a time from the deck, front first.
- Click toggles front/back text (no animation).
- Next/Prev navigate sequentially, disabled at the boundaries, and always reset to the front of the newly-shown card.
- Empty deck shows a message instead of flip/nav controls.
- Visiting while logged out redirects to `/login`.
- "Mulai Belajar" link added to `/decks/[id]`, navigating to the study page.
- Typecheck (`tsc --noEmit`) and lint clean.
- Known, explicitly deferred (not blocking): SM-2 spaced repetition, animated CSS flip, shuffle order, session progress persistence.
