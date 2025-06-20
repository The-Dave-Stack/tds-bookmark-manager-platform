import { CreateBookmarkDto, UpdateBookmarkDto } from '@tds/tds-bm-common';
import { ILike, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { BookmarkEntity } from './entities/bookmark.entity';
import { BookmarksService } from './bookmarks.service';
import { NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UserEntity } from '../users/entities/user.entity';
import axios from 'axios';
import { getRepositoryToken } from '@nestjs/typeorm';

// Mock dependencies
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BookmarksService', () => {
  let service: BookmarksService;
  let repository: Repository<BookmarkEntity>;

  const mockBookmarkRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    preload: jest.fn(),
  };

  const mockPinoLogger = {
    setContext: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarksService,
        {
          provide: getRepositoryToken(BookmarkEntity),
          useValue: mockBookmarkRepository,
        },
        {
          provide: PinoLogger,
          useValue: mockPinoLogger,
        },
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
    repository = module.get<Repository<BookmarkEntity>>(getRepositoryToken(BookmarkEntity));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const user = { id: 'user-uuid' } as UserEntity;

    it('should use provided title instead of fetching', async () => {
      const createDto: CreateBookmarkDto = { url: 'https://example.com', title: 'User Title' };
      const bookmark = { ...createDto, user };
      mockBookmarkRepository.create.mockReturnValue(bookmark);
      mockBookmarkRepository.save.mockResolvedValue(bookmark);

      await service.create(createDto, user);

      expect(mockedAxios.get).not.toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ title: 'User Title' }));
    });

    it('should fetch title automatically if not provided', async () => {
      const createDto: CreateBookmarkDto = { url: 'https://example.com' };
      const bookmark = { ...createDto, user };
      mockedAxios.get.mockResolvedValue({ data: '<html><head><title>Fetched Title</title></head></html>' });
      mockBookmarkRepository.create.mockReturnValue(bookmark);
      mockBookmarkRepository.save.mockResolvedValue(bookmark);

      await service.create(createDto, user);

      expect(mockedAxios.get).toHaveBeenCalledWith(createDto.url, { timeout: 5000 });
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'Fetched Title' }));
    });

    it('should fallback to URL as title if fetching fails', async () => {
      const createDto: CreateBookmarkDto = { url: 'https://example.com' };
       const bookmark = { ...createDto, user };
      mockedAxios.get.mockRejectedValue(new Error('Network error'));
      mockBookmarkRepository.create.mockReturnValue(bookmark);
      mockBookmarkRepository.save.mockResolvedValue(bookmark);

      await service.create(createDto, user);

      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ title: createDto.url }));
      expect(mockPinoLogger.warn).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    const user = { id: 'user-uuid' } as UserEntity;

    it('should find with default sorting (createdAt DESC)', async () => {
      await service.findAllByUser(user);
      expect(repository.find).toHaveBeenCalledWith({
        where: { user: { id: user.id } },
        order: { createdAt: 'DESC' },
        relations: ['folder'],
      });
    });

    it('should find and sort by title', async () => {
      await service.findAllByUser(user, undefined, 'title');
      expect(repository.find).toHaveBeenCalledWith({
        where: { user: { id: user.id } },
        order: { title: 'ASC' },
        relations: ['folder'],
      });
    });

    it('should find with a search term', async () => {
      const searchTerm = 'test';
      await service.findAllByUser(user, searchTerm);
      expect(repository.find).toHaveBeenCalledWith({
        where: [
          { user: { id: user.id }, title: ILike(`%${searchTerm}%`) },
          { user: { id: user.id }, url: ILike(`%${searchTerm}%`) },
        ],
        order: { createdAt: 'DESC' },
        relations: ['folder'],
      });
    });
  });

  describe('update', () => {
    it('should update a bookmark successfully', async () => {
      const updateDto: UpdateBookmarkDto = { title: 'New Title' };
      const existingBookmark = { id: 'bookmark-uuid', title: 'Old Title' };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingBookmark as BookmarkEntity);
      mockBookmarkRepository.preload.mockResolvedValue({ ...existingBookmark, ...updateDto });
      mockBookmarkRepository.save.mockResolvedValue({ ...existingBookmark, ...updateDto });

      const result = await service.update('bookmark-uuid', 'user-uuid', updateDto);

      expect(service.findOne).toHaveBeenCalledWith('bookmark-uuid', 'user-uuid');
      expect(repository.preload).toHaveBeenCalledWith({ id: 'bookmark-uuid', ...updateDto });
      expect(repository.save).toHaveBeenCalled();
      expect(result.title).toBe('New Title');
    });

    it('should throw NotFoundException if bookmark to update is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.update('non-existent-id', 'user-uuid', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a bookmark', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({} as BookmarkEntity);
      mockBookmarkRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove('bookmark-uuid', 'user-uuid')).resolves.not.toThrow();
      expect(repository.delete).toHaveBeenCalledWith('bookmark-uuid');
    });

    it('should throw NotFoundException if bookmark to remove is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove('non-existent-id', 'user-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('incrementClickCount', () => {
    it('should increment the click count of a bookmark', async () => {
      mockBookmarkRepository.update.mockResolvedValue({ affected: 1 });
      await expect(service.incrementClickCount('bookmark-uuid', 'user-uuid')).resolves.not.toThrow();
      expect(repository.update).toHaveBeenCalledWith(
        { id: 'bookmark-uuid', user: { id: 'user-uuid' } },
        { clickCount: expect.any(Function), lastClickedAt: expect.any(Date) }
      );
    });

    it('should throw NotFoundException if bookmark not found', async () => {
      mockBookmarkRepository.update.mockResolvedValue({ affected: 0 });
      await expect(service.incrementClickCount('non-existent-id', 'user-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});