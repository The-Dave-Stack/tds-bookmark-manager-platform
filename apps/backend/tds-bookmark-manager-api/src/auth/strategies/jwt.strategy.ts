/**
 * jwt.strategy.ts
 *
 * Purpose:
 * - Implements a Passport strategy for JWT (JSON Web Token) authentication.
 *
 * Logic Overview:
 * - Extracts the JWT from an HTTP-only cookie.
 * - Validates the token's signature and expiration using the configured JWT secret.
 * - Retrieves the authenticated user's details based on the token's payload.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import type { JwtPayloadDto, UserWithoutPassword } from '@tds/tds-bm-common';

import { ConfigService } from '@nestjs/config';
import { Cookies } from '../cookies';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express'; // Import Request from express
import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

/**
 * Custom function to extract the JWT token from the 'access_token' cookie.
 * @param {Request} req - The Express request object.
 * @returns {string | null} The JWT token string or null if not found.
 */
const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies[Cookies.ACCESS_TOKEN];
  }
  return null;
};

/**
 * Passport strategy for JWT authentication.
 * This strategy validates JWTs extracted from cookies and populates the request with the authenticated user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private usersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor, // Specifies how to extract the JWT from the request
      ignoreExpiration: false, // Do not ignore token expiration
      secretOrKey: configService.get<string>('jwt.secret') as string, // Secret key for verifying the token
    });
  }

  /**
   * Validates the JWT payload and retrieves the corresponding user.
   * This method is called after the JWT has been successfully verified.
   * @param {JwtPayloadDto} payload - The decoded JWT payload.
   * @returns {Promise<UserWithoutPassword>} The authenticated user object (without password hash).
   */
  async validate(payload: JwtPayloadDto): Promise<UserWithoutPassword> {
    // The payload only has id, username, roles. We can fetch the full user.
    const user = await this.usersService.findOneByEmail({ email: payload.sub }, { withoutPassword: true });
    // The DTO returned by the service already excludes the password hash.
    return user;
  }
}
