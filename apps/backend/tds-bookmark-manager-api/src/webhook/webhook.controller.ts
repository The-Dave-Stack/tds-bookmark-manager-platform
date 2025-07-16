/**
 * webhook.controller.ts
 *
 * Purpose:
 * - Handles incoming webhook requests for adding bookmarks.
 *
 * Logic Overview:
 * - Provides an endpoint that uses API key authentication to allow external services to create bookmarks for a user.
 * - Validates the incoming query parameters and delegates bookmark creation to the `BookmarksService`.
 *
 * Last Updated:
 * 2025-07-16 by AI Assistant
 */

import { Controller, Post, UseGuards, Query, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CreateBookmarkDto } from '@tds/tds-bm-common';

/**
 * Controller for handling webhook-related API requests.
 * This controller provides endpoints for external services to interact with the bookmark manager.
 */
@Controller('webhook')
export class WebhookController {
    constructor(private readonly bookmarksService: BookmarksService) {}

    /**
     * POST /api/v1/webhook/bookmark
     * Handles incoming webhook requests to create a new bookmark.
     * This endpoint is protected by the 'api-key' authentication strategy.
     *
     * @param {UserEntity} user - The authenticated user object, injected after API key validation.
     * @param {CreateBookmarkDto} query - The query parameters containing the bookmark URL and optional title.
     * @returns {Promise<BookmarkEntity>} The newly created bookmark entity.
     */
    @Post('bookmark')
    @UseGuards(AuthGuard('api-key'))
    addBookmarkFromWebhook(
        @User() user: UserEntity,
        @Query(new ValidationPipe({ transform: true })) query: CreateBookmarkDto,
    ) {
        // The user object is injected after being validated by ApiKeyStrategy
        // The query object contains the 'url' and optional 'title'
        return this.bookmarksService.create(query, user);
    }
}
