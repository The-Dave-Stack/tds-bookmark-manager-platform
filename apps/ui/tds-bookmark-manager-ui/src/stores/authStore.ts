import { api } from '../api';
import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  apiToken?: string;
  webhookUrl?: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, isAdmin?: boolean) => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; password?: string }) => Promise<void>;
  setUser: (user: User) => void;
  updateUserRole: (role: 'user' | 'admin') => void;
  updateUserProfile: (profile: Partial<User>) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  
  login: async (email: string, password: string) => {
    const user = await api.login(email, password);
    set({ 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        apiToken: user.apiToken,
        webhookUrl: user.webhookUrl
      }
    });
  },
  
  register: async (email: string, password: string, firstName: string, lastName: string, isAdmin = false) => {
    const user = await api.register(email, password, firstName, lastName, isAdmin);
    set({ 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        apiToken: user.apiToken,
        webhookUrl: user.webhookUrl
      }
    });
  },

  updateProfile: async (data) => {
    const currentUser = get().user;
    if (!currentUser?.id) throw new Error('No user logged in');

    const updatedUser = await api.updateProfile(currentUser.id, data);
    set({ 
      user: {
        ...currentUser,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      }
    });
  },
  
  setUser: (user) => set({ user }),
  
  updateUserRole: (role) => {
    set((state) => ({
      user: state.user ? { ...state.user, role } : null
    }));
  },
  
  updateUserProfile: (profile) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...profile } : null
    }));
  },
  
  clearUser: () => set({ user: null }),
}));