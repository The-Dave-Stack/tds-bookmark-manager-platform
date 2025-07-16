/**
 * jwtpayload.dto.ts
 *
 * Purpose:
 * - Defines the structure of the JWT payload.
 *
 * Logic Overview:
 * - Specifies the claims included in the JSON Web Token for authentication and authorization.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Role } from "../../interfaces/user.interface.js";

/**
 * Represents the payload of a JSON Web Token (JWT) used for authentication and authorization.
 */
export interface JwtPayloadDto {
  /**
   * The username of the user.
   */
  username: string;
  /**
   * An array of roles assigned to the user, used for authorization.
   */
  roles: Role[];
  /**
   * Issued at timestamp (optional).
   */
  iat?: number; // issued at timestamp
  /**
   * Subject of the JWT, typically the user's ID.
   */
  sub: string; // subject, typically the userId
  /**
   * Expiration timestamp (optional).
   */
  exp?: number; // expiration timestamp
}
