# TDS Bookmark Manager

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="apps/ui/tds-bookmark-manager-ui/public/favicon.svg" width="45"></a>

**TDS Bookmark Manager** is a modern, full-stack application designed to help you organize, find, and use your web links like never before. It features a clean, intuitive interface and a powerful backend, all built within a professional monorepo structure.

---

## Core Features

-   **Secure Authentication**: JWT-based authentication with password hashing using `bcrypt`.
-   **Role-Based Access Control (RBAC)**: Differentiated roles for `User` and `Admin` with protected routes and functionalities.
-   **Full Bookmark Management**: Complete CRUD (Create, Read, Update, Delete) operations for bookmarks.
-   **Hierarchical Folder Organization**: Organize bookmarks into nested folders for better categorization.
-   **Usage Statistics**: View analytics on your bookmark usage, including click counts and most-used links.
-   **Quick-Add via Webhook & Bookmarklet**: Easily add bookmarks from anywhere using a unique webhook URL or a browser bookmarklet.
-   **Multilingual Support**: Fully internationalized interface supporting English and Spanish.
-   **Admin Panel**: A dedicated section for administrators to manage users and view global statistics.
-   **Dockerized Environment**: The required database (PostgreSQL) is managed via Docker for consistent development and deployment setups.

## Technology Stack

This project is a monorepo managed with **Nx** and **npm workspaces**.

#### **Backend (`tds-bookmark-manager-api`)**

-   **Framework**: [NestJS](https://nestjs.com/)
-   **Database ORM**: [TypeORM](https://typeorm.io/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (development via Docker)
-   **Authentication**: [Passport.js](https://www.passportjs.org/) (JWT and Local strategies)
-   **Validation**: [class-validator](https://github.com/typestack/class-validator), [class-transformer](https://github.com/typestack/class-transformer)
-   **Logging**: `nestjs-pino`
-   **Testing**: Jest

#### **Frontend (`tds-bookmark-manager-ui`)**

-   **Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Internationalization**: [i18next](https://www.i18next.com/)
-   **UI Components**: Headless UI
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Unit & Component Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
-   **E2E Testing**: [Playwright](https://playwright.dev/)

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v22 or higher is recommended)
-   [npm](https://www.npmjs.com/) (v7 or higher, included with Node.js)
-   [Docker](https://www.docker.com/get-started) and Docker Compose

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/tds-bookmark-manager-platform.git](https://github.com/your-username/tds-bookmark-manager-platform.git)
    cd tds-bookmark-manager-platform
    ```

2.  **Install dependencies:**
    This project uses `npm` workspaces. Install all dependencies from the root directory.
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    The backend requires environment variables for the database connection, JWT secrets, and the initial admin user.
    Create a new file `apps/backend/tds-bookmark-manager-api/.env.development` by copying the example below:

    ```env
    # .env.development

    # -- Database Configuration --
    POSTGRES_USER=your_db_user
    POSTGRES_PASSWORD=your_db_password
    POSTGRES_DB=tds_bookmarks_db

    # -- JWT Configuration --
    JWT_SECRET=your-super-secret-jwt-key-that-is-long
    JWT_EXPIRES_IN=1d
    ```

4.  **Start the Database:**
    Use Docker Compose to start the PostgreSQL database service.
    ```bash
    docker-compose up -d
    ```

5.  **Run Database Migrations:**
    Apply the initial database schema and seed the admin user.
    ```bash
    npm run migration:run
    ```

6.  **Run the Development Servers:**
    You can run the backend and frontend servers in separate terminals for the best development experience.

    -   **Terminal 1: Start the Backend API**
        ```bash
        npm run start:api:dev
        ```
        The API will be available at `http://localhost:3000`.

    -   **Terminal 2: Start the Frontend UI**
        ```bash
        npm run start:ui:dev
        ```
        The UI will be available at `http://localhost:4200`.

## Testing

This project is configured with unit, integration, and E2E tests.

-   **Run Frontend Unit/Component Tests:**
    ```bash
    npm run test:ui
    ```

-   **Run Frontend Tests with Coverage:**
    ```bash
    npm run test:ui:cov
    ```

-   **Run Backend Unit/Integration Tests:**
    ```bash
    npm run test:api
    ```

## Database Migrations

Database schema changes are handled by TypeORM migrations.

-   **Generate a new migration:**
    (After making changes to your TypeORM entities)
    ```bash
    npm run migration:generate -- src/db/migrations/YourMigrationName
    ```

-   **Revert the last migration:**
    ```bash
    npm run migration:revert
    ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is distributed under the MIT License. See `LICENSE` file for more information.