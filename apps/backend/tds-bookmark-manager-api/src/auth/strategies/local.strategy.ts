import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = (await this.authService.validateUser({ email, passwordHash: password }, { returnUser: true })) as UserEntity | undefined;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
