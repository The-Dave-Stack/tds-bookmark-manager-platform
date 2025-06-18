import { Test, TestingModule } from '@nestjs/testing';

import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';
import { StatisticsService } from './statistics.service';
import { UserEntity } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('StatisticsService', () => {
  let service: StatisticsService;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
  };

  // Mock repositories now include createQueryBuilder
  const mockUserRepo = {
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockBookmarkRepo = {
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: getRepositoryToken(UserEntity), useValue: mockUserRepo },
        { provide: getRepositoryToken(BookmarkEntity), useValue: mockBookmarkRepo },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should get admin statistics', async () => {
    // Arrange: Set up return values for the mocked methods
    mockUserRepo.count.mockResolvedValue(10);
    mockBookmarkRepo.count.mockResolvedValue(100);

    // Mock the results of the query builders
    (mockBookmarkRepo.createQueryBuilder().getRawOne as jest.Mock).mockResolvedValue({ totalClicks: '500' });
    (mockUserRepo.createQueryBuilder().getRawMany as jest.Mock).mockResolvedValue([]);

    // Act
    const stats = await service.getAdminStatistics();

    // Assert
    expect(stats.totalUsers).toBe(10);
    expect(stats.totalBookmarks).toBe(100);
    expect(stats.totalClicks).toBe(500);
    expect(stats.avgBookmarksPerUser).toBe(10);
    expect(mockUserRepo.createQueryBuilder).toHaveBeenCalled();
    expect(mockBookmarkRepo.createQueryBuilder).toHaveBeenCalled();
  });
});