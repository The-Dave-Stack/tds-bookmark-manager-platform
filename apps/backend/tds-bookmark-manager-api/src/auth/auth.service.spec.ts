import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User, Role, LoginUserDto } from '@tds/tds-bm-common';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { PinoLogger } from 'nestjs-pino';
import { UnauthorizedException } from '@nestjs/common';

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
      const mockUserDto: User = {
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
      const mockUserDto: User = {
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
      it('should return an access token for valid credentials', async () => {
          const loginDto: LoginUserDto = { email: 'test@test.com', password: 'validpassword' };
          const userFromDb = { username: 'test', email: loginDto.email, roles: [], password: loginDto.password } as User;
    
          // La llamada a validateUser es interna de auth.service, así que mockeamos la dependencia que llama: usersService
          mockUsersService.validateUserCredentials.mockResolvedValue(userFromDb);
          mockJwtService.sign.mockReturnValue('mock-token');
    
          await authService.login(loginDto);
    
          // --- CORRECTION IS HERE ---
          // The assertion now correctly expects only ONE argument, which matches the actual implementation.
          expect(usersService.validateUserCredentials).toHaveBeenCalledWith({
            email: loginDto.email,
            password: loginDto.password,
          });
    
          // The rest of the assertions remain the same
          expect(jwtService.sign).toHaveBeenCalledWith({ username: userFromDb.username, sub: userFromDb.email, roles: userFromDb.roles });
        });
        
        // El otro test de login permanece igual
        it('should throw UnauthorizedException for invalid credentials', async () => {
            const loginDto: LoginUserDto = { email: 'wrong@test.com', password: 'wrongpassword' };
            mockUsersService.validateUserCredentials.mockResolvedValue(undefined); // Simulate user not found
            await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

  describe('register', () => {
    it('should create a new user and return user DTO', async () => {
      const createUserDto = { username: 'newuser', password: 'newpassword', email: 'newuser@test.com' };
      const mockNewUserDto: User = {
        username: 'newuser',
        email: 'newuser@test.com',
        isActive: true,
        createdAt: new Date(),
        roles: [Role.USER],
      };
      (usersService.create as jest.Mock).mockResolvedValue(mockNewUserDto);

      const result = await authService.register(createUserDto);

      expect(result).toEqual(mockNewUserDto);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
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
