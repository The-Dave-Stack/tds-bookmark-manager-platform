export interface Bookmark {
  id: string;
  url: string;
  title: string;
  folderId: string | undefined;
  faviconUrl?: string;
  clickCount: number;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}