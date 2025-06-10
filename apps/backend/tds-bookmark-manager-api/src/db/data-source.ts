import * as dotenv from 'dotenv';

import { DataSource, DataSourceOptions } from 'typeorm';
import { join, resolve } from 'path';

import { PinoLogger } from 'nestjs-pino';
import databaseConfig from '../config/database.config';
import { existsSync } from 'fs';
import { getPinoLoggerOptions } from '../logger/constants';

const pinoLogger = new PinoLogger(getPinoLoggerOptions({ env: 'development', context: 'DataSource' }));

// --- START OF ENVIRONMENT LOADING LOGIC ---

// 1. Determine the environment. Default to 'development' if NODE_ENV is not set.
const nodeEnv = process.env.NODE_ENV || 'development';
const envFilePath = resolve(join(__dirname, '../../..'), `.env.${nodeEnv}`);

// 2. Check if the environment-specific .env file exists and load it.
if (existsSync(envFilePath)) {
  pinoLogger.info(`Loading environment variables from: ${envFilePath}`);
  dotenv.config({ path: envFilePath });
} else {
  // 3. Fallback to the default .env file if the specific one is not found.
  pinoLogger.info(`Warning: ${envFilePath} not found. Falling back to default .env file if it exists.`);
  dotenv.config();
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