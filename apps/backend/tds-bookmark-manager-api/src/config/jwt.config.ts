/**
 * jwt.config.ts
 *
 * Purpose:
 * - Defines the configuration for JSON Web Tokens (JWT) used in authentication.
 *
 * Logic Overview:
 * - Registers configuration keys for JWT secret and expiration time,
 *   retrieving values from environment variables.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { registerAs } from '@nestjs/config';

/**
 * Interface defining the structure of the JWT configuration.
 */
export interface JwtConfig {
  /**
   * The secret key used for signing and verifying JWTs.
   */
  secret: string;
  /**
   * The expiration time for JWTs (e.g., '1h', '7d').
   */
  expiresIn: string;
}

/**
 * Registers the JWT configuration with NestJS.
 * Configuration values are loaded from environment variables.
 */
export default registerAs(
  'jwt',
  (): Record<string, any> => ({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  }),
);
