import type { BookmarkType, FolderType as Folder } from '../api/types';
import { CreateFolderDto, UpdateFolderDto } from '@tds/tds-bm-common';

import { api } from '../api';
import { create } from 'zustand';
import { useBookmarkStore } from './bookmarkStore';

interface FolderState {
  folders: Folder[];
  loading: boolean;
  error: string | null;
  
  // Folders
  fetchFolders: () => Promise<void>;
  addFolder: (folder: CreateFolderDto) => Promise<void>;
  updateFolder: (folderId: string, folder: UpdateFolderDto) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
}

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  loading: false,
  error: null,
  
  // --- Folders implementation ---
  fetchFolders: async () => {
    set({ loading: true, error: null });
    try {
      const folders = await api.getFolders();
      
      useBookmarkStore.getState().upsertBookmarks(folders);

      set({ folders: folders, loading: false });
    } catch (error) {
      console.error('Error fetching folders:', error);
      set({ error: 'Failed to fetch folders', loading: false });
    }
  },
  addFolder: async (folder: CreateFolderDto) => {
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
  updateFolder: async (folderId, folder) => {
    try {
      const updatedFolder = await api.updateFolder(folderId, folder);
      set((state) => ({
        folders: state.folders.map(f =>
          f.id === folderId ? updatedFolder : f
        ),
      }));
    } catch (error) {
      console.error('Error updating folder:', error);
      set({ error: 'Failed to update folder' });
      throw error;
    }
  },
  deleteFolder: async (folderId) => {
    try {
      await api.deleteFolder(folderId);
      const { bookmarks, upsertBookmarks } = useBookmarkStore.getState();
      const bookmarksToUpdate = bookmarks
        .filter(b => b.folderId === folderId)
        .map(b => ({ ...b, folderId: undefined }));
      upsertBookmarks(bookmarksToUpdate);

      set((state) => ({
        folders: state.folders.filter(f => f.id !== folderId),
        // OPTIONAL: You might need to refetch bookmarks here if some were in the deleted folder
      }));
    } catch (error) {
      console.error('Error deleting folder:', error);
      set({ error: 'Failed to delete folder' });
      throw error;
    }
  },
}));