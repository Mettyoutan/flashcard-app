# /decks/[id]/study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note for this project specifically:** the user is implementing this plan by hand himself (learning React/Next.js), not delegating to a subagent — see `docs/superpowers/specs/2026-07-14-study-view-design.md` and prior plan `2026-07-12-deck-detail-page.md` for the established pattern. Code blocks below are the reference the user types from; expect the actual files to diverge slightly and to need review/debugging afterward, same as every prior task in this project.

**Goal:** Build `/decks/[id]/study` — a read-only, one-card-at-a-time flip view with Next/Prev navigation, and add a "Mulai Belajar" link from `/decks/[id]` to reach it.

**Architecture:** One new file (`web/src/app/decks/[id]/study/page.tsx`) that mirrors the guard+fetch pattern from `/decks/[id]/page.tsx`, plus local session state (`currentIndex`, `isFlipped`). No new backend, no new type file, no new sub-components — reuses `GET /decks/:deckId/cards`, `Card`/`Deck` types, and the existing `Card` UI primitive. One modified file (`/decks/[id]/page.tsx`) to add the entry link. Full rationale: `docs/superpowers/specs/2026-07-14-study-view-design.md`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui, plain `useState` (no react-hook-form), existing `apiFetch` helper (`web/src/lib/api.ts`).

## Global Constraints

- No react-hook-form / form libraries — this page has no form, but if you add any interactive state, plain `useState`, matching every prior page in this project.
- No Server Components, no `middleware.ts` — client-side guard, same pattern as `web/src/app/decks/[id]/page.tsx`.
- No automated frontend tests — matches project's established posture. Verification is manual (browser) + typecheck.
- `apiFetch<T>(path, options?)` (`web/src/lib/api.ts`) signature: `options.method` required if `options` passed at all; throws `ApiError` (`.message`, `.status`) on non-2xx.
- **Flip interaction is a plain boolean toggle (front/back text swap), NOT a CSS animation** — confirmed decision, see spec. Do not add `transform`/`rotateY`/`perspective` CSS.
- **No wraparound** at Next/Prev boundaries — disable the button instead.
- Backend needs zero changes: `GET /decks/:deckId/cards` (`api/src/cards/cards.controller.ts`) is reused as-is.

---

### Task 1: `/decks/[id]/study` page

**Files:**
- Create: `web/src/app/decks/[id]/study/page.tsx`

**Interfaces:**
- Consumes: `Deck` (`@/types/deck`); `Card` (`@/types/card`); `apiFetch`, `ApiError` (`@/lib/api`); `Button` (`@/components/ui/button`); `Card`, `CardHeader`, `CardTitle`, `CardContent` (`@/components/ui/card`)
- Produces: route `/decks/[id]/study` — nothing consumed by later tasks

- [ ] **Step 1: Write the page**

Create `web/src/app/decks/[id]/study/page.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError, apiFetch } from "@/lib/api";
import type { Deck } from "@/types/deck";
import type { Card as CardType } from "@/types/card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudyPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    let ignore = false;

    async function loadData() {
      try {
        const [deckResult, cardsResult] = await Promise.all([
          apiFetch<Deck>(`/decks/${id}`),
          apiFetch<CardType[]>(`/decks/${id}/cards`),
        ]);
        if (!ignore) {
          setDeck(deckResult);
          setCards(cardsResult);
          setCurrentIndex(0);
          setIsFlipped(false);
        }
      } catch (e: unknown) {
        if (ignore) return;
        if (e instanceof ApiError && e.status === 401) {
          router.replace("/login");
          return;
        }
        setError(e instanceof ApiError ? e.message : "Gagal mengambil deck.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, [id, router, retryTick]);

  function handleNext() {
    setCurrentIndex((i) => i + 1);
    setIsFlipped(false);
  }

  function handlePrev() {
    setCurrentIndex((i) => i - 1);
    setIsFlipped(false);
  }

  if (isLoading) return null;

  const currentCard = cards[currentIndex];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">{deck?.title ?? "Deck"}</h1>

      {error && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm text-red-500">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setRetryTick((t) => t + 1);
            }}
          >
            Coba lagi
          </Button>
        </div>
      )}

      {!error && cards.length === 0 && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm text-muted-foreground">
            Belum ada card di deck ini, tambahkan dulu di halaman deck.
          </p>
          <Link href={`/decks/${id}`} className="text-sm underline">
            Balik ke halaman deck
          </Link>
        </div>
      )}

      {!error && cards.length > 0 && currentCard && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Kartu {currentIndex + 1} dari {cards.length}
          </p>

          <Card
            className="cursor-pointer"
            onClick={() => setIsFlipped((f) => !f)}
          >
            <CardHeader>
              <CardTitle>{isFlipped ? "Belakang" : "Depan"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
              {!isFlipped && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Klik untuk lihat jawaban
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```
Same guard+ignore-flag+retryTick shape as `/decks/[id]/page.tsx`, extended with `currentIndex`/`isFlipped` for the study session. `handleNext`/`handlePrev` always reset `isFlipped` together with moving the index — a new card never opens already flipped. `currentCard = cards[currentIndex]` is computed at render, not stored. Clicking the `Card` toggles `isFlipped`; the hint text only shows while unflipped.

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Commit**

```bash
git add web/src/app/decks/[id]/study/page.tsx
git commit -m "feat: add /decks/[id]/study flip-card view"
```

---

### Task 2: "Mulai Belajar" link on `/decks/[id]`

**Files:**
- Modify: `web/src/app/decks/[id]/page.tsx`

**Interfaces:**
- Consumes: `Link` (`next/link`), `buttonVariants` (`@/components/ui/button`) — both new imports
- Produces: nothing consumed elsewhere — last task in this plan

- [ ] **Step 1: Add the link next to the deck title**

In `web/src/app/decks/[id]/page.tsx`, add to the imports:
```tsx
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
```
(replace the existing `import { Button } from "@/components/ui/button";` line with the one above, adding `buttonVariants` to the same import)

Then change the `<h1>` line:
```tsx
<h1 className="text-2xl font-bold">{deck?.title ?? "Deck"}</h1>
```
to:
```tsx
<div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold">{deck?.title ?? "Deck"}</h1>
  <Link href={`/decks/${id}/study`} className={buttonVariants({ variant: "default" })}>
    Mulai Belajar
  </Link>
</div>
```
`buttonVariants` is used directly on the `Link` (not `Button` wrapping `Link`, or vice versa) because `Button` renders a native `<button>` with no `asChild` prop — nesting two interactive elements would be invalid. `buttonVariants` gives the `Link` the same visual styling as a `Button` without making it one.

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Lint**

Run: `cd web && npm run lint`
Expected: no new errors introduced by this change (pre-existing `web/src/app/page.tsx` error and pre-existing unused-import warnings elsewhere are known, out of scope)

- [ ] **Step 4: Manual verification — full flow**

With `api` (port 3000) and `web` (port 3001) running, logged in with a deck that has at least 2 cards:

1. On `/decks/[id]`, click "Mulai Belajar" — lands on `/decks/[id]/study`, deck title shown, first card's front visible, "Kartu 1 dari N".
2. Click the card — flips to back (label changes to "Belakang", text changes to `card.back`, hint text disappears). Click again — flips back to front.
3. Click Next — moves to card 2, front showing even if card 1 was left flipped, "Kartu 2 dari N".
4. Click Prev back to card 1 — Prev button disabled at index 0.
5. Navigate to the last card — Next button disabled.
6. Open a deck with zero cards (or delete all cards from one via `/decks/[id]`), visit its `/study` — empty-state message shown, no flip/Next/Prev controls, link back to `/decks/[id]` works.
7. Log out (or tamper the token), visit `/decks/[id]/study` directly by URL — redirects to `/login`.

- [ ] **Step 5: Commit**

```bash
git add web/src/app/decks/[id]/page.tsx
git commit -m "feat: link /decks/[id] to study view"
```
