import { CreateUserDto, LoginUserDto, Role, TokenDto, User, UserWithoutPassword } from '@tds/tds-bm-common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PinoLogger } from 'nestjs-pino';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { RolesGuard } from './guards/roles.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  // Mock for the express Response object
  const mockResponse: Partial<Response> = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  const mockLoginUser: LoginUserDto = {
    email: 'test@example.com',
    password: 'testpassword',
  };

  const mockUser: UserWithoutPassword = {
    id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: [Role.USER],
  };
  const mockPinoLogger = {
    setContext: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        { provide: PinoLogger, useValue: mockPinoLogger },
        // Mock AuthGuard for local and jwt strategies
        {
          provide: AuthGuard('local'),
          useValue: { canActivate: jest.fn(() => true) },
        },
        {
          provide: AuthGuard('jwt'),
          useValue: { canActivate: jest.fn(() => true) },
        },
        // Mock RolesGuard
        {
          provide: RolesGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
        // Provide Reflector for RolesGuard to work
        Reflector,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should set a cookie and return user data on successful login', async () => {
      // Arrange
      const token = 'mock-jwt-token';
      mockAuthService.login.mockResolvedValue({ access_token: token, ...mockLoginUser });

      // Act
      const result = await authController.login(mockLoginUser, mockResponse as Response);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(mockLoginUser);
      expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', token, expect.any(Object));
      expect(result).toEqual(mockLoginUser); // The controller should return only user data
    });
  });

  describe('register', () => {
    it('should set a cookie and return user data on successful registration', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password',
        email: 'new@example.com',
      };
      const token = 'mock-jwt-token';
      mockAuthService.register.mockResolvedValue({ access_token: token, ...mockLoginUser });

      // Act
      const result = await authController.register(createUserDto, mockResponse as Response);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', token, expect.any(Object));
      expect(result).toEqual(mockLoginUser);
    });
  });

  describe('logout', () => {
    it('should clear the access token cookie', () => {
      // Act
      authController.logout(mockResponse as Response);

      // Assert
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('access_token');
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      // Act
      const result = authController.getProfile(mockUser);

      // Assert
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAdminData', () => {
    it('should return admin data if user has admin role', () => {
      const mockUser = { userId: 1, username: 'adminuser', roles: ['admin'] };
      const req = { user: mockUser };
      const result = authController.getAdminData(req);
      expect(result).toEqual({
        message: 'This is admin-only data',
        user: mockUser,
      });
    });
  });
});
