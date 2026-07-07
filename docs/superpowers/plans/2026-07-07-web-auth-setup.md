# Web Auth Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Get `web` (Next.js) to register/login/logout against the real NestJS `api`, with the refresh token in an httpOnly cross-origin cookie and the access token in `localStorage`.

**Architecture:** Browser fetches the NestJS API directly (no Next.js proxy). `api` already sets `refresh_token` as an httpOnly cookie server-side (`auth.controller.ts`) but with `sameSite: 'strict'`, which silently drops the cookie cross-origin — that gets fixed to `sameSite: 'none'` + `secure: true`, paired with a real CORS origin allowlist (currently `origin: []`, i.e. nothing allowed). `web` runs on port 3001 in dev (port 3000 is already `api`'s default).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui, plain `useState` (no react-hook-form), NestJS 11 (existing, only 2 files touched).

## Global Constraints

- No react-hook-form / form libraries — plain `useState` per field (user is new to React; decided during brainstorming, see [[feedback-react-teaching-level]]).
- No Next.js Route Handler / BFF proxy — browser calls the NestJS API directly with `credentials: 'include'`.
- Access token lives in `localStorage` only (key: `access_token`) — no React Context, no in-memory-only storage.
- `web` dev server always runs on port 3001; `api` stays on its existing default (3000) — they collide otherwise.
- No automated frontend tests this phase (matches approved spec — manual browser/curl verification only). Do not add a test runner to `web/package.json`.
- Full design rationale lives in `docs/superpowers/specs/2026-07-07-web-auth-setup-design.md` — don't re-derive decisions already made there, follow them.

---

### Task 1: Fix cross-origin cookie + CORS (backend)

**Files:**
- Modify: `api/src/app.module.ts:12-15` (`ConfigSchema`)
- Modify: `api/.env` (append one line — do not read/print existing contents, it holds secrets)
- Modify: `api/src/main.ts:9-12` (`enableCors`)
- Modify: `api/src/auth/auth.controller.ts:82-89` (`saveRefreshToCookie`)
- Modify: `api/src/auth/auth.controller.ts:73-79` (`logout` cookie-clear)

**Interfaces:**
- Consumes: nothing new
- Produces: `FRONTEND_URL` env var, validated by `ConfigSchema`, read directly via `process.env.FRONTEND_URL` in `main.ts` (matches existing `process.env.PORT` pattern in the same file — `main.ts` doesn't use `ConfigService` injection, it reads `process.env` directly)

- [ ] **Step 1: Add `FRONTEND_URL` to the env file**

Run (appends without touching existing secrets):
```bash
echo "FRONTEND_URL=http://localhost:3001" >> api/.env
```

- [ ] **Step 2: Add `FRONTEND_URL` to the validated config schema**

In `api/src/app.module.ts`, change:
```ts
const ConfigSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});
```
to:
```ts
const ConfigSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string(),
});
```

- [ ] **Step 3: Fix the CORS origin allowlist**

In `api/src/main.ts`, change:
```ts
  app.enableCors({
    origin: [],
    credentials: true,
  });
```
to:
```ts
  app.enableCors({
    origin: [process.env.FRONTEND_URL ?? 'http://localhost:3001'],
    credentials: true,
  });
```

- [ ] **Step 4: Fix `sameSite` on the refresh cookie (set)**

In `api/src/auth/auth.controller.ts`, change:
```ts
  private saveRefreshToCookie(res: Response, refresh: string): void {
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: RERFRESH_EXPIRES_IN_MS,
      path: '/auth',
    });
  }
```
to:
```ts
  private saveRefreshToCookie(res: Response, refresh: string): void {
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: RERFRESH_EXPIRES_IN_MS,
      path: '/auth',
    });
  }
```

- [ ] **Step 5: Fix `sameSite` on the refresh cookie (clear, in `logout`)**

In the same file, change:
```ts
    // Remove refresh from cookie
    res.cookie('refresh_token', null, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 0,
      path: '/auth',
    });
```
to:
```ts
    // Remove refresh from cookie
    res.cookie('refresh_token', null, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 0,
      path: '/auth',
    });
```

- [ ] **Step 6: Typecheck**

Run: `cd api && npx tsc --noEmit -p tsconfig.json`
Expected: no output (clean)

- [ ] **Step 6b: Lint**

Run: `cd api && npm run lint`
Expected: no errors (auto-fixable style issues get fixed in place by `eslint --fix`; if it modifies files, re-check the diff before committing)

- [ ] **Step 7: Manual verification — start the server and register a test user**

Run: `cd api && npm run start:dev` (leave running in its own terminal)

In a second terminal:
```bash
curl -i -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3001" \
  -d '{"username":"plantest","email":"plantest@example.com","password":"password123"}'
```
Expected in the response headers:
- `HTTP/1.1 201 Created`
- `access-control-allow-origin: http://localhost:3001`
- `access-control-allow-credentials: true`
- `set-cookie: refresh_token=...; Max-Age=...; Path=/auth; HttpOnly; Secure; SameSite=None`

(Note: `Secure` cookies are allowed over plain `http://localhost` — browsers treat `localhost` as a secure context. This only matters once a real browser is involved in Task 4+; curl doesn't enforce it either way.)

- [ ] **Step 8: Commit**

```bash
git add api/src/app.module.ts api/src/main.ts api/src/auth/auth.controller.ts
git commit -m "fix: cross-origin refresh cookie + CORS origin allowlist"
```
(`.env` is gitignored — nothing to add there.)

---

### Task 2: Web project setup (port, env, shadcn/ui)

**Files:**
- Modify: `web/package.json` (`dev` script)
- Create: `web/.env.local`
- Create (via CLI): `web/components.json`, `web/src/lib/utils.ts`, `web/src/components/ui/{button,input,label,card}.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `@/components/ui/button`, `@/components/ui/input`, `@/components/ui/label`, `@/components/ui/card` (shadcn components, consumed by Tasks 4-6), `@/lib/utils` (shadcn's `cn()` helper)

- [ ] **Step 1: Pin the dev port to 3001**

In `web/package.json`, change:
```json
    "dev": "next dev",
```
to:
```json
    "dev": "next dev -p 3001",
```

- [ ] **Step 2: Create the env file**

Create `web/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

- [ ] **Step 3: Init shadcn/ui**

Run:
```bash
cd web && npx shadcn@latest init -d
```
Expected: creates `components.json`, `src/lib/utils.ts`, updates `src/app/globals.css`; exits 0.

- [ ] **Step 4: Add the components needed for the auth forms**

Run:
```bash
cd web && npx shadcn@latest add button input label card
```
Expected: creates `src/components/ui/button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`; exits 0.

- [ ] **Step 5: Verify the dev server runs on the new port**

Run: `cd web && npm run dev` (leave running), then in another terminal:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
```
Expected: `200`

- [ ] **Step 6: Commit**

```bash
git add web/package.json web/.env.local web/components.json web/src/lib/utils.ts web/src/components/ui web/src/app/globals.css
git commit -m "chore: pin web dev port to 3001, init shadcn/ui"
```

---

### Task 3: API client helper

**Files:**
- Create: `web/src/lib/api.ts`

**Interfaces:**
- Consumes: `process.env.NEXT_PUBLIC_API_URL` (from Task 2's `.env.local`)
- Produces: `apiFetch<T = unknown>(path: string, options?: { method?: string; body?: unknown; headers?: HeadersInit }): Promise<T>`, `class ApiError extends Error { status: number }` — consumed by Tasks 4, 5, 6

- [ ] **Step 1: Write the helper**

Create `web/src/lib/api.ts`:
```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type ApiFetchOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(errorBody.message ?? 'Request failed', res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
```

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Commit**

```bash
git add web/src/lib/api.ts
git commit -m "feat: add apiFetch helper for direct cross-origin API calls"
```

---

### Task 4: Register page

**Files:**
- Create: `web/src/app/(auth)/register/page.tsx`

**Interfaces:**
- Consumes: `apiFetch<T>`, `ApiError` (Task 3); `Button`, `Input`, `Label`, `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle` (Task 2)
- Produces: route `/register`

- [ ] **Step 1: Write the page**

Create `web/src/app/(auth)/register/page.tsx`:
```tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { apiFetch, ApiError } from '@/lib/api';

interface AuthResponse {
  access: string;
  user: { id: string; username: string; email: string };
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await apiFetch<AuthResponse>('/auth/signin', {
        method: 'POST',
        body: { username, email, password },
      });
      localStorage.setItem('access_token', data.access);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registrasi gagal.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Daftar Akun</CardTitle>
          <CardDescription>Buat akun buat mulai bikin flashcard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Mendaftar...' : 'Daftar'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Udah punya akun?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Manual verification**

With `api` (Task 1, port 3000) and `web` (`npm run dev`, port 3001) both running, open `http://localhost:3001/register` in a browser, fill the form with a new username/email/password (min 6 chars), submit.
Expected: redirected to `http://localhost:3001/`; DevTools → Application → Local Storage has `access_token`; DevTools → Application → Cookies shows `refresh_token` with `HttpOnly` ✓, `Secure` ✓, `SameSite=None`.

Then submit the same email again.
Expected: inline error message renders under the form (409 Conflict — "User with this email already exists.").

- [ ] **Step 4: Commit**

```bash
git add "web/src/app/(auth)/register/page.tsx"
git commit -m "feat: add register page"
```

---

### Task 5: Login page

**Files:**
- Create: `web/src/app/(auth)/login/page.tsx`

**Interfaces:**
- Consumes: `apiFetch<T>`, `ApiError` (Task 3); `Button`, `Input`, `Label`, `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle` (Task 2)
- Produces: route `/login`

- [ ] **Step 1: Write the page**

Create `web/src/app/(auth)/login/page.tsx`:
```tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { apiFetch, ApiError } from '@/lib/api';

interface AuthResponse {
  access: string;
  user: { id: string; username: string; email: string };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      localStorage.setItem('access_token', data.access);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login gagal.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Masuk ke akun kamu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Masuk...' : 'Login'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Belum punya akun?{' '}
            <Link href="/register" className="underline">
              Daftar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Manual verification**

Log out (clear `access_token` from localStorage manually via DevTools if Task 6 isn't done yet), go to `http://localhost:3001/login`, log in with the account created in Task 4.
Expected: redirected to `/`, `access_token` present in localStorage.

Try logging in with a wrong password.
Expected: inline error renders ("Wrong email or password.").

- [ ] **Step 4: Commit**

```bash
git add "web/src/app/(auth)/login/page.tsx"
git commit -m "feat: add login page"
```

---

### Task 6: Home page — logged-in state + logout

**Files:**
- Modify: `web/src/app/page.tsx` (full rewrite — replaces the `create-next-app` scaffold)

**Interfaces:**
- Consumes: `apiFetch` (Task 3); `Button` (Task 2)
- Produces: nothing consumed by later tasks (this is the last task in this phase)

- [ ] **Step 1: Rewrite the home page**

Replace the entire contents of `web/src/app/page.tsx` with:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('access_token')));
    setIsLoading(false);
  }, []);

  async function handleLogout() {
    await apiFetch('/auth/logout', { method: 'POST' });
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
  }

  if (isLoading) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Flashcard App</h1>
      {isLoggedIn ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <div className="flex gap-4">
          <Button onClick={() => router.push('/login')}>Login</Button>
          <Button variant="outline" onClick={() => router.push('/register')}>
            Daftar
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd web && npx tsc --noEmit`
Expected: no output (clean)

- [ ] **Step 3: Manual verification — full round trip**

With both servers running: visit `/`, confirm "Login"/"Daftar" buttons show when logged out. Log in (Task 5's account). Confirm redirect to `/` shows a "Logout" button instead. Click it.
Expected: button flips back to "Login"/"Daftar"; `access_token` removed from localStorage; `refresh_token` cookie cleared (DevTools shows it gone or expired).

- [ ] **Step 4: Lint (whole `web` project, since this touches the root page)**

Run: `cd web && npm run lint`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add web/src/app/page.tsx
git commit -m "feat: home page reflects login state, adds logout"
```
