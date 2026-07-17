# Flashcard App

Flashcard CRUD app dengan study mode (flip, next/prev) — Project #1 dari roadmap belajar 45-hari (`review-nest` → `review-prisma` → RAG tutor). Fitur: register/login/logout, deck CRUD, card CRUD (nested di bawah deck), study view read-only satu-kartu-satu-waktu.

## Live

- **Web**: _(isi setelah deploy Vercel)_
- **API**: _(isi setelah deploy Render)_

## Tech Stack

- **Backend** (`api/`): NestJS 11 + Prisma 6 + Zod 4, JWT auth (access + refresh), Neon Postgres.
- **Frontend** (`web/`): Next.js 16 App Router + Tailwind v4 + shadcn/ui, plain `useState` (belum pakai form library).
- **Deploy**: Neon (DB) + Render (`api`) + Vercel (`web`).

Dua app independen, tanpa shared tooling (no turborepo/npm workspaces) — `api` dan `web` masing-masing punya `node_modules` sendiri, dijalankan/deploy terpisah.

## Local Dev

Lihat `api/README.md` dan `web/README.md` masing-masing buat setup dan command lokal.

## Retro

_(isi 3 kalimat setelah deploy: apa yang baru dipelajari, apa yang bikin stuck, apa yang beda buat P2 — entry lengkap juga masuk ke `../roadmap-45-hari-semoga-bisa/README.md`)_
