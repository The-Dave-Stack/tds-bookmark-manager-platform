import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { Cookies } from '../cookies';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SKIP_CSRF_KEY } from '../decorators/skip-csrf.decorator';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skipCsrf = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF_KEY, [context.getHandler(), context.getClass()]);

    if (skipCsrf) {
      return true; // If decorated, bypass the CSRF check
    }

    const request: Request = context.switchToHttp().getRequest();

    // CSRF protection is not needed for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true;
    }

    const csrfTokenFromCookie = request.cookies[Cookies.CSRF_TOKEN];
    const csrfTokenFromHeader = request.headers['x-csrf-token'];

    if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
      throw new ForbiddenException('Invalid CSRF token.');
    }

    return true;
  }
}
