import { AuthModule } from '../auth/auth.module';
import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';
import { BookmarksModule } from '../bookmarks/bookmarks.module';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [AuthModule, BookmarksModule, TypeOrmModule.forFeature([BookmarkEntity])],
  controllers: [WebhookController],
  providers: [BookmarksService], // BookmarksService is needed by WebhookController
})
export class WebhookModule {}