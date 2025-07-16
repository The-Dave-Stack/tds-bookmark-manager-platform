/**
 * folders.module.ts
 *
 * Purpose:
 * - Defines the Folders module for the API.
 *
 * Logic Overview:
 * - Integrates `FolderEntity` and `BookmarkEntity` with TypeORM.
 * - Declares `FoldersController` to handle folder-related requests.
 * - Provides `FoldersService` for business logic and data access.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';
import { FolderEntity } from './entities/folder.entity';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * NestJS module for managing folder-related functionalities.
 * This module encapsulates the folder entity, controller, and service,
 * and also includes the bookmark entity for operations that affect bookmarks.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([FolderEntity, BookmarkEntity]) // Registers FolderEntity and BookmarkEntity with TypeORM
  ],
  controllers: [FoldersController], // Registers FoldersController to handle incoming requests
  providers: [FoldersService], // Provides FoldersService for dependency injection
})
export class FoldersModule {}
