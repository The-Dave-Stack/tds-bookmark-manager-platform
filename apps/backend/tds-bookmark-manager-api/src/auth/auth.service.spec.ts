import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@tds/tds-bm-common';
import { UsersService } from '../users/users.service';

// Mock bcrypt to control hashing and comparison outcomes
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
            validateUserCredentials: jest.fn(), // Add this mock
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockedAccessToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user DTO if credentials are valid', async () => {
      const mockUserDto: User = {
        username: 'testuser',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: ['USER'],
      };
      (usersService.validateUserCredentials as jest.Mock).mockResolvedValue(mockUserDto);

      const result = await authService.validateUser({ email: 'testuser@test.com', password: 'validpassword' }, { returnUser: true });
      expect(result).toEqual(mockUserDto);
      expect(usersService.validateUserCredentials).toHaveBeenCalledWith({ email: 'testuser@test.com', password: 'validpassword' });
    });

    it('should return true if credentials are valid and returnUser is false', async () => {
      const mockUserDto: User = {
        username: 'testuser',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: ['USER'],
      };
      (usersService.validateUserCredentials as jest.Mock).mockResolvedValue(mockUserDto);

      const result = await authService.validateUser({ email: 'testuser@test.com', password: 'validpassword' }, { returnUser: false });
      expect(result).toBe(true);
      expect(usersService.validateUserCredentials).toHaveBeenCalledWith({ email: 'testuser@test.com', password: 'validpassword' });
    });

    it('should return false if user not found', async () => {
      (usersService.validateUserCredentials as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.validateUser({ email: 'nonexistent', password: 'anypass' });
      expect(result).toBe(false);
      expect(usersService.validateUserCredentials).toHaveBeenCalledWith({ email: 'nonexistent', password: 'anypass' });
    });

    it('should return false if password is invalid', async () => {
      (usersService.validateUserCredentials as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.validateUser({ email: 'testuser@test.com', password: 'invalidpassword' });
      expect(result).toBe(false);
      expect(usersService.validateUserCredentials).toHaveBeenCalledWith({ email: 'testuser@test.com', password: 'invalidpassword' });
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUserDto: User = {
        username: 'testuser',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: ['USER'],
      };
      // Ensure validateUserCredentials returns the mockUserDto for the login test
      (usersService.validateUserCredentials as jest.Mock).mockImplementation(async (credentials) => {
        if (credentials.email === 'testuser@test.com' && credentials.password === 'validpassword') {
          return mockUserDto;
        }
        return undefined;
      });
      (jwtService.sign as jest.Mock).mockReturnValue('mockedAccessToken');

      const result = await authService.login({ email: 'testuser@test.com', password: 'validpassword' });

      expect(result).toEqual({ access_token: 'mockedAccessToken' });
      // Expect validateUserCredentials to be called by authService.login
      expect(usersService.validateUserCredentials).toHaveBeenCalledWith({ email: 'testuser@test.com', password: 'validpassword' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: 'testuser@test.com',
        roles: ['USER'],
      });
    });

    // it('should throw UnauthorizedException if validateUserCredentials returns false', async () => {
    //   (usersService.validateUserCredentials as jest.Mock).mockResolvedValue(undefined); // Mock the dependency to return undefined

    //   await expect(authService.login({ email: 'invalid@test.com', password: 'wrongpass' })).rejects.toThrow(UnauthorizedException);
    //   expect(usersService.validateUserCredentials).toHaveBeenCalledWith({ email: 'invalid@test.com', password: 'wrongpass' });
    // });
  });

  describe('register', () => {
    it('should create a new user and return user DTO', async () => {
      const createUserDto = { username: 'newuser', password: 'newpassword', email: 'newuser@test.com' };
      const mockNewUserDto: User = {
        username: 'newuser',
        email: 'newuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: ['USER'],
      };
      (usersService.create as jest.Mock).mockResolvedValue(mockNewUserDto);

      const result = await authService.register(createUserDto);

      expect(result).toEqual(mockNewUserDto);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
