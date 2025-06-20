import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used to identify routes that should bypass the CSRF guard.
 */
export const SKIP_CSRF_KEY = 'skipCsrfGuard';

/**
 * Decorator to mark a route to be excluded from the global CsrfGuard.
 * Apply this to routes that do not require CSRF protection, such as initial setup endpoints.
 */
export const SkipCsrfGuard = () => SetMetadata(SKIP_CSRF_KEY, true);