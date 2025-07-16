/**
 * bookmarks.controller.ts
 *
 * Purpose:
 * - Handles incoming HTTP requests related to bookmark management.
 *
 * Logic Overview:
 * - Provides RESTful API endpoints for creating, retrieving, updating, and deleting bookmarks.
 * - Includes endpoints for searching, sorting, and tracking bookmark clicks.
 * - Utilizes `JwtAuthGuard` for authentication and `@User` decorator to extract user information.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CreateBookmarkDto, UpdateBookmarkDto } from '@tds/tds-bm-common';
import { PinoLogger } from 'nestjs-pino';

/**
 * Controller for handling bookmark-related API requests.
 * All endpoints in this controller are protected by `JwtAuthGuard`.
 */
@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService, private readonly logger: PinoLogger) {
    this.logger.setContext(BookmarksController.name);
  }

  /**
   * POST /api/v1/bookmarks
   * Creates a new bookmark for the authenticated user.
   * @param {CreateBookmarkDto} createBookmarkDto - The data for creating the bookmark.
   * @param {UserEntity} user - The authenticated user object.
   * @returns {Promise<BookmarkEntity>} The newly created bookmark.
   */
  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto, @User() user: UserEntity) {
    return this.bookmarksService.create(createBookmarkDto, user);
  }

  /**
   * GET /api/v1/bookmarks
   * Retrieves all bookmarks for the authenticated user, with optional search and sorting.
   * @param {UserEntity} user - The authenticated user object.
   * @param {string} [search] - Optional search term to filter bookmarks by title or URL.
   * @param {'createdAt' | 'title' | 'clickCount'} [sortBy] - Optional field to sort bookmarks by.
   * @returns {Promise<BookmarkEntity[]>} An array of bookmark entities.
   */
  @Get()
  findAll(
    @User() user: UserEntity,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: 'createdAt' | 'title' | 'clickCount',
  ) {
    this.logger.debug(`Finding all bookmarks for user %o with search: ${search}, sortBy: ${sortBy}`, user);
    return this.bookmarksService.findAllByUser(user, search, sortBy);
  }

  /**
   * GET /api/v1/bookmarks/:id
   * Retrieves a single bookmark by its ID for the authenticated user.
   * @param {string} id - The UUID of the bookmark to retrieve.
   * @param {string} userId - The ID of the authenticated user (extracted from token).
   * @returns {Promise<BookmarkEntity>} The found bookmark entity.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string) {
    return this.bookmarksService.findOne(id, userId);
  }

  /**
   * PATCH /api/v1/bookmarks/:id
   * Updates an existing bookmark for the authenticated user.
   * @param {string} id - The UUID of the bookmark to update.
   * @param {string} userId - The ID of the authenticated user.
   * @param {UpdateBookmarkDto} updateBookmarkDto - The DTO containing the updated bookmark data.
   * @returns {Promise<BookmarkEntity>} The updated bookmark entity.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @User('id') userId: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(id, userId, updateBookmarkDto);
  }

  /**
   * DELETE /api/v1/bookmarks/:id
   * Deletes a bookmark for the authenticated user.
   * Returns HTTP 204 No Content on successful deletion.
   * @param {string} id - The UUID of the bookmark to delete.
   * @param {string} userId - The ID of the authenticated user.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string) {
    return this.bookmarksService.remove(id, userId);
  }

  /**
   * POST /api/v1/bookmarks/:id/click
   * Increments the click count for a specific bookmark.
   * Returns HTTP 204 No Content on successful update.
   * @param {string} id - The UUID of the bookmark whose click count is to be incremented.
   * @param {string} userId - The ID of the authenticated user.
   * @returns {Promise<void>}
   */
  @Post(':id/click')
  @HttpCode(HttpStatus.NO_CONTENT)
  incrementClick(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string) {
    return this.bookmarksService.incrementClickCount(id, userId);
  }
}
