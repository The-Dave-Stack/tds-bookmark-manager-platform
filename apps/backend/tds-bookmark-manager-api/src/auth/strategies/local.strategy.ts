import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { PinoLogger } from 'nestjs-pino';
import { Strategy } from 'passport-local';
import type { User } from '@tds/tds-bm-common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private logger: PinoLogger) {
    super();
    this.logger.setContext(LocalStrategy.name);
  }

  async validate(email: string, password: string): Promise<User> {
    this.logger.debug(`Executing LocalStragy for the login for the user: %o`, email);
    const user = (await this.authService.validateUser({ email, password }, { returnUser: true })) as User | undefined;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
