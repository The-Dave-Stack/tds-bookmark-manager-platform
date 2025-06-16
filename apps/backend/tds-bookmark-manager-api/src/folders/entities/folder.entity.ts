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

@Entity({ name: 'folders' })
@Unique(['user', 'name', 'parentId']) // A user cannot have two folders with the same name within the same parent.
export class FolderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  // This column is for future use to enable nested folders.
  // It will reference the 'id' of the parent FolderEntity.
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // --- RELATIONSHIPS ---

  // Many-to-One relationship with User. Many folders can belong to one user.
  @ManyToOne(() => UserEntity, (user) => user.folders, {
    onDelete: 'CASCADE', // If a user is deleted, their folders are also deleted.
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' }) // Specifies the foreign key column name in the DB.
  user!: UserEntity;

  // One-to-Many relationship with Bookmark. One folder can contain many bookmarks.
  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.folder)
  bookmarks?: BookmarkEntity[];
}
