/**
 * AdminRoute.tsx
 *
 * Purpose:
 * - Protects routes that should only be accessible by authenticated users with the 'ADMIN' role.
 * - Redirects unauthorized users to the login page or the dashboard.
 *
 * Logic Overview:
 * 1. Uses `useAuthStore` to get the current user's authentication status and roles.
 * 2. If the user is not authenticated, it redirects them to the `/login` page.
 * 3. If the user is authenticated but does not have the `Role.ADMIN`, it redirects them to the root (`/`) dashboard.
 * 4. If the user is authenticated and has the `Role.ADMIN`, it renders the `children` components.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { Navigate } from 'react-router-dom';
import { Role } from '@tds/tds-bm-common';
import { useAuthStore } from '../../stores/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.roles.includes(Role.ADMIN)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
