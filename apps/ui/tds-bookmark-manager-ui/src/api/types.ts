import type { Bookmark, CreateBookmarkDto, CreateFolderDto, CreateUserDto, Folder, UpdateBookmarkDto, UpdateFolderDto, UpdateUserRoleDto, User, ForgotPasswordDto, ResetPasswordDto, TokenDto } from "@tds/tds-bm-common";

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
  // System
  checkAdminExists(): Promise<boolean>;
  setupAdmin(createUserDto: CreateUserDto): Promise<UserType>;

  // Auth
  login(email: string, password: string): Promise<UserType>;
  register(createUserDto: CreateUserDto): Promise<UserType>;
  updateProfile(userId: string, data: Partial<UserType>): Promise<UserType>;
  forgotPassword(data: ForgotPasswordDto): Promise<void>;
  resetPassword(data: ResetPasswordDto): Promise<TokenDto>;

  // Bookmarks
  getBookmarks(search?: string, sortBy?: string): Promise<BookmarkType[]>;
  createBookmark(data: CreateBookmarkDto): Promise<BookmarkType>;
  updateBookmark(bookmarkId: string, data: UpdateBookmarkDto): Promise<BookmarkType>;
  deleteBookmark(bookmarkId: string): Promise<void>;
  incrementBookmarkClicks(bookmarkId: string): Promise<void>;

  // Folders
  getFolders(): Promise<FolderType[]>;
  createFolder(data: CreateFolderDto): Promise<FolderType>;
  updateFolder(folderId: string, data: UpdateFolderDto): Promise<FolderType>;
  deleteFolder(folderId: string): Promise<void>;

  // Admin
  getUsers(): Promise<UserType[]>;
  updateUserRole(userId: string, data: UpdateUserRoleDto): Promise<UserType>;
  getAdminStatistics(dateRange: DateRange): Promise<any>;
}