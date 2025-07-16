/**
 * Header.test.tsx
 *
 * Purpose:
 * - Unit tests for the `Header` component.
 * - Verifies correct rendering based on user authentication and role, and handles user interactions like menu toggling and navigation.
 *
 * Logic Overview:
 * 1. Mocks `react-i18next`, `react-router-dom` (specifically `useNavigate` and `Link`), `useAuthStore`, and `react-hot-toast` to isolate the component.
 * 2. Uses `mockNavigate` to spy on navigation calls.
 * 3. Uses `mockLogout` to spy on logout calls from `useAuthStore`.
 * 4. Uses `beforeEach` to reset mocks and `afterEach` to clean up rendered components.
 * 5. Tests:
 *    - Renders correctly for logged-in non-admin users, showing email and no admin link.
 *    - Renders admin link when the user is an admin.
 *    - Calls `toggleSidebar` when the menu button is clicked.
 *    - Opens and closes the user menu on click.
 *    - Navigates to profile settings when the profile link is clicked.
 *    - Navigates to admin panel when the admin link is clicked (as admin).
 *    - Handles successful logout, calling `mockLogout`, showing success toast, and navigating to `/login`.
 *    - Handles logout errors, calling `mockLogout`, showing error toast, and not navigating.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { Role } from '@tds/tds-bm-common';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach, afterEach, type Mock } from 'vitest';

import Header from '../../../components/layout/Header';
import { useAuthStore } from '../../../stores/authStore';


const mockNavigate = vi.fn();

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => {
  return {
    useNavigate: () => mockNavigate,
    Link: vi.fn(({ to, children, onClick }) => (
      <div
        onClick={(e) => {
          onClick?.(e);
          mockNavigate(to);
        }}
        data-testid={`link-${to.replace(/\//g, '').replace(/-/g, '')}`}
      >
        {children}
      </div>
    )),
  };
});

// Mock zustand's useAuthStore
vi.mock('../../../stores/authStore');

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Header', () => {
  const mockToggleSidebar = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as unknown as Mock).mockReturnValue({
      i18n: {
        language: 'en',
        changeLanguage: vi.fn(),
      },
      t: (key: string) => key,
    });
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { email: 'test@example.com', roles: [Role.USER] },
      logout: mockLogout,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly when user is logged in (non-admin)', () => {
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    expect(screen.getByText('app.title.desktop')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.queryByTestId('link-admin')).not.toBeInTheDocument();
  });

  it('renders admin link when user is admin', () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { email: 'admin@example.com', roles: [Role.ADMIN] },
      logout: mockLogout,
    });
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const userMenuButton = screen.getByRole('button', { name: /admin@example.com/i });
    fireEvent.click(userMenuButton);
    
    expect(screen.getByTestId('link-admin')).toBeInTheDocument();
  });

  it('calls toggleSidebar when menu button is clicked', () => {
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const menuButton = screen.getByRole('button', { name: 'Toggle sidebar' });
    fireEvent.click(menuButton);
    
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('opens and closes the user menu on click', () => {
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const userMenuButton = screen.getByRole('button', { name: /test@example.com/i });
    
    // Open menu
    fireEvent.click(userMenuButton);
    expect(screen.getByText('navigation.profile')).toBeInTheDocument();
    
    // Close menu
    fireEvent.click(userMenuButton);
    expect(screen.queryByText('navigation.profile')).not.toBeInTheDocument();
  });

  it('navigates to profile settings when profile link is clicked', () => {
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const userMenuButton = screen.getByRole('button', { name: /test@example.com/i });
    fireEvent.click(userMenuButton);
    
    fireEvent.click(screen.getByTestId('link-profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('navigates to admin panel when admin link is clicked (as admin)', () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { email: 'admin@example.com', roles: [Role.ADMIN] },
      logout: mockLogout,
    });
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const userMenuButton = screen.getByRole('button', { name: /admin@example.com/i });
    fireEvent.click(userMenuButton);
    
    fireEvent.click(screen.getByTestId('link-admin'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('handles logout successfully', async () => {
    mockLogout.mockResolvedValue(undefined);
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const userMenuButton = screen.getByRole('button', { name: /test@example.com/i });
    fireEvent.click(userMenuButton);
    
    const logoutButton = screen.getByText('auth.logout.button');
    await fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('auth.logout.success');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('handles logout error', async () => {
    const mockEmptyFn = vi.fn();
    const error = new Error('Logout failed');
    mockLogout.mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(mockEmptyFn);
    render(<Header toggleSidebar={mockToggleSidebar} />);

    fireEvent.click(screen.getByRole('button', { name: /test@example.com/i }));
    await fireEvent.click(screen.getByText('auth.logout.button'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('common.error');
    expect(mockNavigate).not.toHaveBeenCalledWith('/login');
    consoleErrorSpy.mockRestore();
  });
});
