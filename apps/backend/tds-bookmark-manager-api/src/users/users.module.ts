/**
 * users.module.ts
 *
 * Purpose:
 * - Defines the Users module for the API.
 *
 * Logic Overview:
 * - Integrates the `UserEntity` with TypeORM.
 * - Declares `UsersController` to handle user-related requests.
 * - Provides `UsersService` for business logic and data access.
 * - Exports `UsersService` to be used by other modules.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * NestJS module for managing user-related functionalities.
 * This module encapsulates the user entity, controller, and service.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]) // Registers the UserEntity with TypeORM
  ],
  controllers: [UsersController], // Registers UsersController to handle incoming requests
  providers: [UsersService], // Provides UsersService for dependency injection
  exports: [UsersService], // Exports UsersService to be available for other modules
})
export class UsersModule {}
