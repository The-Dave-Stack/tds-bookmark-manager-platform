import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockBookmarks, mockFolders, mockUsers } from '../../api/mockData';

import { api } from '../../api';

// Mock the actual mockData to ensure tests are isolated
const originalMockUsers = [...mockUsers];
const originalMockBookmarks = [...mockBookmarks];
const originalMockFolders = [...mockFolders];

describe('apiService', () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockUsers.splice(0, mockUsers.length, ...originalMockUsers);
    mockBookmarks.splice(0, mockBookmarks.length, ...originalMockBookmarks);
    mockFolders.splice(0, mockFolders.length, ...originalMockFolders);
    vi.clearAllMocks();
    vi.useFakeTimers(); // Use fake timers for delay
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore real timers
  });

  // Auth tests
  describe('Auth', () => {
    it('should login a user successfully', async () => {
      const userPromise = api.login('user@example.com', 'password123');
      await vi.runAllTimersAsync(); // Advance all pending timers
      const user = await userPromise;
      expect(user).toBeDefined();
      expect(user.email).toBe('user@example.com');
    });

    it('should throw error for invalid login credentials', async () => {
      const promise = api.login('nonexistent@example.com', 'password');
      const assetionPromise = expect(promise).rejects.toThrow('Invalid credentials');
      await vi.runAllTimersAsync(); // Advance all pending timers
      await assetionPromise;
    });

    it('should register a new user successfully', async () => {
      const initialUserCount = mockUsers.length;
      const newUserPromise = api.register({ username: 'newuser', email: 'newuser@example.com', password: 'newpassword', firstName: 'New', lastName: 'User' });
      await vi.runAllTimersAsync(); // Advance all pending timers
      const newUser = await newUserPromise;
      expect(newUser).toBeDefined();
      expect(newUser.email).toBe('newuser@example.com');
      expect(mockUsers.length).toBe(initialUserCount + 1);
      expect(mockUsers.some(u => u.email === 'newuser@example.com')).toBe(true);
    });

    it('should throw error if user already exists during registration', async () => {
      const promise = api.register({ username: 'existinguser', email: 'user@example.com', password: 'password123', firstName: 'Existing', lastName: 'User'});
      const assetionPromise = expect(promise).rejects.toThrow('User already exists');
      await vi.runAllTimersAsync(); // Advance all pending timers
      await assetionPromise;
    });

    it('should update user profile', async () => {
      const updatedUserPromise = api.updateProfile('user@example.com', { firstName: 'Updated', lastName: 'Name' });
      await vi.runAllTimersAsync(); // Advance all pending timers
      const updatedUser = await updatedUserPromise;
      expect(updatedUser.firstName).toBe('Updated');
      expect(updatedUser.lastName).toBe('Name');
      expect(mockUsers.find(u => u.email === 'user@example.com')?.firstName).toBe('Updated');
    });

    it('should throw error if user not found during profile update', async () => {
      const promise = api.updateProfile('nonexistent-user@example.com', { firstName: 'Test' });
      const assertionPromise = expect(promise).rejects.toThrow('User not found');
      await vi.runAllTimersAsync(); // Advance all pending timers
      await assertionPromise;      
    });
  });

  // User Management (Admin) tests
  describe('User Management (Admin)', () => {
    it('should get all users', async () => {
      const usersPromise = api.getUsers();
      await vi.runAllTimersAsync(); // Advance all pending timers
      const users = await usersPromise;
      expect(users).toBeDefined();
      expect(users.length).toBe(mockUsers.length);
      expect(users[0].email).toBe('admin@example.com');
    });

    it('should update user role', async () => {
      const updatedUserPromise = api.updateUserRole('user@example.com', 'ADMIN');
      await vi.runAllTimersAsync(); // Advance all pending timers
      const updatedUser = await updatedUserPromise;
      expect(updatedUser.roles).toContain('ADMIN');
      expect(mockUsers.find(u => u.email === 'user@example.com')?.roles).toContain('ADMIN');
    });

    it('should throw error if user not found during role update', async () => {
      const promise = api.updateUserRole('nonexistent-user@example.com', 'ADMIN');
      const assetionPromise = expect(promise).rejects.toThrow('User not found');
      await vi.runAllTimersAsync(); // Advance all pending timers
      await assetionPromise;
    });

    it('should get admin statistics', async () => {
      const statsPromise = api.getAdminStatistics({ start: new Date(), end: new Date() });
      await vi.runAllTimersAsync(); // Advance all pending timers
      const stats = await statsPromise;
      expect(stats).toBeDefined();
      expect(stats.totalUsers).toBe(mockUsers.length);
      expect(stats.totalBookmarks).toBe(mockBookmarks.length);
      expect(stats.totalClicks).toBeGreaterThanOrEqual(0); // Can be 0 if no clicks in mock data
      expect(stats.topUsers).toBeDefined();
    });
  });

  // Bookmarks tests
  describe('Bookmarks', () => {
    const userEmail = 'admin@example.com';
    let initialBookmark = { // Changed to let to allow modification in beforeEach
      id: 'bookmark-1',
      userEmail: 'admin@example.com',
      url: 'https://example.com/bookmark1',
      title: 'Bookmark 1',
      folderId: 'folder-1',
      clickCount: 0,
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    beforeEach(() => {
      // Ensure mockBookmarks is reset to a known state for bookmark tests
      initialBookmark = { // Reset initialBookmark to ensure clickCount is 0
        id: 'bookmark-1',
        userEmail: 'admin@example.com',
        url: 'https://example.com/bookmark1',
        title: 'Bookmark 1',
        folderId: 'folder-1',
        clickCount: 0,
        isHidden: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockBookmarks.splice(0, mockBookmarks.length, initialBookmark);
    });

    it('should get bookmarks for a user', async () => {
      const bookmarksPromise = api.getBookmarks(userEmail);
      await vi.runAllTimersAsync(); // Advance all pending timers
      const bookmarks = await bookmarksPromise;
      expect(bookmarks).toBeDefined();
      expect(bookmarks.length).toBe(1);
      expect(bookmarks[0].title).toBe('Bookmark 1');
    });

    it('should create a new bookmark', async () => {
      const initialCount = mockBookmarks.length;
      const newBookmarkPromise = api.createBookmark(userEmail, { url: 'https://new.com', title: 'New Bookmark' });
      await vi.runAllTimersAsync(); // Advance all pending timers
      const newBookmark = await newBookmarkPromise;
      expect(newBookmark).toBeDefined();
      expect(newBookmark.url).toBe('https://new.com');
      expect(mockBookmarks.length).toBe(initialCount + 1);
    });

    it('should update an existing bookmark', async () => {
      const updatedBookmarkPromise = api.updateBookmark(userEmail, 'bookmark-1', { title: 'Updated Bookmark' });
      await vi.runAllTimersAsync(); // Advance all pending timers
      const updatedBookmark = await updatedBookmarkPromise;
      expect(updatedBookmark.title).toBe('Updated Bookmark');
      expect(mockBookmarks.find(b => b.id === 'bookmark-1')?.title).toBe('Updated Bookmark');
    });

    it('should throw error if bookmark not found during update', async () => {
      const promise = api.updateBookmark(userEmail, 'nonexistent-bookmark', { title: 'Test' });
      const assertionPromise = expect(promise).rejects.toThrow('Bookmark not found');
      await vi.runAllTimersAsync(); // Advance all pending timers
      await assertionPromise;
    });

    it('should delete a bookmark', async () => {
      const initialCount = mockBookmarks.length;
      await api.deleteBookmark(userEmail, 'bookmark-1');
      await vi.runAllTimersAsync(); // Advance all pending timers
      expect(mockBookmarks.length).toBe(initialCount - 1);
      expect(mockBookmarks.some(b => b.id === 'bookmark-1')).toBe(false);
    }, 15000); // Increased timeout

    it('should throw error if bookmark not found during delete', async () => {
      const promise = api.deleteBookmark(userEmail, 'nonexistent-bookmark');
      const assertionPromise = expect(promise).rejects.toThrow('Bookmark not found');
      await vi.runAllTimersAsync(); // Advance all pending timers
      await assertionPromise;
    });

    it('should increment bookmark click count', async () => {
      const bookmarkPromise = api.incrementBookmarkClicks(userEmail, 'bookmark-1');
      await vi.runAllTimersAsync(); // Advance all pending timers
      const bookmark = await bookmarkPromise;
      expect(bookmark.clickCount).toBe(1);
      expect(mockBookmarks.find(b => b.id === 'bookmark-1')?.clickCount).toBe(1);
    });

    it('should throw error if bookmark not found during click increment', async () => {
      const promise = api.incrementBookmarkClicks(userEmail, 'nonexistent-bookmark');
      const assertionPromise = expect(promise).rejects.toThrow('Bookmark not found');
      await vi.runAllTimersAsync(); // Advance all pending timers
      await assertionPromise;
    });
  });

  // Folders tests
  describe('Folders', () => {
    const userEmail = 'admin@example.com';
    const initialFolder = {
      id: 'folder-1',
      userEmail: userEmail,
      name: 'Folder 1',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      bookmarkCount: 0
    };
    const childFolder = {
      id: 'folder-2',
      userEmail: userEmail,
      name: 'Folder 2',
      parentId: 'folder-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      bookmarkCount: 0
    };
    const bookmarkInFolder = {
      id: 'bookmark-in-folder',
      userEmail: userEmail,
      url: 'https://example.com/in-folder',
      title: 'Bookmark In Folder',
      folderId: 'folder-1',
      clickCount: 0,
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    beforeEach(() => {
      mockFolders.splice(0, mockFolders.length, initialFolder, childFolder);
      mockBookmarks.splice(0, mockBookmarks.length, bookmarkInFolder);
    });

    it('should get folders for a user', async () => {
      const foldersPromise = api.getFolders(userEmail);
      await vi.runAllTimersAsync(); // Advance all pending timers
      const folders = await foldersPromise;
      expect(folders).toBeDefined();
      expect(folders.length).toBe(2);
      expect(folders[0].name).toBe('Folder 1');
    });

    it('should create a new folder', async () => {
      const initialCount = mockFolders.length;
      const newFolderPromise = api.createFolder(userEmail, null, { name: 'New Folder' });
      await vi.runAllTimersAsync(); // Advance all pending timers
      const newFolder = await newFolderPromise;
      expect(newFolder).toBeDefined();
      expect(newFolder.name).toBe('New Folder');
      expect(mockFolders.length).toBe(initialCount + 1);
    });

    it('should update an existing folder', async () => {
      const updatedFolderPromise = api.updateFolder(userEmail, 'folder-1', null, { name: 'Updated Folder' });
      await vi.runAllTimersAsync(); // Advance all pending timers
      const updatedFolder = await updatedFolderPromise;
      expect(updatedFolder.name).toBe('Updated Folder');
      expect(mockFolders.find(f => f.id === 'folder-1')?.name).toBe('Updated Folder');
    });

    it('should throw error if folder not found during update', async () => {
      const promise = api.updateFolder(userEmail, 'nonexistent-folder', 'Test');
      const assertionPromise = expect(promise).rejects.toThrow('Folder not found');
      await vi.runAllTimersAsync(); // Advance all pending timers
      await assertionPromise;
    });

    it('should throw error for circular reference during folder update', async () => {
      // Create a scenario where folder-1 tries to become a child of folder-2, and folder-2 is a child of folder-1
      mockFolders.splice(0, mockFolders.length, 
        { ...initialFolder, parentId: 'folder-2' }, 
        { ...childFolder, parentId: 'folder-1' }
      );
      const promise = api.updateFolder(userEmail, 'folder-1', 'folder-2', { name: 'Folder 1' });
      const assertionPromise = expect(promise).rejects.toThrow('Circular reference detected');
      await vi.runAllTimersAsync(); // Advance all pending timers
      await assertionPromise;
    });

    it('should delete a folder and its children, and update associated bookmarks', async () => {
      const initialFolderCount = mockFolders.length;

      await api.deleteFolder(userEmail, 'folder-1');
      await vi.runAllTimersAsync(); // Advance all pending timers

      expect(mockFolders.length).toBe(initialFolderCount - 2); // folder-1 and folder-2 deleted
      expect(mockFolders.some(f => f.id === 'folder-1')).toBe(false);
      expect(mockFolders.some(f => f.id === 'folder-2')).toBe(false);
      expect(mockBookmarks.find(b => b.id === 'bookmark-in-folder')?.folderId).toBeUndefined();
    }, 15000); // Increased timeout

    it('should throw error if folder not found during delete', async () => {
      const promise = api.deleteFolder(userEmail, 'nonexistent-folder');
      const assertionPromise = expect(promise).rejects.toThrow('Folder not found');
      await vi.runAllTimersAsync(); // Advance all pending timers
      await assertionPromise;
    });
  });
});
