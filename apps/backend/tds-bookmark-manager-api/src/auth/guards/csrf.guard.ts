import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { Cookies } from '../cookies';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
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