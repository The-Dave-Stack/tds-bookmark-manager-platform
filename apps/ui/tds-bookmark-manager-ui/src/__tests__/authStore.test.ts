import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '../api';
import { useAuthStore } from '../stores/authStore';

// Mock the API
vi.mock('../api', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
    updateProfile: vi.fn()
  }
}));

describe('Auth Store', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'user' as const,
    apiToken: 'test-token',
    webhookUrl: 'https://example.com/webhook'
  };

  beforeEach(() => {
    // Clear store between tests
    useAuthStore.setState({
      user: null,
    });
    
    // Clear mock calls
    vi.clearAllMocks();
  });

  it('should login user', async () => {
    (api.login as any).mockResolvedValue(mockUser);

    const store = useAuthStore.getState();
    await store.login('test@example.com', 'password123');

    expect(api.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('should register user', async () => {
    (api.register as any).mockResolvedValue(mockUser);

    const store = useAuthStore.getState();
    await store.register('test@example.com', 'password123', 'Test', 'User');

    expect(api.register).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'Test',
      'User',
      false
    );
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('should update user profile', async () => {
    const updatedUser = {
      ...mockUser,
      firstName: 'Updated',
      lastName: 'Name'
    };
    (api.updateProfile as any).mockResolvedValue(updatedUser);

    const store = useAuthStore.getState();
    store.setUser(mockUser);

    await store.updateProfile({
      firstName: 'Updated',
      lastName: 'Name'
    });

    expect(api.updateProfile).toHaveBeenCalled();
    expect(useAuthStore.getState().user?.firstName).toBe('Updated');
    expect(useAuthStore.getState().user?.lastName).toBe('Name');
  });

  it('should update user role', () => {
    const store = useAuthStore.getState();
    store.setUser(mockUser);
    store.updateUserRole('admin');

    expect(useAuthStore.getState().user?.role).toBe('admin');
  });

  it('should clear user', () => {
    const store = useAuthStore.getState();
    store.setUser(mockUser);
    store.clearUser();

    expect(useAuthStore.getState().user).toBeNull();
  });

  it('should throw error when updating profile without user', async () => {
    const store = useAuthStore.getState();
    
    await expect(store.updateProfile({
      firstName: 'Updated'
    })).rejects.toThrow('No user logged in');
  });
});