# SupportOps Backend

Spring Boot backend for the SupportOps support operations platform.

## Stack

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- PostgreSQL
- Bean Validation
- JWT auth

## Structure

- `config` application and infrastructure configuration
- `controller` REST API endpoints
- `dto` request and response models
- `entity` JPA entities and audit base classes
- `enums` shared domain enums
- `exception` API error handling
- `mapper` entity-to-DTO mapping
- `repository` JPA repositories
- `security` JWT auth and Spring Security configuration
- `seed` local demo data bootstrap
- `service` business logic

## Local run

1. Create a PostgreSQL database named `supportops`
2. Make sure PostgreSQL is running and listening on `localhost:5432` or override the datasource URL
3. Set environment variables if needed:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `FRONTEND_ORIGIN`
   - `SPRING_PROFILES_ACTIVE`
   - `DEMO_MODE`
4. Start the app:

```bash
mvn spring-boot:run
```

You can copy the example env file first:

```bash
cp .env.example .env
```

Default local config is defined in [`src/main/resources/application.yml`](/Users/ankygautam/Desktop/Project/SupportOps/backend/src/main/resources/application.yml).

## Profiles and demo mode

- `dev` is the default local profile
- `demo` enables seeded accounts and demo data for showcase deployments
- `prod` keeps demo seeding disabled
- `DEMO_MODE=true` can be used to force seed loading when needed

Profile files:

- [`src/main/resources/application.yml`](/Users/ankygautam/Desktop/Project/SupportOps/backend/src/main/resources/application.yml)
- [`src/main/resources/application-dev.yml`](/Users/ankygautam/Desktop/Project/SupportOps/backend/src/main/resources/application-dev.yml)
- [`src/main/resources/application-demo.yml`](/Users/ankygautam/Desktop/Project/SupportOps/backend/src/main/resources/application-demo.yml)
- [`src/main/resources/application-prod.yml`](/Users/ankygautam/Desktop/Project/SupportOps/backend/src/main/resources/application-prod.yml)

## Demo credentials

- `admin@supportops.dev` / `supportops`
- `lead@supportops.dev` / `supportops`
- `agent1@supportops.dev` / `supportops`

## Seeded APIs

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/summary`
- `GET /api/tickets`
- `GET /api/tickets/{id}`
- `POST /api/tickets`
- `PUT /api/tickets/{id}`
- `GET /api/tickets/{id}/comments`
- `POST /api/tickets/{id}/comments`
- `GET /api/customers`
- `GET /api/customers/{id}`
- `GET /api/incidents`
- `GET /api/incidents/{id}`
- `POST /api/incidents`
- `GET /api/sla`
- `GET /api/analytics/summary`
- `GET /api/users/me/preferences`
- `PUT /api/users/me/preferences`
- `GET /api/users/team`
- `GET /api/notifications`
- `PUT /api/notifications/{id}/read`
- `PUT /api/notifications/read-all`
- `GET /api/health`
- `GET /api/info`

## Testing and Packaging

```bash
mvn test
mvn -DskipTests package
```

Current backend coverage focuses on:

- auth service login flow
- JWT generation and validation basics
- ticket workflow rules and comment creation
- incident creation/update logic
- customer lookup behavior
- SLA summary and validation rules
- controller validation for auth and tickets

## Production Safety Notes

- `prod` profile fails fast if `JWT_SECRET` still uses the local default
- `prod` profile fails fast if `DB_URL` still points at local PostgreSQL
- `prod` profile fails fast if `FRONTEND_ORIGIN` is missing
- `DEMO_MODE` must remain disabled in production-style deployments

CI workflow:

- [`../.github/workflows/backend-ci.yml`](/Users/ankygautam/Desktop/Project/SupportOps/.github/workflows/backend-ci.yml)

## Notes

- The backend is intentionally frontend-friendly and demo-driven in `dev` and `demo` profiles.
- The schema is ready for later PostgreSQL-backed frontend integration without replacing the API shape.
- `mvn test` runs lightweight workflow and controller coverage for key auth and ticket rules.
