import { DataSourceOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { getPinoLoggerOptions } from '../logger/config';
import { join } from 'path';
import { registerAs } from '@nestjs/config';

const pinoLogger = new PinoLogger(getPinoLoggerOptions({ env: 'development', context: 'DatabaseConfig' }));

function getPostgresConfig(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT as string, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
}

function getSqliteConfig(): DataSourceOptions {
  // SQLite is a file-based database, ideal for local development and testing.
  // It creates a database file in the project root.
  return {
    type: 'sqlite',
    database: process.env.DB_DATABASE || join(__dirname, '../../..', 'tdb-bookmark-manager.sqlite'),
  };
}

export default registerAs('database', (): DataSourceOptions => {
  const dbType = process.env.DB_TYPE;

  let config = getSqliteConfig();
  switch (dbType) {
    case 'postgres':
      config = getPostgresConfig();
      pinoLogger.info(`Using 'postgres' database configuration: %o.`, config);
      return config;
    case 'sqlite':
      pinoLogger.info(`Using 'SQLite' database configuration: %o.`, config);
      return config;
    default:
      // Default to SQLite if DB_TYPE is not set or is an unknown value.
      pinoLogger.warn(`DB_TYPE environment variable not set or invalid. Defaulting to 'sqlite': %o.`, config);
      return config;
  }
});