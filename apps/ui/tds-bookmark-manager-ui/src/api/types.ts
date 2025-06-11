import { DateRange } from "../components/statistics/DateRangeSelector";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string; // Password might not be returned in all API calls
  role: 'user' | 'admin';
  apiToken?: string;
  webhookUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  url: string;
  title: string;
  faviconUrl?: string;
  folderId?: string;
  clickCount: number;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  bookmarkCount: number;
}

export interface ApiInterface {
  // System check
  checkAdminExists(): Promise<boolean>;
  setupAdmin(email: string, password: string, firstName: string, lastName: string): Promise<User>;
  // Auth
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string, firstName: string, lastName: string, isAdmin?: boolean): Promise<User>;
  updateProfile(userId: string, data: { firstName?: string; lastName?: string; password?: string }): Promise<User>;
  // User Management (Admin)
  getUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User>;
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
  getBookmarks(userId: string): Promise<Bookmark[]>;
  createBookmark(userId: string, data: Partial<Bookmark>): Promise<Bookmark>;
  updateBookmark(userId: string, bookmarkId: string, data: Partial<Bookmark>): Promise<Bookmark>;
  deleteBookmark(userId: string, bookmarkId: string): Promise<void>;
  incrementBookmarkClicks(userId: string, bookmarkId: string): Promise<Bookmark>;
  // Folders
  getFolders(userId: string): Promise<Folder[]>;
  createFolder(userId: string, parentId: string | null, data?: Partial<Folder>): Promise<Folder>;
  updateFolder(userId: string, folderId: string, parentId: string | null, data?: Partial<Folder>): Promise<Folder>;
  deleteFolder(userId: string, folderId: string): Promise<void>;
}