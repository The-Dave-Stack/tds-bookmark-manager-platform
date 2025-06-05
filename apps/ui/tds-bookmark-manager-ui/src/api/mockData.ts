import type { Bookmark, Folder, User } from './types';

// Mock data
export const mockUsers: User[] = [
  {
    id: 'admin-123',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    password: 'admin123',
    role: 'admin',
    apiToken: 'admin-token-123',
    webhookUrl: 'https://api.example.com/webhook/admin123',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-123',
    email: 'user@example.com',
    firstName: 'Regular',
    lastName: 'User',
    password: 'password123',
    role: 'user',
    apiToken: 'user-token-123',
    webhookUrl: 'https://api.example.com/webhook/user123',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    userId: 'admin-123',
    name: 'Development',
    parentId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    bookmarkCount: 0
  },
  {
    id: 'folder-2',
    userId: 'admin-123',
    name: 'Reading List',
    parentId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    bookmarkCount: 0
  },
  {
    id: 'folder-3',
    userId: 'admin-123',
    name: 'React',
    parentId: 'folder-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    bookmarkCount: 0
  },
  {
    id: 'folder-4',
    userId: 'admin-123',
    name: 'TypeScript',
    parentId: 'folder-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    bookmarkCount: 0
  }
];

export const mockBookmarks: Bookmark[] = [
  {
    id: 'bookmark-1',
    userId: 'admin-123',
    url: 'https://react.dev',
    title: 'React Documentation',
    faviconUrl: 'https://react.dev/favicon.ico',
    folderId: 'folder-3',
    clickCount: 5,
    isHidden: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'bookmark-2',
    userId: 'admin-123',
    url: 'https://www.typescriptlang.org',
    title: 'TypeScript Documentation',
    faviconUrl: 'https://www.typescriptlang.org/favicon.ico',
    folderId: 'folder-4',
    clickCount: 3,
    isHidden: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];
