import { registerAs } from '@nestjs/config';

export default registerAs(
  'jwt',
  (): Record<string, any> => ({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  }),
);
