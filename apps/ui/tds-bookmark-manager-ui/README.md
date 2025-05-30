# The Dave Stack Bookmark Manager

A modern, feature-rich bookmark management application built with React, TypeScript, and Tailwind CSS. This application allows users to efficiently organize, manage, and track their bookmarks with advanced features like folder organization, statistics tracking, and multilingual support.

![Bookmark Manager Screenshot](https://images.pexels.com/photos/3888151/pexels-photo-3888151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

### 🔐 Authentication & Authorization
- Secure user registration with password strength validation
- Role-based access control (User/Admin)
- JWT-based authentication
- Protected routes and API endpoints
- Password requirements enforcement
  - Minimum 8 characters
  - Uppercase and lowercase letters
  - Numbers and special characters

### 📚 Bookmark Management
- Create, edit, and delete bookmarks
- Organize bookmarks in hierarchical folders
- Archive/unarchive bookmarks
- Track click counts for each bookmark
- Quick search and filtering options
- Sort bookmarks by date, title, or click count

### 📁 Folder Organization
- Create nested folder structures
- Drag-and-drop organization (coming soon)
- Rename and delete folders
- Move bookmarks between folders
- Collapsible folder tree view
- Subfolder support with unlimited nesting

### 📊 Statistics & Analytics
- User-specific bookmark statistics
- Click tracking and analytics
- Most clicked bookmarks overview
- Date range filtering for statistics
  - Customizable date ranges
  - Preset periods (hour, day, week, month)
  - Custom date selection
- Admin dashboard with global statistics

### 🌐 Multilingual Support
- English and Spanish languages
- Easy language switching
- Extensible translation system
- Full RTL support (coming soon)
- Context-aware translations

### 🔧 Integration Features
- Webhook URL for external integrations
- API token for authenticated access
- Bookmarklet for quick bookmark adding
- Browser extension support (coming soon)
- Secure API endpoints

### 👤 User Profile
- Personal information management
- Password update with strength validation
- Webhook URL configuration
- API token management
- Profile settings customization
- Statistics overview

### 👑 Admin Features
- User management
- Role assignment
- Global statistics dashboard
- System monitoring
- User activity tracking

### 🐳 Docker Support
- Multi-stage build optimization
- Production-ready Nginx configuration
- Docker Compose for development and production
- Environment variable management
- Optimized caching and performance

## Technology Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Zustand (State Management)
  - i18next (Internationalization)
  - Lucide React (Icons)
  - React Router
  - React Hot Toast

- **Backend:**
  - Node.js
  - Express
  - JWT Authentication
  - RESTful API
  - Supabase (Database)

- **DevOps:**
  - Docker
  - Nginx
  - Docker Compose
  - Multi-stage builds
  - Production optimization

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dave-stack-bookmark-manager.git
cd dave-stack-bookmark-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t bookmark-manager .
```

2. Run with Docker Compose:

Development:
```bash
docker-compose -f docker-compose.develop.yml up -d
```

Production:
```bash
docker-compose up -d
```

The application will be available at http://localhost:8080.

## Database Schema

The application uses the following main tables:

- `users`: User accounts and authentication
- `bookmarks`: Bookmark entries and metadata
- `folders`: Folder organization structure
- `user_statistics`: Per-user analytics
- `global_statistics`: System-wide statistics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI components inspired by [Tailwind UI](https://tailwindui.com/)
- Database hosting by [Supabase](https://supabase.com/)