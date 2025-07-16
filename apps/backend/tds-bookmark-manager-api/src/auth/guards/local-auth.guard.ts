/**
 * local-auth.guard.ts
 *
 * Purpose:
 * - Implements a local authentication guard for username/password-based login.
 *
 * Logic Overview:
 * - Extends NestJS `AuthGuard` with the 'local' strategy, which handles the
 *   validation of credentials against the `AuthService`.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * Guard for local (username/password) authentication.
 * This guard uses the 'local' strategy configured in Passport.js to validate user credentials.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
