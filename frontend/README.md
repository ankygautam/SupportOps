# SupportOps Frontend

React frontend for the SupportOps support operations platform.

## Local run

1. Create a frontend env file:

```bash
cp .env.example .env
```

2. Set the backend URL if needed:

```bash
VITE_API_URL=http://localhost:8080
```

3. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Production env

- `VITE_API_URL`

If `VITE_API_URL` is missing, the app falls back to `http://localhost:8080` in local development and shows a clear API configuration error in production.

## Build

```bash
npm run build
```

## GitHub Pages

SupportOps is configured for GitHub Pages deployment through [`frontend-pages.yml`](/Users/ankygautam/Desktop/Project/SupportOps/.github/workflows/frontend-pages.yml).

1. Push the repository to GitHub.
2. In the repository settings, set `Pages` to use `GitHub Actions`.
3. Add a repository variable named `VITE_API_URL` with the deployed backend URL.
4. Push to `main` or trigger the workflow manually.

Because the app uses hash-based routing, GitHub Pages can serve deep links without custom rewrite rules.

## Quality Checks

```bash
npm run lint
npm run test:run
npm run build
npm run build:pages
```

The app uses hash-based routing, which keeps deep links stable on static hosting platforms without custom rewrite rules.

## Test Coverage

Frontend tests use Vitest + React Testing Library and focus on:

- login and auth failure states
- protected route redirects
- ticket queue rendering and search
- ticket detail and comment workflow behavior
- create-ticket validation
- incidents rendering
- settings save behavior

Shared test utilities and factories live in [`src/test`](/Users/ankygautam/Desktop/Project/SupportOps/frontend/src/test).

## CI

Frontend CI is defined in [`../.github/workflows/frontend-ci.yml`](/Users/ankygautam/Desktop/Project/SupportOps/.github/workflows/frontend-ci.yml).
GitHub Pages deployment is defined in [`../.github/workflows/frontend-pages.yml`](/Users/ankygautam/Desktop/Project/SupportOps/.github/workflows/frontend-pages.yml).

## Notes

- The app now includes JWT-backed auth, a header notification center, API-backed settings, and role-aware navigation.
- Preferred landing page is persisted in backend settings and mirrored locally for restore after refresh/sign-in.
- A global error boundary, retryable page errors, and session-expiry handling are included for smoother demo and deployment behavior.
- A lightweight API connectivity notice appears on login and in-app when the backend is unavailable or `VITE_API_URL` is misconfigured.

## Demo logins

- `admin@supportops.dev` / `supportops`
- `lead@supportops.dev` / `supportops`
- `agent1@supportops.dev` / `supportops`
