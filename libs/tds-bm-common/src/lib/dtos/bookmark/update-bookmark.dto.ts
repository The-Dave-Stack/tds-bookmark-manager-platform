/**
 * update-bookmark.dto.ts
 *
 * Purpose:
 * - Defines the Data Transfer Object (DTO) for updating an existing bookmark.
 *
 * Logic Overview:
 * - Specifies the optional fields and validation rules for incoming data when a user wants to modify a bookmark.
 * - All fields are optional as a partial update is allowed.
 * - Uses `class-validator` decorators for validation.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { IsBoolean, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

/**
 * DTO for updating an existing bookmark.
 * All fields are optional to allow for partial updates.
 */
export class UpdateBookmarkDto {
  /**
   * Optional new URL for the bookmark. Must be a valid URL if provided.
   */
  @IsUrl({}, { message: 'Must be a valid URL' })
  @IsOptional()
  url?: string;

  /**
   * Optional new title for the bookmark.
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * Optional new URL for the bookmark's favicon.
   */
  @IsUrl({}, { message: 'Must be a valid URL' })
  @IsOptional()
  faviconUrl?: string;

  /**
   * Optional new UUID of the folder to which the bookmark belongs.
   * Can be `null` to move the bookmark to the root folder.
   */
  @IsUUID()
  @IsOptional()
  folderId?: string | null;

  /**
   * Optional boolean indicating if the bookmark should be hidden or shown.
   */
  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;
}
