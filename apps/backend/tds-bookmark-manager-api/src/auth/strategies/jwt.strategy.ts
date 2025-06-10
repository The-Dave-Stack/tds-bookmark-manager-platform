import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/jwtpayload.dto';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
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
