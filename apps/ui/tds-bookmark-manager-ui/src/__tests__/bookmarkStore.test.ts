/**
 * bookmarkStore.test.ts
 *
 * Purpose:
 * - Unit tests for the Zustand bookmark store (`useBookmarkStore`).
 * - Verifies the correct behavior of fetching, adding, updating, deleting, and tracking clicks for bookmarks.
 *
 * Logic Overview:
 * 1. Mocks the `api` service to control its responses during tests.
 * 2. Defines a mock bookmark object for consistent test data.
 * 3. Uses `beforeEach` to reset the store state and clear mock calls before each test.
 * 4. Tests `fetchBookmarks`: asserts API call and state update.
 * 5. Tests `addBookmark`: asserts API call and state update with new bookmark.
 * 6. Tests `updateBookmark`: asserts API call and state update for an existing bookmark.
 * 7. Tests `deleteBookmark`: asserts API call and state update (bookmark removal).
 * 8. Tests `incrementClickCount`: asserts API call and optimistic state update for click count.
 * 9. Tests error handling during `fetchBookmarks`.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '../api';
import { useBookmarkStore } from '../stores/bookmarkStore';

// Mock the entire API module
vi.mock('../api');

describe('Bookmark Store', () => {
  // The mock bookmark no longer needs userId
  const mockBookmark = {
    id: 'test-bookmark-id',
    url: 'https://example.com',
    title: 'Test Bookmark',
    folderId: undefined, // Changed from null to undefined based on TypeScript error
    clickCount: 0,
    isHidden: false,
    createdAt: new Date(), // Changed from string to Date object
    updatedAt: new Date(), // Changed from string to Date object
  };

  beforeEach(() => {
    // Reset store state and mock calls before each test
    useBookmarkStore.setState({
      bookmarks: [],
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('should fetch bookmarks', async () => {
    const mockBookmarks = [mockBookmark];
    (api.getBookmarks as any).mockResolvedValue(mockBookmarks);

    const store = useBookmarkStore.getState();
    // CORRECTED: Call fetchBookmarks without userId
    await store.fetchBookmarks();

    // CORRECTED: Expect getBookmarks to be called with no arguments
    expect(api.getBookmarks).toHaveBeenCalledWith();
    expect(useBookmarkStore.getState().bookmarks).toEqual(mockBookmarks);
  });

  it('should add a bookmark', async () => {
    (api.createBookmark as any).mockResolvedValue(mockBookmark);

    const store = useBookmarkStore.getState();
    // CORRECTED: Call addBookmark without userId
    await store.addBookmark({
      url: mockBookmark.url,
      title: mockBookmark.title,
    });

    expect(api.createBookmark).toHaveBeenCalled();
    expect(useBookmarkStore.getState().bookmarks).toContainEqual(mockBookmark);
  });

  it('should update a bookmark', async () => {
    const updatedBookmark = { ...mockBookmark, title: 'Updated Title' };
    // IMPORTANT: The mock must return the updated object for the test to pass
    (api.updateBookmark as any).mockResolvedValue(updatedBookmark);

    useBookmarkStore.setState({ bookmarks: [mockBookmark] });
    const store = useBookmarkStore.getState();

    // CORRECTED: Call updateBookmark without userId
    await store.updateBookmark(mockBookmark.id, { title: 'Updated Title' });

    expect(api.updateBookmark).toHaveBeenCalled();
    expect(useBookmarkStore.getState().bookmarks[0].title).toBe('Updated Title');
  });

  it('should delete a bookmark', async () => {
    // IMPORTANT: The mock must resolve to indicate success
    (api.deleteBookmark as any).mockResolvedValue(undefined);

    useBookmarkStore.setState({ bookmarks: [mockBookmark] });
    const store = useBookmarkStore.getState();

    // CORRECTED: Call deleteBookmark without userId
    await store.deleteBookmark(mockBookmark.id);

    expect(api.deleteBookmark).toHaveBeenCalled();
    expect(useBookmarkStore.getState().bookmarks).toHaveLength(0);
  });

  it('should increment bookmark click count', async () => {
    // IMPORTANT: Mock the optimistic update behavior of the store
    // No need to mock the api call here as the store updates the state directly

    useBookmarkStore.setState({ bookmarks: [mockBookmark] });
    const store = useBookmarkStore.getState();

    // CORRECTED: Call incrementClickCount without userId
    await store.incrementClickCount(mockBookmark.id);

    expect(api.incrementBookmarkClicks).toHaveBeenCalled();
    expect(useBookmarkStore.getState().bookmarks[0].clickCount).toBe(1);
  });

  it('should handle errors when fetching bookmarks', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { /* no-op */ return undefined; });
    const error = new Error('Failed to fetch');
    (api.getBookmarks as any).mockRejectedValue(error);

    const store = useBookmarkStore.getState();
    await store.fetchBookmarks();

    expect(useBookmarkStore.getState().error).toBe('Failed to fetch bookmarks: Failed to fetch');
    consoleErrorSpy.mockRestore();
  });
});
