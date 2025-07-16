/**
 * webhook.module.ts
 *
 * Purpose:
 * - Defines the Webhook module for the API.
 *
 * Logic Overview:
 * - Integrates `AuthModule` and `BookmarksModule` to support webhook functionalities.
 * - Registers `BookmarkEntity` with TypeORM for direct service access.
 * - Declares `WebhookController` to handle incoming webhook requests.
 * - Provides `BookmarksService` as a dependency for the controller.
 *
 * Last Updated:
 * 2025-07-16 by AI Assistant
 */

import { AuthModule } from '../auth/auth.module';
import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';
import { BookmarksModule } from '../bookmarks/bookmarks.module';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';

/**
 * NestJS module for handling webhook functionalities.
 * This module provides the necessary components for external services to interact
 * with the bookmark manager via webhooks.
 */
@Module({
  imports: [
    AuthModule, // Required for API key authentication
    BookmarksModule, // Provides bookmark-related services
    TypeOrmModule.forFeature([BookmarkEntity]) // Registers BookmarkEntity for direct repository access within this module
  ],
  controllers: [WebhookController], // Registers WebhookController to handle incoming webhook requests
  providers: [BookmarksService], // BookmarksService is needed by WebhookController
})
export class WebhookModule {}
