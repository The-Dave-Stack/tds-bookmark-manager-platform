import * as dotenv from 'dotenv';

import { DataSource, DataSourceOptions } from 'typeorm';

import { PinoLogger } from 'nestjs-pino';
import databaseConfig from '../config/database.config';
import { existsSync } from 'fs';
import { getPinoLoggerOptions } from '../logger/config';
import { resolve } from 'path';

const pinoLogger = new PinoLogger(getPinoLoggerOptions({ env: process.env.NODE_ENV, context: 'DataSource' }));

// --- START OF ENVIRONMENT LOADING LOGIC ---

// 1. Determine the environment. Default to 'development' if NODE_ENV is not set.
const nodeEnv = process.env.NODE_ENV;
const envFilePath = resolve(`.env.${nodeEnv}`);
const defaultEnvFilePath = resolve(`.env`);

// 2. Check if the environment-specific .env file exists and load it.
if (existsSync(envFilePath)) {
  pinoLogger.info(`Loading environment variables from: ${envFilePath}`);
  dotenv.config({ path: envFilePath });
} else {
  // 3. Fallback to the default .env file if the specific one is not found.
  pinoLogger.warn(`Warning: ${envFilePath} not found. Falling back to default .env file if it exists.`);
  if (existsSync(defaultEnvFilePath)) {
    dotenv.config();
  } else {
    pinoLogger.error(`Error: ${defaultEnvFilePath} not found. Check if .env file exists.`);
    process.exit(1);
  }
}

// --- END OF ENVIRONMENT LOADING LOGIC ---

// Get the base configuration directly from our centralized config function.
const baseConfig = databaseConfig();

export const dataSourceOptions: DataSourceOptions = {
  ...baseConfig, // Spread the configuration for either postgres or sqlite

  // NOTE: These paths are now relative to the root of the 'outDir'
  // specified in tsconfig.cli.json, which is 'dist/cli'.
  // TypeORM will look for 'dist/cli/src/**/*.entity.js'
  // and 'dist/cli/src/db/migrations/*.js'
  // This setup requires the CLI to be run from the workspace root.
  entities: [__dirname + '/../**/*.entity.js'],
  migrations: [__dirname + '/migrations/*.js'],

  synchronize: false, // CRITICAL: Always false when using migrations
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
