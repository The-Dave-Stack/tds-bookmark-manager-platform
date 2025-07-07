import { registerAs } from '@nestjs/config';

export interface AppConfig {
  name: string;
  env: string;
  url: string;
  port: number;
  globalRateLimitTtl: number;
  globalRateLimitLimit: number;
}

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
