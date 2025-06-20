import { CreateBookmarkDto, UpdateBookmarkDto } from '@tds/tds-bm-common';
import { Test, TestingModule } from '@nestjs/testing';

import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserEntity } from '../users/entities/user.entity';
import { of } from 'rxjs';

describe('BookmarksController', () => {
  let controller: BookmarksController;
  let service: BookmarksService;

  // Mock the service to isolate the controller logic
  const mockBookmarksService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    incrementClickCount: jest.fn(),
  };

  // Mock user object that would be injected by the @User decorator
  const mockUser: UserEntity = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    username: 'testuser',
    roles: ['USER'],
    isActive: true,
    passwordHash: 'hashedpassword',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [
        {
          provide: BookmarksService,
          useValue: mockBookmarksService,
        },
      ],
    })
    // Mock the JwtAuthGuard to always allow access for controller tests
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => of(true) })
    .compile();

    controller = module.get<BookmarksController>(BookmarksController);
    service = module.get<BookmarksService>(BookmarksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call bookmarksService.create with the correct parameters', async () => {
      const createDto: CreateBookmarkDto = { url: 'https://new-bookmark.com', title: 'New' };
      const expectedResult = { id: 'bookmark-uuid-1', ...createDto, user: mockUser };
      
      mockBookmarksService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, mockUser);

      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call bookmarksService.findAllByUser with user and query params', async () => {
      const expectedResult = [{ id: 'bookmark-uuid-1', url: 'https://a.com' }];
      mockBookmarksService.findAllByUser.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockUser, 'test-search', 'title');

      expect(service.findAllByUser).toHaveBeenCalledWith(mockUser, 'test-search', 'title');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call bookmarksService.findOne with correct id and userId', async () => {
      const bookmarkId = 'bookmark-uuid-1';
      const expectedResult = { id: bookmarkId, url: 'https://a.com' };
      mockBookmarksService.findOne.mockResolvedValue(expectedResult);
      
      const result = await controller.findOne(bookmarkId, mockUser.id as string);

      expect(service.findOne).toHaveBeenCalledWith(bookmarkId, mockUser.id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call bookmarksService.update with correct parameters', async () => {
      const bookmarkId = 'bookmark-uuid-1';
      const updateDto: UpdateBookmarkDto = { title: 'Updated Title' };
      const expectedResult = { id: bookmarkId, title: 'Updated Title' };
      mockBookmarksService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(bookmarkId, mockUser.id as string, updateDto);

      expect(service.update).toHaveBeenCalledWith(bookmarkId, mockUser.id, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call bookmarksService.remove with correct id and userId', async () => {
      const bookmarkId = 'bookmark-uuid-1';
      mockBookmarksService.remove.mockResolvedValue(undefined); // remove returns void

      await controller.remove(bookmarkId, mockUser.id as string);

      expect(service.remove).toHaveBeenCalledWith(bookmarkId, mockUser.id);
    });
  });

  describe('incrementClick', () => {
    it('should call bookmarksService.incrementClickCount with correct id and userId', async () => {
      const bookmarkId = 'bookmark-uuid-1';
      mockBookmarksService.incrementClickCount.mockResolvedValue(undefined); // returns void

      await controller.incrementClick(bookmarkId, mockUser.id as string);

      expect(service.incrementClickCount).toHaveBeenCalledWith(bookmarkId, mockUser.id);
    });
  });
});