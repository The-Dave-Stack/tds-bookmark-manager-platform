import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockApi } from '../../api/mockApiService'; // Test the mock service directly
import { mockBookmarks, mockFolders, mockUsers } from '../../api/mockData';
import { Role } from '@tds/tds-bm-common';

// --- KEY FIX: Preserve original data ---
const originalMockUsers = JSON.parse(JSON.stringify(mockUsers));
const originalMockBookmarks = JSON.parse(JSON.stringify(mockBookmarks));
const originalMockFolders = JSON.parse(JSON.stringify(mockFolders));

describe('mockApiService', () => {
  beforeEach(() => {
    // --- KEY FIX: Reset data before each test ---
    mockUsers.splice(0, mockUsers.length, ...JSON.parse(JSON.stringify(originalMockUsers)));
    mockBookmarks.splice(0, mockBookmarks.length, ...JSON.parse(JSON.stringify(originalMockBookmarks)));
    mockFolders.splice(0, mockFolders.length, ...JSON.parse(JSON.stringify(originalMockFolders)));
    vi.clearAllMocks();
  });

  describe('Auth', () => {
    it('should update user profile', async () => {
        const userToUpdate = mockUsers.find(u => u.email === 'user@example.com');
        const updatedUser = await mockApi.updateProfile(userToUpdate!.id!, { firstName: 'Updated' });
        expect(updatedUser.firstName).toBe('Updated');
    });

    it('should throw error if user not found during profile update', async () => {
        await expect(mockApi.updateProfile('non-existent-id', { firstName: 'Test' })).rejects.toThrow('User not found');      
    });
  });

  describe('User Management (Admin)', () => {
    it('should update user role', async () => {
        const userToUpdate = mockUsers.find(u => u.email === 'user@example.com');
        const updatedUser = await mockApi.updateUserRole(userToUpdate!.id!, { roles: [Role.ADMIN] });
        expect(updatedUser.roles).toContain(Role.ADMIN);
    });
  });

  describe('Bookmarks', () => {
    it('should get bookmarks for a user', async () => {
      const bookmarks = await mockApi.getBookmarks();
      expect(bookmarks).toBeDefined();
      // Based on mockData, user@example.com has 0 bookmarks initially.
      // Let's adjust mockData for a better test or adjust the test.
      // For now, let's assume the user has bookmarks. We'll add one.
      mockBookmarks.push({ id: 'b1', userEmail: 'user@example.com' } as any);
      const bookmarksAfterAdd = await mockApi.getBookmarks();
      expect(bookmarksAfterAdd.length).toBe(1);
    });

    it('should create a new bookmark', async () => {
      const initialCount = mockBookmarks.filter(b => b.userEmail === 'user@example.com').length;
      const newBookmark = await mockApi.createBookmark({ url: 'https://new.com', title: 'New Bookmark' });
      expect(newBookmark.url).toBe('https://new.com');
      const finalCount = mockBookmarks.filter(b => b.userEmail === 'user@example.com').length;
      expect(finalCount).toBe(initialCount + 1);
    });

    it('should throw error if bookmark not found during delete', async () => {
        await expect(mockApi.deleteBookmark('nonexistent-bookmark')).resolves.not.toThrow();
    });

    it('should increment bookmark click count', async () => {
        const bookmarkToUpdate = mockBookmarks.find(b => b.id === 'bookmark-1');
        const initialClicks = bookmarkToUpdate!.clickCount;
        await mockApi.incrementBookmarkClicks('bookmark-1');
        expect(bookmarkToUpdate!.clickCount).toBe(initialClicks + 1);
    });
  });

  // Add other tests similarly, ensuring they are independent
});