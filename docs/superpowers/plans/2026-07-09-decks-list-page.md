# /decks List Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note for this project specifically:** the user is implementing this plan by hand himself (learning React/Next.js), not delegating to a subagent — see `docs/superpowers/specs/2026-07-09-decks-list-page-design.md` and prior plan `2026-07-07-web-auth-setup.md` for the established pattern. Code blocks below are the reference the user types from; expect the actual files to diverge slightly and to need review/debugging afterward, same as every prior task in this project.

**Goal:** Build `/decks` — a Client Component page that lists the logged-in user's decks and lets them create new ones, with a client-side auth guard.

**Architecture:** Three new files: a shared `Deck` type, a presentational `DeckCard`, a self-contained `CreateDeckForm`, composed by the `/decks` page which owns the guard + list state. No Server Components, no middleware — `access_token` lives in `localStorage` only (browser-only API), and the backend only accepts `Authorization: Bearer` headers, so all auth/data-fetching stays client-side. Full rationale: `docs/superpowers/specs/2026-07-09-decks-list-page-design.md`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui, plain `useState` (no react-hook-form), existing `apiFetch` helper (`web/src/lib/api.ts`).

## Global Constraints

- No react-hook-form / form libraries — plain `useState` per field, matching every prior form in this project.
- No Server Components, no `middleware.ts` for this page — `access_token` is `localStorage`-only, unreadable server-side. See spec's "Architecture" section for why.
- `React.FormEvent` is deprecated in this project's React version (confirmed in `node_modules/@types/react/index.d.ts`) — use `SubmitEvent<HTMLFormElement>` for form submit handlers, matching `web/src/app/(auth)/login/page.tsx`.
- No automated frontend tests — matches project's established posture. Verification is manual (browser) + typecheck.
- Expired-token handling (silent refresh) is explicitly out of scope — a `401` from `GET /decks` redirects to `/login`, same as a missing token. Do not attempt to wire `/auth/refresh` in this plan.
- `apiFetch<T>(path, options?)` (from `web/src/lib/api.ts`) signature: `options.method` is required if `options` is passed at all (default `{ method: 'GET' }` only applies when `options` is omitted entirely); throws `ApiError` (has `.message` and `.status`) on non-2xx responses.

---

### Task 1: Shared `Deck` type + `DeckCard` component

**Files:**
- Create: `web/src/types/deck.ts`
- Create: `web/src/components/decks/DeckCard.tsx`

**Interfaces:**
- Consumes: `Card`, `CardHeader`, `CardTitle`, `CardDescription` (`@/components/ui/card`, from Task 2 of the auth-setup plan)
- Produces: `interface Deck { id: string; userId: string; title: string; description: string | null; createdAt: string; updatedAt: string }` (exported from `web/src/types/deck.ts`), `DeckCard` component with props `{ deck: Deck }` — both consumed by Tasks 2 and 3 below

- [ ] **Step 1: Write the shared `Deck` type**

Create `web/src/types/deck.ts`:
```ts
export interface Deck {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
```
This mirrors `api/src/decks/schemas/deck.schema.ts`. `createdAt`/`updatedAt` are `string` — the API sends JSON, dates arrive as ISO strings, not `Date` instances (same reasoning as `AuthResponse` in the auth pages).

- [ ] **Step 2: Write `DeckCard`**

Create `web/src/components/decks/DeckCard.tsx`:
```tsx
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Deck } from '@/types/deck';

type DeckCardProps = {
  deck: Deck;
};

export default function DeckCard({ deck }: DeckCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{deck.title}</CardTitle>
        {deck.description && <CardDescription>{deck.description}</CardDescription>}
      </CardHeader>
    </Card>
  );
}
```
Pure/presentational: no state, no API calls. `deck.description` is nullable (`string | null`), so the `&&` guard skips rendering `CardDescription` when it's `null` or empty.

- [ ] **Step 3: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 4: Commit**

```bash
git add web/src/types/deck.ts web/src/components/decks/DeckCard.tsx
git commit -m "feat: add Deck type and DeckCard component"
```

---

### Task 2: `CreateDeckForm` component

**Files:**
- Create: `web/src/components/decks/CreateDeckForm.tsx`

**Interfaces:**
- Consumes: `Deck` (Task 1); `apiFetch`, `ApiError` (`@/lib/api`); `Button`, `Input`, `Label`, `Card`, `CardContent`, `CardHeader`, `CardTitle` (`@/components/ui/*`)
- Produces: `CreateDeckForm` component with props `{ onCreated: (deck: Deck) => void }` — consumed by Task 3

- [ ] **Step 1: Write the form**

Create `web/src/components/decks/CreateDeckForm.tsx`:
```tsx
'use client';

import { useState, type SubmitEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiFetch, ApiError } from '@/lib/api';
import type { Deck } from '@/types/deck';

type CreateDeckFormProps = {
  onCreated: (deck: Deck) => void;
};

export default function CreateDeckForm({ onCreated }: CreateDeckFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const deck = await apiFetch<Deck>('/decks', {
        method: 'POST',
        body: { title, description: description || undefined },
      });
      onCreated(deck);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal bikin deck.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bikin Deck Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Deskripsi (opsional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={50}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Bikin...' : 'Bikin Deck'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```
Note: `handleSubmit` takes `SubmitEvent<HTMLFormElement>`, not `FormEvent` — `FormEvent` is `@deprecated` in this project's React types (see Global Constraints). On success, `onCreated(deck)` is called with the server's response (the full created `Deck`, since `POST /decks` returns `Promise<Deck>` on the backend) — the parent page appends it to its own list state; this component does not manage the list itself, only reports what it created.

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Commit**

```bash
git add web/src/components/decks/CreateDeckForm.tsx
git commit -m "feat: add CreateDeckForm component"
```

---

### Task 3: `/decks` page — auth guard, list fetch, compose

**Files:**
- Create: `web/src/app/decks/page.tsx`

**Interfaces:**
- Consumes: `Deck` (Task 1); `DeckCard` (Task 1); `CreateDeckForm` (Task 2); `apiFetch`, `ApiError` (`@/lib/api`); `Button` (`@/components/ui/button`)
- Produces: route `/decks` — nothing consumed by later tasks (last task in this plan)

- [ ] **Step 1: Write the page**

Create `web/src/app/decks/page.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import type { Deck } from '@/types/deck';
import DeckCard from '@/components/decks/DeckCard';
import CreateDeckForm from '@/components/decks/CreateDeckForm';
import { Button } from '@/components/ui/button';

export default function DecksPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.replace('/login');
      return;
    }
    loadDecks();
  }, [router]);

  async function loadDecks() {
    setIsLoading(true);
    setError('');

    try {
      const data = await apiFetch<Deck[]>('/decks');
      setDecks(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace('/login');
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Gagal memuat deck.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCreated(deck: Deck) {
    setDecks((prev) => [...prev, deck]);
  }

  if (isLoading) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">Deck Kamu</h1>

      <CreateDeckForm onCreated={handleCreated} />

      {error && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm text-red-500">{error}</p>
          <Button variant="outline" onClick={loadDecks}>
            Coba lagi
          </Button>
        </div>
      )}

      {!error && decks.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Belum ada deck, bikin yang pertama di atas ↑
        </p>
      )}

      {!error && decks.length > 0 && (
        <div className="flex flex-col gap-4">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </div>
  );
}
```
Guard logic: on mount, no `access_token` → `router.replace('/login')` (not `push` — the back button shouldn't return here). Token present → `loadDecks()`. Inside `loadDecks`, a `401` specifically also redirects to `/login` (covers the expired-token case, per spec — no refresh attempt, just treat it the same as never having logged in). Any other error (500, network failure) shows the inline error + retry button instead of redirecting. `handleCreated` appends the new deck directly from the `POST` response — no refetch of the whole list (see spec, Data flow point 3).

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Lint**

Run: `cd web && npm run lint`
Expected: no errors

- [ ] **Step 4: Manual verification — empty state + guard**

With `api` (port 3000) and `web` (`npm run dev`, port 3001) running: open a private/incognito browser window (clean `localStorage`), navigate directly to `http://localhost:3001/decks`.
Expected: immediately redirected to `/login` (no flash of the decks page content).

Log in with an existing account (or create a fresh one via `/signin` first, so it has zero decks). Navigate to `/decks`.
Expected: page loads, shows "Belum ada deck, bikin yang pertama di atas ↑", `CreateDeckForm` visible above it.

- [ ] **Step 5: Manual verification — create + no-refetch**

With devtools Network tab open (filter: Fetch/XHR), fill in `CreateDeckForm` with a title (e.g. "Bahasa Inggris") and submit.
Expected: exactly one `POST http://localhost:3000/decks` request fires (`201`); the new deck appears in the list immediately; **no second `GET /decks` request fires** after the `POST` (confirms the no-refetch behavior — this is the actual proof that Task 2's `onCreated` wiring works as designed, not just that the UI looks right).

Create a second deck with only a title (no description).
Expected: appears in the list without a description line (confirms the `deck.description &&` guard in `DeckCard`).

- [ ] **Step 6: Manual verification — 401 redirect**

While still on `/decks`, open devtools → Application → Local Storage, edit `access_token` to an invalid value (e.g. append `"tampered"` to it), then reload `/decks`.
Expected: `GET /decks` returns `401` (signature no longer valid) → redirected to `/login`, not stuck on a loading spinner or showing a raw error.

- [ ] **Step 7: Commit**

```bash
git add web/src/app/decks/page.tsx
git commit -m "feat: add /decks list page with create form and auth guard"
```
