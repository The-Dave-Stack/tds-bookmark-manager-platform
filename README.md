# TDS Bookmark Manager

<div align="center">
  <img src="apps/ui/tds-bookmark-manager-ui/public/favicon.svg" width="100" alt="TDS Bookmark Manager Logo">
  <p>
    <strong>TDS Bookmark Manager is a modern, full-stack application designed to help you organize, find, and use your web links like never before.</strong>
  </p>
  <p>
    Built with a modern tech stack within a professional monorepo architecture powered by Nx.
  </p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  </div>

---

## 🚀 Overview

This project is more than just a bookmark manager. It is a complete platform that offers a clean and intuitive user interface, a powerful and secure backend, and advanced features such as quick-adding links via webhooks or a custom bookmarklet. The entire project is packaged in a Dockerized environment for consistent development and deployment.

### ✨ Key Features

* **Secure Authentication**: JWT-based system with password hashing using `bcrypt`.
* **Role-Based Access Control (RBAC)**: Differentiated roles for `User` and `Admin` with protected routes and functionalities.
* **Full Bookmark Management**: Complete CRUD (Create, Read, Update, Delete) operations for bookmarks.
* **Hierarchical Organization**: Organize your bookmarks into nested folders and subfolders.
* **Usage Statistics**: View analytics on your bookmark usage, including click counts and most-used links.
* **Quick Add (Webhook & Bookmarklet)**: Easily add bookmarks from any browser using a unique webhook URL or a bookmarklet.
* **Multi-language Support**: Fully internationalized interface supporting English and Spanish.
* **Admin Panel**: A dedicated section for administrators to manage users and view global statistics.
* **Dockerized Environment**: The entire stack, including the PostgreSQL database, is managed via Docker for maximum consistency between environments.

---

## 🛠️ Technology Stack

The project is organized as a monorepo managed with **Nx** and **npm workspaces**.

| Area              | Technology                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Monorepo** | [**Nx**](https://nx.dev/), [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)                                           |
| **Backend** | [**NestJS**](https://nestjs.com/), [TypeORM](https://typeorm.io/), [PostgreSQL](https://www.postgresql.org/), [Passport.js](https://www.passportjs.org/), [Pino](https://getpino.io/) (for logging), [Jest](https://jestjs.io/) |
| **Frontend** | [**React**](https://react.dev/), [**Vite**](https://vitejs.dev/), [**TypeScript**](https://www.typescriptlang.org/), [**Tailwind CSS**](https://tailwindcss.com/), [**Zustand**](https://github.com/pmndrs/zustand) (state), [React Router](https://reactrouter.com/), [i18next](https://www.i18next.com/), [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/), [Playwright](https://playwright.dev/) (E2E) |
| **Database** | [**PostgreSQL**](https://www.postgresql.org/) (managed with Docker)                                                                    |
| **DevOps** | [**Docker** & **Docker Compose**](https://www.docker.com/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [GitHub Actions](https://github.com/features/actions) |

---

## 📂 Project Structure

The monorepo is organized as follows, promoting code reuse and separation of concerns:

```
tds-bookmark-manager-platform/
├── .github/workflows/
│   ├── docker-publish.yml             # CI workflow for the 'main' branch
│   └── release.yml                    # Release workflow for Git tags
├── apps/
│   ├── backend/
│   │   ├── tds-bookmark-manager-api/      # The NestJS API
│   │   └── tds-bookmark-manager-api-e2e/  # E2E tests for the API
│   └── ui/
│       ├── tds-bookmark-manager-ui/       # The React application
│       └── tds-bookmark-manager-ui-e2e/   # E2E tests for the UI with Playwright
├── libs/
│   └── tds-bm-common/                     # Shared library (DTOs, interfaces)
├── docker-compose.yml                     # Docker Compose file for production
├── docker-compose.develop.yml             # Docker Compose file for development
├── nx.json                                # Main Nx configuration
└── package.json                           # Workspace dependencies and scripts
```

---

## 🏁 Getting Started

Follow these steps to get the full development environment running on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (v22 or higher recommended)
* [npm](https://www.npmjs.com/) (v7 or higher, included with Node.js)
* [Docker](https://www.docker.com/get-started) and Docker Compose

### Installation Guide

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/d-lacreme/tds-bookmark-manager-platform.git](https://github.com/d-lacreme/tds-bookmark-manager-platform.git)
    cd tds-bookmark-manager-platform
    ```

2.  **Install dependencies:**
    From the project root, install all dependencies for all applications and libraries.
    ```bash
    npm install
    ```

3.  **Configure Environment Variables for the API:**
    The API requires an `.env` file to function. Create a file named `apps/backend/tds-bookmark-manager-api/.env.development` and paste the following content.

    ```env
    # apps/backend/tds-bookmark-manager-api/.env.development

    # Application Environment
    NODE_ENV=development
    APP_HOST=localhost
    APP_PORT=3000
    APP_PROTOCOL=http
    APP_NAME=TDS Bookmark Manager API

    # Rate Limiting Configuration
    GLOBAL_RATE_LIMIT_TTL=60000
    GLOBAL_RATE_LIMIT_LIMIT=100

    # JWT Configuration
    # IMPORTANT: Use a long and secure secret in a real environment.
    JWT_SECRET=this-is-a-very-long-and-secure-development-secret
    JWT_EXPIRES_IN=1d

    # PostgreSQL Database Variables
    # These match the ones in docker-compose.develop.yml
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=testuser
    POSTGRES_PASSWORD=testpassword
    POSTGRES_DB=tds_bookmarks_db
    ```

4.  **Start Docker services:**
    This command will spin up the PostgreSQL database container.
    ```bash
    npm run docker:dev:up
    ```

5.  **Run Database Migrations:**
    With the database running, apply the initial schema.
    ```bash
    npm run migration:run
    ```

6.  **Start the Development Servers:**
    You can start the API and UI simultaneously with a single command.
    ```bash
    npm run start:all:dev
    ```
    Alternatively, in separate terminals:
    * **Terminal 1 (API):** `npm run start:api:dev`
    * **Terminal 2 (UI):** `npm run start:ui:dev`

You're all set! The React application will be available at `http://localhost:4200` and the NestJS API at `http://localhost:3000`.

---

## 📜 Available Scripts

These are the most important scripts defined in the root `package.json`:

| Script                   | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| `start:all:dev`          | Starts the API and UI in development mode simultaneously.                     |
| `build:all`              | Builds the `common` library, the API, and the UI for production.              |
| `test:all`               | Runs all unit/component tests for the API and UI.                             |
| `docker:dev:up`          | Starts the Docker containers defined in `docker-compose.develop.yml`.         |
| `docker:build:versioned` | Builds versioned Docker images based on the `package.json` version.         |
| `release:tag`            | Creates a custom-formatted Git tag based on the `package.json` version.       |
| `migration:run`          | Runs pending migrations on the database.                                      |
| `migration:generate`     | Generates a new migration file from entity changes.                           |

---

## 🤖 Build and Release Workflow (CI/CD)

This project uses GitHub Actions to automate the build and release process. The workflow is split into two distinct parts to handle continuous integration and versioned releases separately.

### 1. Continuous Integration (on push to `main`)

This workflow is defined in `.github/workflows/docker-publish.yml`.

* **Trigger**: Automatically runs on every push to the `main` branch.
* **Purpose**: To build and publish "bleeding-edge" images of the services that were affected by the changes in the push.
* **Efficiency**: It uses `npx nx affected` to intelligently detect which projects (`api`, `ui`, `migrations`) have changed and only builds images for them. This saves significant time and resources.
* **Image Naming**: Publishes images to GitHub Container Registry (GHCR) with the specific names (`The-Dave-Stack/tds-bookmark-manager-api`, etc.).
* **Tagging Strategy**: Images are tagged with:
    * `latest`: Always points to the most recent commit on `main`.
    * `<sha>`: The short commit hash (e.g., `a1b2c3d`) for perfect traceability.

### 2. Versioned Releases (on Git tag)

This workflow is defined in `.github/workflows/release.yml`.

* **Trigger**: Runs only when a new Git tag matching the pattern `v*.*.*/*` (e.g., `v0.1.x/0.1.0`) is pushed to the repository.
* **Purpose**: To create and publish official, stable, and immutable releases of the entire application suite (UI, API, and Migrations).
* **How to Trigger a Release**: This is a manual process made easy with an npm script. **Do not use `npm version` for releases.**
    1.  **Update Version**: Manually edit the `version` field in the root `package.json` file.
    2.  **Commit Change**: Commit the updated `package.json`.
        ```bash
        git add package.json
        git commit -m "chore(release): bump version to 0.1.0"
        ```
    3.  **Create Custom Tag**: Run the helper script to create the correctly formatted Git tag.
        ```bash
        npm run release:tag
        ```
    4.  **Push to GitHub**: Push your commit and the new tag to trigger the workflow.
        ```bash
        git push && git push --tags
        ```
* **Tagging Strategy**: The workflow extracts the standard version from the custom Git tag. Docker images are then published with standard, useful semantic version tags:
    * `1.0.1` (full version)
    * `1.0` (minor version)
    * `1` (major version)
    * `latest`

---

## 🧪 Testing

The project is set up with unit, integration, and E2E tests.

* **Run UI Tests (Vitest):**
    ```bash
    npm run test:ui
    ```
* **Run API Tests (Jest):**
    ```bash
    npm run test:api
    ```
* **Run UI E2E Tests (Playwright):**
    Ensure the application is running (`npm run start:ui:dev`) and then execute:
    ```bash
    npx nx e2e @tds/tds-bookmark-manager-ui-e2e
    ```

---

## 🤝 Contributing

Contributions are welcome! If you want to improve the project, please feel free to submit a Pull Request.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more information.