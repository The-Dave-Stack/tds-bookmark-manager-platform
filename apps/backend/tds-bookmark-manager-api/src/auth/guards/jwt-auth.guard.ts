/**
 * jwt-auth.guard.ts
 *
 * Purpose:
 * - Implements a JWT (JSON Web Token) authentication guard.
 *
 * Logic Overview:
 * - Extends NestJS `AuthGuard` with the 'jwt' strategy.
 * - Handles the activation logic and customizes the error handling for JWT authentication failures,
 *   throwing an `UnauthorizedException` if authentication fails.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * Guard for JWT-based authentication.
 * This guard uses the 'jwt' strategy configured in Passport.js to validate incoming requests.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  /**
   * Determines if the current request is allowed to proceed based on JWT validation.
   * @param {ExecutionContext} context - The execution context of the current request.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} True if the request is allowed.
   */
  override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  /**
   * Handles the request after Passport.js processes it.
   * Throws an `UnauthorizedException` if authentication fails (e.g., invalid token, no user found).
   * @param {any} err - Any error encountered during authentication.
   * @param {any} user - The authenticated user object, if successful.
   * @param {any} info - Additional information about the authentication process.
   * @returns {any} The authenticated user object.
   * @throws {UnauthorizedException} If authentication fails.
   */
  override handleRequest(err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
