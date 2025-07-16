/**
 * app.config.ts
 *
 * Purpose:
 * - Defines the application-specific configuration.
 *
 * Logic Overview:
 * - Registers configuration keys and retrieves values from environment variables,
 *   providing default values where necessary.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { registerAs } from '@nestjs/config';

/**
 * Interface defining the structure of the application configuration.
 */
export interface AppConfig {
  /**
   * The name of the application.
   */
  name: string;
  /**
   * The current environment (e.g., 'development', 'production', 'docker').
   */
  env: string;
  /**
   * The full URL of the application (e.g., 'http://localhost:3000').
   */
  url: string;
  /**
   * The port on which the application listens.
   */
  port: number;
  /**
   * Time-to-live for global rate limiting in milliseconds.
   */
  globalRateLimitTtl: number;
  /**
   * Maximum number of requests allowed within the `globalRateLimitTtl` for global rate limiting.
   */
  globalRateLimitLimit: number;
}

/**
 * Registers the application configuration with NestJS.
 * Configuration values are loaded from environment variables.
 */
export default registerAs('app', (): Record<string, any> => {
  const port = parseInt(process.env.APP_PORT as string, 10);
  const host = process.env.APP_HOST;
  const protocol = process.env.APP_PROTOCOL;

  const appUrl = `${protocol}://${host}:${port}`;

  return {
    name: process.env.APP_NAME,
    env: process.env.NODE_ENV,
    url: appUrl,
    port: port,

    globalRateLimitTtl: parseInt(process.env.GLOBAL_RATE_LIMIT_TTL as string, 10),
    globalRateLimitLimit: parseInt(process.env.GLOBAL_RATE_LIMIT_LIMIT as string, 10),
  };
});
