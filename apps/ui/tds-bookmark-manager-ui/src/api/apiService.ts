import type { DateRange } from '../components/statistics/DateRangeSelector';
import { mockBookmarks, mockFolders, mockUsers } from './mockData';
import type { Bookmark, Folder, User } from './types';

// Simulate API delay
const delay = () => Promise.resolve();

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock API endpoints
export const api = {
  // Auth
  login: async (email: string, password: string): Promise<User> => {
    await delay();
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    return user;
  },

  register: async (email: string, password: string, firstName: string, lastName: string, isAdmin = false): Promise<User> => {
    await delay();
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user-${generateId()}`,
      email,
      firstName,
      lastName,
      password,
      role: isAdmin ? 'admin' : 'user',
      apiToken: `token-${generateId()}`,
      webhookUrl: `https://api.example.com/webhook/${generateId()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    return newUser;
  },

  updateProfile: async (userId: string, data: { firstName?: string; lastName?: string; password?: string }): Promise<User> => {
    await delay();
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return mockUsers[userIndex];
  },

  // User Management (Admin)
  getUsers: async (): Promise<User[]> => {
    await delay();
    return mockUsers;
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<User> => {
    await delay();
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      role,
      updatedAt: new Date().toISOString()
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
        bookmarkCount: mockBookmarks.filter(b => b.userId === user.id).length,
        clickCount: mockBookmarks
          .filter(b => b.userId === user.id)
          .reduce((sum, b) => sum + b.clickCount, 0)
      }))
    };
  },

  // Bookmarks
  getBookmarks: async (userId: string): Promise<Bookmark[]> => {
    await delay();
    return mockBookmarks.filter(b => b.userId === userId);
  },

  createBookmark: async (userId: string, data: Partial<Bookmark>): Promise<Bookmark> => {
    await delay();
    const newBookmark: Bookmark = {
      id: `bookmark-${generateId()}`,
      userId,
      url: data.url!,
      title: data.title!,
      faviconUrl: data.faviconUrl,
      folderId: data.folderId,
      clickCount: 0,
      isHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockBookmarks.push(newBookmark);
    return newBookmark;
  },

  updateBookmark: async (userId: string, id: string, data: Partial<Bookmark>): Promise<Bookmark> => {
    await delay();
    const index = mockBookmarks.findIndex(b => b.id === id && b.userId === userId);
    if (index === -1) throw new Error('Bookmark not found');

    mockBookmarks[index] = { ...mockBookmarks[index], ...data, updatedAt: new Date().toISOString() };
    return mockBookmarks[index];
  },

  deleteBookmark: async (userId: string, id: string): Promise<void> => {
    await delay();
    const index = mockBookmarks.findIndex(b => b.id === id && b.userId === userId);
    if (index === -1) throw new Error('Bookmark not found');
    mockBookmarks.splice(index, 1);
  },

  incrementBookmarkClicks: async (userId: string, id: string): Promise<Bookmark> => {
    await delay();
    const bookmark = mockBookmarks.find(b => b.id === id && b.userId === userId);
    if (!bookmark) throw new Error('Bookmark not found');
    bookmark.clickCount++;
    bookmark.updatedAt = new Date().toISOString();
    return bookmark;
  },

  // Folders
  getFolders: async (userId: string): Promise<Folder[]> => {
    await delay();
    return mockFolders.filter(f => f.userId === userId);
  },

  createFolder: async (userId: string, name: string, parentId: string | null = null): Promise<Folder> => {
    await delay();
    const newFolder: Folder = {
      id: `folder-${generateId()}`,
      userId,
      name,
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookmarkCount: 0 // Add missing property
    };

    mockFolders.push(newFolder);
    return newFolder;
  },

  updateFolder: async (userId: string, id: string, name: string, parentId: string | null = null): Promise<Folder> => {
    await delay();
    const index = mockFolders.findIndex(f => f.id === id && f.userId === userId);
    if (index === -1) throw new Error('Folder not found');

    // Check for circular reference
    if (parentId) {
      let currentParent = parentId;
      while (currentParent) {
        const parent = mockFolders.find(f => f.id === currentParent);
        if (!parent) break;
        if (parent.id === id) throw new Error('Circular reference detected');
        currentParent = parent.parentId as string;
      }
    }

    mockFolders[index] = { 
      ...mockFolders[index], 
      name, 
      parentId,
      updatedAt: new Date().toISOString() 
    };
    return mockFolders[index];
  },

  deleteFolder: async (userId: string, id: string): Promise<void> => {
    await delay();
    const folderToDelete = mockFolders.find(f => f.id === id && f.userId === userId);
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
