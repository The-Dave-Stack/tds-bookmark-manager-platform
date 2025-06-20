import { BookmarkEntity } from './entities/bookmark.entity';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}