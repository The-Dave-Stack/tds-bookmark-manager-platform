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
