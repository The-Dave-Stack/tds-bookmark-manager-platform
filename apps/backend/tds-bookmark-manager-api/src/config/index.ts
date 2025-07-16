/**
 * index.ts
 *
 * Purpose:
 * - Aggregates and exports all application configuration modules.
 *
 * Logic Overview:
 * - Provides a single point of access for loading various configuration aspects
 *   (application, JWT, database) into the NestJS `ConfigModule`.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';

/**
 * An array of configuration modules to be loaded by the NestJS `ConfigModule`.
 */
export const configurations = [appConfig, jwtConfig, databaseConfig];
