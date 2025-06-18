import { Role } from "../../interfaces/user.interface.js";

export interface JwtPayloadDto {
  username: string;
  roles: Role[];
  iat?: number; // issued at timestamp
  sub: string; // subject, typically the userId
  exp?: number; // expiration timestamp
}
