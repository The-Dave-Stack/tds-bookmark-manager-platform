/**
 * auth.service.ts
 *
 * Purpose:
 * - Handles core authentication and authorization logic.
 *
 * Logic Overview:
 * - Manages user login, registration, password reset, and token validation.
 * - Integrates with `UsersService` for user data management and `EmailService` for sending emails.
 * - Uses `JwtService` to sign and verify JSON Web Tokens.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { CreateUserDto, JwtPayloadDto, LoginUserDto, TokenDto, UserWithoutPassword, mapEntityToDto } from '@tds/tds-bm-common';

import { EmailService } from '../email/email.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { UsersService } from '../users/users.service';

/**
 * Service responsible for user authentication and authorization processes.
 * It orchestrates user validation, token generation, and password management flows.
 */
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private emailService: EmailService, private logger: PinoLogger) {
    this.logger.setContext(AuthService.name);
  }

  /**
   * Validates user credentials (email and password) for login.
   * @param {Pick<LoginUserDto, 'email' | 'password'>} data - The user's email and password.
   * @param {object} [options] - Options for validation.
   * @param {boolean} [options.returnUser=false] - If true, returns the `UserWithoutPassword` object on success; otherwise, returns a boolean.
   * @returns {Promise<UserWithoutPassword | boolean>} The user object (if `returnUser` is true) or a boolean indicating validation success.
   */
  async validateUser(data: Pick<LoginUserDto, 'email' | 'password'>, options: { returnUser: boolean } = { returnUser: false }): Promise<UserWithoutPassword | boolean> {
    this.logger.debug(`[validateUser] Login attempt for the user: %o`, data);
    const result = await this.usersService.validateUserCredentials(data);

    if (!result) {
      return false;
    }

    if (options.returnUser) {
      return result;
    }

    return !!result;
  }

  /**
   * Validates a user based on their API token.
   * Used for external integrations like webhooks.
   * @param {string} token - The API token to validate.
   * @returns {Promise<UserWithoutPassword | null>} The user object if the token is valid, otherwise null.
   */
  async validateUserByApiKey(token: string): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findOneByApiToken(token);
    if (user) {
      return mapEntityToDto(user, UserWithoutPassword);
    }
    return null;
  }

  /**
   * Initiates the "forgot password" process.
   * Creates a password reset token for the given email and sends a reset email to the user.
   * Errors are silently swallowed to prevent user enumeration attacks.
   * @param {string} email - The email address of the user who forgot their password.
   * @returns {Promise<void>}
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      const token = await this.usersService.createPasswordResetToken(email);
      const user = await this.usersService.findOneByEmail({ email }, { withoutPassword: false });
      await this.emailService.sendPasswordResetEmail(user, token);
    } catch (error) {
      // Silently fail to prevent user enumeration attacks
      this.logger.warn(`Forgot password attempt for ${email} failed, but swallowing error.`);
    }
  }

  /**
   * Resets a user's password using a valid reset token.
   * After successful reset, it logs the user in and returns a new JWT token.
   * @param {string} token - The password reset token.
   * @param {string} newPass - The new password for the user.
   * @returns {Promise<TokenDto>} An object containing the new access token.
   */
  async resetPassword(token: string, newPass: string): Promise<TokenDto> {
    const user = await this.usersService.resetUserPassword(token, newPass);
    // Log the user in and return a new JWT token
    const payload: JwtPayloadDto = { username: user.username, sub: user.email, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Handles user login.
   * Generates an access token and returns it along with the user's public information.
   * @param {UserWithoutPassword} user - The validated user object (without password hash).
   * @returns {Promise<TokenDto & UserWithoutPassword>} An object containing the access token and user details.
   */
  async login(user: UserWithoutPassword): Promise<TokenDto & UserWithoutPassword> {
    this.logger.debug(`[login] Login attempt for the user: %o`, user);
    return { ...this._getToken(user), ...user };
  }

  /**
   * Handles new user registration.
   * Creates a new user and automatically logs them in by generating an access token.
   * @param {CreateUserDto} data - The data for creating the new user.
   * @returns {Promise<TokenDto & UserWithoutPassword>} An object containing the access token and the newly registered user's details.
   */
  async register(data: CreateUserDto): Promise<TokenDto & UserWithoutPassword> {
    const newUser = await this.usersService.create(data);
    return { ...this._getToken(newUser), ...newUser };
  }

  /**
   * Private helper method to generate a JWT access token for a given user.
   * @param {UserWithoutPassword} user - The user object for whom to generate the token.
   * @returns {TokenDto} An object containing the generated access token.
   */
  private _getToken(user: UserWithoutPassword): TokenDto {
    const payload: JwtPayloadDto = {
      username: user.username,
      sub: `${user.email}`,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
