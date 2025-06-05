import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBookmarkStore } from '../stores/bookmarkStore';
import { api } from '../api/apiService';

// Mock the API
vi.mock('../api/apiService', () => ({
  api: {
    getBookmarks: vi.fn(),
    createBookmark: vi.fn(),
    updateBookmark: vi.fn(),
    deleteBookmark: vi.fn(),
    incrementBookmarkClicks: vi.fn()
  }
}));

describe('Bookmark Store', () => {
  const userId = 'test-user-id';
  const mockBookmark = {
    id: 'test-bookmark-id',
    userId,
    url: 'https://example.com',
    title: 'Test Bookmark',
    clickCount: 0,
    isHidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    // Clear store between tests
    useBookmarkStore.setState({
      bookmarks: [],
      folders: [],
      loading: false,
      error: null
    });
    
    // Clear mock calls
    vi.clearAllMocks();
  });

  it('should fetch bookmarks', async () => {
    const mockBookmarks = [mockBookmark];
    (api.getBookmarks as any).mockResolvedValue(mockBookmarks);

    const store = useBookmarkStore.getState();
    await store.fetchBookmarks(userId);

    expect(api.getBookmarks).toHaveBeenCalledWith(userId);
    expect(useBookmarkStore.getState().bookmarks).toEqual(mockBookmarks);
    expect(useBookmarkStore.getState().loading).toBe(false);
    expect(useBookmarkStore.getState().error).toBe(null);
  });

  it('should add a bookmark', async () => {
    (api.createBookmark as any).mockResolvedValue(mockBookmark);

    const store = useBookmarkStore.getState();
    await store.addBookmark(userId, {
      url: mockBookmark.url,
      title: mockBookmark.title,
      isHidden: false
    });

    expect(api.createBookmark).toHaveBeenCalled();
    expect(useBookmarkStore.getState().bookmarks).toContainEqual(mockBookmark);
  });

  it('should update a bookmark', async () => {
    const updatedBookmark = { ...mockBookmark, title: 'Updated Title' };
    (api.updateBookmark as any).mockResolvedValue(updatedBookmark);

    useBookmarkStore.setState({ bookmarks: [mockBookmark] });
    const store = useBookmarkStore.getState();

    await store.updateBookmark(userId, mockBookmark.id, { title: 'Updated Title' });

    expect(api.updateBookmark).toHaveBeenCalled();
    expect(useBookmarkStore.getState().bookmarks[0].title).toBe('Updated Title');
  });

  it('should delete a bookmark', async () => {
    (api.deleteBookmark as any).mockResolvedValue(undefined);

    useBookmarkStore.setState({ bookmarks: [mockBookmark] });
    const store = useBookmarkStore.getState();

    await store.deleteBookmark(userId, mockBookmark.id);

    expect(api.deleteBookmark).toHaveBeenCalled();
    expect(useBookmarkStore.getState().bookmarks).toHaveLength(0);
  });

  it('should increment bookmark click count', async () => {
    const updatedBookmark = { ...mockBookmark, clickCount: 1 };
    (api.incrementBookmarkClicks as any).mockResolvedValue(updatedBookmark);

    useBookmarkStore.setState({ bookmarks: [mockBookmark] });
    const store = useBookmarkStore.getState();

    await store.incrementClickCount(userId, mockBookmark.id);

    expect(api.incrementBookmarkClicks).toHaveBeenCalled();
    expect(useBookmarkStore.getState().bookmarks[0].clickCount).toBe(1);
  });

  it('should handle errors when fetching bookmarks', async () => {
    // Mock console.error to prevent error output during test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const error = new Error('Failed to fetch');
    (api.getBookmarks as any).mockRejectedValue(error);

    const store = useBookmarkStore.getState();
    await store.fetchBookmarks(userId);

    expect(useBookmarkStore.getState().error).toBe('Failed to fetch bookmarks: Failed to fetch');
    expect(useBookmarkStore.getState().loading).toBe(false);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});