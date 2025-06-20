import { Params } from 'nestjs-pino';

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

const pinoHttpProductionOptions = {
  level: 'info',
  transport: undefined, // Default to JSON in production
  ...pinoHttpCommonOptions,
};

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
