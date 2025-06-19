import { CreateBookmarkDto, CreateFolderDto, CreateUserDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto, TokenDto, UpdateBookmarkDto, UpdateFolderDto, UpdateUserRoleDto } from '@tds/tds-bm-common';
import axios from 'axios';
import Cookies from 'js-cookie';

import { DateRange } from '../components/statistics/DateRangeSelector';


import type { ApiInterface, BookmarkType, FolderType, UserType } from './types';

// Get the API URL from the global window object injected at runtime.
const apiUrl = (window as any).TDS_CONFIG?.API_URL || 'http://localhost:3000/api/v1';

// Create an Axios instance with the runtime base URL
const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get('csrf-token'); // TODO: Use Cookies.CSRF_TOKEN from shared library
    if (csrfToken) {
      // Add it to the request headers
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Implement the API methods by calling the real backend endpoints
export const api: ApiInterface = {
  // --- System Check ---
  async checkAdminExists(): Promise<boolean> {
    const response = await apiClient.get('/users/checkAdmins');
    return response.data;
  },
  async setupAdmin(createUserDto: CreateUserDto): Promise<UserType> {
    const response = await apiClient.post('/users/setupAdmin', createUserDto);
    return response.data;
  },

  // --- Auth ---
  async login(loginUserDto: LoginUserDto): Promise<UserType> {
    const response = await apiClient.post('/auth/login', loginUserDto);
    return response.data;
  },
  async logout(): Promise<void> {
    throw new Error('Function not implemented.');
  },
  async register(createUserDto: CreateUserDto): Promise<UserType> {
    const response = await apiClient.post('/auth/register', createUserDto);
    return response.data;
  },
  async forgotPassword(data: ForgotPasswordDto): Promise<void> {
    throw new Error('Function not implemented.');
  },
  async resetPassword(data: ResetPasswordDto): Promise<TokenDto> {
    throw new Error('Function not implemented.');
  },

  // --- User ---
  async updateProfile(userId: string, data: Partial<UserType>): Promise<UserType> {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  },
  async getProfile(): Promise<UserType> {
    throw new Error('Function not implemented.');
  },

  // --- Bookmarks ---
  async getBookmarks(): Promise<BookmarkType[]> {
    const response = await apiClient.get('/bookmarks');
    return response.data;
  },
  async createBookmark(data: CreateBookmarkDto): Promise<BookmarkType> {
    const response = await apiClient.post('/bookmarks', data);
    return response.data;
  },
  async updateBookmark(bookmarkId: string, data: UpdateBookmarkDto): Promise<BookmarkType> {
    const response = await apiClient.patch(`/bookmarks/${bookmarkId}`, data);
    return response.data;
  },
  async deleteBookmark(bookmarkId: string): Promise<void> {
    await apiClient.delete(`/bookmarks/${bookmarkId}`);
  },
  async incrementBookmarkClicks(bookmarkId: string): Promise<void> {
    await apiClient.post(`/bookmarks/${bookmarkId}/click`);
  },

  // --- Folders ---
  async getFolders(): Promise<FolderType[]> {
    const response = await apiClient.get('/folders');
    return response.data;
  },
  async createFolder(data: CreateFolderDto): Promise<FolderType> {
    const response = await apiClient.post('/folders', data);
    return response.data;
  },
  async updateFolder(folderId: string, data: UpdateFolderDto): Promise<FolderType> {
    const response = await apiClient.patch(`/folders/${folderId}`, data);
    return response.data;
  },
  async deleteFolder(folderId: string): Promise<void> {
    await apiClient.delete(`/folders/${folderId}`);
  },

  // --- Admin ---
  async getUsers(): Promise<UserType[]> {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  async updateUserRole(userId: string, data: UpdateUserRoleDto): Promise<UserType> {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, data);
    return response.data;
  },
  async getAdminStatistics(dateRange: DateRange): Promise<any> {
    const response = await apiClient.get('/statistics/admin', { params: dateRange });
    return response.data;
  },
  
};