import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
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
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with the user from request', async () => {
      const mockUser = { userId: 1, username: 'testuser', roles: ['user'] };
      const mockLoginResult = { access_token: 'mockedAccessToken' };
      (authService.login as jest.Mock).mockResolvedValue(mockLoginResult);

      const req = { user: mockUser };
      const result = await authController.login(req);

      expect(result).toEqual(mockLoginResult);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('register', () => {
    it('should call authService.register with username and password', async () => {
      const createUserDto = { username: 'newuser', password: 'newpassword', email: 'newuser@test.com' };
      const mockRegisterResult = {
        userId: 2,
        username: 'newuser',
        roles: ['user'],
      };
      (authService.register as jest.Mock).mockResolvedValue(mockRegisterResult);

      const result = await authController.register(createUserDto);

      expect(result).toEqual(mockRegisterResult);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getProfile', () => {
    it('should return the user from request', () => {
      const mockUser = {
        userId: 1,
        username: 'testuser',
        password: 'hashedpassword',
        email: 'testuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: ['user'],
      };
      const req = { user: mockUser };
      const result = authController.getProfile(req);
      expect(result).toEqual({ user: mockUser }); // Expect the nested user object
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
