# Roadmap Teknis — Flashcard App (P1)

> Ini breakdown **operasional/build-order** khusus repo ini. Rencana strategis, alasan keputusan, ground rules, dan progress log lintas-project tetap satu-satunya sumber di `../../roadmap-45-hari-semoga-bisa/README.md` (jangan diulang di sini). Dokumen ini menjawab "ngoding apa duluan, dalam urutan apa" — bukan "kenapa".

**Scope (dari master roadmap, Hari 1-10, ~40 jam):** Auth (register/login/logout) · Deck CRUD · Card CRUD · Study mode sederhana (flip, next/prev) · deploy Neon + Render/Railway + Vercel.

**Time-box, bukan scope-box.** Kalau molor, potong stretch dulu (search, tag, dark mode), definition of done tetap: deployed + bisa dipakai orang lain lewat URL.

---

## Urutan Build

### 1. Backend foundation
- [ ] `npm install prisma @prisma/client zod nestjs-zod bcrypt @nestjs/jwt @nestjs/passport passport-jwt @nestjs/config` di `api/`
- [ ] `npx prisma init`, set `DATABASE_URL` (Neon connection string) di `.env`
- [ ] Schema Prisma — extend pattern dari `review-nest/prisma/schema.prisma`:
  - `User` (id uuid, username, email unique, password hash, timestamps)
  - `RefreshToken` (userId, token unique, revoked, expiresAt) — relasi ke `User`
  - `Deck` (id, userId FK, title, description?, timestamps) — relasi ke `User`
  - `Card` (id, deckId FK, front, back, timestamps) — relasi ke `Deck`
- [ ] `npx prisma migrate dev`
- [ ] `DatabaseModule` + `DatabaseService` (global module, `extends PrismaClient`, connect `onModuleInit`) — copy pattern dari review-nest

### 2. Auth module (port dari `review-nest/src/auth`)
- [ ] Zod schemas: register/login DTO, JWT payload schema
- [ ] `AuthService`: register (bcrypt hash), login (verify + issue tokens), refresh, logout (revoke refresh token)
- [ ] `TokenService`: generate access+refresh pair (`jwtService.signAsync`, expiry constants terpisah)
- [ ] `JwtStrategy` + `JwtAuthGuard` (Passport) — proteksi route
- [ ] `@CurrentUser()` decorator
- [ ] `AuthController`: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`

### 3. Deck module
- [ ] `DecksController`/`DecksService` — CRUD, semua query scoped ke `userId` dari `@CurrentUser()`
- [ ] Routes: `GET/POST /decks`, `GET/PATCH/DELETE /decks/:id`
- [ ] Guard semua route deck dengan `JwtAuthGuard`

### 4. Card module
- [ ] `CardsController`/`CardsService` — CRUD nested di bawah deck, validasi deck milik user
- [ ] Routes: `GET/POST /decks/:deckId/cards`, `GET/PATCH/DELETE /decks/:deckId/cards/:id`

### 5. Study mode (backend minimal)
- [ ] `GET /decks/:deckId/study` — return semua card di deck (belum ada SM-2, itu jatah P2)
- [ ] Logic flip/next/prev sepenuhnya di frontend (state lokal), API cuma nyuplai data

### 6. Frontend (Next.js App Router)
> Cek `node_modules/next/dist/docs/` dulu sebelum nulis App Router code — versi ini breaking changes dari training data.
- [ ] Setup: Tailwind (sudah ada) + init shadcn/ui, `.env.local` (`NEXT_PUBLIC_API_URL`)
- [ ] Auth pages: `/login`, `/register` — client component, fetch ke API, simpan token (cookie httpOnly lewat API kalau memungkinkan, atau minimal localStorage buat versi belajar)
- [ ] `/decks` — list deck user (server component fetch + auth check)
- [ ] `/decks/[id]` — list card dalam deck + form tambah/edit card
- [ ] `/decks/[id]/study` — study view: flip card, next/prev (client component, local state)
- [ ] CORS: whitelist origin frontend di `main.ts` NestJS (`app.enableCors`)

### 7. Deploy (definition of done)
- [ ] DB: provision Neon Postgres, jalanin migration production
- [ ] API: deploy ke Render/Railway, set env vars (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, dll)
- [ ] Frontend: deploy ke Vercel, set `NEXT_PUBLIC_API_URL` ke URL API production
- [ ] Smoke test: register → login → buat deck → buat card → study mode, semua lewat URL publik
- [ ] README repo ini: screenshot + link live
- [ ] Retro 3 kalimat (apa yang baru dipelajari, apa yang bikin stuck, apa yang beda di P2) — masuk ke progress log master roadmap, bukan di sini

---

## Stretch (backlog, cuma kalau waktu sisa)
- Search card dalam deck
- Tag/kategori deck
- Dark mode toggle
