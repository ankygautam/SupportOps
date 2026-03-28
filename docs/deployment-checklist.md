# SupportOps Deployment Checklist

## Before Deploy

- Confirm `frontend/.env` or deployment env includes `VITE_API_URL`
- Confirm backend env includes `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, and `FRONTEND_ORIGIN`
- Use `SPRING_PROFILES_ACTIVE=demo` only for showcase environments
- Keep `DEMO_MODE=false` for production-style deployments
- Verify PostgreSQL is reachable from the backend runtime

## Build Checks

- Frontend: `npm run lint`
- Frontend: `npm run test:run`
- Frontend: `npm run build`
- Backend: `mvn test`
- Backend: `mvn -DskipTests package`

## Post-Deploy Verification

- Open `/login` and confirm the API health notice is clear
- Sign in with an allowed demo account
- Verify dashboard summary loads
- Open tickets, incidents, customers, SLA, analytics, settings, and team views
- Confirm role-based access for `ADMIN`, `TEAM_LEAD`, and `SUPPORT_AGENT`
- Verify `/api/health` returns `UP`
- Verify `/api/info` reflects the expected profile and demo mode

## Demo Accounts

- `admin@supportops.dev` / `supportops`
- `lead@supportops.dev` / `supportops`
- `agent1@supportops.dev` / `supportops`
