import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateFolderDto, UpdateFolderDto } from '@tds/tds-bm-common';
import { Test, TestingModule } from '@nestjs/testing';

import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';
import { FolderEntity } from './entities/folder.entity';
import { FoldersService } from './folders.service';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FoldersService', () => {
  let service: FoldersService;
  let folderRepository: Repository<FolderEntity>;
  let bookmarkRepository: Repository<BookmarkEntity>;

  const mockFolderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  const mockBookmarkRepository = {
    update: jest.fn(),
  };

  const mockPinoLogger = {
    setContext: jest.fn(),
    debug: jest.fn(),
  };

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
      providers: [
        FoldersService,
        {
          provide: getRepositoryToken(FolderEntity),
          useValue: mockFolderRepository,
        },
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

    service = module.get<FoldersService>(FoldersService);
    folderRepository = module.get<Repository<FolderEntity>>(getRepositoryToken(FolderEntity));
    bookmarkRepository = module.get<Repository<BookmarkEntity>>(getRepositoryToken(BookmarkEntity));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new root folder (parentId is null)', async () => {
      // This test now verifies the corrected logic
      const createDto: CreateFolderDto = { name: 'New Folder', parentId: null };
      const folderToSave = { name: createDto.name, user: mockUser }; // Note: parentId is not included
      const expectedResult = { id: 'folder-uuid-1', ...folderToSave };

      mockFolderRepository.create.mockReturnValue(folderToSave);
      mockFolderRepository.save.mockResolvedValue(expectedResult);

      const result = await service.create(createDto, mockUser);

      // The create call should not include parentId if it's null in the DTO
      expect(folderRepository.create).toHaveBeenCalledWith(folderToSave);
      expect(folderRepository.save).toHaveBeenCalledWith(folderToSave);
      expect(result).toEqual(expectedResult);
    });

    it('should create and save a new subfolder (parentId is provided)', async () => {
      const parentFolderId = 'parent-uuid-456';
      const createDto: CreateFolderDto = { name: 'Subfolder', parentId: parentFolderId };
      const folderToSave = { name: createDto.name, user: mockUser, parentId: parentFolderId };
      const expectedResult = { id: 'folder-uuid-2', ...folderToSave };

      mockFolderRepository.create.mockReturnValue(folderToSave);
      mockFolderRepository.save.mockResolvedValue(expectedResult);

      const result = await service.create(createDto, mockUser);

      // The create call should include parentId when it is a valid string
      expect(folderRepository.create).toHaveBeenCalledWith(folderToSave);
      expect(folderRepository.save).toHaveBeenCalledWith(folderToSave);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find and return a folder by id and userId', async () => {
      const folderId = 'folder-uuid-1';
      const folder = { id: folderId, name: 'Test Folder', user: mockUser };
      mockFolderRepository.findOne.mockResolvedValue(folder);

      const result = await service.findOne(folderId, mockUser.id as string);

      expect(folderRepository.findOne).toHaveBeenCalledWith({ where: { id: folderId, user: { id: mockUser.id } } });
      expect(result).toEqual(folder);
    });

    it('should throw NotFoundException if folder is not found', async () => {
      mockFolderRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('non-existent-id', mockUser.id as string)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a folder name successfully', async () => {
      const folderId = 'folder-uuid-1';
      const updateDto: UpdateFolderDto = { name: 'Updated Name' };
      const existingFolder = { id: folderId, name: 'Old Name' };

      // Mock the findOne call to return the existing folder
      jest.spyOn(service, 'findOne').mockResolvedValue(existingFolder as FolderEntity);

      // Mock what preload should return
      mockFolderRepository.preload.mockResolvedValue({ ...existingFolder, ...updateDto });

      // Mock the final save operation
      mockFolderRepository.save.mockResolvedValue({ ...existingFolder, ...updateDto });

      const result = await service.update(folderId, mockUser.id as string, updateDto);

      expect(service.findOne).toHaveBeenCalledWith(folderId, mockUser.id);
      expect(folderRepository.preload).toHaveBeenCalledWith({ id: folderId, name: 'Updated Name' });
      expect(folderRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Name');
    });

    // --- NEW test case to verify parentId update to null ---
    it('should move a folder to root by setting parentId to null', async () => {
      const folderId = 'folder-uuid-1';
      const updateDto: UpdateFolderDto = { parentId: null };
      const existingFolder = { id: folderId, name: 'A Folder', parentId: 'some-parent-id' };
      const finalFolderState = { id: folderId, name: 'A Folder', parentId: undefined };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingFolder as FolderEntity);
      mockFolderRepository.preload.mockResolvedValue(existingFolder); // Preload returns the initial state
      mockFolderRepository.save.mockResolvedValue(finalFolderState as any);

      await service.update(folderId, mockUser.id as string, updateDto);

      // The save method should be called with parentId being undefined
      expect(folderRepository.save).toHaveBeenCalledWith(expect.objectContaining({ parentId: undefined }));
    });

    it('should throw BadRequestException for circular parent reference', async () => {
      const folderId = 'folder-uuid-1';
      const updateDto: UpdateFolderDto = { parentId: folderId };

      await expect(service.update(folderId, mockUser.id as string, updateDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if folder to update is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.update('non-existent-id', 'user-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should reassign bookmarks and delete the folder', async () => {
      const folderId = 'folder-uuid-1';
      const userId = mockUser.id as string;

      jest.spyOn(service, 'findOne').mockResolvedValue({ id: folderId } as FolderEntity);
      mockBookmarkRepository.update.mockResolvedValue({ affected: 2 }); // Assume 2 bookmarks were updated
      mockFolderRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(folderId, userId);

      expect(service.findOne).toHaveBeenCalledWith(folderId, userId);
      // Verify bookmarks are moved to root
      expect(bookmarkRepository.update).toHaveBeenCalledWith({ folder: { id: folderId }, user: { id: userId } }, { folder: undefined });
      // Verify folder is deleted
      expect(folderRepository.delete).toHaveBeenCalledWith(folderId);
    });

    it('should throw NotFoundException if folder to remove does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove('non-existent-id', 'user-id')).rejects.toThrow(NotFoundException);
    });
  });
});
