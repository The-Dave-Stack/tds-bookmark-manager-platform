import { Bookmark } from "./index.js";

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  bookmarks?: Bookmark[];
}