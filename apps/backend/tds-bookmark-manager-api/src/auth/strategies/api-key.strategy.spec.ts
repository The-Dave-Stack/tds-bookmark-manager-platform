import { Test, TestingModule } from '@nestjs/testing';

import { ApiKeyStrategy } from './api-key.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('ApiKeyStrategy', () => {
  let strategy: ApiKeyStrategy;
  const mockAuthService = {
    validateUserByApiKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();
    strategy = module.get<ApiKeyStrategy>(ApiKeyStrategy);
  });

  it('should validate and return the user for a valid API key', async () => {
    const mockUser = { id: 'user-uuid', username: 'test' };
    mockAuthService.validateUserByApiKey.mockResolvedValue(mockUser);

    const result = await strategy.validate('valid-api-key');

    expect(mockAuthService.validateUserByApiKey).toHaveBeenCalledWith('valid-api-key');
    expect(result).toEqual(mockUser);
  });

  it('should throw an UnauthorizedException for an invalid API key', async () => {
    mockAuthService.validateUserByApiKey.mockResolvedValue(null);
    await expect(strategy.validate('invalid-api-key')).rejects.toThrow(UnauthorizedException);
  });
});