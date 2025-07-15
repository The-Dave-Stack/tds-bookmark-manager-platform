/**
 * create-folder.dto.ts
 *
 * Purpose:
 * - Defines the Data Transfer Object (DTO) for creating a new folder.
 *
 * Logic Overview:
 * - Specifies the expected fields and validation rules for incoming data when a user wants to create a folder.
 * - Uses `class-validator` decorators for validation.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO for creating a new folder.
 */
export class CreateFolderDto {
  /**
   * The name of the folder. Must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty()
  name!: string;

  /**
   * Optional UUID of the parent folder. Can be `null` if it's a top-level folder.
   * (Note: MVP specifies single-level folders, so this might always be null in practice for now).
   */
  @IsUUID()
  @IsOptional()
  parentId?: string | null;
}
