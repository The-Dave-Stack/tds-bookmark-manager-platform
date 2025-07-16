/**
 * token.dto.ts
 *
 * Purpose:
 * - Defines the structure for an authentication token response.
 *
 * Logic Overview:
 * - Simple DTO to encapsulate the access token returned upon successful authentication.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

/**
 * Represents the response containing an access token after successful authentication.
 */
export interface TokenDto {
  /**
   * The JWT access token.
   */
  access_token: string;
}
