/**
 * bookmark.entity.ts
 *
 * Purpose:
 * - Defines the Bookmark database entity and its mapping to the `bookmarks` table.
 *
 * Logic Overview:
 * - Represents the bookmark data model, including URL, title, favicon, click tracking,
 *   visibility status, and relationships with `UserEntity` and `FolderEntity`.
 * - Uses TypeORM decorators for database mapping and relationship management.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { FolderEntity } from '../../folders/entities/folder.entity';
import type { UserEntity } from '../../users/entities/user.entity';

/**
 * Represents a bookmark record in the database.
 * This entity maps to the `bookmarks` table and defines the schema for bookmark data.
 */
@Entity({ name: 'bookmarks' })
export class BookmarkEntity {
  /**
   * The unique identifier (UUID) for the bookmark.
   * This is the primary key for the `bookmarks` table.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * The URL of the bookmarked page.
   */
  @Column({ type: 'text' })
  url!: string;

  /**
   * The title of the bookmarked page.
   */
  @Column({ type: 'text' })
  title!: string;

  /**
   * Optional URL of the favicon for the bookmarked page.
   */
  @Column({ name: 'favicon_url', type: 'text', nullable: true })
  faviconUrl?: string;

  /**
   * The number of times the bookmark has been clicked. Defaults to 0.
   */
  @Column({ name: 'click_count', type: 'int', default: 0 })
  clickCount!: number;

  /**
   * The timestamp when the bookmark was last clicked. Nullable.
   */
  @Column({ name: 'last_clicked_at', nullable: true })
  lastClickedAt?: Date;

  /**
   * Boolean indicating if the bookmark is hidden from the main view. Defaults to false.
   */
  @Column({ name: 'is_hidden', type: 'boolean', default: false })
  isHidden!: boolean;

  /**
   * Timestamp when the bookmark record was created.
   * Automatically set on creation.
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /**
   * Timestamp when the bookmark record was last updated.
   * Automatically updated on each entity save.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // --- RELATIONSHIPS ---

  /**
   * Many-to-One relationship with `UserEntity`.
   * Represents the user who owns this bookmark.
   * If a user is deleted, their bookmarks are also deleted (`CASCADE`).
   */
  @ManyToOne('UserEntity', (user: UserEntity) => user.bookmarks, {
    onDelete: 'CASCADE', // If a user is deleted, their bookmarks are also deleted.
    nullable: false, // A bookmark must always belong to a user.
  })
  @JoinColumn({ name: 'user_id' }) // Specifies the foreign key column in the bookmarks table
  user!: UserEntity;

  /**
   * Many-to-One relationship with `FolderEntity`.
   * Represents the folder this bookmark belongs to.
   * If a folder is deleted, the `folder_id` in the bookmark is set to NULL (`SET NULL`).
   * A bookmark can exist without a folder (in the root).
   */
  @ManyToOne('FolderEntity', (folder: FolderEntity) => folder.bookmarks, {
    onDelete: 'SET NULL', // If a folder is deleted, set folder_id to NULL.
    nullable: true, // A bookmark can exist without a folder (in the root).
  })
  @JoinColumn({ name: 'folder_id' }) // Specifies the foreign key column in the bookmarks table
  folder?: FolderEntity;
}
