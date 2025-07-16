/**
 * api-key.strategy.ts
 *
 * Purpose:
 * - Implements a Passport strategy for API key-based authentication.
 *
 * Logic Overview:
 * - Uses the `passport-http-bearer` strategy to extract a token from the `Authorization` header.
 * - Validates the token against the `AuthService` to authenticate the user.
 * - Throws `UnauthorizedException` if the API key is invalid.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer'; // A more suitable strategy

/**
 * Passport strategy for API key authentication.
 * This strategy is named 'api-key' and expects a bearer token in the Authorization header.
 */
@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validates the provided API token.
   * @param {string} token - The API token extracted from the request.
   * @returns {Promise<any>} The authenticated user object if the token is valid.
   * @throws {UnauthorizedException} If the API key is invalid.
   */
  async validate(token: string): Promise<any> {
    const user = await this.authService.validateUserByApiKey(token);
    if (!user) {
      throw new UnauthorizedException('Invalid API Key');
    }
    return user;
  }
}
