import { registerAs } from '@nestjs/config';

export default registerAs(
  'jwt',
  (): Record<string, any> => ({
    secret: process.env.JWT_SECRET || 'a-different-secret-for-jwt',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    jweKey: process.env.JWE_SECRET_KEY || 'super-secret-jwe-key-of-at-least-32-bytes',
    jweContentEncryptionAlgorithm: process.env.JWE_CONTENT_ENCRYPTION_ALGORITHM || 'A256GCM',
    jweKeyManagementAlgorithm: process.env.JWE_KEY_MANAGEMENT_ALGORITHM || 'dir',
  }),
);
