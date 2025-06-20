import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';
import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, BookmarkEntity])],
  controllers: [StatisticsController],
  providers: [StatisticsService]
})
export class StatisticsModule {}