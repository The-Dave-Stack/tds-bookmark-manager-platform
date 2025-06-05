import { Navigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

/// <reference types="vitest/globals" />
import { render, screen } from '@testing-library/react';

import AdminRoute from '../../../components/auth/AdminRoute';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuthStore } from '../../../stores/authStore';

// Mock react-router-dom's Navigate component
vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(() => null), // Simplified mock
}));

// Mock zustand's useAuthStore
vi.mock('../../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Auth Routes', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    (Navigate as Mock).mockImplementation(() => null); // Ensure Navigate is reset
  });

  describe('ProtectedRoute', () => {
    it('should render children when authenticated', () => {
      (useAuthStore as unknown as Mock).mockReturnValue({ isAuthenticated: true });

      render(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(Navigate).not.toHaveBeenCalled();
    });

    it('should redirect to /login when not authenticated', () => {
      (useAuthStore as unknown as Mock).mockReturnValue({ isAuthenticated: false });

      render(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);
      expect(Navigate).toHaveBeenCalledWith({ to: '/login', replace: true }, {});
      expect(screen.queryByText('Protected Content')).toBeInTheDocument(); // Keep this to ensure it's still rendered by the mock Navigate
    });
  });

  describe('AdminRoute', () => {
    it('should redirect to /login when not authenticated', () => {
      (useAuthStore as unknown as Mock).mockReturnValue({ isAuthenticated: false });

      render(<AdminRoute><div>Admin Content</div></AdminRoute>);
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
      expect(Navigate).toHaveBeenCalledWith({ to: '/login', replace: true }, {});
    });

    it('should redirect to / when authenticated but not admin', () => {
      (useAuthStore as unknown as Mock).mockReturnValue({ isAuthenticated: true, user: { role: 'user' } });

      render(<AdminRoute><div>Admin Content</div></AdminRoute>);
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
      expect(Navigate).toHaveBeenCalledWith({ to: '/', replace: true }, {});
    });

    it('should render children when authenticated as admin', () => {
      (useAuthStore as unknown as Mock).mockReturnValue({ isAuthenticated: true, user: { role: 'admin' } });

      render(<AdminRoute><div>Admin Content</div></AdminRoute>);
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
      expect(Navigate).not.toHaveBeenCalled();
    });
  });
});
