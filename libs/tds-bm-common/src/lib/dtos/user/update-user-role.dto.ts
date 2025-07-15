/**
 * update-user-role.dto.ts
 *
 * Purpose:
 * - Defines the Data Transfer Object (DTO) for updating a user's roles.
 *
 * Logic Overview:
 * - Specifies an array of roles to be assigned to a user.
 * - Ensures that each role in the array is a valid `Role` enum value.
 * - Uses `class-validator` decorators for validation.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { IsArray, IsEnum } from 'class-validator';

import { Role } from '../../interfaces/user.interface.js';

/**
 * DTO for updating a user's roles.
 */
export class UpdateUserRoleDto {
  /**
   * An array of roles to be assigned to the user.
   * Each element must be a valid value from the `Role` enum.
   */
  @IsArray()
  @IsEnum(Role, { each: true })
  roles!: Role[];
}
