/**
 * cookies.ts
 *
 * Purpose:
 * - Defines an enum for standardizing cookie names used in the application.
 *
 * Logic Overview:
 * - Provides a centralized list of cookie names to ensure consistency and avoid typos.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

/**
 * Enum defining the names of cookies used by the application.
 */
export enum Cookies {
  /**
   * The name for the JWT access token cookie.
   */
  ACCESS_TOKEN = 'access_token',
  /**
   * The name for the CSRF token cookie.
   */
  CSRF_TOKEN = 'csrf-token',
}
