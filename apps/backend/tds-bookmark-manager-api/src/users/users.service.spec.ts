import * as bcrypt from 'bcrypt'; // Import bcrypt

import { ArrayContains, Repository } from 'typeorm';
import { Role, UserWithoutPassword } from '@tds/tds-bm-common'; // Import UserWithoutPassword DTO
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common'; // Import NotFoundException
import { PinoLogger } from 'nestjs-pino';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mapEntityToDto } from '@tds/tds-bm-common'; // Import mapEntityToDto

// Mock bcrypt globally for this test file
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock mapEntityToDto from @tds/tds-bm-common
// This mock will be used by the UsersService when it calls mapEntityToDto
jest.mock('@tds/tds-bm-common', () => {
  const originalModule = jest.requireActual('@tds/tds-bm-common');
  return {
    ...originalModule,
    mapEntityToDto: jest.fn((entity, dtoClass) => {
      if (!entity) return undefined;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...rest } = entity; // Destructure to remove passwordHash
      if (dtoClass === originalModule.UserWithoutPassword) {
        // Check if the target DTO is UserWithoutPassword
        return { ...rest }; // Return the rest of the properties, effectively removing passwordHash
      }
      return rest; // For other DTOs or if dtoClass is not UserWithoutPassword
    }),
    UserWithoutPassword: originalModule.UserWithoutPassword, // Ensure UserWithoutPassword DTO class is exported
  };
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<UserEntity>;
  let configService: ConfigService;

  beforeEach(async () => {
    // Reset mocks before each test to ensure a clean state
    (mapEntityToDto as jest.Mock).mockClear();
    (bcrypt.hash as jest.Mock).mockClear();
    (bcrypt.compare as jest.Mock).mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: PinoLogger,
          useValue: {
            setContext: jest.fn(),
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          // Provide a mock for ConfigService
          provide: ConfigService,
          useValue: {
            // Mock the .get() method to return a default db type for tests
            get: jest.fn((key: string) => {
              if (key === 'database.type') {
                return 'sqlite'; // or 'postgres', depending on what you want to test
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hasAdmins', () => {
    it('should use ArrayContains for postgres', async () => {
      // Arrange: set up the mock for this specific test
      //jest.spyOn(configService, 'get').mockReturnValue('postgres');
      (userRepository.count as jest.Mock).mockResolvedValue(1);

      // Act
      const result = await service.hasAdmins();

      // Assert
      expect(result).toBe(true);
      expect(userRepository.count).toHaveBeenCalledWith({
        where: { roles: ArrayContains(['ADMIN']) },
      });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a UserEntity if found and withoutPassword is false', async () => {
      const mockUserEntity = { id: '1', email: 'test@example.com', username: 'testuser', passwordHash: 'hash' } as UserEntity;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUserEntity);

      const user = await service.findOneByEmail({ email: 'test@example.com' }, { withoutPassword: false });
      expect(user).toEqual(mockUserEntity);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mapEntityToDto).not.toHaveBeenCalled();
    });

    it('should return a User DTO if found and withoutPassword is true or not specified', async () => {
      const mockUserEntity = { id: '1', email: 'test@example.com', username: 'testuser', passwordHash: 'hash' } as UserEntity;
      const expectedUserDto = { id: '1', email: 'test@example.com', username: 'testuser' };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUserEntity);
      (mapEntityToDto as jest.Mock).mockReturnValue(expectedUserDto);

      const user = await service.findOneByEmail({ email: 'test@example.com' });
      expect(user).toEqual(expectedUserDto);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mapEntityToDto).toHaveBeenCalledWith(mockUserEntity, UserWithoutPassword);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOneByEmail({ email: 'nonexistent@example.com' })).rejects.toThrow(NotFoundException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: '1', email: 'test1@example.com', username: 'user1' },
        { id: '2', email: 'test2@example.com', username: 'user2' },
      ] as UserEntity[];
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);

      const users = await service.findAll();
      expect(users).toEqual(mockUsers);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new user DTO', async () => {
      const createUserDto = {
        username: 'newuser',
        password: 'newpassword',
        email: 'newuser@example.com',
      };
      const dateNow = new Date();
      const savedUserEntity = {
        id: 'uuid-1',
        username: 'newuser',
        email: 'newuser@example.com',
        roles: ['USER'],
        passwordHash: 'hashedpassword',
        isActive: true,
        createdAt: dateNow,
        updatedAt: dateNow,
      } as UserEntity;

      const expectedUserDto = {
        id: 'uuid-1',
        username: 'newuser',
        email: 'newuser@example.com',
        roles: ['USER'],
        isActive: true,
        createdAt: dateNow,
        updatedAt: dateNow,
        apiToken: expect.any(String), // apiToken is generated in service
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUserEntity);
      (mapEntityToDto as jest.Mock).mockReturnValue(expectedUserDto);

      const newUser = await service.create(createUserDto);

      expect(newUser).toEqual(expectedUserDto);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'newuser',
          email: 'newuser@example.com',
          passwordHash: 'hashedpassword',
          roles: ['USER'],
          isActive: true,
          apiToken: expect.any(String), // apiToken is generated in service
        })
      );
      expect(mapEntityToDto).toHaveBeenCalledWith(savedUserEntity, UserWithoutPassword);
    });
  });

  describe('validateUserCredentials', () => {
    it('should return user DTO if credentials are valid', async () => {
      const dateNow = new Date();
      const mockUserEntity: UserEntity = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashedpassword',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: dateNow,
        updatedAt: dateNow,
        roles: [Role.USER],
      };
      const expectedUserDto = {
        id: '1',
        username: 'testuser',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: dateNow,
        updatedAt: dateNow,
        roles: ['USER'],
      };

      const findOneByEmailSpy = jest.spyOn(service, 'findOneByEmail').mockResolvedValue(mockUserEntity);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mapEntityToDto as jest.Mock).mockReturnValue(expectedUserDto);

      const result = await service.validateUserCredentials({ email: 'testuser@test.com', password: 'validpassword' });
      expect(result).toEqual(expectedUserDto);
      expect(findOneByEmailSpy).toHaveBeenCalledWith({ email: 'testuser@test.com' }, { withoutPassword: false });
      expect(bcrypt.compare).toHaveBeenCalledWith('validpassword', 'hashedpassword');
      expect(mapEntityToDto).toHaveBeenCalledWith(mockUserEntity, UserWithoutPassword);
    });

    it('should return undefined if user not found', async () => {
      // Mock findOneByEmail to simulate it throwing NotFoundException,
      // which validateUserCredentials should catch and return undefined.
      const findOneByEmailSpy = jest.spyOn(service, 'findOneByEmail').mockImplementation(async () => {
        throw new NotFoundException('User not found');
      });

      const result = await service.validateUserCredentials({ email: 'nonexistent', password: 'anypass' });
      expect(result).toBeUndefined();
      expect(findOneByEmailSpy).toHaveBeenCalledWith({ email: 'nonexistent' }, { withoutPassword: false });
    });

    it('should return undefined if password is invalid', async () => {
      const mockUserEntity: UserEntity = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashedpassword',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: [Role.USER],
      };
      const findOneByEmailSpy = jest.spyOn(service, 'findOneByEmail').mockResolvedValue(mockUserEntity);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUserCredentials({ email: 'testuser@test.com', password: 'invalidpassword' });
      expect(result).toBeUndefined();
      expect(findOneByEmailSpy).toHaveBeenCalledWith({ email: 'testuser@test.com' }, { withoutPassword: false });
      expect(bcrypt.compare).toHaveBeenCalledWith('invalidpassword', 'hashedpassword');
    });
  });

  describe('hashPassword', () => {
    it('should hash the password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      const hashedPassword = await service.hashPassword('plainpassword');
      expect(hashedPassword).toBe('hashedpassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 10);
    });
  });

  describe('comparePassword', () => {
    it('should compare passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.comparePassword('plainpassword', 'hashedpassword');
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('plainpassword', 'hashedpassword');
    });
  });
});
