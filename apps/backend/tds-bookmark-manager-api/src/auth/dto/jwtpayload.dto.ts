export class JwtPayloadDto {
  username!: string;
  roles!: string[];
  iat?: number; // issued at timestamp
  sub!: string; // subject, typically the userId
  exp?: number; // expiration timestamp
}
