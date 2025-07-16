# Project Brief: The Dave Stack Bookmark Manager Platform

## 1. Project Name
The Dave Stack Bookmark Manager Platform

## 2. Purpose
To create a functional, well-designed, and modern web application for personal bookmark management, serving as a portfolio piece for "The Dave Stack" and potentially a free tool for the community.

## 3. Core Objectives (MVP V1.0)
- **Portfolio Showcase**: Demonstrate full-stack development skills with modern technologies (React, NestJS, PostgreSQL, Docker).
- **Personal Utility**: Develop a useful tool for the author's personal bookmark management.
- **Community Engagement**: Potentially offer as a free tool to attract users to "The Dave Stack" brand.

## 4. Design Philosophy
- **Simplicity**: Clean, intuitive UI with minimal configuration. Focus on efficient bookmark management.
- **Modernity**: Contemporary and attractive visual appearance.
- **Bookmark-Centric**: Prioritize viewing and accessing bookmarks.
- **Ease of Use**: Common operations should be quick and easy.
- **Quick Access**: Users should find and access bookmarks efficiently.

## 5. Key Technologies
- **Frontend**: React (with TypeScript), Vite, Zustand, Tailwind CSS, i18next.
- **Backend**: NestJS (with TypeScript), TypeORM, Passport.js, bcrypt, nestjs-pino, helmet, ThrottlerModule.
- **Database**: PostgreSQL
- **Monorepo Tool**: Nx
- **Package Manager**: pnpm
- **Deployment**: Docker (consideration for deployment)

## 6. MVP Scope - Included Functionalities
- Public landing page.
- User account management (registration with advanced password validation, login, logout).
- Basic CRUD for bookmarks (Create, Read, Update, Delete).
- Automatic retrieval of title and favicon from URL when adding a bookmark.
- Organization of bookmarks into single-level folders (basic CRUD).
- Bookmark search.
- Tracking of clicks on bookmarks for usage statistics.
- Display of basic usage statistics (e.g., most used bookmarks).
- Option to hide/archive rarely used bookmarks.
- Webhook for adding bookmarks from outside the application.
- Basic administration panel (user and role management).

## 7. MVP Scope - Explicitly Excluded Functionalities
- Advanced AI functionalities (auto-categorization, suggestions).
- Native browser extensions or mobile applications.
- Bulk import/export of bookmarks.
- Sharing bookmarks/folders.
- Advanced tagging.
- Real-time notifications (WebSockets).
- Advanced multi-language support (MVP in primary language).
- Advanced folder nesting (single-level only for MVP).

## 8. User Roles
- **Registered User**: Standard user; manages personal bookmarks and folders, views statistics, uses webhook.
- **Administrator**: Elevated privileges; all user permissions + access to admin panel, view/manage users, assign/revoke admin roles.

## 9. Non-Functional Requirements
- **Usability**: Intuitive, clear, consistent, responsive design.
- **Performance**: Fast load times, quick responses for data operations.
- **Security**: Secure password storage, protection against vulnerabilities, HTTPS, robust auth/auth, input validation.
- **Scalability**: Efficient database design, stateless backend, pagination.
- **Maintainability**: Modular, well-structured code, TypeScript, comments, coding standards, tests.
- **Compatibility**: Latest versions of Chrome, Firefox, Edge, Safari.

## 10. Data Design (Preliminary)
- **Users Table**: `id`, `first_name`, `last_name`, `email`, `password_hash`, `role`, `api_token`, `created_at`, `updated_at`.
- **Folders Table**: `id`, `user_id` (FK), `name`, `created_at`, `updated_at`.
- **Bookmarks Table**: `id`, `user_id` (FK), `folder_id` (FK), `url`, `title`, `favicon_url`, `click_count`, `last_clicked_at`, `is_hidden`, `created_at`, `updated_at`.
