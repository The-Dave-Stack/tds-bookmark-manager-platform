/**
 * ProtectedRoute.tsx
 *
 * Purpose:
 * - Protects routes that should only be accessible by authenticated users.
 * - Redirects unauthenticated users to the login page.
 *
 * Logic Overview:
 * 1. Uses `useAuthStore` to check if the user is authenticated.
 * 2. If the user is not authenticated, it redirects them to the `/login` page using `Navigate`.
 * 3. If the user is authenticated, it renders the `children` components.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => !!state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
