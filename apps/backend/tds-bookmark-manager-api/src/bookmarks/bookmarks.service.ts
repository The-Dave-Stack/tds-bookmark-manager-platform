/**
 * bookmarks.service.ts
 *
 * Purpose:
 * - Provides business logic and data access operations for bookmark management.
 *
 * Logic Overview:
 * - Handles CRUD operations for bookmarks, including automatic title/favicon retrieval,
 *   search, and click tracking.
 * - Interacts with the `BookmarkEntity` repository and integrates with external services
 *   like `axios` and `cheerio` for web scraping.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { BookmarkEntity } from './entities/bookmark.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateBookmarkDto, UpdateBookmarkDto } from '@tds/tds-bm-common';

/**
 * Service responsible for all bookmark-related business logic and database interactions.
 * It handles operations such as creating, retrieving, updating, and deleting bookmarks,
 * as well as fetching metadata from URLs and tracking clicks.
 */
@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private readonly bookmarksRepository: Repository<BookmarkEntity>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(BookmarksService.name);
  }

  /**
   * Creates a new bookmark for a given user.
   * Automatically attempts to fetch the page title and a plausible favicon URL if not provided.
   * @param {CreateBookmarkDto} createBookmarkDto - The data for creating the bookmark.
   * @param {UserEntity} user - The user entity who is creating the bookmark.
   * @returns {Promise<BookmarkEntity>} The newly created bookmark entity.
   */
  async create(createBookmarkDto: CreateBookmarkDto, user: UserEntity): Promise<BookmarkEntity> {
    const bookmarkData: Partial<BookmarkEntity> = {
      ...createBookmarkDto,
      user,
      folder: createBookmarkDto.folderId ? ({ id: createBookmarkDto.folderId } as any) : undefined,
    };

    // Fetch title automatically only if not provided by the user.
    if (!bookmarkData.title) {
      try {
        this.logger.debug(`Title not provided. Fetching from URL: ${bookmarkData.url}`);
        const response = await axios.get(bookmarkData.url as string, { timeout: 5000 });
        const $ = cheerio.load(response.data);
        bookmarkData.title = $('title').text() || bookmarkData.url; // Fallback to URL if title is empty
      } catch (error) {
        this.logger.warn(`Failed to fetch title for URL: ${bookmarkData.url}. Error: ${error}`);
        bookmarkData.title = bookmarkData.url; // Fallback to URL on any error
      }
    }

    // Construct a plausible favicon URL.
    try {
      const url = new URL(bookmarkData.url as string);
      bookmarkData.faviconUrl = `${url.origin}/favicon.ico`;
    } catch (error) {
      this.logger.warn(`Could not parse URL to generate favicon URL for: ${bookmarkData.url}`);
      bookmarkData.faviconUrl = undefined;
    }

    const bookmark = this.bookmarksRepository.create(bookmarkData);
    return this.bookmarksRepository.save(bookmark);
  }

  /**
   * Finds all bookmarks for a specific user, with optional search and sorting capabilities.
   * @param {UserEntity} user - The user entity whose bookmarks are to be found.
   * @param {string} [search] - Optional search term to filter bookmarks by title or URL (case-insensitive).
   * @param {'createdAt' | 'title' | 'clickCount'} [sortBy='createdAt'] - Optional field to sort bookmarks by.
   * @returns {Promise<BookmarkEntity[]>} An array of bookmark entities belonging to the user.
   */
  findAllByUser(user: UserEntity, search?: string, sortBy?: 'createdAt' | 'title' | 'clickCount'): Promise<BookmarkEntity[]> {
    const findOptions: any = {
        where: { user: { id: user.id } },
        order: {},
        relations: ['folder'],
    };

    // Add sorting logic
    if (sortBy === 'title') {
        findOptions.order.title = 'ASC';
    } else if (sortBy === 'clickCount') {
        findOptions.order.clickCount = 'DESC';
    } else {
        findOptions.order.createdAt = 'DESC'; // Default sort
    }

    // Add search logic if a search term is provided
    if (search) {
        // This creates an OR condition: WHERE (user.id = :id AND title ILIKE :search) OR (user.id = :id AND url ILIKE :search)
        findOptions.where = [
            { ...findOptions.where, title: ILike(`%${search}%`) },
            { ...findOptions.where, url: ILike(`%${search}%`) },
        ];
    }

    return this.bookmarksRepository.find(findOptions);
  }

  /**
   * Finds a single bookmark by its ID and ensures it belongs to the specified user.
   * @param {string} id - The ID of the bookmark to find.
   * @param {string} userId - The ID of the user who owns the bookmark.
   * @returns {Promise<BookmarkEntity>} The found bookmark entity.
   * @throws {NotFoundException} If the bookmark with the given ID is not found or does not belong to the user.
   */
  async findOne(id: string, userId: string): Promise<BookmarkEntity> {
    const bookmark = await this.bookmarksRepository.findOne({ where: { id, user: { id: userId } } });
    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID "${id}" not found`);
    }
    return bookmark;
  }

  /**
   * Updates an existing bookmark.
   * @param {string} id - The ID of the bookmark to update.
   * @param {string} userId - The ID of the user who owns the bookmark.
   * @param {UpdateBookmarkDto} updateBookmarkDto - The DTO containing the updated bookmark data.
   * @returns {Promise<BookmarkEntity>} The updated bookmark entity.
   * @throws {NotFoundException} If the bookmark is not found or does not belong to the user.
   * @throws {InternalServerErrorException} If the bookmark could not be processed for update.
   */
  async update(id: string, userId: string, updateBookmarkDto: UpdateBookmarkDto): Promise<BookmarkEntity> {
    const bookmark = await this.findOne(id, userId); // Ensures bookmark exists and belongs to user

    const updatedBookmark = await this.bookmarksRepository.preload({
      id: bookmark.id,
      ...updateBookmarkDto,
    });

    if (updateBookmarkDto.folderId === null) {
      (updatedBookmark as any).folder = null;
    }

    if (!updatedBookmark) {
      throw new InternalServerErrorException('Could not process bookmark for update.');
    }

    return this.bookmarksRepository.save(updatedBookmark);
  }

  /**
   * Deletes a bookmark from the database.
   * @param {string} id - The ID of the bookmark to delete.
   * @param {string} userId - The ID of the user who owns the bookmark.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the bookmark is not found or could not be deleted.
   */
  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId); // Handles existence and ownership check
    const result = await this.bookmarksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bookmark with ID "${id}" could not be deleted.`);
    }
  }

  /**
   * Increments the click count for a specific bookmark and updates its last clicked timestamp.
   * @param {string} id - The ID of the bookmark to update.
   * @param {string} userId - The ID of the user who owns the bookmark.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the bookmark is not found or does not belong to the user.
   */
  async incrementClickCount(id: string, userId: string): Promise<void> {
    const result = await this.bookmarksRepository.update(
        { id, user: { id: userId } },
        { 
            clickCount: () => '"click_count" + 1',
            lastClickedAt: new Date()
        }
    );

    if (result.affected === 0) {
        throw new NotFoundException(`Bookmark with ID "${id}" not found to increment click count.`);
    }
  }
}
