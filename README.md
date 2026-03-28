# SupportOps

SupportOps is a portfolio-grade full-stack support operations platform built to feel like a premium internal SaaS tool used by real support, reliability, and customer operations teams.

It combines queue management, incident response, SLA monitoring, customer history, team operations, analytics, notifications, and role-aware settings into one polished workspace.

## Why It Was Built

SupportOps was built to show what a serious internal tool can look like when product thinking, operational realism, and full-stack engineering are treated as first-class concerns.

Instead of stopping at a static dashboard, the project focuses on:

- believable support workflows
- clean frontend and backend architecture
- role-aware security and behavior
- seeded data that tells a coherent operational story
- presentation-ready polish for demos, screenshots, and portfolio review

## Project Overview

SupportOps was designed as more than a dashboard mock. The goal is to showcase how a realistic internal support platform can be structured across frontend and backend layers while still feeling production-ready from a UX perspective.

The product currently includes:

- JWT-backed authentication with seeded demo accounts
- Role-aware access for Admin, Team Lead, and Support Agent
- Ticket workflows with escalation, reassignment, waiting-on-customer state, resolution notes, reopen flow, and activity history
- Incident management with linked tickets and operational impact context
- Customer records with support history and account health
- SLA monitoring with urgency-focused states and queue views
- Analytics for leadership and operations review
- Team management for staffing and ownership controls
- In-app notification center with unread state and read actions
- API-backed user preferences and workspace settings

## Feature Highlights

### Ticket Operations

- Searchable and filterable queue
- Saved views like My Open Tickets, Critical Queue, Waiting on Customer, and Breached SLA
- Detailed ticket workspace with comments, activity feed, SLA state, escalation controls, related incidents, and quick actions
- Internal notes and public replies

### Incident Command

- Severity/status filtering
- Linked ticket visibility
- Incident detail drawer with timeline, root cause, mitigation, and affected customer counts

### Team and Admin

- Team roster with role, active tickets, resolved-this-week, and average response stats
- Role updates and activation/deactivation flows
- Safe reassignment support when deactivating staff with active ownership

### Operational Depth

- SLA states and urgency indicators
- Notification center for ticket assignment, escalations, incidents, and SLA breach events
- Analytics with comparisons, workload distribution, most impacted customers, reopened rate, MTTR, and incident frequency
- Role-aware settings and persisted user preferences

## Architecture Summary

### Frontend

- React
- TypeScript
- React Router
- Tailwind CSS
- Framer Motion

Structure highlights:

- `frontend/src/api` for typed API services
- `frontend/src/app/config` for options, storage keys, and feature toggles
- `frontend/src/test` for reusable frontend test utilities and behavior-focused Vitest coverage
- `frontend/src/components` for reusable UI and feature modules
- `frontend/src/contexts` for auth and toast state
- `frontend/src/pages` for product surfaces
- `frontend/src/types` for shared DTO and UI models

### Backend

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- PostgreSQL

Structure highlights:

- `backend/src/main/java/com/supportops/backend/controller`
- `backend/src/main/java/com/supportops/backend/service`
- `backend/src/main/java/com/supportops/backend/entity`
- `backend/src/main/java/com/supportops/backend/repository`
- `backend/src/main/java/com/supportops/backend/security`
- `backend/src/main/java/com/supportops/backend/dto`
- `backend/src/test/java/com/supportops/backend` for service and controller coverage of auth and workflow rules

## Main Routes and Modules

- `/demo` guided demo entry with role-based sign-in options
- `/about` project overview and architecture summary
- `/launch-checklist` release-readiness summary for demo, docs, env, and verification coverage
- `/dashboard` operational snapshot
- `/tickets` queue management and saved views
- `/tickets/:id` detailed case workspace
- `/incidents` incident command center
- `/customers` support records and customer context
- `/sla` deadline and breach monitoring
- `/analytics` leadership and operations review
- `/team` staff coverage and role-aware administration
- `/settings` persisted personal and operational preferences

## Screenshots

Add screenshots here when presenting the project:

- `docs/screenshots/login.png`
- `docs/screenshots/demo-entry.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/tickets.png`
- `docs/screenshots/ticket-detail.png`
- `docs/screenshots/incidents.png`
- `docs/screenshots/analytics.png`
- `docs/screenshots/team.png`
- `docs/screenshots/about-project.png`

Suggested captions:

- Secure JWT-backed login and role-aware entry
- Launch readiness page for final demo and deployment review
- Premium support queue with workflow-safe actions
- Incident command view with linked customer impact
- Leadership analytics and operational comparison view

## Internal Notes

- Architecture notes: [`docs/architecture-notes.md`](/Users/ankygautam/Desktop/Project/SupportOps/docs/architecture-notes.md)
- UI system notes: [`docs/ui-system.md`](/Users/ankygautam/Desktop/Project/SupportOps/docs/ui-system.md)
- Forward roadmap: [`docs/roadmap.md`](/Users/ankygautam/Desktop/Project/SupportOps/docs/roadmap.md)
- Setup guide: [`docs/setup-guide.md`](/Users/ankygautam/Desktop/Project/SupportOps/docs/setup-guide.md)
- Demo guide: [`docs/demo-guide.md`](/Users/ankygautam/Desktop/Project/SupportOps/docs/demo-guide.md)
- Screenshot plan: [`docs/screenshot-plan.md`](/Users/ankygautam/Desktop/Project/SupportOps/docs/screenshot-plan.md)

## Local Setup

### Backend

1. Create a PostgreSQL database named `supportops`
2. Set environment variables if needed:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `FRONTEND_ORIGIN`
   - `SPRING_PROFILES_ACTIVE`
   - `DEMO_MODE`
3. Start the backend:

```bash
cd backend
mvn spring-boot:run
```

Optional local database shortcut:

```bash
docker compose up -d postgres
```

### Frontend

1. Create the frontend env file:

```bash
cd frontend
cp .env.example .env
```

2. Set the API URL if needed:

```bash
VITE_API_URL=http://localhost:8080
```

3. Start the frontend:

```bash
npm install
npm run dev
```

## Root-Level Commands

If you prefer running from the repository root, use the included `Makefile`:

```bash
make db-up
make backend-dev
make frontend-dev
```

Other useful targets:

- `make frontend-lint`
- `make frontend-test`
- `make frontend-build`
- `make backend-test`
- `make backend-build`
- `make check`

## Environment Variables

### Frontend

- `VITE_API_URL`
- `VITE_DEMO_MODE`
- `VITE_SHOWCASE_MODE`

### Backend

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `FRONTEND_ORIGIN`
- `SPRING_PROFILES_ACTIVE`
- `DEMO_MODE`

Example env files:

- [`frontend/.env.example`](/Users/ankygautam/Desktop/Project/SupportOps/frontend/.env.example)
- [`backend/.env.example`](/Users/ankygautam/Desktop/Project/SupportOps/backend/.env.example)

### Recommended local demo mode

- Backend profile defaults to `dev`
- Demo seed data is enabled in `dev` and `demo`
- For a shareable deployed demo, use `SPRING_PROFILES_ACTIVE=demo`
- For a production-style deployment without demo seeding, use `SPRING_PROFILES_ACTIVE=prod`

## Seeded Credentials

- `admin@supportops.dev` / `supportops`
- `lead@supportops.dev` / `supportops`
- `agent1@supportops.dev` / `supportops`

## Demo Account Reference

- `Admin`: full platform walkthrough, analytics, team management, settings, and launch readiness
- `Team Lead`: queue balancing, escalations, incidents, SLA monitoring, and operational handoffs
- `Support Agent`: frontline ticket work, comments, internal notes, customer context, and status updates

## Demo Flow

1. Open `/demo` for the guided entry experience.
2. Choose `Admin` for the broadest walkthrough or `Team Lead` for the strongest queue-and-incident story.
3. Use `/launch-checklist` when presenting deployment readiness, docs coverage, and verification status.
4. Capture hero screens from dashboard, tickets, ticket detail, incidents, analytics, and team management.

## Deployment Notes

### Frontend

- Static-ready Vite build
- Uses a hash-router setup so deep links survive static hosting without custom rewrites
- Deployable to GitHub Pages, Vercel, Netlify, or similar static hosts
- Requires `VITE_API_URL` to point at the backend
- Includes a GitHub Pages deployment workflow at [`frontend-pages.yml`](/Users/ankygautam/Desktop/Project/SupportOps/.github/workflows/frontend-pages.yml)
- For GitHub Pages, add a repository variable named `VITE_API_URL` and set Pages to `GitHub Actions`

### Backend

- Deployable to Render or Railway
- Uses environment-based datasource, CORS, JWT, and demo-mode configuration
- Includes `/api/health` for lightweight health checking
- Includes `/api/info` for quick profile and demo-mode verification
- Fails fast in `prod` when `JWT_SECRET`, `DB_URL`, or `FRONTEND_ORIGIN` are still using unsafe local defaults
- Demo seeding is disabled by default in `prod`

## Scripts and Quality Gates

### Frontend

- `npm run dev`
- `npm run lint`
- `npm run test`
- `npm run test:run`
- `npm run build`
- `npm run build:pages`
- `npm run format`
- `npm run format:check`

### Backend

- `mvn test`
- `mvn -DskipTests package`

## CI/CD

GitHub Actions workflows are included for both application layers:

- [`frontend-ci.yml`](/Users/ankygautam/Desktop/Project/SupportOps/.github/workflows/frontend-ci.yml)
- [`backend-ci.yml`](/Users/ankygautam/Desktop/Project/SupportOps/.github/workflows/backend-ci.yml)
- [`frontend-pages.yml`](/Users/ankygautam/Desktop/Project/SupportOps/.github/workflows/frontend-pages.yml)

The frontend workflow installs dependencies, runs lint, runs Vitest, and builds the production bundle. The backend workflow runs Maven tests and verifies packaging.

### GitHub Pages Quick Setup

1. Push the repository to GitHub.
2. Open repository settings and go to `Pages`.
3. Set the source to `GitHub Actions`.
4. Add a repository variable named `VITE_API_URL` that points at the deployed backend origin.
5. Push to `main` or run the `Frontend Pages Deploy` workflow manually.

## Demo Walkthrough

If you want to present the project quickly:

1. Open `/demo` for guided entry or `/about` for the project overview
2. Sign in as `admin@supportops.dev` for the broadest walkthrough
3. Start on Dashboard to frame queue pressure and incident visibility
4. Visit Tickets and open a detail view to show escalation, resolution, reopen flow, and mixed activity history
5. Open Incidents to show linked ticket visibility and operational impact
6. Open Team to show role-aware admin tooling
7. Open Analytics and Settings to show operational depth and persisted preferences

See the fuller demo script in [`docs/demo-guide.md`](/Users/ankygautam/Desktop/Project/SupportOps/docs/demo-guide.md).

## Architecture Overview

SupportOps is structured as a real two-part product:

- `frontend/` contains the React application, typed API layer, role-aware routing, reusable UI system, and showcase guidance surfaces.
- `backend/` contains the Spring Boot API, JWT authentication, layered services, DTO mapping, security configuration, seeded demo data, and business workflow rules.

The frontend consumes the backend through module-based API clients rather than page-local fetch logic. The backend separates controllers, services, repositories, entities, DTOs, mappers, and security classes so frontend integration can evolve without rework.

## Auth and Security Summary

- JWT-based login with seeded demo accounts
- BCrypt password hashing
- `/api/auth/login` as the public auth entry point
- `/api/auth/me` for session restore
- role-aware route protection in both frontend and backend
- protected APIs for tickets, incidents, customers, SLA, analytics, notifications, team management, and preferences

## API Overview

SupportOps exposes a frontend-focused REST API under `/api` with stable DTO-driven responses for:

- authentication and session restore
- dashboard summary and activity
- tickets, comments, and workflow updates
- incidents and linked operational impact
- customers and support history
- SLA queue and summary metrics
- analytics summaries, issue categories, and team performance
- notifications
- team management and user preferences

Representative endpoints:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/summary`
- `GET /api/tickets`
- `GET /api/tickets/{id}`
- `POST /api/tickets/{id}/comments`
- `GET /api/incidents`
- `GET /api/customers`
- `GET /api/sla`
- `GET /api/analytics/summary`
- `GET /api/users/me/preferences`
- `GET /api/health`
- `GET /api/info`

## Testing and Readiness

- Frontend includes Vitest and React Testing Library coverage for auth, protected routes, tickets, incidents, and settings
- Backend tests cover JWT auth basics, ticket workflow rules, comment creation, incidents, customers, SLA logic, and controller validation
- Auth restore, protected routes, seeded roles, and typed API integration are wired for realistic demo use
- A deployment checklist is included in [`docs/deployment-checklist.md`](/Users/ankygautam/Desktop/Project/SupportOps/docs/deployment-checklist.md)
- A screenshot capture plan is included in [`docs/screenshot-plan.md`](/Users/ankygautam/Desktop/Project/SupportOps/docs/screenshot-plan.md)

## Case Study Notes

Reusable case study content lives in [`docs/case-study.md`](docs/case-study.md) and can be adapted for a portfolio site, presentation deck, or project write-up.

## Why This Project Works Well in a Portfolio

SupportOps demonstrates:

- product thinking, not just UI assembly
- realistic internal-tool UX
- typed frontend/backend integration
- scalable Spring Boot architecture
- operational workflow modeling
- role-aware security
- polished demo presentation value

## Future Improvements

- database migrations with Flyway
- richer audit/event reporting and attachments
- real-time notification delivery
- stronger release automation and environment promotion workflows
