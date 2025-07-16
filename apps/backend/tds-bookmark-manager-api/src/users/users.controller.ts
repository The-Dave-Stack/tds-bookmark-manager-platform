/**
 * users.controller.ts
 *
 * Purpose:
 * - Handles incoming HTTP requests related to user management.
 *
 * Logic Overview:
 * - Provides endpoints for checking admin existence and setting up the initial admin user.
 * - Interacts with the `UsersService` to perform business logic.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDto, User } from '@tds/tds-bm-common';

import { CacheInterceptor } from '@nestjs/cache-manager';
import { PinoLogger } from 'nestjs-pino';
import { UsersService } from './users.service';
import { SkipCsrfGuard } from '../auth/decorators/skip-csrf.decorator';

/**
 * Controller for handling user-related API requests.
 * Routes requests to the appropriate service methods.
 */
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private readonly logger: PinoLogger) {
    this.logger.setContext(UsersController.name);
  }

  /**
   * GET /api/v1/users/checkAdmins
   * Checks if there are any administrators registered in the system.
   * This endpoint is cached to reduce database load on frequent checks.
   * @returns {Promise<boolean>} True if at least one admin exists, false otherwise.
   */
  @Get('checkAdmins')
  @UseInterceptors(CacheInterceptor)
  async checkAdmins(): Promise<boolean> {
    return await this.usersService.hasAdmins();
  }

  /**
   * POST /api/v1/users/setupAdmin
   * Sets up the first administrator user. This endpoint is typically used during initial application setup.
   * It skips CSRF protection as it's an initial setup endpoint.
   * @param {CreateUserDto} createUserDto - The data for creating the admin user.
   * @returns {Promise<User>} The created admin user object.
   */
  @SkipCsrfGuard()
  @Post('setupAdmin')
  async setupAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(`Setup admin: %o`, createUserDto);
    return await this.usersService.setupAdmin(createUserDto);
  }
}
