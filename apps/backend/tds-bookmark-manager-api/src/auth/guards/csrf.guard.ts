/**
 * csrf.guard.ts
 *
 * Purpose:
 * - Implements a global CSRF (Cross-Site Request Forgery) protection guard.
 *
 * Logic Overview:
 * - Checks for the presence and matching of CSRF tokens in both cookies and request headers
 *   for unsafe HTTP methods (e.g., POST, PUT, DELETE).
 * - Allows bypassing CSRF checks for specific routes using the `@SkipCsrfGuard` decorator.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { Cookies } from '../cookies';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SKIP_CSRF_KEY } from '../decorators/skip-csrf.decorator';

/**
 * Global guard for CSRF protection.
 * This guard checks for a valid CSRF token in incoming requests for unsafe methods.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current request is allowed to proceed based on CSRF token validation.
   * @param {ExecutionContext} context - The execution context of the current request.
   * @returns {boolean} True if the request is allowed, false otherwise.
   * @throws {ForbiddenException} If the CSRF token is invalid or missing for an unsafe method.
   */
  canActivate(context: ExecutionContext): boolean {
    // Check if the route is decorated to skip CSRF protection
    const skipCsrf = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF_KEY, [context.getHandler(), context.getClass()]);

    if (skipCsrf) {
      return true; // If decorated, bypass the CSRF check
    }

    const request: Request = context.switchToHttp().getRequest();

    // CSRF protection is not needed for safe methods (GET, HEAD, OPTIONS)
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true;
    }

    const csrfTokenFromCookie = request.cookies[Cookies.CSRF_TOKEN];
    const csrfTokenFromHeader = request.headers['x-csrf-token'];

    // If tokens are missing or do not match, throw a ForbiddenException
    if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
      throw new ForbiddenException('Invalid CSRF token.');
    }

    return true;
  }
}
