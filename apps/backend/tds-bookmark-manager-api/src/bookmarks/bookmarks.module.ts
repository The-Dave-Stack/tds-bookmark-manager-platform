import { BookmarkEntity } from './entities/bookmark.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity])]
})
export class BookmarksModule {}