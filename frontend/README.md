# README_DEV — Dig DH

Developer notes: what has been done, the decisions behind it, and what's next.

## 1. Origin

The UI comes from the Figma file **"Sans-titre"** (frame `5:2`, "Dig DH"): a 1440px desktop page with a navigation bar, a "Portail des actions" section holding two boxes (**Projets** and **Corvées**), and a footer.

Path taken:

1. Figma design → static HTML + CSS (`dig-dh/`, kept as reference).
2. Static HTML → React + Vite (`dig-dh-react/`), data to come from a backend.
3. React JS → **TypeScript** (current state).

## 2. Current state

### Stack
- React 18, TypeScript 5 (strict), Vite 5
- Plain CSS (single `src/styles.css`, design tokens as CSS variables)
- No router, no state library, no test setup yet

### Structure
```
src/
  api/index.ts          fetchProjects / fetchChores + normalize (DTO → Entry)
  components/
    Nav, Footer         layout
    Box                 one portal box (header + list + loading/error/empty states)
    Item                one project/chore row
    Button              pill button with arrow icon
    Logo, ArrowUpRight  inline SVGs (placeholders, see §4)
  hooks/useFetch.ts     generic fetch hook (abort on unmount, reload)
  types/index.ts        Entry, EntryDto, FetchStatus
  App.tsx               two useFetch calls → two Boxes
  main.tsx, styles.css, vite-env.d.ts
```

### Design tokens (from Figma)
| Token | Value |
|---|---|
| `--color-bg` | `#f7f4ed` |
| `--color-bg-section` | `#e9ecdd` |
| `--color-surface` | `#ffffff` |
| `--color-border` | `#daddd0` |
| `--color-primary` | `#263d32` |
| `--color-muted` | `#687167` |
| Fonts | Lora (titles), Inter (body) |
| Radii | 16px cards, 12px items, 100px pills |

### Data flow
`App` → `useFetch(fetchProjects | fetchChores)` → `{ data, status, reload }` → `Box` renders by `status` (`loading` | `success` | `error`).

## 3. Backend contract (assumed)

Not yet confirmed with the backend team.

- `GET {VITE_API_URL}/projects`
- `GET {VITE_API_URL}/chores`

Each returns an array of:

```json
{ "id": 1, "title": "Jardin partagé", "description": "…", "volunteers": 12, "schedule": "Tous les samedis" }
```

If the real API differs, change only `EntryDto` (`src/types/index.ts`), `normalize` and the paths (`src/api/index.ts`). The UI works with `Entry` and is not affected.

`VITE_API_URL` is set in `.env` (see `.env.example`). Defaults to `/api`.

## 4. Known gaps and shortcuts

- **Logo** (`Logo.tsx`) is a placeholder (two circles). The real asset must be exported from Figma ("Symbole du lien", node `2:486`).
- **Arrow icon** is a generic arrow-up-right, not the exact Figma asset (node `4:18`).
- **Not in the Figma file**, added by us and to be validated by design:
  - responsive breakpoints (1100px, 640px)
  - skeleton / error / empty states
- **"Voir tout" buttons** link to `#`. Nav links are in-page anchors (`#projets`, `#corvees`, `#contact`).
- **Footer links** (Instagram, Mentions légales, Confidentialité) are placeholders.
- **Footer year** is computed (`new Date().getFullYear()`); Figma shows 2026.
- **Volunteer pluralisation** is handled in `Item.tsx` ("1 bénévole" / "n bénévoles"). Verify against the real data, including `0`.
- **Untested:** the project was generated without running `npm install`, `typecheck` or `build`. First step is to run them.
- **Accessibility:** not audited yet (heading order, focus styles, contrast of `#687167` on `#f7f4ed` at 10–12px).

## 5. Next steps

### Immediate
1. `npm install`, then `npm run typecheck` and `npm run build`; fix anything that surfaces.
2. Confirm the API contract with the backend (endpoints, field names, pagination, auth) and update `EntryDto` / `normalize`.
3. Handle CORS (backend headers, or uncomment the dev proxy in `vite.config.ts`).
4. Replace the placeholder logo and arrow with the Figma exports.

### Short term
5. Pages behind "Voir tout": full list of projects, full list of corvées, and probably a detail view. This is when to add a router (React Router or similar).
6. Decide how "Projets / Corvées / Contact" in the nav should behave (anchors vs routes).
7. Runtime validation of API responses (e.g. Zod) so a malformed reply triggers the error state instead of breaking rendering.
8. Pagination or a cap on the number of items shown in each box (the design shows 4).
9. Design review of loading / error / empty states and responsive behaviour.

### Later
10. Data layer upgrade: TanStack Query (caching, retries, refetch on focus) to replace `useFetch` once there are more endpoints.
11. Tests: Vitest + React Testing Library for `Item`, `Box` states and `useFetch`; mock the API with MSW.
12. Linting and formatting (ESLint, Prettier), plus CI running `typecheck` and `build`.
13. Accessibility audit and fixes.
14. i18n if other languages are needed (UI is currently hard-coded French).
15. Self-host fonts (Lora, Inter) instead of loading from Google Fonts, if privacy/performance requires it.
16. If SEO or server rendering becomes a requirement, evaluate Next.js (components and CSS port over directly).

## 6. Commands

```
npm install
cp .env.example .env     # set VITE_API_URL
npm run dev              # local dev server
npm run typecheck        # tsc --noEmit
npm run build            # type-check + production build
npm run preview          # serve the production build
```
