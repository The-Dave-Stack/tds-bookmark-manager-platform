import { Role } from '@tds/tds-bm-common';
import { UserType } from '../api/types';
import { api } from '../api';
import { create } from 'zustand';

interface AuthState {
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, isAdmin?: boolean) => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; password?: string }) => Promise<void>;
  setUser: (user: UserType) => void;
  updateUserRoles: (roles: Role[]) => void;
  updateUserProfile: (profile: Partial<UserType>) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  
  login: async (email: string, password: string) => {
    const user = await api.login(email, password);
    set({ 
      user: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        apiToken: user.apiToken,
        webhookUrl: user.webhookUrl
      }
    });
  },
  
  register: async (email: string, password: string, firstName: string, lastName: string, isAdmin = false) => {
    const user = await api.register(email, password, firstName, lastName, isAdmin);
    set({ 
      user: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        apiToken: user.apiToken,
        webhookUrl: user.webhookUrl
      }
    });
  },

  updateProfile: async (data) => {
    const currentUser = get().user;
    if (!currentUser?.email) throw new Error('No user logged in');

    const updatedUser = await api.updateProfile(currentUser.email, data);
    set({ 
      user: {
        ...currentUser,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      }
    });
  },
  
  setUser: (user) => set({ user }),
  
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