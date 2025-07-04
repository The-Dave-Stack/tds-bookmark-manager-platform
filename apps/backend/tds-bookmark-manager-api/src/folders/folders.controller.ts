import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from '@tds/tds-bm-common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { PinoLogger } from 'nestjs-pino';

@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService, private readonly logger: PinoLogger) {
    this.logger.setContext(FoldersController.name);
  }

  @Post()
  create(@Body() createFolderDto: CreateFolderDto, @User() user: UserEntity) {
    return this.foldersService.create(createFolderDto, user);
  }

  @Get()
  findAll(@User() user: UserEntity) {
    this.logger.debug(`Finding all folders for user %o`, user);
    return this.foldersService.findAllByUser(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string) {
    return this.foldersService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @User('id') userId: string, 
    @Body() updateFolderDto: UpdateFolderDto
  ) {
    return this.foldersService.update(id, userId, updateFolderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string) {
    return this.foldersService.remove(id, userId);
  }
}