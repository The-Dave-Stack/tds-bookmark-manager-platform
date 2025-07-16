# System Patterns: The Dave Stack Bookmark Manager Platform

## 1. System Architecture
The project is a full-stack monorepo managed with Nx and pnpm, consisting of a NestJS backend API and a React frontend UI application.

### Backend (`tds-bookmark-manager-api`)
- **Framework**: NestJS
- **Language**: TypeScript
- **Architecture**: Modular, following standard NestJS conventions.
    - **Controllers/API Layer**: Handles HTTP requests, routing, and DTO validation.
    - **Service/Business Logic Layer**: Contains core business rules and orchestrates operations.
    - **Data Access/Repository Layer**: Manages TypeORM interactions with the PostgreSQL database.
- **Database**: PostgreSQL, managed with TypeORM entities and migrations.
- **Authentication/Authorization**: Passport.js with Local and JWT strategies, secured by `JwtAuthGuard` and `RolesGuard`.
- **Security**: `bcrypt` for password hashing, `helmet` for HTTP headers, `ThrottlerModule` for rate limiting, global `ValidationPipe` for input validation.
- **Logging**: `nestjs-pino` for structured, asynchronous logging.

### Frontend (`tds-bookmark-manager-ui`)
- **Framework/Library**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript with TSX
- **Architecture**: Component-based.
    - **Pages**: Top-level components for routes.
    - **Components**: Reusable UI components, organized by feature.
    - **Layout**: Main structural components (`Layout`, `Header`, `Sidebar`).
- **State Management**: Zustand for global state, `useState` for local component state.
- **API Layer**: Currently uses a mock API service (`mockApiService.ts`) but will transition to a real service using `axios` or `fetch`.
- **Styling**: Tailwind CSS.
- **Internationalization**: `i18next` and `react-i18next` for multi-language support.
- **Testing**: Vitest for unit/component tests, React Testing Library for rendering, Playwright for E2E tests.

## 2. Key Technical Decisions
- **Monorepo**: Nx for managing multiple applications and libraries within a single repository, facilitating shared code and consistent tooling.
- **TypeScript Everywhere**: Ensures type safety across both frontend and backend, improving code quality and maintainability.
- **ORM (TypeORM)**: Provides an abstraction layer for database interactions, allowing for object-oriented database operations and schema migrations.
- **Modular Design**: Promotes separation of concerns, reusability, and easier maintenance for both frontend and backend.
- **Global Validation Pipe (NestJS)**: Centralized input validation using `class-validator` decorators.
- **Zustand for State Management**: A lightweight and flexible state management solution for React.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and consistent styling.
- **i18n**: Built-in internationalization support for future multi-language capabilities.

## 3. Design Patterns in Use
- **Repository Pattern**: Abstracting data access logic (implicitly used with TypeORM entities and services).
- **Service Layer Pattern**: Encapsulating business logic, separating it from controllers and data access.
- **DTOs (Data Transfer Objects)**: Used for data validation and shaping data transferred between layers (especially in NestJS).
- **Strategy Pattern (Passport.js)**: For authentication strategies (Local, JWT).
- **Middleware Pattern**: For global concerns like logging, security headers, and rate limiting.
- **Component Pattern (React)**: Building UI from small, reusable, and independent components.

## 4. Component Relationships (High-Level)

### Backend
- `main.ts` -> `AppModule`
- `AppModule` -> `AuthModule`, `UsersModule`, `BookmarksModule`, `FoldersModule`, `StatisticsModule`, `WebhookModule`, `AdminModule`, `ConfigModule`, `TypeOrmModule`, `LoggerModule`, `ThrottlerModule`.
- Controllers interact with Services.
- Services interact with TypeORM Repositories (Entities).
- Guards and Decorators are used across controllers and services for security and roles.

### Frontend
- `main.tsx` -> `App.tsx`
- `App.tsx` -> `BrowserRouter`, `Layout`, `Login`, `Register`, `Dashboard`, `AdminPanel`, `ProfileSettings`, `LandingPage`.
- `Layout.tsx` -> `Header.tsx`, `Sidebar.tsx`, and renders child routes.
- Pages and Components interact with Zustand stores (`authStore`, `bookmarkStore`, `folderStore`).
- Zustand stores interact with `apiService` (mock or real).
- Components use `useTranslation` hook for i18n.

## 5. Critical Implementation Paths
- **User Authentication Flow**: Registration -> Login -> JWT token generation -> Protected API access.
- **Bookmark CRUD**: Adding a bookmark (with URL parsing for title/favicon) -> Listing bookmarks -> Editing -> Deleting.
- **Folder Management**: Creating folders -> Assigning bookmarks to folders -> Renaming/Deleting folders.
- **Webhook Integration**: Receiving external bookmark data -> Validating token -> Saving bookmark.
- **Admin User Management**: Listing users -> Changing roles.
