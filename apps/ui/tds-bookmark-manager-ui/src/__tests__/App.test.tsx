import { render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';


import App from '../App';
import { useAuthStore } from '../stores/authStore';

// No mock for react-router-dom, use actual implementations with MemoryRouter

// Mock useAuthStore
vi.mock('../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: (key: string) => key, // Simple passthrough for translation keys
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('App', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      user: null, // Default to no user logged in
      clearUser: vi.fn(),
    });
  });

  it('renders LandingPage for unauthenticated users on /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('landing.hero.title')).toBeInTheDocument();
  });

  it('renders Dashboard for authenticated users on /', () => {
    (useAuthStore as any).mockReturnValue({
      user: { email: 'test@example.com', role: 'user' },
      clearUser: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('My Bookmarks')).toBeInTheDocument();
  });

  it('renders Login page on /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders Register page on /register', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Create Your Account' })).toBeInTheDocument();
  });

  it('renders ProfileSettings page on /profile for authenticated users', () => {
    (useAuthStore as any).mockReturnValue({
      user: { email: 'test@example.com', role: 'user' },
      clearUser: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Profile Settings', level: 1 })).toBeInTheDocument();
  });

  it('redirects from /profile to /login if not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Login', level: 3 })).toBeInTheDocument(); // Should redirect to login
  });

  it('redirects from /admin to /login if not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Login', level: 3 })).toBeInTheDocument(); // Should redirect to login
  });

  it('redirects from /admin to / if authenticated but not admin', () => {
    (useAuthStore as any).mockReturnValue({
      user: { email: 'user@example.com', role: 'user' },
      clearUser: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'My Bookmarks', level: 1 })).toBeInTheDocument(); // Should redirect to dashboard
  });

});
