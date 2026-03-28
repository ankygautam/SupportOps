# SupportOps Setup Guide

## Local prerequisites

- Node.js 20+
- npm
- Java 17
- Maven
- PostgreSQL 16+ or Docker

## Fast local setup

1. Start PostgreSQL.
2. Copy environment examples.
3. Start backend.
4. Start frontend.

## Option A: use local PostgreSQL

Create a database named `supportops`, then use the example env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Start the backend:

```bash
cd backend
mvn spring-boot:run
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

## Option B: use Docker for PostgreSQL

From the project root:

```bash
docker compose up -d postgres
```

Then start the backend and frontend as usual.

## Root-level convenience commands

From the project root:

```bash
make db-up
make backend-dev
make frontend-dev
```

Useful checks:

```bash
make frontend-lint
make frontend-test
make backend-test
make check
```

## Default local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

## Demo-safe local defaults

- Database: `supportops`
- Database user: `postgres`
- Database password: `postgres`
- Demo mode: enabled in local/demo profiles
