import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer'; // A more suitable strategy

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<any> {
    const user = await this.authService.validateUserByApiKey(token);
    if (!user) {
      throw new UnauthorizedException('Invalid API Key');
    }
    return user;
  }
}