import { FolderEntity } from './entities/folder.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FolderEntity])]
})
export class FoldersModule {}