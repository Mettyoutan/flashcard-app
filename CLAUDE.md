# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

`api`: Prisma schema (User/RefreshToken/Deck/Card) migrated to Neon, `auth`, `decks`, and `cards` modules (full CRUD, ownership-scoped, reviewed) are implemented. Cards tests still placeholder-only (non-blocking gap, deferred). `web` is still unmodified `create-next-app` — next milestone. This is **Project #1 (Flashcard CRUD)** of a 3-project, 45-day learning roadmap. Macro plan/rationale/decisions live in `../CLAUDE.md` (workspace root) and `../roadmap-45-hari-semoga-bisa/README.md` — do not duplicate that content here. This repo's own build-order/technical breakdown lives in `docs/ROADMAP.md`.

Two independent apps in one folder, no shared package/workspace tooling (no turborepo, no npm workspaces) — `api` and `web` each have their own `node_modules` and are run/deployed separately.

## Commands

Backend (`cd api`):
```bash
npm run start:dev      # watch mode, http://localhost:3000 default
npm run lint           # eslint --fix
npm run test           # jest unit tests
npm run test:watch
npm run test:cov
npm run test:e2e       # jest -c test/jest-e2e.json
npm run build          # nest build -> dist/
```
Single test file: `npx jest src/path/to/file.spec.ts`. Single e2e file: `npx jest --config ./test/jest-e2e.json path/to/file.e2e-spec.ts`.

Frontend (`cd web`):
```bash
npm run dev     # next dev
npm run build
npm run lint
```

## Architecture

### Backend (NestJS 11 + Prisma 6 + Zod 4 — per workspace-locked stack)

Scaffolded and implemented (auth + decks); sibling project `review-nest` (`D:\Lenovo\Code\learn\typescript\review-nest`) remains the pattern reference for anything not yet built (cards CRUD):

- **Database access**: single global `DatabaseModule` (`@Global()`) exporting a `DatabaseService` that `extends PrismaClient` and connects `onModuleInit`. No repository abstraction layer — services inject `DatabaseService` directly.
- **Validation**: Zod schemas (`*.schema.ts`), not `class-validator` decorators. `ZodValidationPipe` registered globally in `main.ts`. Payload/DTO shape is inferred from the Zod schema.
- **Module folder convention**: each domain module (`auth/`, `users/`, `decks/`, `cards/`) contains:
  - `dtos/*.dto.ts` — flat is fine (e.g. `cards/`); `dtos/requests/*.dto.ts` + `dtos/responses/*.dto.ts` subfolders when a module actually has both request and response DTOs to separate (e.g. `decks/`, `auth/`). Don't force the requests/responses split on a module that doesn't need it yet.
  - `schemas/*.schema.ts` (Zod) — always present, one file per domain type
  - `*.controller.ts`, `*.service.ts`, `*.module.ts`
  - module-specific `guards/`, `decorators/`, `strategies/` when needed (auth only)
- **Auth**: JWT access + refresh pair issued by a `TokenService` (`jwtService.signAsync` with separate expiry constants), refresh tokens persisted in a `RefreshToken` table (revocable, indexed by `userId`), passwords hashed with bcrypt. `JwtGuard` + Passport `JwtStrategy` protect routes; `@CurrentUser()` decorator pulls the authenticated user off the request.
- **Cross-origin cookie strategy (decided 2026-07-07, not yet implemented)**: `web` (Vercel) and `api` (Render/Railway) are different domains in production, so the browser talks to `api` directly — no Next.js proxy/BFF layer. `auth.controller.ts::saveRefreshToCookie` currently sets `refresh_token` with `sameSite: 'strict'`, which silently breaks cross-origin (cookie never sent). Required fix before `web` auth pages can work end-to-end: (1) `sameSite: 'none'` + `secure: true` on both `res.cookie` calls in `auth.controller.ts`; (2) `app.enableCors({ origin: <web origin>, credentials: true })` in `main.ts` — explicit origin, not `*`, `credentials: true` is mandatory for the cookie to be sent/accepted. `web` fetches call the `api` origin directly with `fetch(url, { credentials: 'include' })`. Access token stays in the JSON response body (client-held, sent as `Authorization: Bearer` header), only `refresh_token` is httpOnly-cookied.
- **Common**: shared decorators live under `common/decorators/` (e.g. `@CurrentUser()`). No `ApiResponseDto`/`PaginatedResponseDto`/`PaginationQueryDto` wrappers built yet — endpoints return the Zod-inferred type directly (e.g. `Deck`, `Deck[]`).
- **Route param validation**: `Param('id', ParseUUIDPipe)` on any route taking a resource id — required so a malformed id 400s instead of falling through to a raw Postgres/Prisma error (500). Applied in `decks.controller.ts`; carry the same pattern into `cards.controller.ts`.
- **Prisma exception handling (mandatory)**: if a service method calls `this.db.<model>.*` without catching the Prisma error cases that method can raise, fix it immediately — don't just flag it. Before writing the fix, pull current Prisma error-handling docs via Context7 MCP (don't rely on training data for exact error codes/API). Pattern already established in `decks.service.ts` (`update`/`delete`): catch `Prisma.PrismaClientKnownRequestError` and map known codes to Nest exceptions (e.g. `P2025` record-not-found → `NotFoundException`); also check for missing ownership/existence checks on foreign-key params (e.g. a nested resource's parent id) before the write, the same way `findById` scopes by `{ id, userId }`. Apply this same standard to every Prisma call across `auth`, `decks`, `cards`, and any future module — not just where a bug happened to be found.

`Deck` belongs to `User`, `Card` belongs to `Deck` — both cascade-delete on parent removal (see `prisma/schema.prisma`).

### Frontend (Next.js App Router + Tailwind + shadcn/ui)

`web/CLAUDE.md` → `@AGENTS.md` carries a load-bearing warning: **this Next.js version has breaking API/convention changes vs. training data** — read `node_modules/next/dist/docs/` before writing App Router code, don't assume familiar Next.js patterns apply as-is.

No pages beyond the default scaffold exist yet. Planned structure (see `docs/ROADMAP.md`): auth pages, deck list, deck detail (card list), study view — calling the NestJS API via `fetch`, with explicit client vs. server component decisions and CORS/env wiring to the API origin.

## Deployment target (definition of done for this project)

Neon (Postgres) + Render/Railway (`api`) + Vercel (`web`). Project isn't "done" until deployed and reachable by URL — localhost is not completion (workspace ground rule).

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
