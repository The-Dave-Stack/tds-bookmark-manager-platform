import { CreateBookmarkDto, CreateFolderDto, CreateUserDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto, Role, UpdateBookmarkDto, UpdateFolderDto, UpdateUserRoleDto } from '@tds/tds-bm-common';
import { v4 as uuidv4 } from 'uuid';

import { mockBookmarks, mockFolders, mockUsers } from './mockData';

import type { ApiInterface, BookmarkType, FolderType, UserType } from './types';
import type { DateRange } from '../components/statistics/DateRangeSelector';


let MOCK_CURRENT_USER: UserType | null = null;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const MOCK_CURRENT_USER_EMAIL = 'user@example.com';

export const mockApi: ApiInterface = {
  // --- System ---
  async checkAdminExists(): Promise<boolean> {
    await delay(100);
    return mockUsers.some(u => u.roles.includes(Role.ADMIN));
  },
  async setupAdmin(createUserDto: CreateUserDto): Promise<UserType> {
    await delay(500);
    const newAdmin: UserType = {
      id: uuidv4(),
      ...createUserDto,
      roles: [Role.ADMIN, Role.USER],
      apiToken: `admin-token-${uuidv4()}`,
      createdAt: new Date(),
    };
    mockUsers.push(newAdmin);
    return newAdmin;
  },

  // --- Auth ---
  async login(loginUserDto: LoginUserDto): Promise<UserType> {
    await delay(500);
    const user = mockUsers.find(u => u.email === loginUserDto.email && u.password === loginUserDto.password);
    if (!user) throw new Error("Invalid credentials");
    MOCK_CURRENT_USER = user; // Simulate session creation
    // Return only user data, no token
    const { password: _, ...userData } = user;
    return userData as UserType;
  },
  async logout(): Promise<void> {
    await delay(100);
    MOCK_CURRENT_USER = null; // Simulate session destruction
    return Promise.resolve();
  },
  async register(createUserDto: CreateUserDto): Promise<UserType> {
    await delay(500);
    if (mockUsers.some(u => u.email === createUserDto.email)) {
      throw new Error("User already exists");
    }
    const newUser: UserType = { id: uuidv4(), ...createUserDto, roles: [Role.USER], apiToken: uuidv4(), createdAt: new Date() };
    mockUsers.push(newUser);
    MOCK_CURRENT_USER = newUser; // Simulate session creation
    // Return only user data
    const { password: _, ...userData } = newUser;
    return userData as UserType;
  },
  async updateProfile(userId: string, data: Partial<UserType>): Promise<UserType> {
    await delay(300);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    Object.assign(user, data);
    return user;
  },
  async forgotPassword(data: ForgotPasswordDto): Promise<void> {
    await delay(500);
    console.log(`[MOCK] Password reset requested for: ${data.email}`);
  },
  async resetPassword(data: ResetPasswordDto): Promise<{ access_token: string; }> {
    await delay(500);
    console.log(`[MOCK] Password has been reset with token: ${data.token}`);
    return { access_token: 'mock-new-jwt-after-reset' };
  },

  // -- User ---
  async getProfile (): Promise<UserType> {
    await delay(100);
    if (!MOCK_CURRENT_USER) {
      throw new Error("Unauthorized");
    }
    const { password: _, ...userData } = MOCK_CURRENT_USER;
    return userData as UserType;
  },

  // --- Bookmarks ---
  async getBookmarks(search?: string): Promise<BookmarkType[]> {
    await delay(300);
    let bookmarks = mockBookmarks.filter(b => b.userEmail === MOCK_CURRENT_USER_EMAIL);
    if (search) {
      bookmarks = bookmarks.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.url.toLowerCase().includes(search.toLowerCase()));
    }
    return JSON.parse(JSON.stringify(bookmarks));
  },
  async createBookmark(data: CreateBookmarkDto): Promise<BookmarkType> {
    await delay(300);
    const newBookmark: BookmarkType = {
      id: uuidv4(),
      userEmail: MOCK_CURRENT_USER_EMAIL,
      url: data.url,
      title: data.title || 'Mocked Title From URL',
      faviconUrl: 'https://example.com/favicon.ico',
      folderId: data.folderId || undefined,
      clickCount: 0,
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockBookmarks.push(newBookmark);
    return newBookmark;
  },
  async updateBookmark(bookmarkId: string, data: UpdateBookmarkDto): Promise<BookmarkType> {
    await delay(300);
    const index = mockBookmarks.findIndex(b => b.id === bookmarkId);
    if (index === -1) throw new Error('Bookmark not found');

    // --- CORRECTION FOR FOLDERID ---
    const { folderId, ...restOfDto } = data;
    const updatedData: any = { ...restOfDto };

    // Handle the case where a bookmark is moved to the root folder
    if ('folderId' in data) {
      updatedData.folderId = folderId === null ? undefined : folderId;
    }

    mockBookmarks[index] = { ...mockBookmarks[index], ...updatedData, updatedAt: new Date() };
    return mockBookmarks[index];
  },
  async deleteBookmark(bookmarkId: string): Promise<void> {
    await delay(300);
    const index = mockBookmarks.findIndex(b => b.id === bookmarkId);
    if (index > -1) mockBookmarks.splice(index, 1);
  },
  async incrementBookmarkClicks(bookmarkId: string): Promise<void> {
    await delay(100);
    const bookmark = mockBookmarks.find(b => b.id === bookmarkId);
    if (bookmark) bookmark.clickCount++;
  },

  // --- Folders ---
  async getFolders(): Promise<FolderType[]> {
    await delay(200);
    return mockFolders.filter(f => f.userEmail === MOCK_CURRENT_USER_EMAIL);
  },
  async createFolder(data: CreateFolderDto): Promise<FolderType> {
    await delay(200);
    const newFolder: FolderType = {
      id: uuidv4(),
      name: data.name,
      parentId: data.parentId || null,
      userEmail: MOCK_CURRENT_USER_EMAIL,
      bookmarkCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockFolders.push(newFolder);
    return newFolder;
  },
  async updateFolder(folderId: string, data: UpdateFolderDto): Promise<FolderType> {
    await delay(200);
    const folder = mockFolders.find(f => f.id === folderId);
    if (!folder) throw new Error("Folder not found");

    const { parentId, ...restOfDto } = data;
    const updatedData: any = { ...restOfDto };
    if ('parentId' in data) {
      updatedData.parentId = parentId === null ? null : parentId; // Mock can handle null
    }

    Object.assign(folder, updatedData);
    folder.updatedAt = new Date();
    return folder;
  },
  async deleteFolder(folderId: string): Promise<void> {
    await delay(200);
    const index = mockFolders.findIndex(f => f.id === folderId);
    if (index > -1) mockFolders.splice(index, 1);
  },

  // --- Admin ---
  async getUsers(): Promise<UserType[]> {
    await delay(400);
    return mockUsers;
  },
  async updateUserRole(userId: string, data: UpdateUserRoleDto): Promise<UserType> {
    await delay(400);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    user.roles = data.roles;
    return user;
  },
  async getAdminStatistics(dateRange: DateRange): Promise<any> {
    await delay(500);
    console.log('[MOCK] Getting admin stats for range:', dateRange);
    return {
      totalUsers: mockUsers.length,
      totalBookmarks: mockBookmarks.length,
      totalClicks: mockBookmarks.reduce((sum, b) => sum + b.clickCount, 0),
      avgBookmarksPerUser: mockBookmarks.length / mockUsers.length,
      topUsers: [],
    };
  },

};