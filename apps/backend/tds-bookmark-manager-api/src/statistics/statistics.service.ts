import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        @InjectRepository(BookmarkEntity)
        private readonly bookmarksRepository: Repository<BookmarkEntity>,
    ) {}

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