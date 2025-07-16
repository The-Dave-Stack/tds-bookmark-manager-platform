/**
 * roles.guard.ts
 *
 * Purpose:
 * - Implements a role-based authorization guard.
 *
 * Logic Overview:
 * - Retrieves required roles from metadata set by the `@Roles` decorator.
 * - Checks if the authenticated user's roles include any of the required roles.
 * - Integrates with NestJS `Reflector` to read metadata.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { UserWithoutPassword } from '@tds/tds-bm-common';

/**
 * Guard for role-based authorization.
 * This guard checks if the authenticated user has the necessary roles to access a route.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current request is allowed to proceed based on user roles.
   * @param {ExecutionContext} context - The execution context of the current request.
   * @returns {boolean} True if the user has at least one of the required roles, false otherwise.
   */
  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for the route from metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true; // If no roles are specified, allow access
    }

    // Get the user object from the request (populated by authentication guards)
    const { user } = context.switchToHttp().getRequest() as { user: UserWithoutPassword };

    // Check if the user has any of the required roles
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
