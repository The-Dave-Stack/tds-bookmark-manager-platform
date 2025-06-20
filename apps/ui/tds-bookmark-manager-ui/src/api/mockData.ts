import type { BookmarkType, FolderType, UserType } from './types';

// Mock data
export const mockUsers: UserType[] = [
  {
    username: 'admintest',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    password: 'admin123',
    roles: ['ADMIN'],
    apiToken: 'admin-token-123',
    webhookUrl: 'https://api.example.com/webhook/admin123',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    username: 'usertest',
    email: 'user@example.com',
    firstName: 'Regular',
    lastName: 'User',
    password: 'password123',
    roles: ['USER'],
    apiToken: 'user-token-123',
    webhookUrl: 'https://api.example.com/webhook/user123',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  }
];

export const mockFolders: FolderType[] = [
  {
    id: 'folder-1',
    userEmail: 'admin@example.com',
    name: 'Development',
    parentId: null,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    bookmarkCount: 0
  },
  {
    id: 'folder-2',
    userEmail: 'admin@example.com',
    name: 'Reading List',
    parentId: null,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    bookmarkCount: 0
  },
  {
    id: 'folder-3',
    userEmail: 'admin@example.com',
    name: 'React',
    parentId: 'folder-1',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    bookmarkCount: 0
  },
  {
    id: 'folder-4',
    userEmail: 'admin@example.com',
    name: 'TypeScript',
    parentId: 'folder-1',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    bookmarkCount: 0
  }
];

export const mockBookmarks: BookmarkType[] = [
  {
    id: 'bookmark-1',
    userEmail: 'admin@example.com',
    url: 'https://react.dev',
    title: 'React Documentation',
    faviconUrl: 'https://react.dev/favicon.ico',
    folderId: 'folder-3',
    clickCount: 5,
    isHidden: false,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: 'bookmark-2',
    userEmail: 'admin@example.com',
    url: 'https://www.typescriptlang.org',
    title: 'TypeScript Documentation',
    faviconUrl: 'https://www.typescriptlang.org/favicon.ico',
    folderId: 'folder-4',
    clickCount: 3,
    isHidden: false,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  }
];
