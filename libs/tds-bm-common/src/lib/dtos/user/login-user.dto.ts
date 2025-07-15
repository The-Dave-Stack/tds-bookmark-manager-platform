/**
 * login-user.dto.ts
 *
 * Purpose:
 * - Defines the Data Transfer Object (DTO) for user login.
 *
 * Logic Overview:
 * - Specifies the required fields (email and password) for user authentication.
 * - Includes validation for email format and password minimum length.
 * - Uses `class-validator` decorators for validation.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { User } from '../../interfaces/user.interface.js';

/**
 * DTO for user login.
 */
export class LoginUserDto implements Pick<User, 'password' | 'email'> {
  /**
   * The user's password. Must be a non-empty string and at least 8 characters long.
   */
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  /**
   * The user's email address. Must be a valid email format and is required.
   */
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}
