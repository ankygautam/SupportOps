# SupportOps Architecture Notes

SupportOps is organized to keep product domains understandable without over-abstracting the app.

## Frontend structure

- `frontend/src/api`: typed API clients grouped by domain
- `frontend/src/app/config`: shared runtime config, options, storage keys, and feature flags
- `frontend/src/components`: reusable UI primitives plus domain-specific components
- `frontend/src/contexts`: auth, toast, and app-level state
- `frontend/src/hooks`: query helpers, URL state helpers, and reusable data behaviors
- `frontend/src/pages`: route-level orchestration only
- `frontend/src/types`: API DTOs and normalized UI models

## Frontend conventions

- Keep page files responsible for route orchestration, not low-level rendering details.
- Keep feature-specific UI inside feature folders such as `components/tickets` or `components/incidents`.
- Put browser storage keys in `app/config/storage.ts` instead of scattering string literals.
- Put demo/showcase toggles in `app/config/features.ts` so they can be disabled cleanly later.
- Prefer URL-backed query state for searchable/filterable tables.

## Backend structure

- `controller`: thin HTTP layer
- `service`: business logic and workflow orchestration
- `dto`: request/response contracts
- `mapper`: entity-to-DTO and DTO-to-entity mapping
- `repository`: focused data access
- `entity`: persistence model
- `security`: JWT and auth infrastructure
- `config`: environment, startup, CORS, and readiness behavior

## API shape conventions

- List endpoints should stay lightweight and table-oriented.
- Detail endpoints may include richer nested context needed by a specific workspace.
- Error payloads should keep the existing `timestamp`, `status`, `error`, `message`, and `path` shape.
- Query parameters should prefer simple names such as `q`, `status`, `priority`, `page`, and `pageSize`.

## Demo and environment behavior

- Demo accounts and showcase helpers are intentional product-layer additions, not core business logic.
- Backend demo seed behavior is controlled through `DEMO_MODE` and active profile selection.
- Frontend showcase/demo visibility is controlled through `VITE_DEMO_MODE` and `VITE_SHOWCASE_MODE`.

## Tables and forms

- Reuse shared table wrappers, pagination, badges, and page error states before creating new patterns.
- Keep forms aligned to the shared button, field, and toast patterns so workflows remain consistent.
