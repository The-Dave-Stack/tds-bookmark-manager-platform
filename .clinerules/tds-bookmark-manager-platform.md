# Project: TDS Bookmark Manager Platform

This is a monorepo project named "TDS Bookmark Manager Platform", managed with pnpm workspaces. It consists of a backend API and a frontend UI application. The primary language used throughout the project is TypeScript.

**AI Assistant (Cline) Directives:**
- When performing tasks, be mindful of the monorepo structure. Use `pnpm --filter <app-name> <command>` for app-specific actions if not using a root-level script.
- The backend is in `apps/backend/tds-bookmark-manager-api` and the frontend in `apps/ui/tds-bookmark-manager-ui`.
- Prioritize using existing pnpm scripts for common tasks like building, testing, and linting.
- Note the current data persistence strategy: backend uses in-memory arrays for users, and the frontend API service (`apiService.ts`) uses mock data. Be aware that Supabase is mentioned as a potential future database for the backend.
- Adhere to ESLint and Prettier configurations for code style.
- Provide suggestions and generate code consistent with the existing technology stack (NestJS for backend, React/Vite/Zustand/Tailwind for frontend).

## Global Project Information

- **Monorepo Structure**:
    - Backend: `apps/backend/tds-bookmark-manager-api` (NestJS application)
    - Frontend: `apps/ui/tds-bookmark-manager-ui` (React application)
- **Package Manager**: `pnpm` (version >=10 specified in root `package.json`)
- **Node Version**: `>=22` (specified in root `package.json`)
- **Key Root Scripts** (from root `package.json`):
    - `pnpm run clean:all`: Cleans all workspaces (executes `rimraf node_modules pnpm-lock.yaml` and `pnpm -r run clean:all`).
    - `pnpm run build`: Builds both backend (`pnpm --filter=tds-bookmark-manager-api run build`) and frontend (`pnpm --filter=tds-bookmark-manager-ui run build`).
    - `pnpm run format`: Formats code in all workspaces (executes `pnpm -r run format`).
    - `pnpm run start:api:dev`: Starts the backend API in development mode (`pnpm --filter=tds-bookmark-manager-api run start:dev`).
    - `pnpm run start:ui:dev`: Starts the frontend UI in development mode (`pnpm --filter=tds-bookmark-manager-ui run dev`).
    - `pnpm run start:dev`: Starts both API and UI in development mode concurrently (uses `npm-run-all`).
    - Other test scripts: `test:api`, `test:api:cov`, `test:ui`, `test:ui:cov`, `test:api:e2e`.

## Backend: `tds-bookmark-manager-api`

The backend is a NestJS application located at `apps/backend/tds-bookmark-manager-api`, written in TypeScript.

- **Framework**: NestJS.
- **Core Files**:
    - `src/main.ts`: Application entry point. Sets up global `ValidationPipe`, CORS, and `helmet`.
    - `src/app.module.ts`: Root module. Imports `AuthModule`, `UsersModule`, `ThrottlerModule`, `ConfigModule`, and `LoggerModule` (nestjs-pino).
- **Modules & Architecture**:
    - `UsersModule` (defined in `src/users/users.module.ts`):
        - `UsersService` (in `src/users/users.service.ts`): Manages user data. **Currently uses an in-memory array for users.**
        - `UserEntity` (defined in `src/users/user.entity.ts`): Defines the user structure (e.g., `userId`, `username`, `password`, `email`, `roles`).
        - `CreateUserDto` (in `src/users/dto/create-user.dto.ts`): Data Transfer Object for user creation with validation using `class-validator`.
        - `LoginUserDto` (in `src/users/dto/login-user.dto.ts`): DTO for user login.
    - `AuthModule` (defined in `src/auth/auth.module.ts`): Handles authentication and authorization.
        - `AuthService` (in `src/auth/auth.service.ts`): Logic for user validation, login (JWT generation via `JwtService`), and registration. Uses `bcrypt` for password hashing.
        - `AuthController` (in `src/auth/auth.controller.ts`): Defines endpoints like `/auth/login`, `/auth/register`, `/auth/profile`, `/auth/admin-data`.
        - Strategies: `JwtStrategy` (in `src/auth/strategies/jwt.strategy.ts`) and `LocalStrategy` (in `src/auth/strategies/local.strategy.ts`) using Passport.
        - Guards: `JwtAuthGuard`, `LocalAuthGuard`, `RolesGuard` (in `src/auth/guards/roles.guard.ts`) for role-based access control, used with the `@Roles()` decorator (defined in `src/auth/decorators/roles.decorator.ts`).
        - Constants: `jwtConstants` (in `src/auth/constants.ts`) for JWT secret (marked as TODO to use environment variable).
        - DTOs: `JwtPayloadDto`, `TokenDto`.
- **Validation**: Uses `class-validator` and `class-transformer`. `ValidationPipe` is applied globally in `src/main.ts`.
- **Security**:
    - `helmet` for security HTTP headers.
    - `@nestjs/throttler` for rate limiting, configured in `src/app.module.ts`.
- **Logging**: `nestjs-pino` and `pino-http` with `pino-pretty` for development, configured in `src/app.module.ts`.
- **API Documentation**: `@nestjs/swagger` used in `src/main.ts` to generate API docs at `/api-docs`.
- **Configuration**: `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json`. Module-specific configurations in `src/config/` (e.g., `app.config.ts`, `jwt.config.ts`).
- **Linting/Formatting**: ESLint (config: `eslint.config.mjs`) and Prettier (via `format` script).
- **Testing**: Jest (`test/jest-e2e.json`, `*.spec.ts` files). Example E2E test: `test/app.e2e-spec.ts`.
- **Key Scripts** (from `apps/backend/tds-bookmark-manager-api/package.json`):
    - `pnpm run build` (uses `nest build`)
    - `pnpm run format` (uses `prettier`)
    - `pnpm run start:dev` (uses `nest start --watch`)
    - `pnpm run lint` (uses `eslint`)
    - `pnpm run test` (uses `jest`)
    - `pnpm run test:e2e` (uses `jest --config ./test/jest-e2e.json`)

## Frontend: `tds-bookmark-manager-ui`

The frontend is a React application located at `apps/ui/tds-bookmark-manager-ui`, built with Vite, TypeScript, and Tailwind CSS.

- **Core Files**:
    - `src/main.tsx`: Application entry point. Sets up React DOM, `BrowserRouter`, and `Toaster` for notifications.
    - `src/App.tsx`: Defines routes using `react-router-dom` and main application layout structure. Includes `ProtectedRoute` and `AdminRoute`.
    - `index.html`: Main HTML file for Vite.
- **Key Technologies & Libraries**:
    - React 18.
    - Vite for bundling and dev server (`vite.config.ts`).
    - TypeScript (`tsconfig.app.json`, `tsconfig.node.json`).
    - Tailwind CSS for styling (`tailwind.config.js`, `postcss.config.js`, `src/index.css`).
    - Zustand for state management (e.g., `src/stores/authStore.ts`, `src/stores/bookmarkStore.ts`).
    - `react-router-dom` for navigation.
    - `i18next` and `react-i18next` for internationalization (`src/i18n/config.ts`). Supports English (`locales/en.json`) and Spanish (`locales/es.json`).
    - Lucide React for icons.
    - `react-hot-toast` for notifications.
- **Structure & Components**:
    - `src/api/`:
        - `apiService.ts`: Contains functions simulating API calls (e.g., login, getBookmarks). **Currently uses mock data from `mockData.ts`**.
        - `types.ts`: TypeScript interfaces for `User`, `Bookmark`, `Folder`.
    - `src/components/`: Reusable UI components.
        - `auth/`: `AdminRoute.tsx`, `ProtectedRoute.tsx`.
        - `bookmarks/`: `BookmarkCard.tsx`, `BookmarkGrid.tsx`, `BookmarkModal.tsx`, `MostClickedBookmarks.tsx`.
        - `folders/`: `FolderModal.tsx`.
        - `layout/`: `Layout.tsx`, `Header.tsx`, `Sidebar.tsx`.
        - `statistics/`: `AdminStats.tsx`, `UserStats.tsx`, `DateRangeSelector.tsx`.
        - `common/`: `ConfirmDialog.tsx`, `LanguageSwitcher.tsx`, `LoadingScreen.tsx`.
    - `src/pages/`: Top-level page components like `Dashboard.tsx`, `Login.tsx`, `Register.tsx`, `AdminPanel.tsx`, `ProfileSettings.tsx`, `LandingPage.tsx`.
    - `src/utils/`: Utility functions like `passwordValidation.ts` and `dateUtils.ts`.
- **Testing**: Vitest (`vitest.config.ts`) with Testing Library. Test files in `src/__tests__/`. Setup in `src/__tests__/setup.ts`.
- **Linting**: ESLint (`eslint.config.js`).
- **Docker**:
    - `Dockerfile` (content not provided, but referenced in README and `docker-compose.develop.yml`).
    - `docker-compose.develop.yml`: For local development, builds from `Dockerfile` and exposes port 8080.
    - `docker-compose.yml`: For production, uses a pre-built image `registry.thedavestack.com/tds-bookmark-manager:latest` and includes Traefik labels for reverse proxy and HTTPS.
- **Key Scripts** (from `apps/ui/tds-bookmark-manager-ui/package.json`):
    - `pnpm run dev` (uses `vite`)
    - `pnpm run build` (uses `tsc -b && vite build`)
    - `pnpm run lint` (uses `eslint .`)
    - `pnpm run test` (uses `vitest --run`)
    - `pnpm run test:cov` (uses `vitest run --coverage`)
- **README Features Overview** (from `apps/ui/tds-bookmark-manager-ui/README.md`):
    - Authentication & Authorization (JWT, RBAC, protected routes)
    - Bookmark Management (CRUD, folders, click tracking)
    - Folder Organization (nested, subfolders)
    - Statistics & Analytics (user/admin, date range filtering)
    - Multilingual Support (EN/ES)
    - Integration Features (Webhook URL, API token, Bookmarklet)
    - User Profile (info, password, webhook config)
    - Admin Features (user management, global stats)
    - Docker Support (multi-stage build, Nginx, Docker Compose)

## Development Focus & Current State

- **Data Persistence**:
    - **Backend**: Currently uses in-memory arrays for user data within `UsersService`.
    - **Frontend**: The `apiService.ts` uses mock data imported from `mockData.ts`.
    - **Future Note**: The UI README mentions "Supabase (Database)" as part of the backend stack, which suggests a planned or alternative persistence layer. This is important context for any database-related tasks.
- **Internationalization (i18n)**: Fully set up in the frontend with English and Spanish translations located in `apps/ui/tds-bookmark-manager-ui/src/i18n/locales/`.
- **Password Security**: Backend uses `bcrypt` for hashing passwords. Frontend includes password strength validation logic (`src/utils/passwordValidation.ts`).