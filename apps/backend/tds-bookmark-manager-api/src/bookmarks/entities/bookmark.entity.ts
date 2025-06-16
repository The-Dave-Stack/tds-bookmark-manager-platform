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

@Entity({ name: 'bookmarks' })
export class BookmarkEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  url!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ name: 'favicon_url', type: 'text', nullable: true })
  faviconUrl?: string;

  @Column({ name: 'click_count', type: 'int', default: 0 })
  clickCount!: number;

  @Column({ name: 'last_clicked_at', nullable: true })
  lastClickedAt?: Date;

  @Column({ name: 'is_hidden', type: 'boolean', default: false })
  isHidden!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // --- RELATIONSHIPS ---

  // Many-to-One relationship with User. Many bookmarks can belong to one user.
  @ManyToOne('UserEntity', (user: UserEntity) => user.bookmarks, {
    onDelete: 'CASCADE', // If a user is deleted, their bookmarks are also deleted.
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  // Many-to-One relationship with Folder. Many bookmarks can belong to one folder.
  @ManyToOne('FolderEntity', (folder: FolderEntity) => folder.bookmarks, {
    onDelete: 'SET NULL', // If a folder is deleted, set folder_id to NULL.
    nullable: true, // A bookmark can exist without a folder (in the root).
  })
  @JoinColumn({ name: 'folder_id' })
  folder?: FolderEntity;
}
