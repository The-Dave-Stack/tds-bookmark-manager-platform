import type { Bookmark, CreateUserDto, Folder, Role, User } from "@tds/tds-bm-common";

import { DateRange } from "../components/statistics/DateRangeSelector";

export interface UserType extends User {
  token?: string;
  webhookUrl?: string;
}

export interface BookmarkType extends Bookmark {
  userEmail: string;
}

export interface FolderType extends Folder {
  userEmail: string;
  bookmarkCount: number;
}

export interface ApiInterface {
  // System check
  checkAdminExists(): Promise<boolean>;
  setupAdmin(createUserDto: CreateUserDto): Promise<UserType>;
  // Auth
  login(email: string, password: string): Promise<UserType>;
  register(createUserDto: CreateUserDto): Promise<UserType>;
  updateProfile(email: string, data: Partial<UserType>): Promise<UserType>;
  // User Management (Admin)
  getUsers(): Promise<UserType[]>;
  updateUserRole(email: string, role: Role): Promise<UserType>;
  // Statistics
  // TODO: return statistic object
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
  getBookmarks(userEmail: string): Promise<BookmarkType[]>;
  createBookmark(userEmail: string, data: Partial<BookmarkType>): Promise<BookmarkType>;
  updateBookmark(userEmail: string, bookmarkId: string, data: Partial<BookmarkType>): Promise<BookmarkType>;
  deleteBookmark(userEmail: string, bookmarkId: string): Promise<void>;
  incrementBookmarkClicks(userEmail: string, bookmarkId: string): Promise<BookmarkType>;
  // Folders
  getFolders(userEmail: string): Promise<FolderType[]>;
  createFolder(userEmail: string, parentId: string | null, data?: Partial<FolderType>): Promise<FolderType>;
  updateFolder(userEmail: string, folderId: string, parentId: string | null, data?: Partial<FolderType>): Promise<FolderType>;
  deleteFolder(userEmail: string, folderId: string): Promise<void>;
}