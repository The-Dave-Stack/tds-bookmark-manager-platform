/**
 * folders.controller.ts
 *
 * Purpose:
 * - Handles incoming HTTP requests related to folder management.
 *
 * Logic Overview:
 * - Provides RESTful API endpoints for creating, retrieving, updating, and deleting folders.
 * - Utilizes `JwtAuthGuard` for authentication and `@User` decorator to extract user information.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from '@tds/tds-bm-common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { PinoLogger } from 'nestjs-pino';

/**
 * Controller for handling folder-related API requests.
 * All endpoints in this controller are protected by `JwtAuthGuard`.
 */
@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService, private readonly logger: PinoLogger) {
    this.logger.setContext(FoldersController.name);
  }

  /**
   * POST /api/v1/folders
   * Creates a new folder for the authenticated user.
   * @param {CreateFolderDto} createFolderDto - The data for creating the folder.
   * @param {UserEntity} user - The authenticated user object.
   * @returns {Promise<FolderEntity>} The newly created folder.
   */
  @Post()
  create(@Body() createFolderDto: CreateFolderDto, @User() user: UserEntity) {
    return this.foldersService.create(createFolderDto, user);
  }

  /**
   * GET /api/v1/folders
   * Retrieves all folders for the authenticated user, including a virtual "Unorganized" folder.
   * @param {UserEntity} user - The authenticated user object.
   * @returns {Promise<FolderEntity[]>} An array of folder entities.
   */
  @Get()
  findAll(@User() user: UserEntity) {
    this.logger.debug(`Finding all folders for user %o`, user);
    return this.foldersService.findAllByUser(user);
  }

  /**
   * GET /api/v1/folders/:id
   * Retrieves a single folder by its ID for the authenticated user.
   * @param {string} id - The UUID of the folder to retrieve.
   * @param {string} userId - The ID of the authenticated user.
   * @returns {Promise<FolderEntity>} The found folder entity.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string) {
    return this.foldersService.findOne(id, userId);
  }

  /**
   * PATCH /api/v1/folders/:id
   * Updates an existing folder for the authenticated user.
   * @param {string} id - The UUID of the folder to update.
   * @param {string} userId - The ID of the authenticated user.
   * @param {UpdateFolderDto} updateFolderDto - The DTO containing the updated folder data.
   * @returns {Promise<FolderEntity>} The updated folder entity.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @User('id') userId: string, 
    @Body() updateFolderDto: UpdateFolderDto
  ) {
    return this.foldersService.update(id, userId, updateFolderDto);
  }

  /**
   * DELETE /api/v1/folders/:id
   * Deletes a folder for the authenticated user.
   * Returns HTTP 204 No Content on successful deletion.
   * Bookmarks within the deleted folder are moved to the root.
   * @param {string} id - The UUID of the folder to delete.
   * @param {string} userId - The ID of the authenticated user.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string) {
    return this.foldersService.remove(id, userId);
  }
}
