/**
 * local.strategy.ts
 *
 * Purpose:
 * - Implements a Passport strategy for local (username/password) authentication.
 *
 * Logic Overview:
 * - Uses the `passport-local` strategy to validate user credentials (email and password).
 * - Delegates the actual validation to the `AuthService`.
 * - Throws `UnauthorizedException` if authentication fails.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { PinoLogger } from 'nestjs-pino';
import { Strategy } from 'passport-local';
import type { UserWithoutPassword } from '@tds/tds-bm-common';

/**
 * Passport strategy for local (email and password) authentication.
 * This strategy is used to validate user credentials during the login process.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private logger: PinoLogger) {
    super({ usernameField: 'email', passwordField: 'password' });
    this.logger.setContext(LocalStrategy.name);
  }

  /**
   * Validates the user's email and password.
   * This method is called by Passport.js during local authentication.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<UserWithoutPassword>} The authenticated user object (without password hash).
   * @throws {UnauthorizedException} If the email or password is invalid.
   */
  async validate(email: string, password: string): Promise<UserWithoutPassword> {
    this.logger.debug(`[validate] Executing LocalStragy for the login for the user: %o`, email);
    const user = (await this.authService.validateUser({ email, password }, { returnUser: true })) as UserWithoutPassword | undefined;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
