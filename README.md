# TDS Bookmark Manager Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Reclaim Your Browser: TDS Bookmark Manager Platform is a modern, feature-rich bookmark management application designed to help you organize, find, and use your web links like never before. It features a clean, intuitive interface to enhance productivity.

## Overview

This project is a monorepo managed with `pnpm` workspaces, containing:
-   **Frontend (`apps/ui/tds-bookmark-manager-ui`):** A React application built with Vite, TypeScript, and Tailwind CSS, providing the user interface.
-   **Backend (`apps/backend/tds-bookmark-manager-api`):** A NestJS API that handles business logic, data storage (currently in-memory for users, with UI using mock data for bookmarks), and authentication.

## ✨ Features

The platform boasts a comprehensive set of features, including:

-   **🔐 Authentication & Authorization:** Secure user registration and login (JWT-based), role-based access control (User/Admin), password strength validation, and protected routes.
-   **📚 Bookmark Management:** Create, edit, delete, archive, and unarchive bookmarks. Includes click tracking, search, filtering, and sorting options.
-   **📁 Folder Organization:** Intuitive categorization of bookmarks into hierarchical (nested) folders.
-   **📊 Statistics & Analytics:** User-specific and global (admin) bookmark statistics, including most clicked and usage over custom date ranges.
-   **🌐 Multilingual Support:** Frontend support for English (en) and Spanish (es).
-   **🔧 Integration Features:** Webhook URL and API token for external integrations (details in user profile), plus a bookmarklet for quick saving.
-   **👤 User Profile Management:** Update personal information and password.
-   **👑 Admin Panel:** User management (role assignment) and access to global application statistics.
-   **🐳 Docker Support:** Configuration for development and production deployment using Docker and Docker Compose.

## 🛠️ Technology Stack

### Platform-wide
-   **TypeScript:** For static typing across the entire codebase.
-   **pnpm:** For efficient package management in the monorepo.
-   **ESLint & Prettier:** For code linting and formatting.
-   **Docker & Docker Compose:** For containerization and orchestration.

### Frontend (`apps/ui/tds-bookmark-manager-ui`)
-   **React 18:** For building the user interface.
-   **Vite:** As the build tool and development server.
-   **Zustand:** For state management.
-   **Tailwind CSS:** For utility-first styling.
-   **React Router:** For client-side routing.
-   **i18next & react-i18next:** For internationalization.
-   **Lucide React:** For icons.
-   **React Hot Toast:** For notifications.
-   **Vitest & React Testing Library:** For unit and component testing.

### Backend (`apps/backend/tds-bookmark-manager-api`)
-   **NestJS:** A progressive Node.js framework.
-   **Express:** As the underlying HTTP server framework (default with NestJS). -   **JWT (JSON Web Tokens):** For authentication, via `@nestjs/jwt` and `passport-jwt`.
-   **Passport.js:** For authentication strategies (`passport-local`, `passport-jwt`).
-   **bcrypt:** For password hashing.
-   **class-validator & class-transformer:** For request payload validation.
-   **Helmet:** For securing HTTP headers.
-   **nestjs-pino:** For structured logging.
-   **@nestjs/throttler:** For rate limiting.
-   **@nestjs/config:** For configuration management.
-   **@nestjs/swagger:** For API documentation.
-   **Jest & Supertest:** For testing.
-   **Data Persistence:** Currently, user data is managed in-memory within `UserService`. _(Note: The frontend README mentions Supabase, which might indicate a planned database integration.)_

## Monorepo Structure

The project is organized as a monorepo using pnpm workspaces:

```
tds-bookmark-manager-platform/
├── apps/
│   ├── backend/
│   │   └── tds-bookmark-manager-api/  # NestJS Backend Application
│   └── ui/
│       └── tds-bookmark-manager-ui/   # React Frontend Application
├── package.json                       # Root package.json
└── pnpm-workspace.yaml                # pnpm workspace configuration
```

## Prerequisites

-   Node.js: `>=22` (as specified in `package.json`)
-   pnpm: `>=10` (as specified in `package.json`)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/The-Dave-Stack/tds-bookmark-manager-platform.git
    cd tds-bookmark-manager-platform
    ```

2.  **Install dependencies from the root:**
    This will install dependencies for all workspaces.
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    -   **Backend (`apps/backend/tds-bookmark-manager-api`):** This application uses environment variables for configuration (e.g., `APP_PORT`, `JWT_SECRET`). Create a `.env.development` or `.env` file in the `apps/backend/tds-bookmark-manager-api` directory based on your needs. Refer to `src/config/app.config.ts` and `src/config/jwt.config.ts` for variables used.
    -   **Frontend (`apps/ui/tds-bookmark-manager-ui`):** If the frontend requires environment variables (e.g., for API base URLs), create a `.env` file in the `apps/ui/tds-bookmark-manager-ui` directory. (The UI README mentioned `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` which might be relevant if connecting to Supabase directly from UI, or if API URL is configurable).

## 🚀 Running the Applications

All commands should typically be run from the root of the monorepo.

-   **Start both Frontend UI and Backend API in development mode concurrently:**
    ```bash
    pnpm run start:dev
    ```
   

-   **Start only the Frontend UI (Development):**
    ```bash
    pnpm run start:ui:dev
    ```
   
    The UI will typically be available at `http://localhost:5173` (Vite's default).

-   **Start only the Backend API (Development):**
    ```bash
    pnpm run start:api:dev
    ```
   
    The API will typically be available at `http://localhost:3000` (or the port specified in its .env).

## ✅ Running Tests

-   **Run UI Tests:**
    ```bash
    pnpm --filter=tds-bookmark-manager-ui run test
    ```
    For UI test coverage:
    ```bash
    pnpm --filter=tds-bookmark-manager-ui run test:cov
    ```
   

-   **Run Backend Tests (Unit & Integration):**
    ```bash
    pnpm --filter=tds-bookmark-manager-api run test
    ```
    For backend test coverage:
    ```bash
    pnpm --filter=tds-bookmark-manager-api run test:cov
    ```
   

-   **Run Backend E2E Tests:**
    ```bash
    pnpm --filter=tds-bookmark-manager-api run test:e2e
    ```
   

## 💅 Linting and Formatting

-   **Format all code in the monorepo:**
    ```bash
    pnpm run format
    ```
   

-   **Lint UI code:**
    ```bash
    pnpm --filter=tds-bookmark-manager-ui run lint
    ```
   

-   **Lint Backend code:**
    ```bash
    pnpm --filter=tds-bookmark-manager-api run lint
    ```
   

## 📦 Building for Production

-   **Build both frontend and backend applications:**
    ```bash
    pnpm run build
    ```
   
    This will create production-ready builds in the respective `dist` folders of each application.

## 🐳 Docker

This project includes Docker support for easier deployment and development consistency.

-   **Development (UI only example):**
    The UI (`apps/ui/tds-bookmark-manager-ui`) has a `docker-compose.develop.yml` for building its Docker image and running it locally, typically exposing port 8080.
    ```bash
    cd apps/ui/tds-bookmark-manager-ui
    docker-compose -f docker-compose.develop.yml up --build
    ```

-   **Production (UI only example with Traefik):**
    The UI also has a `docker-compose.yml` configured for use with Traefik, pointing to a pre-built image from `registry.thedavestack.com`. You would adapt this for your deployment environment.

*(Note: For a full platform deployment with Docker, you would typically create a root `docker-compose.yml` orchestrating both the backend and frontend services.)*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please make sure to update tests as appropriate.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) file for details (assuming MIT from UI sub-project).

## 🙏 Acknowledgements

-   Icons by [Lucide React](https://lucide.dev/)
-   Inspiration from various modern web application patterns.