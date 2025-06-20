import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { FolderEntity } from './entities/folder.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateFolderDto, UpdateFolderDto } from '@tds/tds-bm-common';
import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(FolderEntity)
    private readonly foldersRepository: Repository<FolderEntity>,
    @InjectRepository(BookmarkEntity) // Inject Bookmark repository to update bookmarks on folder deletion
    private readonly bookmarksRepository: Repository<BookmarkEntity>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FoldersService.name);
  }

  async create(createFolderDto: CreateFolderDto, user: UserEntity): Promise<FolderEntity> {
    const entityToCreate: Partial<FolderEntity> = {
      name: createFolderDto.name,
      user: user,
      // Conditionally add the parentId only if it's a valid string.
      // If parentId is null or undefined from the DTO, it will be omitted,
      // which TypeORM correctly interprets as NULL in the database for a nullable column.
      ...(createFolderDto.parentId && { parentId: createFolderDto.parentId }),
    };

    const folder = this.foldersRepository.create(entityToCreate);
    return this.foldersRepository.save(folder);
  }

  findAllByUser(user: UserEntity): Promise<FolderEntity[]> {
    return this.foldersRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: string, userId: string): Promise<FolderEntity> {
    const folder = await this.foldersRepository.findOne({ where: { id, user: { id: userId } } });
    if (!folder) {
      throw new NotFoundException(`Folder with ID "${id}" not found.`);
    }
    return folder;
  }

  async update(id: string, userId: string, updateFolderDto: UpdateFolderDto): Promise<FolderEntity> {
    const { parentId, ...restOfDto } = updateFolderDto;

    // 1. Prevent circular reference
    if (id === parentId) {
      throw new BadRequestException('A folder cannot be its own parent.');
    }

    // 2. Verify ownership and existence
    const folder = await this.findOne(id, userId);

    // 3. Preload the entity with the simple properties
    const preloadedFolder = await this.foldersRepository.preload({
        id: folder.id,
        ...restOfDto,
    });

    if (!preloadedFolder) {
        throw new InternalServerErrorException('Could not process folder for update.');
    }

    // 4. Handle the parentId separately to manage the null case.
    // The `in` operator checks if the property was present in the DTO, even if its value was null.
    if ('parentId' in updateFolderDto) {
        // This explicitly converts a DTO's `null` to an entity's `undefined`
        preloadedFolder.parentId = parentId ?? undefined;
    }

    return this.foldersRepository.save(preloadedFolder);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId); // Verifies ownership

    // Move bookmarks from the deleted folder to the root (folderId = null)
    await this.bookmarksRepository.update(
        { folder: { id }, user: { id: userId } },
        { folder: undefined }
    );

    const result = await this.foldersRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Folder with ID "${id}" not found for deletion.`);
    }
  }
}