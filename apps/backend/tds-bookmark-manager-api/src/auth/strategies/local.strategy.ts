import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { PinoLogger } from 'nestjs-pino';
import { Strategy } from 'passport-local';
import type { UserWithoutPassword } from '@tds/tds-bm-common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private logger: PinoLogger) {
    super({ usernameField: 'email', passwordField: 'password' });
    this.logger.setContext(LocalStrategy.name);
  }

  async validate(email: string, password: string): Promise<UserWithoutPassword> {
    this.logger.debug(`[validate] Executing LocalStragy for the login for the user: %o`, email);
    const user = (await this.authService.validateUser({ email, password }, { returnUser: true })) as UserWithoutPassword | undefined;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
