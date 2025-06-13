import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import type { JwtPayloadDto } from '@tds/tds-bm-common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') as string,
    });
  }

  async validate(payload: any): Promise<JwtPayloadDto> {
    return {
      sub: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
