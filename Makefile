frontend-dev:
	cd frontend && npm run dev

backend-dev:
	cd backend && mvn spring-boot:run

frontend-build:
	cd frontend && npm run build

backend-build:
	cd backend && mvn -DskipTests package

frontend-test:
	cd frontend && npm run test:run

backend-test:
	cd backend && mvn test

frontend-lint:
	cd frontend && npm run lint

db-up:
	docker compose up -d postgres

db-down:
	docker compose down

check:
	cd frontend && npm run lint && npm run test:run && npm run build
	cd backend && mvn test
