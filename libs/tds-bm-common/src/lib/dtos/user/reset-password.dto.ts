/**
 * reset-password.dto.ts
 *
 * Purpose:
 * - Defines the Data Transfer Object (DTO) for resetting a user's password.
 *
 * Logic Overview:
 * - Specifies the required token (from the reset link) and the new password for resetting.
 * - Includes validation for the new password's minimum length.
 * - Uses `class-validator` decorators for validation.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO for resetting a user's password.
 */
export class ResetPasswordDto {
  /**
   * The password reset token received via email. Must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty()
  token!: string;

  /**
   * The new password for the user. Must be a non-empty string and at least 8 characters long.
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;
}
