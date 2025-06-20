import { DataSourceOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { getPinoLoggerOptions } from '../logger/config';
import { registerAs } from '@nestjs/config';

const pinoLogger = new PinoLogger(getPinoLoggerOptions({ env: process.env.NODE_ENV, context: 'DatabaseConfig' }));

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

export default registerAs('database', (): DataSourceOptions => {
  const config = getPostgresConfig();
  pinoLogger.info(`Using 'postgres' database configuration: %o.`, config);
  return config;
});