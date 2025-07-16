/**
 * user.entity.ts
 *
 * Purpose:
 * - Defines the User database entity and its mapping to the `users` table.
 *
 * Logic Overview:
 * - Represents the user data model, including authentication details, personal information,
 *   roles, and relationships with other entities like folders and bookmarks.
 * - Uses TypeORM decorators for database mapping and `class-transformer` for serialization control.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role, UserWithoutPassword } from '@tds/tds-bm-common';

import type { BookmarkEntity } from '../../bookmarks/entities/bookmark.entity';
import { Exclude } from 'class-transformer';
import type { FolderEntity } from '../../folders/entities/folder.entity';

/**
 * Represents a user record in the database.
 * This entity maps to the `users` table and defines the schema for user data.
 */
@Entity({ name: 'users' })
export class UserEntity implements UserWithoutPassword {
  /**
   * The unique identifier (UUID) for the user.
   * This is the primary key for the `users` table.
   */
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  /**
   * The user's chosen username.
   */
  @Column({ type: 'varchar', length: 255 })
  username!: string;

  /**
   * The hashed password of the user.
   * This field is excluded from serialization to prevent sensitive data exposure.
   */
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  @Exclude()
  passwordHash!: string;

  /**
   * Token used for password reset functionality.
   * This field is excluded from serialization for security.
   */
  @Column({ name: 'password_reset_token', type: 'varchar', length: 255, nullable: true })
  @Exclude() // Always exclude sensitive tokens from serialization
  passwordResetToken?: string;

  /**
   * Expiration timestamp for the password reset token.
   * This field is excluded from serialization.
   */
  @Column({ name: 'password_reset_expires', type: 'timestamp', nullable: true })
  @Exclude()
  passwordResetExpires?: Date;

  /**
   * The user's email address. Must be unique across all users.
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  /**
   * The first name of the user.
   */
  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName?: string;

  /**
   * The last name of the user.
   */
  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName?: string;

  /**
   * Boolean indicating if the user account is active.
   */
  @Column({ default: false, name: 'is_active' })
  isActive!: boolean;

  /**
   * Unique API token for webhook access. Nullable if not generated.
   */
  @Column({ name: 'api_token', type: 'varchar', length: 255, unique: true, nullable: true })
  apiToken?: string;

  /**
   * Timestamp when the user record was created.
   * Automatically set on creation.
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /**
   * Timestamp when the user record was last updated.
   * Automatically updated on each entity save.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  /**
   * Timestamp of the user's last successful login.
   * Nullable if the user has not logged in yet.
   */
  @Column({ name: 'last_login', nullable: true })
  lastLogin?: Date;

  /**
   * An array of roles assigned to the user (e.g., 'USER', 'ADMIN').
   * Defaults to ['USER'].
   */
  @Column({ type: 'text', array: true, default: ['USER'] })
  roles!: Role[];

  /**
   * One-to-many relationship with `FolderEntity`.
   * Represents the folders created by this user.
   */
  @OneToMany('FolderEntity', (folder: FolderEntity) => folder.user)
  folders?: FolderEntity[];

  /**
   * One-to-many relationship with `BookmarkEntity`.
   * Represents the bookmarks created by this user.
   */
  @OneToMany('BookmarkEntity', (bookmark: BookmarkEntity) => bookmark.user)
  bookmarks?: BookmarkEntity[];
}
