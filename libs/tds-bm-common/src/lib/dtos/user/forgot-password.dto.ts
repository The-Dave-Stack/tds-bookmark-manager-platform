/**
 * forgot-password.dto.ts
 *
 * Purpose:
 * - Defines the Data Transfer Object (DTO) for initiating a password reset request.
 *
 * Logic Overview:
 * - Specifies the email field required to request a password reset link.
 * - Uses `class-validator` decorators for validation.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO for initiating a password reset request.
 */
export class ForgotPasswordDto {
  /**
   * The email address associated with the account for which the password reset is requested.
   * Must be a valid email format and is required.
   */
  @IsEmail({}, { message: 'A valid email is required' })
  @IsNotEmpty()
  email!: string;
}
