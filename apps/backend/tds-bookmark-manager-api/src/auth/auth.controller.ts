/**
 * auth.controller.ts
 *
 * Purpose:
 * - Handles incoming HTTP requests related to authentication and authorization.
 *
 * Logic Overview:
 * - Provides endpoints for user login, registration, logout, and profile retrieval.
 * - Manages JWT and CSRF tokens via cookies.
 * - Utilizes NestJS guards and decorators for authentication and role-based authorization.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Controller, Request, Get, Post, UseGuards, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User as UserFromReq } from './decorators/user.decorator';
import type { CookieOptions, Response } from 'express'; // Import Response from express
import * as crypto from 'crypto';

import type { CreateUserDto, User, UserWithoutPassword } from '@tds/tds-bm-common';
import { Cookies } from './cookies';
import { PinoLogger } from 'nestjs-pino';
import { SkipCsrfGuard } from './decorators/skip-csrf.decorator';

/**
 * Controller for handling authentication-related API requests.
 * Routes requests to the appropriate service methods and manages cookie-based tokens.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private logger: PinoLogger) {
    this.logger.setContext(AuthController.name);
  }

  /**
   * POST /api/v1/auth/login
   * Handles user login. Authenticates user credentials, generates JWT and CSRF tokens,
   * sets them as HTTP-only and regular cookies respectively, and returns user data.
   * Skips CSRF protection for this endpoint.
   * @param {UserWithoutPassword} user - The authenticated user object (from LocalAuthGuard).
   * @param {Response} response - The Express response object to set cookies.
   * @returns {Promise<UserWithoutPassword>} The user's public profile data.
   */
  @SkipCsrfGuard()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@UserFromReq() user: UserWithoutPassword, @Res({ passthrough: true }) response: Response): Promise<UserWithoutPassword> {
    this.logger.debug(`[login] Login attempt for the user: %o`, user);
    const { access_token, ...userData} = await this.authService.login(user);

    this._addToCookies<string>(response, Cookies.ACCESS_TOKEN, access_token);
    this._addToCookies<string>(response, Cookies.CSRF_TOKEN, crypto.randomBytes(32).toString('hex'), { httpOnly: false });

    return userData;
  }

  /**
   * POST /api/v1/auth/logout
   * Handles user logout. Clears all authentication-related cookies (access token, CSRF token).
   * Requires JWT authentication.
   * @param {Response} response - The Express response object to clear cookies.
   * @returns {object} A success message.
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    Object.values(Cookies).forEach(cookieName => {
      response.clearCookie(cookieName);
    })
    return { message: 'Logged out successfully' };
  }

  /**
   * POST /api/v1/auth/register
   * Handles new user registration. Creates a new user, generates JWT and CSRF tokens,
   * sets them as cookies, and returns the newly registered user's data.
   * @param {CreateUserDto} createUserDto - The data for creating the new user.
   * @param {Response} response - The Express response object to set cookies.
   * @returns {Promise<UserWithoutPassword>} The newly registered user's public profile data.
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response): Promise<UserWithoutPassword> {
    const { access_token, ...userData } = await this.authService.register(createUserDto);

    this._addToCookies<string>(response, Cookies.ACCESS_TOKEN, access_token);
    this._addToCookies<string>(response, Cookies.CSRF_TOKEN, crypto.randomBytes(32).toString('hex'), { httpOnly: false });

    return userData;
  }

  /**
   * GET /api/v1/auth/profile
   * Retrieves the profile of the currently authenticated user.
   * Requires JWT authentication.
   * @param {UserWithoutPassword} user - The authenticated user object (from JwtAuthGuard).
   * @returns {UserWithoutPassword} The authenticated user's public profile data.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@UserFromReq() user: UserWithoutPassword): UserWithoutPassword {
    return user;
  }

  /**
   * POST /api/v1/auth/admin-data
   * Example endpoint demonstrating admin-only access.
   * Requires JWT authentication and the 'admin' role.
   * @param {Request} req - The Express request object, containing user data from the guard.
   * @returns {object} A message indicating admin access and the user data.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin-data')
  getAdminData(@Request() req: any) {
    return { message: 'This is admin-only data', user: req.user };
  }

  /**
   * Private helper method to set a cookie on the Express response object.
   * Configures cookies with security best practices (httpOnly, secure, sameSite).
   * @template T The type of the cookie value.
   * @param {Response} response - The Express response object.
   * @param {Cookies} cookieName - The name of the cookie to set.
   * @param {T} cookieValue - The value of the cookie.
   * @param {CookieOptions} [cookieOptions] - Additional options for the cookie.
   */
  private _addToCookies<T>(response: Response, cookieName: Cookies, cookieValue: T, cookieOptions?: CookieOptions) {
    response.cookie(cookieName, cookieValue, {
      httpOnly: true, // The browser's JS cannot access the cookie
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production (HTTPS)
      sameSite: 'strict', // Helps prevent CSRF attacks
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiration
      ...cookieOptions,
    });
  }
}
