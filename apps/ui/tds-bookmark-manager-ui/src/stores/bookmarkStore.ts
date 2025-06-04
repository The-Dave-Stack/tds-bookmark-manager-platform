import { create } from 'zustand';
import { api } from '../api/apiService';
import type { Bookmark, Folder } from '../api/types';

interface BookmarkState {
  bookmarks: Bookmark[];
  folders: Folder[];
  loading: boolean;
  error: string | null;
  
  fetchBookmarks: (userId: string) => Promise<void>;
  addBookmark: (userId: string, bookmark: Omit<Bookmark, 'id' | 'userId' | 'clickCount' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBookmark: (userId: string, id: string, bookmark: Partial<Bookmark>) => Promise<void>;
  deleteBookmark: (userId: string, id: string) => Promise<void>;
  incrementClickCount: (userId: string, id: string) => Promise<void>;
  
  fetchFolders: (userId: string) => Promise<void>;
  addFolder: (userId: string, name: string, parentId: string | null) => Promise<void>;
  updateFolder: (userId: string, id: string, name: string, parentId: string | null) => Promise<void>;
  deleteFolder: (userId: string, id: string) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
  bookmarks: [],
  folders: [],
  loading: false,
  error: null,
  
  fetchBookmarks: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const bookmarks = await api.getBookmarks(userId);
      set({ bookmarks, loading: false });
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      set({ error: `Failed to fetch bookmarks: ${(error as Error).message}`, loading: false });
    }
  },
  
  addBookmark: async (userId: string, bookmark) => {
    set({ loading: true, error: null });
    try {
      const newBookmark = await api.createBookmark(userId, bookmark);
      set((state) => ({ 
        bookmarks: [...state.bookmarks, newBookmark],
        loading: false 
      }));
    } catch (error) {
      console.error('Error adding bookmark:', error);
      set({ error: 'Failed to add bookmark', loading: false });
    }
  },
  
  updateBookmark: async (userId: string, id: string, bookmark) => {
    set({ loading: true, error: null });
    try {
      const updatedBookmark = await api.updateBookmark(userId, id, bookmark);
      set((state) => ({
        bookmarks: state.bookmarks.map(b => 
          b.id === id ? updatedBookmark : b
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating bookmark:', error);
      set({ error: 'Failed to update bookmark', loading: false });
    }
  },
  
  deleteBookmark: async (userId: string, id: string) => {
    set({ loading: true, error: null });
    try {
      await api.deleteBookmark(userId, id);
      set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      set({ error: 'Failed to delete bookmark', loading: false });
    }
  },
  
  incrementClickCount: async (userId: string, id: string) => {
    try {
      const updatedBookmark = await api.incrementBookmarkClicks(userId, id);
      set((state) => ({
        bookmarks: state.bookmarks.map(b =>
          b.id === id ? updatedBookmark : b
        )
      }));
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  },
  
  fetchFolders: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const folders = await api.getFolders(userId);
      set({ folders, loading: false });
    } catch (error) {
      console.error('Error fetching folders:', error);
      set({ error: 'Failed to fetch folders', loading: false });
    }
  },
  
  addFolder: async (userId: string, name: string, parentId: string | null) => {
    set({ loading: true, error: null });
    try {
      const newFolder = await api.createFolder(userId, name, parentId);
      set((state) => ({
        folders: [...state.folders, newFolder],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding folder:', error);
      set({ error: 'Failed to add folder', loading: false });
    }
  },
  
  updateFolder: async (userId: string, id: string, name: string, parentId: string | null) => {
    set({ loading: true, error: null });
    try {
      const updatedFolder = await api.updateFolder(userId, id, name, parentId);
      set((state) => ({
        folders: state.folders.map(f =>
          f.id === id ? updatedFolder : f
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating folder:', error);
      set({ error: 'Failed to update folder', loading: false });
    }
  },
  
  deleteFolder: async (userId: string, id: string) => {
    set({ loading: true, error: null });
    try {
      await api.deleteFolder(userId, id);
      set((state) => ({
        folders: state.folders.filter(f => f.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting folder:', error);
      set({ error: 'Failed to delete folder', loading: false });
    }
  },
}));