import type { BookmarkType as Bookmark, FolderType } from '../api/types';
import { CreateBookmarkDto, UpdateBookmarkDto } from '@tds/tds-bm-common';

import { api } from '../api';
import { create } from 'zustand';

interface BookmarkState {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  
  // Bookmarks
  fetchBookmarks: () => Promise<void>;
  addBookmark: (bookmark: CreateBookmarkDto) => Promise<void>;
  updateBookmark: (bookmarkId: string, bookmark: UpdateBookmarkDto) => Promise<void>;
  deleteBookmark: (bookmarkId: string) => Promise<void>;
  incrementClickCount: (bookmarkId: string) => Promise<void>;
  upsertBookmarks: (bookmarksToUpsert: FolderType[]) => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  folders: [],
  loading: false,
  error: null,
  
  // --- Bookmarks implementation ---
  fetchBookmarks: async () => {
    set({ loading: true, error: null });
    try {
      const bookmarks = await api.getBookmarks();
      set({ bookmarks, loading: false });
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      set({ error: `Failed to fetch bookmarks: ${(error as Error).message}`, loading: false });
    }
  },
  addBookmark: async (bookmark) => {
    try {
      const newBookmark = await api.createBookmark(bookmark);
      set((state) => ({ 
        bookmarks: [...state.bookmarks, newBookmark],
      }));
    } catch (error) {
      console.error('Error adding bookmark:', error);
      set({ error: 'Failed to add bookmark' });
      throw error; // Re-throw to be caught in the component
    }
  },
  updateBookmark: async (bookmarkId, bookmark) => {
    try {
      const updatedBookmark = await api.updateBookmark(bookmarkId, bookmark);
      set((state) => ({
        bookmarks: state.bookmarks.map(b => 
          b.id === bookmarkId ? updatedBookmark : b
        ),
      }));
    } catch (error) {
      console.error('Error updating bookmark:', error);
      set({ error: 'Failed to update bookmark' });
      throw error;
    }
  },
  deleteBookmark: async (bookmarkId) => {
    try {
      await api.deleteBookmark(bookmarkId);
      set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.id !== bookmarkId),
      }));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      set({ error: 'Failed to delete bookmark' });
      throw error;
    }
  },
  incrementClickCount: async (bookmarkId: string) => {
    try {
      // This can be a fire-and-forget, but we'll await it for consistency
      await api.incrementBookmarkClicks(bookmarkId);
      // Optimistically update the local state
      set((state) => ({
        bookmarks: state.bookmarks.map(b =>
          b.id === bookmarkId ? { ...b, clickCount: b.clickCount || 0 + 1 } : b
        )
      }));
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  },
  upsertBookmarks: (folders) => {
    if (!folders || folders.length === 0) return;

    set((state) => {
      const existingBookmarksMap = new Map(state.bookmarks.map(b => [b.id, b]));
      
      folders.forEach(folder => {
        if (!folder.bookmarks || folder.bookmarks.length === 0) return;
        folder.bookmarks.forEach(bookmark => {
          existingBookmarksMap.set(bookmark.id, { ...bookmark, folderId: folder.id });
        });
      });

      return { bookmarks: Array.from(existingBookmarksMap.values()) };
    });
  },
}));