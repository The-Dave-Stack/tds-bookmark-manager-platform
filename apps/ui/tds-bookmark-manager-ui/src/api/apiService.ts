import type { ApiInterface, BookmarkType, FolderType, UserType } from './types'; // Reuse your existing types
import { CreateUserDto, Role, isEmail } from '@tds/tds-bm-common';

import { DateRange } from '../components/statistics/DateRangeSelector';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Get the API URL from the global window object injected at runtime.
// Fallback to a local development URL if not present.
const aPiUrl = (window as any).TDS_CONFIG?.API_URL || 'http://localhost:3000/api/v1';

// Create an Axios instance with the runtime base URL
const apiClient = axios.create({
  baseURL: aPiUrl,
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
    const response = await apiClient.get('/users/checkAdmins');
    return response.data;
  },
  async setupAdmin(createUserDto: CreateUserDto): Promise<UserType> {
    const response = await apiClient.post('/users/setupAdmin', createUserDto);
    return response.data;
  },
  // --- Auth ---
  async login(email: string, password: string): Promise<UserType> {
    isEmail(email);
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  async register(createUserDto: CreateUserDto): Promise<UserType> {
    const response = await apiClient.post('/auth/register', createUserDto);
    return response.data;
  },

  async updateProfile(email: string, data: Partial<UserType>): Promise<UserType> {
    isEmail(email);
    const response = await apiClient.put(`/users/${email}`, data);
    return response.data;
  },

  // --- User Management (Admin) ---
  async getUsers(): Promise<UserType[]> {
    const response = await apiClient.get('/users');
    return response.data;
  },

  async updateUserRole(email: string, role: Role): Promise<UserType> {
    isEmail(email);
    const response = await apiClient.put(`/users/${email}/role`, { role });
    return response.data;
  },

  // --- Statistics ---
  // TODO: return statistic object
  async getAdminStatistics(dateRange: DateRange): Promise<any> {
    const response = await apiClient.get('/statistics/admin', { params: dateRange });
    return response.data;
  },

  // --- Bookmarks ---
  async getBookmarks(userEmail: string): Promise<BookmarkType[]> {
    isEmail(userEmail);
    const response = await apiClient.get(`/users/${userEmail}/bookmarks`);
    return response.data;
  },

  async createBookmark(userEmail: string, data: Partial<BookmarkType>): Promise<BookmarkType> {
    isEmail(userEmail);
    const response = await apiClient.post(`/users/${userEmail}/bookmarks`, data);
    return response.data;
  },

  async updateBookmark(userEmail: string, bookmarkId: string, data: Partial<BookmarkType>): Promise<BookmarkType> {
    isEmail(userEmail);
    const response = await apiClient.put(`/users/${userEmail}/bookmarks/${bookmarkId}`, data);
    return response.data;
  },

  async deleteBookmark(userEmail: string, bookmarkId: string): Promise<void> {
    isEmail(userEmail);
    await apiClient.delete(`/users/${userEmail}/bookmarks/${bookmarkId}`);
  },

  async incrementBookmarkClicks(userEmail: string, bookmarkId: string): Promise<BookmarkType> {
    isEmail(userEmail);
    const response = await apiClient.post(`/users/${userEmail}/bookmarks/${bookmarkId}/click`);
    return response.data;
  },

  // --- Folders ---
  async getFolders(userEmail: string): Promise<FolderType[]> {
    isEmail(userEmail);
    const response = await apiClient.get(`/users/${userEmail}/folders`);
    return response.data;
  },

  async createFolder(userEmail: string, parentId: string | null, data: Partial<FolderType>): Promise<FolderType> {
    isEmail(userEmail);
    const response = await apiClient.post(`/users/${userEmail}/folders`, data);
    return response.data;
  },

  async updateFolder(userEmail: string, folderId: string, parentId: string | null, data: Partial<FolderType>): Promise<FolderType> {
    isEmail(userEmail);
    const response = await apiClient.put(`/users/${userEmail}/folders/${folderId}`, data);
    return response.data;
  },

  async deleteFolder(userEmail: string, folderId: string): Promise<void> {
    isEmail(userEmail);
    await apiClient.delete(`/users/${userEmail}/folders/${folderId}`);
  }
};