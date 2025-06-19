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