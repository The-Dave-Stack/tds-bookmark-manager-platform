/**
 * validation.schema.ts
 *
 * Purpose:
 * - Defines the Joi schema for validating environment variables.
 *
 * Logic Overview:
 * - Ensures that all necessary environment variables are present and correctly formatted
 *   before the application starts, providing clear error messages if a variable is missing or invalid.
 * - Includes a conditional check to exclude email configuration requirements during database migrations.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import * as Joi from 'joi';

//import { PinoLogger } from 'nestjs-pino';
//import { getPinoLoggerOptions } from '../logger/config';

//const pinoLogger = new PinoLogger(getPinoLoggerOptions({ env: process.env.NODE_ENV, context: 'validationSchema' }));

/**
 * Defines the base schema for environment variable validation using Joi.
 * This ensures that the application does not start without the required
 * configuration, providing clear error messages if a variable is missing or invalid.
 */
let validationSchema = Joi.object({
  // Application Environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'docker')
    .required(),
  APP_HOST: Joi.string().default('localhost'),
  APP_PORT: Joi.number().default(3000),
  APP_PROTOCOL: Joi.string().default('http'),
  APP_NAME: Joi.string().default('TDS Bookmark Manager API'),
  GLOBAL_RATE_LIMIT_TTL: Joi.number().default(60000), // 1 minute in ms
  GLOBAL_RATE_LIMIT_LIMIT: Joi.number().default(100), // 100 requests

  // JWT Configuration
  JWT_SECRET: Joi.string().required().min(32).messages({
    'string.base': 'JWT_SECRET must be a string',
    'string.min': 'JWT_SECRET must be at least 32 characters long',
    'any.required': 'JWT_SECRET is a required environment variable',
  }),
  JWT_EXPIRES_IN: Joi.string().default('1h'),

  // PostgreSQL variables
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),

});

/**
 * Conditionally adds email configuration validation to the schema.
 * Email configuration is only required when the application is not running in a 'migration' context.
 */
if (process.env.VALIDATION_CONTEXT !== 'migration') {
  validationSchema = validationSchema.concat(Joi.object({
    // --- NEW: Email Configuration ---
    EMAIL_HOST: Joi.string().required().description('SMTP host for sending emails'),
    EMAIL_PORT: Joi.number().required().description('SMTP port'),
    EMAIL_USER: Joi.string().required().description('SMTP username'),
    EMAIL_PASS: Joi.string().required().description('SMTP password'),
    EMAIL_FROM: Joi.string().email().required().description('Default "from" email address'),
  }));
}

export { validationSchema };
