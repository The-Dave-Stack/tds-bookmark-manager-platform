import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach, type Mock } from 'vitest';
import Header from '../../../components/layout/Header';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import toast from 'react-hot-toast';

const mockNavigate = vi.fn(); // Define mockNavigate here

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => {
  const actualUseNavigate = vi.fn();
  return {
    useNavigate: () => mockNavigate, // Directly return the mockNavigate
    Link: vi.fn(({ to, children, onClick }) => (
      <div
        onClick={(e) => {
          onClick?.(e);
          mockNavigate(to); // Use mockNavigate directly
        }}
        data-testid={`link-${to.replace(/\//g, '').replace(/-/g, '')}`} // Remove all slashes and hyphens for simpler test IDs
      >
        {children}
      </div>
    )),
  };
});

// Mock zustand's useAuthStore
vi.mock('../../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Header', () => {
  const mockToggleSidebar = vi.fn();
  // const mockNavigate = vi.fn(); // Moved outside vi.mock
  const mockClearUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as unknown as Mock).mockReturnValue({
      i18n: { // Added i18n mock
        language: 'en',
        changeLanguage: vi.fn(),
      },
      t: (key: string) => key, // Simple passthrough for translation keys
    });
    // Removed: (useNavigate as unknown as Mock).mockImplementation(() => mockNavigate);
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { email: 'test@example.com', role: 'user' },
      clearUser: mockClearUser,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly when user is logged in (non-admin)', () => {
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    expect(screen.getByText('app.title.desktop')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.queryByTestId('link-admin')).not.toBeInTheDocument(); // Admin link should not be visible
  });

  it('renders admin link when user is admin', () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { email: 'admin@example.com', role: 'admin' },
      clearUser: mockClearUser,
    });
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const userMenuButton = screen.getByRole('button', { name: /admin@example.com/i });
    fireEvent.click(userMenuButton); // Open menu
    
    expect(screen.getByTestId('link-admin')).toBeInTheDocument(); // Use data-testid for admin link
  });

  it('calls toggleSidebar when menu button is clicked', () => {
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const menuButton = screen.getByRole('button', { name: 'Toggle sidebar' }); // Use aria-label as name
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
    fireEvent.click(userMenuButton); // Open menu
    
    fireEvent.click(screen.getByTestId('link-profile')); // Use data-testid for profile link
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('navigates to admin panel when admin link is clicked (as admin)', () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { email: 'admin@example.com', role: 'admin' },
      clearUser: mockClearUser,
    });
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const userMenuButton = screen.getByRole('button', { name: /admin@example.com/i });
    fireEvent.click(userMenuButton); // Open menu
    
    fireEvent.click(screen.getByTestId('link-admin')); // Use data-testid for admin link
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('handles logout successfully', async () => {
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const userMenuButton = screen.getByRole('button', { name: /test@example.com/i });
    fireEvent.click(userMenuButton); // Open menu
    
    fireEvent.click(screen.getByText('auth.logout.button'));
    
    expect(mockClearUser).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('auth.logout.success');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('handles logout error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
    mockClearUser.mockImplementation(() => { throw new Error('Logout failed'); });
    
    render(<Header toggleSidebar={mockToggleSidebar} />);
    
    const userMenuButton = screen.getByRole('button', { name: /test@example.com/i });
    fireEvent.click(userMenuButton); // Open menu
    
    fireEvent.click(screen.getByText('auth.logout.button'));
    
    expect(mockClearUser).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('common.error');
    expect(mockNavigate).not.toHaveBeenCalledWith('/login'); // Should not navigate on error
    consoleErrorSpy.mockRestore(); // Restore console.error
  });
});
