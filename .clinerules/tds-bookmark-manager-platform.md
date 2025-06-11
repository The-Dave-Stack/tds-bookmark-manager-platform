# Project: TDS Bookmark Manager Platform

This is a full-stack monorepo project named "TDS Bookmark Manager Platform", managed with **Nx** and **pnpm workspaces**. It consists of a backend API and a frontend UI application, both written entirely in **TypeScript**. The project is intended to be open-source, so all code, comments, and documentation should be in **English**.

## 1. Global Project Information

-   **Monorepo Tool**: Nx
-   **Package Manager**: pnpm
-   **Core Scripts** (from root `package.json`):
    -   `start:api:dev`: Starts the NestJS backend in development mode.
    -   `start:ui:dev`: Starts the React frontend in development mode.
    -   `migration:generate`, `migration:run`, `migration:revert`: TypeORM CLI commands for database migrations.
-   **Linting/Formatting**: ESLint and Prettier are configured at the root level.

## 2. Backend: `tds-bookmark-manager-api`

The backend is a robust NestJS application.

-   **Framework**: NestJS
-   **Language**: TypeScript
-   **Core Files**:
    -   `src/main.ts`: Application entry point. Configures global pipes (`ValidationPipe`), CORS, `helmet` for security, API versioning, and Swagger documentation.
    -   `src/app.module.ts`: Root module. Integrates all feature modules, `ConfigModule`, `TypeOrmModule`, `LoggerModule` (Pino), and `ThrottlerModule` for rate limiting.
-   **Architecture & Modules**: The application follows a standard modular architecture.
    -   `AuthModule` (`src/auth`): Handles authentication and authorization using Passport.js.
        -   **Strategies**: `LocalStrategy` for email/password and `JwtStrategy` for protecting endpoints.
        -   **Guards**: `JwtAuthGuard` and `RolesGuard` are used to secure controllers.
        -   **DTOs**: `CreateUserDto` and `LoginUserDto` for data validation at the controller level.
    -   `UsersModule` (`src/users`): Manages user data and persistence.
    -   `BookmarksModule` (`src/bookmarks`): Manages bookmark data.
    -   `FoldersModule` (`src/folders`): Manages folder data.
-   **Database**:
    -   **ORM**: **TypeORM** is used for database interaction.
    -   **Entities**: Defined in `src/**/entities/*.entity.ts`. Key entities are `UserEntity`, `BookmarkEntity`, and `FolderEntity`. Relationships (`@ManyToOne`, `@OneToMany`) and constraints are defined here.
    -   **Migrations**: Database schema changes are managed via migrations located in `src/db/migrations/`. These are generated and run using the `typeorm` CLI scripts in `package.json`.
    -   **Database Support**: The configuration supports both **PostgreSQL** (for production, via `docker-compose.yml`) and **SQLite** (as a fallback for local development), determined by the `DB_TYPE` environment variable.
-   **Configuration**:
    -   Uses `@nestjs/config` for environment variable management.
    -   Configuration is modularized into files like `app.config.ts`, `database.config.ts`, and `jwt.config.ts`.
    -   Secrets (e.g., `JWT_SECRET`) are loaded from `.env.{environment}` files.
-   **Security**:
    -   Password hashing is done with `bcrypt`.
    -   `helmet` is used for setting secure HTTP headers.
    -   `ThrottlerModule` provides global rate-limiting.
    -   Input validation is enforced globally by `ValidationPipe`.
-   **Logging**:
    -   Uses `nestjs-pino` for structured, asynchronous logging.
    -   Configuration in `src/logger/config.ts` provides different outputs for development (pretty-printed) and production (JSON) and redacts sensitive information.
-   **Testing**:
    -   Unit and integration tests are written with **Jest**.
    -   E2E tests are set up in a separate `tds-bookmark-manager-api-e2e` project.

## 3. Frontend: `tds-bookmark-manager-ui`

The frontend is a modern single-page application built with React.

-   **Framework/Library**: React 19
-   **Build Tool**: Vite
-   **Language**: TypeScript with TSX
-   **Core Files**:
    -   `src/main.tsx`: App entry point. Configures `BrowserRouter`, `react-hot-toast`, and `i18next`.
    -   `src/App.tsx`: Defines application routing using `react-router-dom` and renders the main layout.
-   **Component Architecture**:
    -   `src/pages`: Top-level components for each route (e.g., `Dashboard.tsx`, `Login.tsx`).
    -   `src/components`: Reusable components, organized by feature (e.g., `bookmarks`, `layout`, `common`).
    -   `src/components/layout`: Contains the main `Layout.tsx`, `Header.tsx`, and `Sidebar.tsx` that structure the authenticated user experience.
-   **State Management**:
    -   **Zustand** is used for global state management.
    -   Stores are defined in `src/stores/`, such as `authStore.ts` and `bookmarkStore.ts`. They handle state logic and interactions with the API service.
-   **API Layer**:
    -   `src/api/apiService.ts`: **Currently contains a mock API service** that simulates backend calls using data from `mockData.ts`. This allows for independent UI development. The project will need to transition this to a real service using `axios` or `fetch`.
    -   `src/api/types.ts`: Defines shared TypeScript types used between the API layer and the UI.
-   **Styling**:
    -   **Tailwind CSS** is used for all styling.
    -   The theme and custom colors are defined in `tailwind.config.js`.
-   **Internationalization (i18n)**:
    -   `i18next` and `react-i18next` are fully configured.
    -   Translation files are located in `src/i18n/locales/` for English (`en.json`) and Spanish (`es.json`).
    -   Use the `useTranslation` hook and `t()` function for all user-facing strings.
-   **Testing**:
    -   **Vitest** is used for unit and component testing (`__tests__` directories).
    -   **React Testing Library** is used for rendering components in tests.
    -   **Playwright** is configured for end-to-end tests in the `tds-bookmark-manager-ui-e2e` project.

## 4. How to Assist

When providing help, adhere to the following guidelines:

-   **Language**: **Always provide code, comments, and explanations in English.**
-   **Architecture Adherence**:
    -   **Backend**: Generate code that fits the NestJS modular architecture. New features should be in their own modules. Use DTOs with `class-validator` decorators for input validation. Use services for business logic and repositories for data access.
    -   **Frontend**: Create components following the existing structure. For new features, utilize Zustand stores for state management and call the `apiService` for data fetching. Do not put business logic directly in components.
-   **Code Style**: Match the existing code style (ESLint/Prettier). Use TypeScript and provide types for all new functions, variables, and props.
-   **i18n**: When adding new user-facing text in the frontend, use the `t()` function from `react-i18next` and add the corresponding keys to both `en.json` and `es.json`.
-   **Testing**: When generating a new feature (e.g., a new NestJS controller or a React component), suggest or generate a corresponding test file (`.spec.ts` or `.test.tsx`).
-   **Security**: Do not suggest storing secrets or sensitive keys in code. Remind to use the `ConfigService` in the backend.
-   **State Management**: Favor Zustand for any new global state. Use component-level state (`useState`) for UI-specific, non-shared state.