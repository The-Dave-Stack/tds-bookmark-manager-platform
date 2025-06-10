import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import AdminRoute from '../../../components/auth/AdminRoute';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuthStore } from '../../../stores/authStore';

// Create a spy for the Navigate component's calls
const mockNavigate = vi.fn();

// Mock react-router-dom to control Navigate's behavior and capture its props
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as any; // Cast to any to allow spreading
  return {
    ...actual, // Keep other exports from react-router-dom
    Navigate: (props: any) => {
      mockNavigate(props); // Capture only the props passed to Navigate
      return null; // Navigate component doesn't render anything visible
    },
  };
});

// Mock zustand's useAuthStore
vi.mock('../../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Auth Routes', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockNavigate.mockClear(); // Clear calls on our custom spy
  });

  describe('ProtectedRoute', () => {
    it('should render children when authenticated', () => {
      (useAuthStore as unknown as Mock).mockReturnValue({ isAuthenticated: true });

      render(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should redirect to /login when not authenticated', () => {
      (useAuthStore as unknown as Mock).mockReturnValue({ isAuthenticated: false });

      render(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login', replace: true });
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument(); // Should not be in the document if redirected
    });
  });

  describe('AdminRoute', () => {
    it('should redirect to /login when not authenticated', () => {
      (useAuthStore as unknown as Mock).mockReturnValue({ isAuthenticated: false });

      render(<AdminRoute><div>Admin Content</div></AdminRoute>);
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login', replace: true });
    });

    it('should redirect to / when authenticated but not admin', () => {
      (useAuthStore as unknown as Mock).mockReturnValue({ isAuthenticated: true, user: { role: 'user' } });

      render(<AdminRoute><div>Admin Content</div></AdminRoute>);
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/', replace: true });
    });

    it('should render children when authenticated as admin', () => {
      (useAuthStore as unknown as Mock).mockReturnValue({ isAuthenticated: true, user: { role: 'admin' } });

      render(<AdminRoute><div>Admin Content</div></AdminRoute>);
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
