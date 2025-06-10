import * as bcrypt from 'bcrypt';

import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

// Mock bcrypt to control hashing and comparison outcomes
jest.mock('bcrypt', () => ({
  compare: jest.fn((password, hash) => password === 'validpassword' && hash === 'hashedpassword'),
  hash: jest.fn(() => 'hashedpassword'),
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
            findOne: jest.fn(),
            create: jest.fn(),
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
    it('should return user without password if credentials are valid', async () => {
      const mockUser: UserEntity = {
        id: 1,
        username: 'testuser',
        passwordHash: 'hashedpassword',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: ['user'],
      };
      (usersService.findOne as jest.Mock).mockReturnValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser({ email: 'testuser@test.com', passwordHash: 'validpassword' });
      expect(result).toBeTruthy();
      expect(usersService.findOne).toHaveBeenCalledWith({ email: 'testuser@test.com' }, { withoutPassword: false });
      expect(bcrypt.compare).toHaveBeenCalledWith('validpassword', 'hashedpassword');
    });

    it('should return null if user not found', async () => {
      (usersService.findOne as jest.Mock).mockReturnValue(undefined);

      const result = await authService.validateUser({ email: 'nonexistent', passwordHash: 'anypass' });
      expect(result).toBeFalsy();
      expect(usersService.findOne).toHaveBeenCalledWith({ email: 'nonexistent' }, { withoutPassword: false });
    });

    it('should return null if password is invalid', async () => {
      const mockUser: UserEntity = {
        id: 1,
        username: 'testuser',
        passwordHash: 'hashedpassword',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: ['user'],
      };
      (usersService.findOne as jest.Mock).mockReturnValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser({ email: 'testuser@test.com', passwordHash: 'invalidpassword' });
      expect(result).toBeFalsy();
      expect(usersService.findOne).toHaveBeenCalledWith({ email: 'testuser@test.com' }, { withoutPassword: false });
      expect(bcrypt.compare).toHaveBeenCalledWith('invalidpassword', 'hashedpassword');
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { password: 'hashedpassword', email: 'testuser@test.com' };
      const mockUser: UserEntity = {
        id: 1,
        username: 'testuser',
        passwordHash: 'hashedpassword',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: ['user'],
      };
      (usersService.findOne as jest.Mock).mockReturnValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(user);

      expect(result).toEqual({ access_token: 'mockedAccessToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: '1',
        roles: ['user'],
      });
    });
  });

  describe('register', () => {
    it('should create a new user with hashed password and return user without password', async () => {
      const mockNewUser = {
        userId: 3,
        username: 'newuser',
        password: 'newpassword',
        email: 'newuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: ['user'],
      };
      (usersService.create as jest.Mock).mockReturnValue(mockNewUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const result = await authService.register({ email: 'newuser@test.com', passwordHash: 'newpassword', username: 'newuser' });
      expect(result).toEqual(mockNewUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(usersService.create).toHaveBeenCalledWith({ email: 'newuser@test.com', password: 'hashedpassword', username: 'newuser', roles: ['user'] });
    });
  });
});
