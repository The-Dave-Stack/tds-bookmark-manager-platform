/**
 * folder.interface.ts
 *
 * Purpose:
 * - Defines the structure for a Folder object.
 *
 * Logic Overview:
 * - Interface for consistent data representation across the application, including nested bookmarks.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Bookmark } from "./index.js";

/**
 * Represents a folder for organizing bookmarks in the system.
 */
export interface Folder {
  /**
   * Unique identifier of the folder.
   */
  id: string;
  /**
   * The name of the folder.
   */
  name: string;
  /**
   * Optional ID of the parent folder. Null if it's a top-level folder.
   * (Note: MVP specifies single-level folders, so this might always be null in practice for now).
   */
  parentId: string | null;
  /**
   * Timestamp when the folder was created.
   */
  createdAt?: Date;
  /**
   * Timestamp when the folder was last updated.
   */
  updatedAt?: Date;
  /**
   * Optional array of Bookmark objects contained within this folder.
   */
  bookmarks?: Bookmark[];
}
