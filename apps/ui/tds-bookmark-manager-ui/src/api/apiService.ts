import type { ApiInterface, Bookmark, Folder, User } from './types'; // Reuse your existing types

import { DateRange } from '../components/statistics/DateRangeSelector';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Create an Axios instance with a base URL from environment variables
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
});

// Use an interceptor to automatically add the JWT to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.token; // Assuming token is stored in user object
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Implement the API methods by calling the backend endpoints
export const api: ApiInterface = {
  // --- System check ---
  async checkAdminExists(): Promise<boolean> {
    throw new Error('Function not implemented.');
  },
  async setupAdmin(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    throw new Error('Function not implemented.');
  },
  // --- Auth ---
  async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  async register(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const response = await apiClient.post('/auth/register', { email, password, firstName, lastName });
    return response.data;
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  },

  // --- User Management (Admin) ---
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get('/users');
    return response.data;
  },

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    const response = await apiClient.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  // --- Statistics ---
  async getAdminStatistics(dateRange: DateRange): Promise<any> {
    const response = await apiClient.get('/statistics/admin', { params: dateRange });
    return response.data;
  },

  // --- Bookmarks ---
  async getBookmarks(userId: string): Promise<Bookmark[]> {
    const response = await apiClient.get(`/users/${userId}/bookmarks`);
    return response.data;
  },

  async createBookmark(userId: string, data: Partial<Bookmark>): Promise<Bookmark> {
    const response = await apiClient.post(`/users/${userId}/bookmarks`, data);
    return response.data;
  },

  async updateBookmark(userId: string, bookmarkId: string, data: Partial<Bookmark>): Promise<Bookmark> {
    const response = await apiClient.put(`/users/${userId}/bookmarks/${bookmarkId}`, data);
    return response.data;
  },

  async deleteBookmark(userId: string, bookmarkId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/bookmarks/${bookmarkId}`);
  },

  async incrementBookmarkClicks(userId: string, bookmarkId: string): Promise<Bookmark> {
    const response = await apiClient.post(`/users/${userId}/bookmarks/${bookmarkId}/click`);
    return response.data;
  },

  // --- Folders ---
  async getFolders(userId: string): Promise<Folder[]> {
    const response = await apiClient.get(`/users/${userId}/folders`);
    return response.data;
  },

  async createFolder(userId: string, parentId: string | null, data: Partial<Folder>): Promise<Folder> {
    const response = await apiClient.post(`/users/${userId}/folders`, data);
    return response.data;
  },

  async updateFolder(userId: string, folderId: string, parentId: string | null, data: Partial<Folder>): Promise<Folder> {
    const response = await apiClient.put(`/users/${userId}/folders/${folderId}`, data);
    return response.data;
  },

  async deleteFolder(userId: string, folderId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/folders/${folderId}`);
  }
};