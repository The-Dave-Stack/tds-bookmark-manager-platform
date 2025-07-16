/**
 * statistics.module.ts
 *
 * Purpose:
 * - Defines the Statistics module for the API.
 *
 * Logic Overview:
 * - Integrates `UserEntity` and `BookmarkEntity` with TypeORM for data access.
 * - Declares `StatisticsController` to handle statistics-related requests.
 * - Provides `StatisticsService` for business logic related to statistics generation.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';
import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';

/**
 * NestJS module for managing application statistics.
 * This module provides the necessary components to gather and expose various metrics.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, BookmarkEntity]) // Registers User and Bookmark entities for repository access
  ],
  controllers: [StatisticsController], // Registers StatisticsController to handle incoming requests
  providers: [StatisticsService] // Provides StatisticsService for dependency injection
})
export class StatisticsModule {}
