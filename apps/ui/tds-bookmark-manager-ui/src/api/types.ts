import type { Bookmark, Folder, User } from "@tds/tds-bm-common";

import { DateRange } from "../components/statistics/DateRangeSelector";

export interface UserType extends User {
  webhookUrl?: string;
}

export interface BookmarkType extends Bookmark {
  userId: string;
}

export interface FolderType extends Folder {
  userId: string;  
  bookmarkCount: number;
}

export interface ApiInterface {
  // System check
  checkAdminExists(): Promise<boolean>;
  setupAdmin(email: string, password: string, firstName: string, lastName: string): Promise<UserType>;
  // Auth
  login(email: string, password: string): Promise<UserType>;
  register(email: string, password: string, firstName: string, lastName: string, isAdmin?: boolean): Promise<UserType>;
  updateProfile(userId: string, data: Partial<UserType>): Promise<UserType>;
  // User Management (Admin)
  getUsers(): Promise<UserType[]>;
  updateUserRole(userId: string, role: 'user' | 'admin'): Promise<UserType>;
  // Statistics
  getAdminStatistics(dateRange: DateRange): Promise<{
    totalUsers: number;
    totalBookmarks: number;
    totalClicks: number;
    avgBookmarksPerUser: number;
    avgClicksPerUser: number;
    topUsers: Array<{
      email: string;
      bookmarkCount: number;
      clickCount: number;
    }>;
  }>;
  // Bookmarks
  getBookmarks(userId: string): Promise<BookmarkType[]>;
  createBookmark(userId: string, data: Partial<BookmarkType>): Promise<BookmarkType>;
  updateBookmark(userId: string, bookmarkId: string, data: Partial<BookmarkType>): Promise<BookmarkType>;
  deleteBookmark(userId: string, bookmarkId: string): Promise<void>;
  incrementBookmarkClicks(userId: string, bookmarkId: string): Promise<BookmarkType>;
  // Folders
  getFolders(userId: string): Promise<FolderType[]>;
  createFolder(userId: string, parentId: string | null, data?: Partial<FolderType>): Promise<FolderType>;
  updateFolder(userId: string, folderId: string, parentId: string | null, data?: Partial<FolderType>): Promise<FolderType>;
  deleteFolder(userId: string, folderId: string): Promise<void>;
}