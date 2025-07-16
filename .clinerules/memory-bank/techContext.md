# Tech Context: The Dave Stack Bookmark Manager Platform

## 1. Technologies Used

### Frontend
- **React 19**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **Vite**: Fast build tool and development server.
- **Zustand**: A small, fast, and scalable bear-bones state-management solution.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **i18next & react-i18next**: Internationalization framework for React applications.
- **Vitest**: A blazing fast unit-test framework powered by Vite.
- **React Testing Library**: A set of utilities for testing React components.
- **Playwright**: A framework for Web Testing and Automation (used for E2E tests).

### Backend
- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **TypeORM**: ORM (Object Relational Mapper) for TypeScript and JavaScript (ES7, ES6, ES5). Supports PostgreSQL.
- **Passport.js**: Authentication middleware for Node.js.
- **bcrypt**: Library for hashing passwords.
- **nestjs-pino**: Module for integrating Pino (a very fast logger) with NestJS.
- **helmet**: Express.js middleware for setting various HTTP headers to help secure the app.
- **ThrottlerModule**: NestJS module for rate limiting.
- **class-validator & class-transformer**: Libraries for object validation and transformation.
- **Jest**: JavaScript testing framework (used for unit and integration tests).

### Database
- **PostgreSQL**: A powerful, open-source object-relational database system.

### Monorepo & Package Management
- **Nx**: A set of extensible dev tools for monorepos.
- **pnpm**: A fast, disk space efficient package manager.

### Deployment (Considerations)
- **Docker**: Platform for developing, shipping, and running applications in containers.

## 2. Development Setup

### Prerequisites
- Node.js (LTS version recommended)
- pnpm
- Docker (for local database and potential containerized development)
- Git

### Initial Setup (from root of monorepo)
1. `pnpm install`: Install all dependencies for the monorepo.
2. Database setup:
    - Ensure Docker is running.
    - `docker-compose up -d postgres`: Start the PostgreSQL container.
    - Run migrations (scripts defined in `package.json`):
        - `pnpm migration:generate <MigrationName>`: Generate a new migration.
        - `pnpm migration:run`: Run pending migrations.
        - `pnpm migration:revert`: Revert the last migration.
3. Start Backend: `pnpm start:api:dev`
4. Start Frontend: `pnpm start:ui:dev`

### Environment Variables
- Backend uses `@nestjs/config` to load environment variables from `.env.{environment}` files.
- Sensitive information like `JWT_SECRET` and database credentials are configured via these files.
- Frontend might also use environment variables, typically prefixed with `VITE_` for Vite.

## 3. Technical Constraints
- **TypeScript Only**: All new code must be written in TypeScript.
- **Single-level Folders (MVP)**: Folder nesting is explicitly excluded for MVP.
- **No AI/ML for MVP**: Advanced AI features are post-MVP.
- **No Browser Extensions/Mobile Apps for MVP**: Focus is on the web application.
- **Mock API Service in Frontend**: The frontend currently relies on `mockApiService.ts`. This needs to be replaced with a real API integration using `axios` or `fetch` when the backend is ready.

## 4. Dependencies (Key Libraries/Packages)

### Root `package.json`
- `@nx/js`, `@nx/nest`, `@nx/react`, `@nx/vite`: Nx plugins.
- `prettier`, `eslint`: Code formatting and linting.

### Backend (`apps/backend/tds-bookmark-manager-api/package.json`)
- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`: Core NestJS packages.
- `@nestjs/config`, `@nestjs/jwt`, `@nestjs/passport`, `@nestjs/swagger`, `@nestjs/typeorm`: NestJS modules for configuration, JWT, Passport, Swagger, and TypeORM.
- `typeorm`, `pg`: TypeORM and PostgreSQL driver.
- `bcrypt`: Password hashing.
- `class-validator`, `class-transformer`: Validation and transformation.
- `helmet`, `compression`: Security and performance middleware.
- `nestjs-pino`: Logging.
- `passport-jwt`, `passport-local`: Passport strategies.
- `reflect-metadata`, `rxjs`: Required dependencies.

### Frontend (`apps/ui/tds-bookmark-manager-ui/package.json`)
- `react`, `react-dom`: React core libraries.
- `react-router-dom`: Routing.
- `zustand`: State management.
- `tailwindcss`, `postcss`, `autoprefixer`: Styling.
- `i18next`, `react-i18next`: Internationalization.
- `react-hot-toast`: Notifications.
- `axios`: HTTP client (will be used for real API calls).

## 5. Tool Usage Patterns

- **Nx Commands**: Used for generating applications/libraries, running tests, building, and serving.
- **pnpm Commands**: Used for installing dependencies (`pnpm install`), adding/removing packages (`pnpm add`, `pnpm remove`).
- **TypeORM CLI**: Used for database migrations (`pnpm migration:generate`, `pnpm migration:run`, `pnpm migration:revert`).
- **Jest/Vitest**: Used for running tests (`pnpm test`).
- **ESLint/Prettier**: Integrated into development workflow for code quality and consistency.
