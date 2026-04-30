# AGENTS.md

## Project Overview

**WERKPLAN** is a browser-based 3D factory/warehouse visualization tool built with React 19 + TypeScript + Three.js (via React Three Fiber). It is a frontend-only application (Phases 1-7) with no backend dependencies.

## Cursor Cloud specific instructions

### Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | TypeScript check + production bundle |
| `npm run lint` | ESLint check |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting without writing |

### Key Notes

- The project follows `WERKPLAN_PROJECT_PLAN.md` strictly in phase order (Phase 0 → 7).
- `CURSOR_SYSTEM_PROMT.md` contains the full coding guidelines (German).
- `IMPLEMENTATION_PROGRESS.md` tracks completed work — always read before starting new tasks.
- No backend or database is needed for Phases 1-7. All persistence is via `localStorage`.
- The dev server runs on **port 5173** (Vite default).
- TypeScript strict mode is enabled. No `any` types or `@ts-ignore` allowed.
- Three.js bundle is ~300KB gzipped — within the 400KB target.
- Vitest config is in a separate `vitest.config.ts` (not inside `vite.config.ts`) due to Vite 8 type incompatibility.
- Git commits should be on `main` branch directly (no feature branches per project convention).
- Commit messages in German, format: `feat:`, `fix:`, `docs:`, `refactor:`, `perf:`, `style:`.
- The Vite dev server requires no external services — just `npm run dev` to start developing.
- Hot-reload works reliably; no need to restart the server after code changes.
