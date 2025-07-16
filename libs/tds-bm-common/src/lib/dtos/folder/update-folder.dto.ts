/**
 * update-folder.dto.ts
 *
 * Purpose:
 * - Defines the Data Transfer Object (DTO) for updating an existing folder.
 *
 * Logic Overview:
 * - Specifies the optional fields and validation rules for incoming data when a user wants to modify a folder.
 * - All fields are optional as a partial update is allowed.
 * - Uses `class-validator` decorators for validation.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO for updating an existing folder.
 * All fields are optional to allow for partial updates.
 */
export class UpdateFolderDto {
  /**
   * Optional new name for the folder.
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * Optional new UUID of the parent folder. Can be `null` to move the folder to the root.
   * (Note: MVP specifies single-level folders, so this might always be null in practice for now).
   */
  @IsUUID()
  @IsOptional()
  parentId?: string | null;
}
