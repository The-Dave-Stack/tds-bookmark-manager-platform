/**
 * roles.decorator.ts
 *
 * Purpose:
 * - Defines a custom decorator for assigning roles to controller methods or classes.
 *
 * Logic Overview:
 * - Uses NestJS `SetMetadata` to attach role information to route handlers,
 *   which can then be read by a `RolesGuard` for authorization.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { SetMetadata } from '@nestjs/common';

/**
 * The key used to store roles metadata.
 */
export const ROLES_KEY = 'roles';

/**
 * Custom decorator to specify required roles for accessing a route.
 * Can be applied to a controller class or individual route handler methods.
 *
 * @param {...string[]} roles - A list of roles (e.g., 'admin', 'user') that are allowed to access the decorated route.
 * @returns {CustomDecorator} A NestJS custom decorator.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
