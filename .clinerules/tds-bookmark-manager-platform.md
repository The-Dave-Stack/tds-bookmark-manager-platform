# Project: TDS Bookmark Manager Platform

This is a monorepo project named "TDS Bookmark Manager Platform", managed with pnpm workspaces. It consists of a backend API and a frontend UI application. The primary language used throughout the project is TypeScript.

## Global Project Information

- **Monorepo Structure**:
    - `apps/backend/tds-bookmark-manager-api`: NestJS backend application.
    - `apps/ui/tds-bookmark-manager-ui`: React frontend application.
- **Package Manager**: pnpm.
- **Node Version**: >=22.
- **Key Root Scripts** (from `package.json`):
    - `pnpm run clean:all`: Cleans all workspaces.
    - `pnpm run build`: Builds both backend and frontend.
    - `pnpm run format`: Formats code in all workspaces.
    - `pnpm run start:api:dev`: Starts the backend API in development mode.
    - `pnpm run start:ui:dev`: Starts the frontend UI in development mode.
    - `pnpm run start:dev`: Starts both API and UI in development mode concurrently.

## Backend: `tds-bookmark-manager-api`

The backend is a NestJS application written in TypeScript.

- **Framework**: NestJS
- **Core Files**:
    - `src/main.ts`: Application entry point, sets up global pipes (ValidationPipe), CORS, Helmet.
    - `src/app.module.ts`: Root module, imports `AuthModule`, `UsersModule`, `ThrottlerModule`.
- **Modules & Architecture**:
    - `UsersModule` (`src/users/`):
        - `UsersService` (`users.service.ts`): Manages user data. Currently uses an in-memory array for users.
        - `User` entity (`user.entity.ts`): Defines the user structure (userId, username, password, roles).
        - `CreateUserDto` (`dto/create-user.dto.ts`): Data Transfer Object for user creation with validation.
    - `AuthModule` (`src/auth/`): Handles authentication and authorization.
        - `AuthService` (`auth.service.ts`): Logic for user validation, login (JWT generation), and registration. Uses `bcrypt` for password hashing.
        - `AuthController` (`auth.controller.ts`): Endpoints for `/auth/login`, `/auth/register`, `/auth/profile`, `/auth/admin-data`.
        - Strategies: `JwtStrategy` (`jwt.strategy.ts`), `LocalStrategy` (`local.strategy.ts`) using Passport.
        - Guards: `RolesGuard` (`roles.guard.ts`) for role-based access control, used with `@Roles()` decorator (`roles.decorator.ts`).
        - Constants: `jwtConstants` (`constants.ts`) for JWT secret (marked as TODO to use env var).
- **Validation**: Uses `class-validator` and `class-transformer`. `ValidationPipe` is applied globally in `main.ts`.
- **Security**:
    - `helmet` for security headers.
    - `ThrottlerModule` for rate limiting.
- **Linting/Formatting**: ESLint (`eslint.config.mjs`) and Prettier.
- **Configuration**: `nest-cli.json`, `tsconfig.json`.
- **Testing**: Jest setup (`package.json`, `test/jest-e2e.json`).

## Frontend: `tds-bookmark-manager-ui`

The frontend is a React application built with Vite, TypeScript, and Tailwind CSS.

- **Core Files**:
    - `src/main.tsx`: Application entry point, sets up React DOM, BrowserRouter, Toaster.
    - `src/App.tsx`: Defines routes and main application layout structure.
    - `index.html`: Main HTML file.
- **Key Technologies & Libraries**:
    - React 19.
    - Vite for bundling and dev server.
    - TypeScript.
    - Tailwind CSS for styling (`tailwind.config.js`, `postcss.config.js`, `src/index.css`).
    - Zustand for state management (`src/stores/authStore.ts`, `src/stores/bookmarkStore.ts`).
    - React Router for navigation (`src/App.tsx`).
    - `i18next` and `react-i18next` for internationalization (`src/i18n/`). Supports English and Spanish.
    - Lucide React for icons.
    - React Hot Toast for notifications.
- **Structure & Components**:
    - `src/api/`:
        - `apiService.ts`: Contains functions simulating API calls (e.g., login, getBookmarks). **Currently uses mock data (`mockData.ts`)**.
        - `types.ts`: TypeScript interfaces for User, Bookmark, Folder.
    - `src/components/`: Reusable UI components.
        - `auth/`: `AdminRoute.tsx`, `ProtectedRoute.tsx`.
        - `bookmarks/`: `BookmarkCard.tsx`, `BookmarkGrid.tsx`, `BookmarkModal.tsx`, `MostClickedBookmarks.tsx`.
        - `folders/`: `FolderModal.tsx`.
        - `layout/`: `Layout.tsx`, `Header.tsx`, `Sidebar.tsx`.
        - `statistics/`: `AdminStats.tsx`, `UserStats.tsx`, `DateRangeSelector.tsx`.
        - `common/`: `ConfirmDialog.tsx`, `LanguageSwitcher.tsx`, `LoadingScreen.tsx`.
    - `src/pages/`: Top-level page components like `Dashboard.tsx`, `Login.tsx`, `Register.tsx`, `AdminPanel.tsx`, `ProfileSettings.tsx`, `LandingPage.tsx`.
- **Linting**: ESLint (`eslint.config.js`).
- **Docker**:
    - `docker-compose.develop.yml`: For local development, builds from `Dockerfile` (not provided in the list of files you uploaded, but referenced) and exposes port 8080.
    - `docker-compose.yml`: For production, uses a pre-built image `registry.thedavestack.com/tds-bookmark-manager:latest` and includes Traefik labels for reverse proxy and HTTPS.
- **README Features**:
    - Authentication & Authorization (JWT, RBAC, protected routes)
    - Bookmark Management (CRUD, folders, click tracking)
    - Folder Organization (nested, subfolders)
    - Statistics & Analytics (user/admin, date range filtering)
    - Multilingual Support (EN/ES)
    - Integration Features (Webhook URL, API token, Bookmarklet)
    - User Profile (info, password, webhook config)
    - Admin Features (user management, global stats)
    - Docker Support

## Development Focus

- **Data State**: Backend currently uses in-memory data for users; frontend API service uses mock data. The UI README mentions "Supabase (Database)" as part of the backend stack, which might be the intended future state or a point to clarify for consistency.
- **Internationalization**: Fully set up in frontend with EN/ES JSON files in `apps/ui/tds-bookmark-manager-ui/src/i18n/locales/`.