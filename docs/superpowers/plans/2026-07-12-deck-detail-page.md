# /decks/[id] Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note for this project specifically:** the user is implementing this plan by hand himself (learning React/Next.js), not delegating to a subagent — see `docs/superpowers/specs/2026-07-12-deck-detail-page-design.md` and prior plan `2026-07-09-decks-list-page.md` for the established pattern. Code blocks below are the reference the user types from; expect the actual files to diverge slightly and to need review/debugging afterward, same as every prior task in this project.

**Goal:** Build `/decks/[id]` — a Client Component page showing one deck's cards, with create/edit/delete, and make `DeckCard` on `/decks` link here.

**Architecture:** Four files: a shared `Card` type, a `CardItem` component (view + inline edit + delete, owns its own API calls), a `CreateCardForm`, composed by the `/decks/[id]` page which owns the guard + `deck`/`cards` state. `DeckCard` on `/decks` gets wrapped in a `next/link` to point here. No Server Components, no middleware — same reasoning as `/decks`. Full rationale: `docs/superpowers/specs/2026-07-12-deck-detail-page-design.md`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui, plain `useState` (no react-hook-form), existing `apiFetch` helper (`web/src/lib/api.ts`).

## Global Constraints

- No react-hook-form / form libraries — plain `useState` per field, matching every prior form in this project.
- No Server Components, no `middleware.ts` — `access_token` is `localStorage`-only. Client-side guard, same pattern as `web/src/app/decks/page.tsx`.
- `React.FormEvent` is deprecated in this project's React version — use `SubmitEvent<HTMLFormElement>` for form submit handlers.
- No automated frontend tests — matches project's established posture. Verification is manual (browser) + typecheck.
- `apiFetch<T>(path, options?)` (`web/src/lib/api.ts`) signature: `options.method` required if `options` passed at all; throws `ApiError` (`.message`, `.status`) on non-2xx; returns `undefined as T` on `204 No Content`.
- **401 handling scope decision (per spec):** only the page's own initial `GET` (deck + cards fetch) redirects to `/login` on 401. Create/edit/delete show the error inline instead — matches `CreateDeckForm`'s existing behavior, not a new gap.
- Delete confirmation: native `confirm()`, no custom dialog component.
- `maxLength` + live character counter pattern (established in `CreateDeckForm.tsx`): a `<p>` under the `Input` showing `{value.length}/{MAX}`, red text when `value.length >= MAX`, using `cn` from `@/lib/utils`. `front` max is 100, `back` max is 300 (mirrors `api/src/cards/schemas/card.schema.ts`).
- Dynamic route param: `useParams<{ id: string }>()` from `next/navigation` (Client Component hook) — confirmed against `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-params.md`, not `props.params`.
- Backend is fully ready, no API changes needed: `GET /decks/:id` (`api/src/decks/decks.controller.ts`), `GET/POST /decks/:deckId/cards`, `GET/PATCH/DELETE /decks/:deckId/cards/:cardId` (`api/src/cards/cards.controller.ts`).

---

### Task 1: Shared `Card` type + `CardItem` component

**Files:**
- Create: `web/src/types/card.ts`
- Create: `web/src/components/cards/CardItem.tsx`

**Interfaces:**
- Consumes: `Card`, `CardHeader`, `CardTitle`, `CardContent` (`@/components/ui/card`), `Button` (`@/components/ui/button`), `Input` (`@/components/ui/input`), `Label` (`@/components/ui/label`), `apiFetch`, `ApiError` (`@/lib/api`), `cn` (`@/lib/utils`)
- Produces: `interface Card { id, deckId, front, back, createdAt, updatedAt }` (exported from `web/src/types/card.ts`), `CardItem` component with props `{ card: Card; onUpdated: (card: Card) => void; onDeleted: (cardId: string) => void }` — both consumed by Task 3

- [ ] **Step 1: Write the shared `Card` type**

Create `web/src/types/card.ts`:
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
Mirrors `api/src/cards/schemas/card.schema.ts`. `createdAt`/`updatedAt` are `string` — same reasoning as `Deck`, JSON responses carry ISO date strings.

- [ ] **Step 2: Write `CardItem`**

Create `web/src/components/cards/CardItem.tsx`:
```tsx
"use client";

import { useState, type SubmitEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { apiFetch, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Card as CardType } from "@/types/card";

const FRONT_MAX = 100;
const BACK_MAX = 300;

type CardItemProps = {
  card: CardType;
  onUpdated: (card: CardType) => void;
  onDeleted: (cardId: string) => void;
};

export default function CardItem({ card, onUpdated, onDeleted }: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function startEditing() {
    setFront(card.front);
    setBack(card.back);
    setError("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setError("");
  }

  async function handleSave(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const updated = await apiFetch<CardType>(
        `/decks/${card.deckId}/cards/${card.id}`,
        { method: "PATCH", body: { front, back } },
      );
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal simpan card.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Hapus card ini?")) return;

    try {
      await apiFetch<void>(`/decks/${card.deckId}/cards/${card.id}`, {
        method: "DELETE",
      });
      onDeleted(card.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal hapus card.");
    }
  }

  if (isEditing) {
    return (
      <Card>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`front-${card.id}`}>Depan</Label>
              <Input
                id={`front-${card.id}`}
                value={front}
                onChange={(e) => setFront(e.target.value)}
                maxLength={FRONT_MAX}
                required
              />
              <p
                className={cn(
                  "text-xs",
                  front.length >= FRONT_MAX ? "text-red-500" : "text-muted-foreground",
                )}
              >
                {front.length}/{FRONT_MAX}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`back-${card.id}`}>Belakang</Label>
              <Input
                id={`back-${card.id}`}
                value={back}
                onChange={(e) => setBack(e.target.value)}
                maxLength={BACK_MAX}
                required
              />
              <p
                className={cn(
                  "text-xs",
                  back.length >= BACK_MAX ? "text-red-500" : "text-muted-foreground",
                )}
              >
                {back.length}/{BACK_MAX}
              </p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Nyimpen..." : "Simpan"}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEditing}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{card.front}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{card.back}</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={startEditing}>
            Edit
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```
Two render branches: edit mode (form, seeded from `card` each time `startEditing` runs — so stale local edits from a previous cancelled attempt don't leak in) and view mode. `onUpdated`/`onDeleted` report results upward; `CardItem` never touches a shared list itself, matching the callback-prop pattern from `CreateDeckForm`. `card.deckId` builds every URL — no separate `deckId` prop needed.

- [ ] **Step 3: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 4: Commit**

```bash
git add web/src/types/card.ts web/src/components/cards/CardItem.tsx
git commit -m "feat: add Card type and CardItem component"
```

---

### Task 2: `CreateCardForm` component

**Files:**
- Create: `web/src/components/cards/CreateCardForm.tsx`

**Interfaces:**
- Consumes: `Card` (Task 1); `apiFetch`, `ApiError` (`@/lib/api`); `cn` (`@/lib/utils`); `Button`, `Input`, `Label`, `Card`, `CardContent`, `CardHeader`, `CardTitle` (`@/components/ui/*`)
- Produces: `CreateCardForm` component with props `{ deckId: string; onCreated: (card: Card) => void }` — consumed by Task 3

- [ ] **Step 1: Write the form**

Create `web/src/components/cards/CreateCardForm.tsx`:
```tsx
"use client";

import { useState, type SubmitEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { apiFetch, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Card as CardType } from "@/types/card";

const FRONT_MAX = 100;
const BACK_MAX = 300;

type CreateCardFormProps = {
  deckId: string;
  onCreated: (card: CardType) => void;
};

export default function CreateCardForm({ deckId, onCreated }: CreateCardFormProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const card = await apiFetch<CardType>(`/decks/${deckId}/cards`, {
        method: "POST",
        body: { front, back },
      });

      onCreated(card);
      setFront("");
      setBack("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal bikin card.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bikin Card Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="front">Depan</Label>
            <Input
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              maxLength={FRONT_MAX}
              required
            />
            <p
              className={cn(
                "text-xs",
                front.length >= FRONT_MAX ? "text-red-500" : "text-muted-foreground",
              )}
            >
              {front.length}/{FRONT_MAX}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="back">Belakang</Label>
            <Input
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              maxLength={BACK_MAX}
              required
            />
            <p
              className={cn(
                "text-xs",
                back.length >= BACK_MAX ? "text-red-500" : "text-muted-foreground",
              )}
            >
              {back.length}/{BACK_MAX}
            </p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Bikin..." : "Bikin Card"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```
Same shape as `CreateDeckForm`, one level down: `deckId` comes from the parent page's route param (this form doesn't read the URL itself), `onCreated(card)` reports the server's response so the parent can append it without a refetch.

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Commit**

```bash
git add web/src/components/cards/CreateCardForm.tsx
git commit -m "feat: add CreateCardForm component"
```

---

### Task 3: `/decks/[id]` page — guard, fetch, compose

**Files:**
- Create: `web/src/app/decks/[id]/page.tsx`

**Interfaces:**
- Consumes: `Deck` (`@/types/deck`); `Card` (Task 1); `CardItem` (Task 1); `CreateCardForm` (Task 2); `apiFetch`, `ApiError` (`@/lib/api`); `Button` (`@/components/ui/button`)
- Produces: route `/decks/[id]` — nothing consumed by later tasks

- [ ] **Step 1: Write the page**

Create `web/src/app/decks/[id]/page.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import type { Deck } from "@/types/deck";
import type { Card as CardType } from "@/types/card";
import CardItem from "@/components/cards/CardItem";
import CreateCardForm from "@/components/cards/CreateCardForm";
import { Button } from "@/components/ui/button";

export default function DeckDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryTick, setRetryTick] = useState(0);

  function handleCardCreated(card: CardType) {
    setCards((prev) => [...prev, card]);
  }

  function handleCardUpdated(card: CardType) {
    setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
  }

  function handleCardDeleted(cardId: string) {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  }

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
        }
      } catch (e: unknown) {
        if (ignore) return;
        if (e instanceof ApiError && e.status === 401) {
          router.replace("/login");
          return;
        }
        setError(e instanceof ApiError ? e.message : "Failed fetching deck.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, [id, router, retryTick]);

  if (isLoading) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">{deck?.title ?? "Deck"}</h1>

      <CreateCardForm deckId={id} onCreated={handleCardCreated} />

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
        <p className="text-sm text-muted-foreground">
          Belum ada card, bikin yang pertama di atas ↑
        </p>
      )}

      {!error && cards.length > 0 && (
        <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onUpdated={handleCardUpdated}
              onDeleted={handleCardDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```
Same guard+ignore-flag+retryTick shape as `web/src/app/decks/page.tsx`, extended to fetch two resources (`Promise.all`) instead of one — either call 401ing redirects to `/login`, any other failure shows the shared error+retry UI. `id` from `useParams` goes into the effect's dependency array (Next.js guarantees it's stable per route, but including it documents the real dependency and matches the lint rule's exhaustive-deps expectations).

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Lint**

Run: `cd web && npm run lint`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add web/src/app/decks/[id]/page.tsx
git commit -m "feat: add /decks/[id] page with card CRUD"
```

---

### Task 4: `DeckCard` — link to `/decks/[id]`

**Files:**
- Modify: `web/src/components/decks/DeckCard.tsx`

**Interfaces:**
- Consumes: `Link` (`next/link`) — new import
- Produces: nothing consumed elsewhere — last task in this plan

- [ ] **Step 1: Wrap `DeckCard` in a `Link`**

Modify `web/src/components/decks/DeckCard.tsx` — full new contents:
```tsx
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import type { Deck } from "@/types/deck";

type DeckCardProps = {
  deck: Deck;
};

export default function DeckCard({ deck }: DeckCardProps) {
  return (
    <Link href={`/decks/${deck.id}`} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle>{deck.title}</CardTitle>
          {deck.description && (
            <CardDescription>{deck.description}</CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
```
`Link` renders an `<a>`, which is inline by default — `className="block"` on it makes the whole card area clickable, not just the text. `hover:bg-muted/50` on `Card` is the only visual affordance that it's clickable (no cursor/underline changes needed, `<a>` already gets a pointer cursor natively).

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Manual verification — full flow**

With `api` (port 3000) and `web` (port 3001) running, logged in with at least one deck:

1. On `/decks`, click a deck card → lands on `/decks/[id]`, header shows the deck's title.
2. Fresh/empty deck → shows "Belum ada card, bikin yang pertama di atas ↑", `CreateCardForm` visible above it.
3. Create a card via the form → appears in the list immediately; check devtools Network tab confirms exactly one `POST .../cards` fires, no follow-up `GET`.
4. Click "Edit" on a card → form appears pre-filled with current `front`/`back`; change a value, click "Simpan" → card updates in place, exits edit mode. Click "Edit" again, change a value, click "Batal" → discards the change, no network request fires for the cancel.
5. Click "Hapus" on a card → browser `confirm()` dialog appears. Click Cancel → card stays. Click "Hapus" again, confirm → card disappears from the list.
6. Log out (or open a private window), navigate directly to an existing `/decks/[id]` URL → redirected to `/login`.
7. With a tampered/expired `access_token` in `localStorage`, reload `/decks/[id]` → redirected to `/login`, not stuck loading.

- [ ] **Step 4: Commit**

```bash
git add web/src/components/decks/DeckCard.tsx
git commit -m "feat: link DeckCard to /decks/[id]"
```
