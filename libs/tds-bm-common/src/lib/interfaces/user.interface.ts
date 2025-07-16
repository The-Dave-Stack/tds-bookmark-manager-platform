/**
 * user.interface.ts
 *
 * Purpose:
 * - Defines the data structures for User objects and roles.
 *
 * Logic Overview:
 * - Provides interfaces for user data, distinguishing between full user data and data exposed without sensitive information like passwords.
 * - Also defines user roles.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Expose } from "class-transformer";

/**
 * Represents a user object with sensitive information (like password) excluded,
 * typically for API responses.
 */
export class UserWithoutPassword {
  /**
   * Unique identifier of the user.
   */
  @Expose()
  id?: string;

  /**
   * The username of the user.
   */
  @Expose()
  username!: string;

  /**
   * The email address of the user.
   */
  @Expose()
  email!: string;

  /**
   * The first name of the user.
   */
  @Expose()
  firstName?: string;

  /**
   * The last name of the user.
   */
  @Expose()
  lastName?: string;

  /**
   * Indicates if the user account is active.
   */
  @Expose()
  isActive?: boolean;

  /**
   * An array of roles assigned to the user.
   */
  @Expose()
  roles!: Role[];

  /**
   * Timestamp when the user account was created.
   */
  @Expose()
  createdAt?: Date;

  /**
   * Timestamp when the user account was last updated.
   */
  @Expose()
  updatedAt?: Date;

  /**
   * Timestamp of the user's last login.
   */
  @Expose()
  lastLogin?: Date;

  /**
   * The API token for the user's webhook.
   */
  @Expose()
  apiToken?: string;
}

/**
 * Represents a full user object, including sensitive information like the password.
 * Used internally or for registration.
 */
export class User extends UserWithoutPassword {
  /**
   * The user's password. Optional, as it might be hashed or not always present.
   */
  password?: string;
}

/**
 * Enum defining the possible roles a user can have within the application.
 */
export enum Role {
  /**
   * Administrator role with elevated privileges.
   */
  ADMIN = 'ADMIN',
  /**
   * Standard user role.
   */
  USER = 'USER',
}
