/**
 * create-user.dto.ts
 *
 * Purpose:
 * - Defines the Data Transfer Object (DTO) for creating a new user account.
 *
 * Logic Overview:
 * - Specifies the required fields and validation rules for user registration.
 * - Includes validation for username, password (minimum length), and email format.
 * - Uses `class-validator` decorators for validation.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { User } from '../../interfaces/user.interface.js';

/**
 * DTO for creating a new user account.
 */
export class CreateUserDto implements Pick<User, 'username' | 'password' | 'email' | 'firstName' | 'lastName'> {
  /**
   * The username for the new user. Must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username!: string;

  /**
   * The password for the new user. Must be a non-empty string and at least 8 characters long.
   */
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  /**
   * The email address for the new user. Must be a valid email format and is required.
   */
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  /**
   * Optional first name of the user.
   */
  @IsString()
  firstName?: string;

  /**
   * Optional last name of the user.
   */
  @IsString()
  lastName?: string;
}
