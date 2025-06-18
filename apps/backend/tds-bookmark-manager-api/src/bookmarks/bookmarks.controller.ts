import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CreateBookmarkDto, UpdateBookmarkDto } from '@tds/tds-bm-common';

@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto, @User() user: UserEntity) {
    return this.bookmarksService.create(createBookmarkDto, user);
  }

  @Get()
  findAll(
    @User() user: UserEntity,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: 'createdAt' | 'title' | 'clickCount',
  ) {
    return this.bookmarksService.findAllByUser(user, search, sortBy);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string) {
    return this.bookmarksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @User('id') userId: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(id, userId, updateBookmarkDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string) {
    return this.bookmarksService.remove(id, userId);
  }

  @Post(':id/click')
  @HttpCode(HttpStatus.NO_CONTENT)
  incrementClick(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string) {
    return this.bookmarksService.incrementClickCount(id, userId);
  }
}