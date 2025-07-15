/**
 * folder.entity.ts
 *
 * Purpose:
 * - Defines the Folder database entity and its mapping to the `folders` table.
 *
 * Logic Overview:
 * - Represents the folder data model, including name, potential parent,
 *   and relationships with `UserEntity` and `BookmarkEntity`.
 * - Enforces uniqueness constraint for folder names within the same user and parent.
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
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import type { BookmarkEntity } from '../../bookmarks/entities/bookmark.entity';
import type { UserEntity } from '../../users/entities/user.entity';

/**
 * Represents a folder record in the database.
 * This entity maps to the `folders` table and defines the schema for folder data.
 */
@Entity({ name: 'folders' })
@Unique(['user', 'name', 'parentId']) // A user cannot have two folders with the same name within the same parent.
export class FolderEntity {
  /**
   * The unique identifier (UUID) for the folder.
   * This is the primary key for the `folders` table.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * The name of the folder.
   */
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  /**
   * The ID of the parent folder. Nullable for top-level folders.
   * This column is for future use to enable nested folders.
   */
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId?: string;

  /**
   * Timestamp when the folder record was created.
   * Automatically set on creation.
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /**
   * Timestamp when the folder record was last updated.
   * Automatically updated on each entity save.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // --- RELATIONSHIPS ---

  /**
   * Many-to-One relationship with `UserEntity`.
   * Represents the user who owns this folder.
   * If a user is deleted, their folders are also deleted (`CASCADE`).
   */
  @ManyToOne('UserEntity', (user: UserEntity) => user.folders, {
    onDelete: 'CASCADE', // If a user is deleted, their folders are also deleted.
    nullable: false, // A folder must always belong to a user.
  })
  @JoinColumn({ name: 'user_id' }) // Specifies the foreign key column name in the DB.
  user!: UserEntity;

  /**
   * One-to-Many relationship with `BookmarkEntity`.
   * Represents the bookmarks contained within this folder.
   */
  @OneToMany('BookmarkEntity', (bookmark: BookmarkEntity) => bookmark.folder)
  bookmarks?: BookmarkEntity[];
}
