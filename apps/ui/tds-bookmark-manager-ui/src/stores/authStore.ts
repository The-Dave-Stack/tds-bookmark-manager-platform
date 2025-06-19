import { CreateUserDto, LoginUserDto, Role } from '@tds/tds-bm-common';
import { create } from 'zustand';

import { api } from '../api';
import { UserType } from '../api/types';

interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  login: (loginUserDto: LoginUserDto) => Promise<void>;
  logout: () => Promise<void>;
  register: (createUserDto: CreateUserDto, isAdmin?: boolean) => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; password?: string }) => Promise<void>;
  setUser: (user: UserType | null) => void;
  updateUserRoles: (roles: Role[]) => void;
  updateUserProfile: (profile: Partial<UserType>) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  checkAuth: async () => {
    try {
      // We call the new profile endpoint to get user data if a session is active
      const user = await api.getProfile(); 
      set({ user, isAuthenticated: true });
    } catch (error) {
      // If it fails (e.g., 401), it means there is no session
      set({ user: null, isAuthenticated: false });
    }
  },

  login: async (loginUserDto: LoginUserDto) => {
    const user = await api.login(loginUserDto);
    set({ 
      user: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        apiToken: user.apiToken,
        webhookUrl: user.webhookUrl
      },
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await api.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  register: async (createUserDto: CreateUserDto, isAdmin = false) => {
    const user = await api.register(createUserDto);
    set({ 
      user: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        apiToken: user.apiToken,
        webhookUrl: user.webhookUrl
      },
      isAuthenticated: true,
    });
  },

  updateProfile: async (data) => {
    const currentUser = get().user;
    if (!currentUser?.email) throw new Error('No user logged in');

    const updatedUser = await api.updateProfile(currentUser.email, data);
    set({ 
      user: {
        ...currentUser,
        ...updatedUser
      }
    });
  },
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  updateUserRoles: (roles) => {
    set((state) => ({
      user: state.user ? { ...state.user, roles } : null
    }));
  },
  
  updateUserProfile: (profile) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...profile } : null
    }));
  },
  
  clearUser: () => set({ user: null }),
}));
