/**
 * user.decorator.ts
 *
 * Purpose:
 * - Defines a custom parameter decorator to extract the authenticated user object (or a specific property)
 *   from the request.
 *
 * Logic Overview:
 * - Uses NestJS `createParamDecorator` to access the `request.user` object, which is populated
 *   by authentication guards (e.g., `JwtAuthGuard`, `LocalAuthGuard`).
 * - Allows for direct injection of the user object or a specific property of it into controller method parameters.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserWithoutPassword } from '@tds/tds-bm-common';

/**
 * Custom parameter decorator to inject the authenticated user object into a route handler.
 * If a `data` key is provided, it will return that specific property from the user object.
 * Otherwise, it returns the entire user object.
 *
 * @param {keyof UserWithoutPassword | undefined} data - Optional key of the user object to extract (e.g., 'id', 'email').
 * @param {ExecutionContext} ctx - The execution context, providing access to the request object.
 * @returns {UserWithoutPassword | string | undefined} The user object, a specific user property, or undefined.
 */
export const User = createParamDecorator((data: keyof UserWithoutPassword | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const user = request.user;

  return data ? user?.[data] : user;
});
