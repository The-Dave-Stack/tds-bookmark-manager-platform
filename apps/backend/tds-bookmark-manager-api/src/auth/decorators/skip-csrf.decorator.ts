/**
 * skip-csrf.decorator.ts
 *
 * Purpose:
 * - Defines a custom decorator to bypass CSRF protection for specific routes.
 *
 * Logic Overview:
 * - Uses NestJS `SetMetadata` to flag a route, indicating that the `CsrfGuard`
 *   should skip its validation for that particular endpoint.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used to identify routes that should bypass the CSRF guard.
 */
export const SKIP_CSRF_KEY = 'skipCsrfGuard';

/**
 * Decorator to mark a route to be excluded from the global `CsrfGuard`.
 * Apply this to routes that do not require CSRF protection, such as initial setup endpoints
 * or public-facing APIs where CSRF is not applicable.
 *
 * @returns {CustomDecorator} A NestJS custom decorator.
 */
export const SkipCsrfGuard = () => SetMetadata(SKIP_CSRF_KEY, true);
