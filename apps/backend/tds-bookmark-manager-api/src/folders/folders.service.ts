/**
 * folders.service.ts
 *
 * Purpose:
 * - Provides business logic and data access operations for folder management.
 *
 * Logic Overview:
 * - Handles CRUD operations for folders, including creating, retrieving, updating, and deleting.
 * - Manages relationships with bookmarks, especially when folders are deleted (moving bookmarks to root).
 * - Includes a virtual "Unorganized" folder for bookmarks not assigned to any specific folder.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { FolderEntity } from './entities/folder.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateFolderDto, UpdateFolderDto } from '@tds/tds-bm-common';
import { BookmarkEntity } from '../bookmarks/entities/bookmark.entity';

/**
 * Service responsible for all folder-related business logic and database interactions.
 * It handles operations such as creating, retrieving, updating, and deleting folders,
 * and manages the association of bookmarks with folders.
 */
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

  /**
   * Creates a new folder for a given user.
   * @param {CreateFolderDto} createFolderDto - The data for creating the folder.
   * @param {UserEntity} user - The user entity who is creating the folder.
   * @returns {Promise<FolderEntity>} The newly created folder entity.
   */
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

  /**
   * Finds all folders for a specific user, including a virtual "Unorganized" folder
   * that contains all bookmarks not assigned to any specific folder.
   * @param {UserEntity} user - The user entity whose folders are to be found.
   * @returns {Promise<FolderEntity[]>} An array of folder entities, including the "Unorganized" folder.
   */
  async findAllByUser(user: UserEntity): Promise<FolderEntity[]> {
    const folders = await this.foldersRepository.find({ where: { user: { id: user.id } }, relations: ['bookmarks'] });
    const now = new Date();
    const rootBookmarks = await this.bookmarksRepository.find({ where: { folder: IsNull(), user: { id: user.id } } });
    this.logger.debug(`Found ${rootBookmarks.length} root bookmarks for user %o: %o`, user, rootBookmarks);
    const rootFolder: FolderEntity = {
      id: 'unorganized',
      name: 'Unorganized',
      user: user,
      parentId: undefined,
      bookmarks: rootBookmarks,
      createdAt: now,
      updatedAt: now
    };
    const foldersWithRoot = [rootFolder, ...folders];
    this.logger.debug(`Found ${foldersWithRoot.length} folders for user %o: %o`, user, foldersWithRoot);
    return foldersWithRoot;
  }

  /**
   * Finds a single folder by its ID and ensures it belongs to the specified user.
   * @param {string} id - The ID of the folder to find.
   * @param {string} userId - The ID of the user who owns the folder.
   * @returns {Promise<FolderEntity>} The found folder entity.
   * @throws {NotFoundException} If the folder with the given ID is not found or does not belong to the user.
   */
  async findOne(id: string, userId: string): Promise<FolderEntity> {
    const folder = await this.foldersRepository.findOne({ where: { id, user: { id: userId } } });
    if (!folder) {
      throw new NotFoundException(`Folder with ID "${id}" not found.`);
    }
    return folder;
  }

  /**
   * Updates an existing folder.
   * Prevents a folder from being set as its own parent.
   * @param {string} id - The ID of the folder to update.
   * @param {string} userId - The ID of the user who owns the folder.
   * @param {UpdateFolderDto} updateFolderDto - The DTO containing the updated folder data.
   * @returns {Promise<FolderEntity>} The updated folder entity.
   * @throws {BadRequestException} If a folder attempts to set itself as its own parent.
   * @throws {NotFoundException} If the folder is not found or does not belong to the user.
   * @throws {InternalServerErrorException} If the folder could not be processed for update.
   */
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

  /**
   * Deletes a folder from the database.
   * Before deletion, all bookmarks within the deleted folder are moved to the root (unassigned).
   * @param {string} id - The ID of the folder to delete.
   * @param {string} userId - The ID of the user who owns the folder.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the folder is not found or could not be deleted.
   */
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
