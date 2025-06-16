import type { CreateUserDto, JwtPayloadDto, LoginUserDto, TokenDto, User } from '@tds/tds-bm-common';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(data: Pick<User, 'email' | 'password'>, options: { returnUser: boolean } = { returnUser: false }): Promise<User | boolean> {
    const result = await this.usersService.validateUserCredentials(data);

    if (!result) {
      return false;
    }

    if (options.returnUser) {
      return result as User;
    }

    return !!result;
  }

  async login(user: LoginUserDto): Promise<TokenDto> {
    const userFound = (await this.validateUser({ email: user.email, password: user.password }, { returnUser: true })) as User;
    if (!userFound) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayloadDto = {
      username: userFound.username,
      sub: `${userFound.email}`,
      roles: userFound.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // TODO: Maybe not needed to return the created user
  async register(data: CreateUserDto): Promise<User> {
    return await this.usersService.create({ ...data });
  }
}
