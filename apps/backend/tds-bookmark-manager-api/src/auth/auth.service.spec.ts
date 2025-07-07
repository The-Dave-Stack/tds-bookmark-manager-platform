import { CreateUserDto, LoginUserDto, Role, UserWithoutPassword } from '@tds/tds-bm-common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { UnauthorizedException } from '@nestjs/common';
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

  // Mocks for all dependencies
  const mockUsersService = {
    validateUserCredentials: jest.fn(),
    create: jest.fn(),
    createPasswordResetToken: jest.fn(),
    findOneByEmail: jest.fn(),
    resetUserPassword: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };
  const mockEmailService = {
    sendPasswordResetEmail: jest.fn(),
  };
  const mockPinoLogger = {
    setContext: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: PinoLogger, useValue: mockPinoLogger },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user DTO if credentials are valid', async () => {
      const mockUserDto: UserWithoutPassword = {
        username: 'testuser',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: [Role.USER],
      };
      (usersService.validateUserCredentials as jest.Mock).mockResolvedValue(mockUserDto);

      const result = await authService.validateUser({ email: 'testuser@test.com', password: 'validpassword' }, { returnUser: true });
      expect(result).toEqual(mockUserDto);
      expect(usersService.validateUserCredentials).toHaveBeenCalledWith({ email: 'testuser@test.com', password: 'validpassword' });
    });

    it('should return true if credentials are valid and returnUser is false', async () => {
      const mockUserDto: UserWithoutPassword = {
        username: 'testuser',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: [Role.USER],
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
    it('should return an access token and user data for a valid user', async () => {
      const mockUserWithoutPassword: UserWithoutPassword = {
        username: 'testuser',
        email: 'test@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: [Role.USER],
      };

      (usersService.validateUserCredentials as jest.Mock).mockResolvedValue(mockUserWithoutPassword);
      mockJwtService.sign.mockReturnValue('mock-token');

      const result = await authService.login(mockUserWithoutPassword);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUserWithoutPassword.username,
        sub: mockUserWithoutPassword.email,
        roles: mockUserWithoutPassword.roles,
      });
      expect(result).toEqual({
        access_token: 'mock-token',
        ...mockUserWithoutPassword,
      });
    });
  });

  describe('register', () => {
    it('should create a user and return an access token and user data', async () => {
      const createUserDto: CreateUserDto = { username: 'newuser', password: 'password', email: 'new@example.com' };
      const newUserWithoutPassword: UserWithoutPassword = {
        id: '1',
        username: 'newuser',
        email: 'new@example.com',
        roles: [Role.USER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        apiToken: 'some-api-token',
      };

      mockUsersService.create.mockResolvedValue(newUserWithoutPassword);
      mockJwtService.sign.mockReturnValue('mock-token');

      const result = await authService.register(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: newUserWithoutPassword.username,
        sub: newUserWithoutPassword.email,
        roles: newUserWithoutPassword.roles,
      });
      expect(result).toEqual({
        access_token: 'mock-token',
        ...newUserWithoutPassword,
      });
    });
  });

  describe('forgotPassword', () => {
    it('should create a token and send an email', async () => {
        const email = 'user@example.com';
        const user = { email } as any;
        const token = 'reset-token-123';
        mockUsersService.createPasswordResetToken.mockResolvedValue(token);
        mockUsersService.findOneByEmail.mockResolvedValue(user);

        await authService.forgotPassword(email);

        expect(usersService.createPasswordResetToken).toHaveBeenCalledWith(email);
        expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(user, token);
    });
  });

  describe('resetPassword', () => {
    it('should reset password and return a new JWT', async () => {
        const token = 'reset-token-123';
        const newPassword = 'newPassword123';
        const user = { username: 'test', email: 'test@test.com', roles: ['USER'] } as any;

        mockUsersService.resetUserPassword.mockResolvedValue(user);
        mockJwtService.sign.mockReturnValue('new-jwt-token');

        const result = await authService.resetPassword(token, newPassword);

        expect(usersService.resetUserPassword).toHaveBeenCalledWith(token, newPassword);
        expect(jwtService.sign).toHaveBeenCalledWith({ username: user.username, sub: user.email, roles: user.roles });
        expect(result).toEqual({ access_token: 'new-jwt-token' });
    });
  });
});
