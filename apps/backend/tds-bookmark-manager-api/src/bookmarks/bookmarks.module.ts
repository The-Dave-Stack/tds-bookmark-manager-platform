/**
 * bookmarks.module.ts
 *
 * Purpose:
 * - Defines the Bookmarks module for the API.
 *
 * Logic Overview:
 * - Integrates the `BookmarkEntity` with TypeORM.
 * - Declares `BookmarksController` to handle bookmark-related requests.
 * - Provides `BookmarksService` for business logic and data access.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { BookmarkEntity } from './entities/bookmark.entity';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * NestJS module for managing bookmark-related functionalities.
 * This module encapsulates the bookmark entity, controller, and service.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity]) // Registers the BookmarkEntity with TypeORM
  ],
  controllers: [BookmarksController], // Registers BookmarksController to handle incoming requests
  providers: [BookmarksService], // Provides BookmarksService for dependency injection
})
export class BookmarksModule {}
