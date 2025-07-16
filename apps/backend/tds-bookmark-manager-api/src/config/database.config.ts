/**
 * database.config.ts
 *
 * Purpose:
 * - Defines the database configuration for the application.
 *
 * Logic Overview:
 * - Provides functions to retrieve PostgreSQL database connection details from environment variables
 *   and registers this configuration with NestJS.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { DataSourceOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { getPinoLoggerOptions } from '../logger/config';
import { registerAs } from '@nestjs/config';

const pinoLogger = new PinoLogger(getPinoLoggerOptions({ env: process.env.NODE_ENV, context: 'DatabaseConfig' }));

/**
 * Retrieves PostgreSQL database configuration from environment variables.
 * @returns {DataSourceOptions} The PostgreSQL data source options.
 */
function getPostgresConfig(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT as string, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  };
}

/**
 * Interface defining the structure of PostgreSQL database configuration.
 */
export interface PostgresConfig {
  /**
   * The type of the database (e.g., 'postgres').
   */
  type: 'postgres';
  /**
   * The host of the PostgreSQL database.
   */
  host: string;
  /**
   * The port of the PostgreSQL database.
   */
  port: number;
  /**
   * The username for connecting to the PostgreSQL database.
   */
  username: string;
  /**
   * The password for connecting to the PostgreSQL database.
   */
  password: string;
  /**
   * The name of the PostgreSQL database.
   */
  database: string;
}

/**
 * Registers the database configuration with NestJS.
 * It uses the `getPostgresConfig` function to load the configuration
 * and logs the configuration being used.
 */
export default registerAs('database', (): DataSourceOptions => {
  const config = getPostgresConfig();
  pinoLogger.info(`Using 'postgres' database configuration: %o.`, config);
  return config;
});
