import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// This middleware ensures that any request not explicitly starting with '/api'
// (which is your global API prefix) is redirected to the Swagger documentation.
// This acts as a default "landing page" for non-API traffic.
@Injectable()
export class ApiRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check if the request path does NOT start with '/api'
    // Also, ensure it's not already '/api-docs' to prevent endless redirects
    if (!req.path.startsWith('/api') && req.path !== '/api-docs') {
      // Perform a 301 Permanent Redirect to indicate the resource has moved definitively.
      return res.redirect(301, '/api-docs');
    }
    next(); // Pass the request to the next middleware in the chain
  }
}