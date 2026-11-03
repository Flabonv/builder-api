# Dig DH — frontend

React + TypeScript + Vite. Talks to the Django API in `../app`.

- `design/index.html` + `design/styles.css`: static export of the Figma design (visual reference only).
  With the dev server running, view it at http://localhost:5173/design/index.html
- `src/styles.css`: the same stylesheet, used by the app.

## Commands

```
npm install
npm run dev        # http://localhost:5173 — /api/* is proxied to Django on :8000
npm run build      # type-check (tsc -b) + production build
npm run lint
```

Start the backend first: `docker-compose up` from the repo root.
