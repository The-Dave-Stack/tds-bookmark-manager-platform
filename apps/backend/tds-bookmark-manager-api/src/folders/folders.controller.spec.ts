import { CreateFolderDto, UpdateFolderDto } from '@tds/tds-bm-common';
import { Test, TestingModule } from '@nestjs/testing';

import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserEntity } from '../users/entities/user.entity';
import { of } from 'rxjs';

describe('FoldersController', () => {
  let controller: FoldersController;
  let service: FoldersService;

  const mockFoldersService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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
      controllers: [FoldersController],
      providers: [
        {
          provide: FoldersService,
          useValue: mockFoldersService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => of(true) })
    .compile();

    controller = module.get<FoldersController>(FoldersController);
    service = module.get<FoldersService>(FoldersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call foldersService.create with correct parameters', async () => {
      const createDto: CreateFolderDto = { name: 'New Folder' };
      const expectedResult = { id: 'folder-uuid-1', ...createDto, user: mockUser };
      
      mockFoldersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, mockUser);

      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call foldersService.findAllByUser with the user', async () => {
      const expectedResult = [{ id: 'folder-uuid-1', name: 'Folder 1' }];
      mockFoldersService.findAllByUser.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockUser);

      expect(service.findAllByUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call foldersService.findOne with correct id and userId', async () => {
        const folderId = 'folder-uuid-1';
        const expectedResult = { id: folderId, name: 'Folder 1' };
        mockFoldersService.findOne.mockResolvedValue(expectedResult);
        
        const result = await controller.findOne(folderId, mockUser.id as string);
  
        expect(service.findOne).toHaveBeenCalledWith(folderId, mockUser.id);
        expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call foldersService.update with correct parameters', async () => {
        const folderId = 'folder-uuid-1';
        const updateDto: UpdateFolderDto = { name: 'Updated Name' };
        const expectedResult = { id: folderId, ...updateDto };
        mockFoldersService.update.mockResolvedValue(expectedResult);
  
        const result = await controller.update(folderId, mockUser.id as string, updateDto);
  
        expect(service.update).toHaveBeenCalledWith(folderId, mockUser.id, updateDto);
        expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call foldersService.remove with correct id and userId', async () => {
        const folderId = 'folder-uuid-1';
        mockFoldersService.remove.mockResolvedValue(undefined); // returns void
  
        await controller.remove(folderId, mockUser.id as string);
  
        expect(service.remove).toHaveBeenCalledWith(folderId, mockUser.id);
    });
  });
});