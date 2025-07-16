/**
 * config.ts
 *
 * Purpose:
 * - Configures the Pino logger for the NestJS application.
 *
 * Logic Overview:
 * - Provides different logging options for development and production environments,
 *   including redaction of sensitive data and custom log properties.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Params } from 'nestjs-pino';

/**
 * Common options applied to both development and production Pino HTTP configurations.
 * Includes redaction rules for sensitive information.
 */
const pinoHttpCommonOptions = {
  // Redact sensitive information from logs
  redact: {
    paths: ['req.headers.authorization', 'req.headers["x-api-key"]', 'req.body.password', 'req.body.currentPassword', 'req.body.newPassword'],
    censor: '[REDACTED]',
  },
  // Disable success log for /health endpoint (if you have a health check)
  // autoLogging: {
  //   ignore: (req) => req.originalUrl === '/health',
  // },
};

/**
 * Default Pino HTTP options for development environments.
 * Configures pretty-printed logs for better readability during development.
 */
const pinoHttpDefaultOptions = {
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      singleLine: true,
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname,req.remoteAddress,req.remotePort,res.headers', // Simplifies logs in development
    },
  },
  ...pinoHttpCommonOptions,
};

/**
 * Pino HTTP options for production environments.
 * Configures JSON logs by default for easier parsing by log aggregation systems.
 */
const pinoHttpProductionOptions = {
  level: 'info',
  transport: undefined, // Default to JSON in production
  ...pinoHttpCommonOptions,
};

/**
 * Returns the appropriate Pino logger parameters based on the environment.
 *
 * @param {object} options - The options for configuring the logger.
 * @param {string | undefined} options.env - The current environment (e.g., 'production', 'development').
 * @param {string} options.context - The logging context, used for custom log properties.
 * @returns {Params} The Pino logger parameters.
 */
export function getPinoLoggerOptions(options: { env: string | undefined; context: string }): Params {
  const pinoHttpOptions = ['production', 'docker'].includes(options.env as string) ? pinoHttpProductionOptions : pinoHttpDefaultOptions;
  return {
    pinoHttp: {
      ...pinoHttpOptions,
      ...pinoHttpCommonOptions,
      customProps: () => ({
        context: options.context || 'UndefinedContext',
      }),
    },
  };
}
