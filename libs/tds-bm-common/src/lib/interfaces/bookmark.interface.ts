/**
 * bookmark.interface.ts
 *
 * Purpose:
 * - Defines the structure for a Bookmark object.
 *
 * Logic Overview:
 * - Interface for consistent data representation across the application.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

/**
 * Represents a bookmark in the system.
 */
export interface Bookmark {
  /**
   * Unique identifier of the bookmark.
   */
  id: string;
  /**
   * The URL of the bookmarked page.
   */
  url: string;
  /**
   * The title of the bookmarked page.
   */
  title: string;
  /**
   * Optional ID of the folder the bookmark belongs to. Undefined if in the root.
   */
  folderId: string | undefined;
  /**
   * Optional URL of the favicon for the bookmarked page.
   */
  faviconUrl?: string;
  /**
   * Number of times the bookmark has been clicked.
   */
  clickCount?: number;
  /**
   * Indicates if the bookmark is hidden from the main view.
   */
  isHidden: boolean;
  /**
   * Timestamp when the bookmark was created.
   */
  createdAt?: Date;
  /**
   * Timestamp when the bookmark was last updated.
   */
  updatedAt?: Date;
}
