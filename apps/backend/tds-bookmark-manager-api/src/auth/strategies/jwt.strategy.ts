import type { JwtPayloadDto, UserWithoutPassword } from '@tds/tds-bm-common';

import { ConfigService } from '@nestjs/config';
import { Cookies } from '../cookies';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express'; // Import Request from express
import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

// Custom function to extract the token from the cookie
const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies[Cookies.ACCESS_TOKEN];
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private usersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') as string,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<UserWithoutPassword> {
    // The payload only has id, username, roles. We can fetch the full user.
    const user = await this.usersService.findOneByEmail({ email: payload.sub }, { withoutPassword: true });
    // The DTO returned by the service already excludes the password hash.
    return user;
  }
}
