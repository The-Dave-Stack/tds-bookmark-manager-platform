import { registerAs } from '@nestjs/config';

export default registerAs('app', (): Record<string, any> => {
  const port = parseInt(process.env.APP_PORT as string, 10) || 3000;
  const host = process.env.APP_HOST || 'localhost';
  const protocol = process.env.APP_PROTOCOL || 'http';

  const appUrl = `${protocol}://${host}:${port}`;

  return {
    name: process.env.APP_NAME || 'TDS Bookmar Manager API',
    env: process.env.NODE_ENV || 'development',
    url: appUrl,
    port: port,

    jweKey: process.env.JWE_SECRET_KEY || 'super-secret-jwe-key-of-at-least-32-bytes',
    jweIssuer: process.env.JWE_ISSUER || 'TheDaveStackURLShortener',
    jweAudience: process.env.JWE_AUDIENCE || 'url-shortener-users',
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',

    globalRateLimitTtl: parseInt(process.env.GLOBAL_RATE_LIMIT_TTL as string, 10) || 60000, // 1 minute in ms
    globalRateLimitLimit: parseInt(process.env.GLOBAL_RATE_LIMIT_LIMIT as string, 10) || 100, // 100 requests
  };
});
