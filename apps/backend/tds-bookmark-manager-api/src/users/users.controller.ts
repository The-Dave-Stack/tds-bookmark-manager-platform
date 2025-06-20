import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDto, User } from '@tds/tds-bm-common';

import { CacheInterceptor } from '@nestjs/cache-manager';
import { PinoLogger } from 'nestjs-pino';
import { UsersService } from './users.service';
import { SkipCsrfGuard } from '../auth/decorators/skip-csrf.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private readonly logger: PinoLogger) {
    this.logger.setContext(UsersController.name);
  }

  @Get('checkAdmins')
  @UseInterceptors(CacheInterceptor)
  async checkAdmins(): Promise<boolean> {
    return await this.usersService.hasAdmins();
  }

  @SkipCsrfGuard()
  @Post('setupAdmin')
  async setupAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(`Setup admin: %o`, createUserDto);
    return await this.usersService.setupAdmin(createUserDto);
  }
}
