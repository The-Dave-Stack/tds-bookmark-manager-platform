import { Controller, Request, Post, UseGuards, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';

import type { CreateUserDto, TokenDto, UserWithoutPassword } from '@tds/tds-bm-common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req: any): Promise<TokenDto> {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  logout(@Request() req: any): void {
    console.log('User logged out:', req.user);
    // TODO: Implement logout logic if needed, e.g., invalidate session or token
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@User() user: any): UserWithoutPassword {
    return user as UserWithoutPassword;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin-data')
  getAdminData(@Request() req: any) {
    return { message: 'This is admin-only data', user: req.user };
  }
}
