/**
 * statistics.service.ts
 *
 * Purpose:
 * - Provides business logic for retrieving application-wide statistics.
 *
 * Logic Overview:
 * - Gathers data on total users, total bookmarks, total clicks, and top users by bookmark/click count.
 * - Interacts directly with `UserEntity` and `BookmarkEntity` repositories using TypeORM's QueryBuilder.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';

/**
 * Service responsible for generating various statistics about the application's usage.
 * This includes global metrics and insights into user activity.
 */
@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        @InjectRepository(BookmarkEntity)
        private readonly bookmarksRepository: Repository<BookmarkEntity>,
    ) {}

    /**
     * Retrieves a comprehensive set of statistics for the administration panel.
     * Includes total users, total bookmarks, total clicks, average bookmarks per user,
     * and a list of top users by bookmark and click count.
     * @returns {Promise<object>} An object containing various statistics.
     */
    async getAdminStatistics() {
        const totalUsers = await this.usersRepository.count();
        const totalBookmarks = await this.bookmarksRepository.count();

        const totalClicksResult = await this.bookmarksRepository
            .createQueryBuilder('bookmark')
            .select('SUM(bookmark.clickCount)', 'totalClicks')
            .getRawOne();

        const totalClicks = parseInt(totalClicksResult.totalClicks, 10) || 0;

        const topUsers = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoin('user.bookmarks', 'bookmark')
            .select('user.email', 'email')
            .addSelect('COUNT(bookmark.id)', 'bookmarkCount')
            .addSelect('SUM(bookmark.clickCount)', 'clickCount')
            .groupBy('user.email')
            .orderBy('"bookmarkCount"', 'DESC')
            .limit(5)
            .getRawMany();

        return {
            totalUsers,
            totalBookmarks,
            totalClicks,
            avgBookmarksPerUser: totalUsers > 0 ? totalBookmarks / totalUsers : 0,
            topUsers: topUsers.map(u => ({...u, bookmarkCount: parseInt(u.bookmarkCount), clickCount: parseInt(u.clickCount) || 0 })),
        };
    }
}
