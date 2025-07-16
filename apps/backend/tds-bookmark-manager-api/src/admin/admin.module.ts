/**
 * admin.module.ts
 *
 * Purpose:
 * - Defines the Admin module for the API.
 *
 * Logic Overview:
 * - Imports `UsersModule` to provide access to `UsersService` for administrative operations.
 * - Declares `AdminController` to handle admin-specific requests.
 *
 * Last Updated:
 * 2025-07-16 by AI Assistant
 */

import { AdminController } from './admin.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module'; // Import UsersModule to use UsersService

/**
 * NestJS module for administrative functionalities.
 * This module provides endpoints and services for managing users and other admin-specific tasks.
 */
@Module({
  imports: [
    UsersModule // Make services from UsersModule available for injection in AdminController
  ],
  controllers: [AdminController], // Registers AdminController to handle incoming requests
})
export class AdminModule {}
