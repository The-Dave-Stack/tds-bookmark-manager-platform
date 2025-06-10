import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = await service.findOne({ email: 'john@test.com' });
      expect(user).toBeDefined();
      expect(user?.email).toBe('john@test.com');
    });

    it('should return undefined if user not found', async () => {
      const user = await service.findOne({ email: 'nonexistent' });
      expect(user).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const users = await service.findAll();
      expect(users).toBeDefined();
      const initialLength = users.length;
      const newUser = await service.create({
        username: 'testuser',
        passwordHash: 'testpass',
        email: 'test2@test.com',
        roles: ['user'],
      });
      expect(newUser).toBeDefined();
      expect('password' in newUser).toBe(false);
      expect(newUser.username).toBe('testuser');
      expect(newUser.email).toBe('test2@test.com');
      expect(newUser.roles).toEqual(['user']);
      expect(newUser.id).toBe(initialLength + 1);
    });
  });
});
