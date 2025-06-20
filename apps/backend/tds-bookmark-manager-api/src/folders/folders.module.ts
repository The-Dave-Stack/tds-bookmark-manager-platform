import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';
import { FolderEntity } from './entities/folder.entity';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FolderEntity, BookmarkEntity])],
  controllers: [FoldersController],
  providers: [FoldersService],
})
export class FoldersModule {}