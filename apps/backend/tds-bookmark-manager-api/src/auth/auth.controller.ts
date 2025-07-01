import { Controller, Request, Post, UseGuards, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private logger: PinoLogger) {
    this.logger.setContext(AuthController.name);
  }

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

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    Object.values(Cookies).forEach(cookieName => {
      response.clearCookie(cookieName);
    })
    return { message: 'Logged out successfully' };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response): Promise<UserWithoutPassword> {
    const { access_token, ...userData } = await this.authService.register(createUserDto);

    this._addToCookies<string>(response, Cookies.ACCESS_TOKEN, access_token);
    this._addToCookies<string>(response, Cookies.CSRF_TOKEN, crypto.randomBytes(32).toString('hex'), { httpOnly: false });

    return userData;
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@UserFromReq() user: UserWithoutPassword): UserWithoutPassword {
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin-data')
  getAdminData(@Request() req: any) {
    return { message: 'This is admin-only data', user: req.user };
  }

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
