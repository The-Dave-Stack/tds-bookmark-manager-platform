/**
 * authStore.test.ts
 *
 * Purpose:
 * - Unit tests for the Zustand authentication store (`useAuthStore`).
 * - Verifies the correct behavior of login, logout, and authentication check functionalities.
 *
 * Logic Overview:
 * 1. Mocks the `api` service to control its responses during tests.
 * 2. Defines a mock user object for consistent test data.
 * 3. Uses `beforeEach` to reset the store and clear mock calls before each test.
 * 4. Tests the `login` function:
 *    - Asserts that `api.login` is called with correct credentials.
 *    - Verifies that `user` and `isAuthenticated` states are updated correctly on success.
 * 5. Tests the `logout` function:
 *    - Asserts that `api.logout` is called.
 *    - Verifies that `user` is cleared and `isAuthenticated` is set to `false`.
 * 6. Tests the `checkAuth` function:
 *    - Verifies state updates when `api.getProfile` returns a user.
 *    - Verifies state updates when `api.getProfile` throws an error (e.g., unauthorized).
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { LoginUserDto, Role } from '@tds/tds-bm-common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '../api';
import { UserType } from '../api/types';
import { useAuthStore } from '../stores/authStore';

// Mock the API
vi.mock('../api');

describe('Auth Store', () => {
  const mockUser: UserType = {
    username: 'test-user',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: [Role.USER],
    apiToken: 'test-token',
    webhookUrl: 'https://example.com/webhook'
  };

  beforeEach(() => {
    // Clear store between tests
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
    
    // Clear mock calls
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should set the user and isAuthenticated to true on successful login', async () => {
      (api.login as jest.Mock).mockResolvedValue(mockUser);

      const loginUser: LoginUserDto = { email: 'test@example.com', password: 'password123' };
      const store = useAuthStore.getState();
      await store.login(loginUser);

      expect(api.login).toHaveBeenCalledWith(loginUser);
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear the user and set isAuthenticated to false', async () => {
      // Arrange: set an initial user
      useAuthStore.setState({ user: mockUser, isAuthenticated: true });
      (api.logout as jest.Mock).mockResolvedValue(undefined);

      // Act
      const store = useAuthStore.getState();
      await store.logout();

      // Assert
      expect(api.logout).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('checkAuth', () => {
    it('should set user and isAuthenticated to true if API returns a user', async () => {
      (api.getProfile as jest.Mock).mockResolvedValue(mockUser);

      const store = useAuthStore.getState();
      await store.checkAuth();

      expect(api.getProfile).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should set user to null and isAuthenticated to false if API throws an error', async () => {
      (api.getProfile as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      const store = useAuthStore.getState();
      await store.checkAuth();

      expect(api.getProfile).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
