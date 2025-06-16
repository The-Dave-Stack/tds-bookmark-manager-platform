import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDto, User } from '@tds/tds-bm-common';

import { CacheInterceptor } from '@nestjs/cache-manager';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('checkAdmins')
  @UseInterceptors(CacheInterceptor)
  async checkAdmins(): Promise<boolean> {
    return await this.usersService.hasAdmins();
  }

  @Post('setupAdmin')
  async setupAdmin(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.setupAdmin(createUserDto);
  }
}
