# Dig DH — frontend

React + TypeScript + Vite. Talks to the Django API in `../app`.

- `design/index.html` + `design/styles.css`: static export of the Figma design (visual reference only).
  With the dev server running, view it at http://localhost:5173/design/index.html
- `src/styles.css`: the same stylesheet, used by the app.

## Commands

Always run these from `frontend/` (from the repo root, `npx tsc` downloads a fake `tsc` package).

```
npm install        # once, and after pulling changes to package.json
```

### Daily work: two terminals

| Terminal | Command | What it does |
|---|---|---|
| 1 | `npm run dev` | Vite dev server at http://localhost:5173, reloads on save. `/api/*` is proxied to Django on :8000. Does **not** check types. |
| 2 | `npm run typecheck` | `tsc` in watch mode: reports type errors on every save. Serves nothing. |

Start the backend first if you need the API: `docker-compose up` from the repo root.

### Other

```
npm run lint       # ESLint: bad patterns (any, hook misuse…) in otherwise valid code
npm run build      # type-check (tsc -b) then production build into dist/
npm run preview    # serve the dist/ build locally
```

## TODO

Each phase focuses on one TypeScript concept.

- [x] **Phase 0 — Setup.** Vite react-ts template (v6, Node 18), Figma export kept in `design/`, `/api` proxy.
- [x] **Phase 1 — Static components.** Rebuild `design/index.html` as `Nav`, `Footer`, `Button`, `Item`, `Box` with hard-coded data.
  *TS: typing props, `interface`, optional fields, `children`.*
- [x] **Phase 2 — API types by hand.** `src/types/api.ts`: `Tag`, `TrailDig`, `TrailDigDetail`, `User`, payload types, written from the DRF serializers.
  *TS: `interface` vs `type`, `extends`, `Omit` / `Partial` / `Pick`.*
- [ ] **Phase 3 — Typed API client.** One `apiFetch<T>()` that adds the base URL and token and turns DRF errors (`{field: string[]}`) into a typed error.
  *TS: generics, `unknown` vs `any`, narrowing, error classes.*
- [ ] **Phase 4 — Login.** Login page, token in `localStorage`, `AuthContext`.
  *TS: discriminated unions (`{status: 'anonymous'} | {status: 'authenticated', …}`), typing context.*
- [ ] **Phase 5 — Real data on the home page.** Projets = Tags, Corvées = TrailDigs.
  *TS: generic hooks, loading/error/success union.*
  Backend: make reads public and update the two `test_auth_required` tests. Digs: `IsAuthenticatedOrReadOnly`. Tags: `AllowAny` for list in `get_permissions` (writes stay `IsAdminUser`). Option: since tags are managed in `/admin/`, drop the Update/Destroy mixins so the tag viewset is list-only (update the two `_fails` tests to expect 405).
- [ ] **Phase 6 — Routing.** React Router, "Voir tout" list pages, `/digs/:id` detail page.
  *TS: typing route params (`string | undefined`).*
- [ ] **Phase 7 — Create/edit form.** Create and edit a dig, show DRF field errors.
  *TS: form events, controlled inputs, naive-datetime helper (the API rejects timezones, so no `toISOString()`).*
- [ ] **Later.** Generate types from `/api/schema/` with `openapi-typescript` and compare with the hand-written ones; TanStack Query; Vitest; nginx/Docker deploy; upgrade Node to 22.

### Known backend bug (fix in Phase 7)

`TrailDigSerializer._get_tags` (`app/traildig/serializers.py`) looks tags up with `user=auth_user`, but tags are created by an admin. A non-admin creating or updating a dig with `tags: [{"name": "X"}]` gets `Tag X does not exist.` Fix: look the tag up by name only (as `validate()` already does).
