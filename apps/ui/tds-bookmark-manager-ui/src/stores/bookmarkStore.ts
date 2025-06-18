import type { Bookmark, Folder } from '../api/types';
import { api } from '../api';
import { create } from 'zustand';
import { CreateBookmarkDto, CreateFolderDto, UpdateBookmarkDto, UpdateFolderDto } from '@tds/tds-bm-common';

interface BookmarkState {
  bookmarks: Bookmark[];
  folders: Folder[];
  loading: boolean;
  error: string | null;
  
  // Bookmarks
  fetchBookmarks: () => Promise<void>;
  addBookmark: (bookmark: CreateBookmarkDto) => Promise<void>;
  updateBookmark: (id: string, bookmark: UpdateBookmarkDto) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  incrementClickCount: (id: string) => Promise<void>;
  
  // Folders
  fetchFolders: () => Promise<void>;
  addFolder: (folder: CreateFolderDto) => Promise<void>;
  updateFolder: (id: string, folder: UpdateFolderDto) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
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
  updateBookmark: async (id, bookmark) => {
    try {
      const updatedBookmark = await api.updateBookmark(id, bookmark);
      set((state) => ({
        bookmarks: state.bookmarks.map(b => 
          b.id === id ? updatedBookmark : b
        ),
      }));
    } catch (error) {
      console.error('Error updating bookmark:', error);
      set({ error: 'Failed to update bookmark' });
      throw error;
    }
  },
  deleteBookmark: async (id) => {
    try {
      await api.deleteBookmark(id);
      set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      set({ error: 'Failed to delete bookmark' });
      throw error;
    }
  },
  incrementClickCount: async (id: string) => {
    try {
      // This can be a fire-and-forget, but we'll await it for consistency
      await api.incrementBookmarkClicks(id);
      // Optimistically update the local state
      set((state) => ({
        bookmarks: state.bookmarks.map(b =>
          b.id === id ? { ...b, clickCount: b.clickCount + 1 } : b
        )
      }));
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  },
  
  // --- Folders implementation ---
  fetchFolders: async () => {
    set({ loading: true, error: null });
    try {
      const folders = await api.getFolders();
      set({ folders, loading: false });
    } catch (error) {
      console.error('Error fetching folders:', error);
      set({ error: 'Failed to fetch folders', loading: false });
    }
  },
  addFolder: async (folder) => {
    try {
      const newFolder = await api.createFolder(folder);
      set((state) => ({
        folders: [...state.folders, newFolder],
      }));
    } catch (error) {
      console.error('Error adding folder:', error);
      set({ error: 'Failed to add folder' });
      throw error;
    }
  },
  updateFolder: async (id, folder) => {
    try {
      const updatedFolder = await api.updateFolder(id, folder);
      set((state) => ({
        folders: state.folders.map(f =>
          f.id === id ? updatedFolder : f
        ),
      }));
    } catch (error) {
      console.error('Error updating folder:', error);
      set({ error: 'Failed to update folder' });
      throw error;
    }
  },
  deleteFolder: async (id) => {
    try {
      await api.deleteFolder(id);
      set((state) => ({
        folders: state.folders.filter(f => f.id !== id),
        // OPTIONAL: You might need to refetch bookmarks here if some were in the deleted folder
      }));
    } catch (error) {
      console.error('Error deleting folder:', error);
      set({ error: 'Failed to delete folder' });
      throw error;
    }
  },
}));