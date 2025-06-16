import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role, UserWithoutPassword } from '@tds/tds-bm-common';

import type { BookmarkEntity } from '../../bookmarks/entities/bookmark.entity';
import { Exclude } from 'class-transformer';
import type { FolderEntity } from '../../folders/entities/folder.entity';

@Entity({ name: 'users' })
export class UserEntity implements UserWithoutPassword {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', length: 255 })
  username!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  @Exclude()
  passwordHash!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName?: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName?: string;

  @Column({ default: false, name: 'is_active' })
  isActive!: boolean;

  @Column({ name: 'api_token', type: 'varchar', length: 255, unique: true, nullable: true })
  apiToken?: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @Column({ name: 'last_login', nullable: true })
  lastLogin?: Date;

  @Column('simple-array')
  roles!: Role[];

  @OneToMany('FolderEntity', (folder: FolderEntity) => folder.user)
  folders?: FolderEntity[];

  @OneToMany('BookmarkEntity', (bookmark: BookmarkEntity) => bookmark.user)
  bookmarks?: BookmarkEntity[];
}
