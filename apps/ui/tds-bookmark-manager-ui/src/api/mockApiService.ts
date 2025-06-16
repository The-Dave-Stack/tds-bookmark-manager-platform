import type { ApiInterface, BookmarkType, FolderType, UserType } from './types';
import { CreateUserDto, Role, isEmail } from '@tds/tds-bm-common';
import { mockBookmarks, mockFolders, mockUsers } from './mockData';

import type { DateRange } from '../components/statistics/DateRangeSelector';

// Simulate API delay
const delay = () => Promise.resolve();

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock API endpoints
export const mockApi: ApiInterface = {
  // System check
  checkAdminExists: async (): Promise<boolean> => {
    await delay();
    return mockUsers.some(user => !!user.roles.find((role) => role === 'ADMIN'));
  },

  setupAdmin: async (createUserDto: CreateUserDto): Promise<UserType> => {
    await delay();
    
    // Check if admin already exists
    if (mockUsers.some(user => !!user.roles.find((role) => role === 'ADMIN'))) {
      throw new Error('Admin user already exists');
    }

    const newAdmin: UserType = {
      ...createUserDto,
      password: '',
      roles: ['ADMIN'],
      apiToken: `admin-token-${generateId()}`,
      webhookUrl: `https://api.example.com/webhook/admin-${generateId()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUsers.push(newAdmin);
    return newAdmin;
  },
  // Auth
  login: async (email: string, password: string): Promise<UserType> => {
    isEmail(email);
    await delay();
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    return user;
  },

  register: async (createUserDto: CreateUserDto): Promise<UserType> => {
    await delay();
    if (mockUsers.some(u => u.email === createUserDto.email)) {
      throw new Error('User already exists');
    }

    const newUser: UserType = {
      ...createUserDto,
      roles: ['USER'],
      apiToken: `token-${generateId()}`,
      webhookUrl: `https://api.example.com/webhook/${generateId()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUsers.push(newUser);
    return newUser;
  },

  updateProfile: async (email: string, data: Partial<UserType>): Promise<UserType> => {
    isEmail(email);
    await delay();
    const userIndex = mockUsers.findIndex(u => u.email === email);
    if (userIndex === -1) throw new Error('User not found');

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date()
    };

    return mockUsers[userIndex];
  },

  // User Management (Admin)
  getUsers: async (): Promise<UserType[]> => {
    await delay();
    return mockUsers;
  },

  updateUserRole: async (email: string, role: Role): Promise<UserType> => {
    isEmail(email);
    await delay();
    const userIndex = mockUsers.findIndex(u => u.email === email);
    if (userIndex === -1) throw new Error('User not found');

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      roles: [...new Set<Role>([...mockUsers[userIndex].roles, role])],
      updatedAt: new Date()
    };

    return mockUsers[userIndex];
  },

  // TODO: Use dateRange parameter to filter statistics
  getAdminStatistics: async (dateRange: DateRange) => {
    await delay();
    const totalUsers = mockUsers.length;
    const totalBookmarks = mockBookmarks.length;
    const totalClicks = mockBookmarks.reduce((sum, bm) => sum + bm.clickCount, 0);

    return {
      totalUsers,
      totalBookmarks,
      totalClicks,
      avgBookmarksPerUser: totalUsers > 0 ? totalBookmarks / totalUsers : 0,
      avgClicksPerUser: totalUsers > 0 ? totalClicks / totalUsers : 0,
      topUsers: mockUsers.map(user => ({
        email: user.email,
        bookmarkCount: mockBookmarks.filter(b => b.userEmail === user.email).length,
        clickCount: mockBookmarks
          .filter(b => b.userEmail === user.email)
          .reduce((sum, b) => sum + b.clickCount, 0)
      }))
    };
  },

  // Bookmarks
  getBookmarks: async (userEmail: string): Promise<BookmarkType[]> => {
    isEmail(userEmail);
    await delay();
    return mockBookmarks.filter(b => b.userEmail === userEmail);
  },

  createBookmark: async (userEmail: string, data: Partial<BookmarkType>): Promise<BookmarkType> => {
    isEmail(userEmail);
    await delay();
    const newBookmark: BookmarkType = {
      id: `bookmark-${generateId()}`,
      userEmail,
      url: data.url!,
      title: data.title!,
      faviconUrl: data.faviconUrl,
      folderId: data.folderId as string,
      clickCount: 0,
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockBookmarks.push(newBookmark);
    return newBookmark;
  },

  updateBookmark: async (userEmail: string, id: string, data: Partial<BookmarkType>): Promise<BookmarkType> => {
    isEmail(userEmail);
    await delay();
    const index = mockBookmarks.findIndex(b => b.id === id && b.userEmail === userEmail);
    if (index === -1) throw new Error('Bookmark not found');

    mockBookmarks[index] = { ...mockBookmarks[index], ...data, updatedAt: new Date() };
    return mockBookmarks[index];
  },

  deleteBookmark: async (userEmail: string, id: string): Promise<void> => {
    isEmail(userEmail);
    await delay();
    const index = mockBookmarks.findIndex(b => b.id === id && b.userEmail === userEmail);
    if (index === -1) throw new Error('Bookmark not found');
    mockBookmarks.splice(index, 1);
  },

  incrementBookmarkClicks: async (userEmail: string, id: string): Promise<BookmarkType> => {
    isEmail(userEmail);
    await delay();
    const bookmark = mockBookmarks.find(b => b.id === id && b.userEmail === userEmail);
    if (!bookmark) throw new Error('Bookmark not found');
    bookmark.clickCount++;
    bookmark.updatedAt = new Date();
    return bookmark;
  },

  // Folders
  getFolders: async (userEmail: string): Promise<FolderType[]> => {
    isEmail(userEmail);
    await delay();
    return mockFolders.filter(f => f.userEmail === userEmail);
  },

  createFolder: async (userEmail: string, parentId: string | null, data: Partial<FolderType>): Promise<FolderType> => {
    isEmail(userEmail);
    await delay();
    const newFolder: FolderType = {
      ...data as FolderType,
      id: `folder-${generateId()}`,
      userEmail,
      parentId
    };

    mockFolders.push(newFolder);
    return newFolder;
  },

  updateFolder: async (userEmail: string, folderId: string, parentId: string | null, data: Partial<FolderType>): Promise<FolderType> => {
    isEmail(userEmail);
    await delay();
    const index = mockFolders.findIndex(f => f.id === folderId && f.userEmail === userEmail);
    if (index === -1) throw new Error('Folder not found');

    // Check for circular reference
    if (parentId) {
      let currentParent = parentId;
      while (currentParent) {
        const parent = mockFolders.find(f => f.id === currentParent);
        if (!parent) break;
        if (parent.id === parentId) throw new Error('Circular reference detected');
        currentParent = parent.parentId as string;
      }
    }

    mockFolders[index] = { 
      ...mockFolders[index],
      ...data,
      parentId,
      updatedAt: new Date()
    };
    return mockFolders[index];
  },

  deleteFolder: async (userEmail: string, id: string): Promise<void> => {
    isEmail(userEmail);
    await delay();
    const folderToDelete = mockFolders.find(f => f.id === id && f.userEmail === userEmail);
    if (!folderToDelete) throw new Error('Folder not found');

    const folderIdsToDelete: string[] = [];
    const collectChildren = (folderId: string) => {
      folderIdsToDelete.push(folderId);
      const children = mockFolders.filter(f => f.parentId === folderId);
      children.forEach(child => collectChildren(child.id));
    };

    collectChildren(id);

    // Filter out deleted folders
    mockFolders.splice(0, mockFolders.length, ...mockFolders.filter(f => !folderIdsToDelete.includes(f.id)));

    // Update bookmarks to remove folder reference
    mockBookmarks.forEach(bookmark => {
      if (bookmark.folderId && folderIdsToDelete.includes(bookmark.folderId)) {
        bookmark.folderId = undefined;
      }
    });
  }
};
