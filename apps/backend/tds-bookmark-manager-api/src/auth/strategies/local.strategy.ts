import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import type { User } from '@tds/tds-bm-common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<User> {
    const user = (await this.authService.validateUser({ email, password }, { returnUser: true })) as User | undefined;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
