# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TDS Bookmark Manager is a full-stack bookmark management platform built as an Nx monorepo with npm workspaces. The platform consists of a NestJS API backend, React frontend, and shared common library for DTOs and interfaces.

## Common Development Commands

### Build Commands
```bash
# Build all projects (common lib, API, UI)
npm run build:all

# Build individual components
npm run build:lib:common
npm run build:api
npm run build:ui
```

### Development Servers
```bash
# Start both API and UI in development mode
npm run start:all:dev

# Start individual services
npm run start:api:dev      # NestJS API at localhost:3000
npm run start:ui:dev       # React UI at localhost:4200
npm run start:ui:dev:mock  # React UI with mock API
```

### Testing
```bash
# Run all tests
npm run test:all
npm run test:all:cov       # With coverage

# Individual test suites
npm run test:api           # NestJS Jest tests
npm run test:api:watch     # Watch mode
npm run test:ui            # React Vitest tests
npm run test:ui:web        # Vitest UI mode

# E2E tests
npx nx e2e @tds/tds-bookmark-manager-ui-e2e    # Playwright E2E
```

### Linting
```bash
# Lint individual projects
npm run lint:api
npm run lint:ui
npm run lint:lib:common

# Auto-fix linting issues
npm run lint:api:fix
npm run lint:ui:fix
npm run lint:lib:common:fix
```

### Database Operations
```bash
# Run database migrations
npm run migration:run

# Generate new migration from entity changes
npm run migration:generate -- -n MigrationName

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Docker Commands
```bash
# Development environment
npm run docker:dev:up        # Start PostgreSQL container
npm run docker:dev:down      # Stop containers
npm run docker:dev:up:build  # Build and start

# Build versioned images
npm run docker:build:versioned
```

### Nx Commands
```bash
# View project dependency graph
npm run nx:graph

# Show specific project details
npm run nx:show:api
npm run nx:show:ui
```

## Architecture Overview

### Monorepo Structure
- **apps/backend/tds-bookmark-manager-api/**: NestJS API with TypeORM and PostgreSQL
- **apps/ui/tds-bookmark-manager-ui/**: React frontend with Vite, TypeScript, and Tailwind CSS
- **libs/tds-bm-common/**: Shared DTOs, interfaces, and utilities
- **apps/backend/tds-bookmark-manager-api-e2e/**: API E2E tests
- **apps/ui/tds-bookmark-manager-ui-e2e/**: UI E2E tests with Playwright

### Backend (NestJS API)
- **Modules**: Auth, Users, Bookmarks, Folders, Statistics, Admin, Webhook, Email
- **Authentication**: JWT-based with Passport.js strategies (local, JWT, API key)
- **Authorization**: Role-based access control (User/Admin roles)
- **Database**: PostgreSQL with TypeORM migrations
- **Security**: CSRF protection, rate limiting, password hashing with bcrypt
- **Logging**: Pino logger with request ID tracking and sensitive data redaction
- **Email**: Nodemailer integration for password reset functionality

### Frontend (React)
- **State Management**: Zustand stores for auth, bookmarks, and folders
- **Routing**: React Router with protected routes and admin-only routes
- **Styling**: Tailwind CSS with responsive design
- **Internationalization**: i18next with English and Spanish support
- **API Integration**: Axios-based service layer with mock API support
- **Components**: Organized by feature (auth, bookmarks, folders, layout, common)

### Shared Library
- **DTOs**: Data transfer objects for API communication
- **Interfaces**: TypeScript interfaces for type safety
- **Utils**: Shared utility functions and mappers

## Key Features

### Authentication & Authorization
- JWT session-based authentication with secure HTTP-only cookies
- Role-based access control with User and Admin roles
- API key authentication for webhook endpoints
- Password reset functionality with email integration

### Bookmark Management
- Full CRUD operations for bookmarks with folder organization
- Hierarchical folder structure with nested folders
- Bookmark archiving and usage statistics tracking
- Quick-add via webhook endpoints and bookmarklet
- URL metadata extraction and validation

### Admin Features
- User management and role assignment
- Global statistics and usage analytics
- System administration panel

## Environment Configuration

### API Environment (.env.development)
Required environment variables for the API:
- `NODE_ENV`: Environment (development/production/docker)
- `APP_HOST`, `APP_PORT`, `APP_PROTOCOL`: Application server config
- `JWT_SECRET`, `JWT_EXPIRES_IN`: JWT configuration
- `POSTGRES_*`: Database connection parameters
- `GLOBAL_RATE_LIMIT_*`: Rate limiting configuration
- `EMAIL_*`: Email service configuration (optional for development)

### Database Setup
1. Start PostgreSQL: `npm run docker:dev:up`
2. Run migrations: `npm run migration:run`
3. Database supports both PostgreSQL (production) and SQLite (development)

## Development Workflow

### Adding New Features
1. Create shared DTOs/interfaces in `libs/tds-bm-common` if needed
2. Implement backend endpoints in appropriate NestJS module
3. Add database entities and migrations if required
4. Create frontend components and integrate with API
5. Add tests for both backend and frontend
6. Run linting: `npm run lint:api:fix && npm run lint:ui:fix`

### Database Changes
1. Modify TypeORM entities in the API
2. Generate migration: `npm run migration:generate -- -n DescriptiveName`
3. Review generated migration file
4. Test migration: `npm run migration:run`

### Testing Strategy
- Backend: Jest unit tests with supertest for integration testing
- Frontend: Vitest for unit/component tests with React Testing Library
- E2E: Playwright for user journey testing
- API testing supports both real database and in-memory testing modes

## TypeScript Configuration
- Strict TypeScript configuration with path mapping
- Shared base configuration in `tsconfig.base.json`
- Project-specific configurations extend the base config
- Import path aliases configured for clean imports

## Build and Deployment
- Dockerized production builds with multi-stage Dockerfiles
- Separate migration container for database schema management
- CI/CD with GitHub Actions for automated builds
- Versioned releases with semantic versioning support