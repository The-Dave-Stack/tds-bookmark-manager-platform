/**
 * create-bookmark.dto.ts
 *
 * Purpose:
 * - Defines the Data Transfer Object (DTO) for creating a new bookmark.
 *
 * Logic Overview:
 * - Specifies the expected fields and validation rules for incoming data when a user wants to add a bookmark.
 * - Uses `class-validator` decorators for validation.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

/**
 * DTO for creating a new bookmark.
 */
export class CreateBookmarkDto {
  /**
   * The URL of the bookmark. Must be a valid URL and is required.
   */
  @IsUrl({}, { message: 'Must be a valid URL' })
  @IsNotEmpty({ message: 'URL is required' })
  url!: string;

  /**
   * Optional title for the bookmark. If not provided, the backend may attempt to fetch it.
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * Optional URL for the bookmark's favicon.
   */
  @IsUrl({}, { message: 'Must be a valid URL' })
  @IsOptional()
  faviconUrl?: string;

  /**
   * Optional UUID of the folder to which the bookmark belongs.
   * If not provided, the bookmark will be placed in the root.
   */
  @IsUUID()
  @IsOptional()
  folderId?: string;

  /**
   * Optional boolean indicating if the bookmark should be hidden. Defaults to false.
   */
  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;
}
