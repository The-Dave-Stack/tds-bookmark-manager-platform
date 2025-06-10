import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity, UserEntityWithoutPassword } from '../users/entities/user.entity';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtPayloadDto } from './dto/jwtpayload.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { TokenDto } from './dto/token.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    data: Pick<UserEntity, 'email' | 'passwordHash'>,
    options: { returnUser: boolean } = { returnUser: false },
  ): Promise<UserEntityWithoutPassword | boolean> {
    const foundUser = (await this.usersService.findOne({ email: data.email }, { withoutPassword: false })) as UserEntity | undefined;
    const result = foundUser && (await bcrypt.compare(data.passwordHash, foundUser.passwordHash));

    if (!result) {
      return false;
    }

    if (options.returnUser) {
      return foundUser as UserEntityWithoutPassword;
    }

    return !!foundUser;
  }

  async login(user: LoginUserDto): Promise<TokenDto> {
    const userFound = (await this.validateUser({ email: user.email, passwordHash: user.passwordHash }, { returnUser: true })) as UserEntityWithoutPassword;
    if (!userFound) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayloadDto = {
      username: userFound.username,
      sub: `${userFound.id}`,
      roles: userFound.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // TODO: Maybe not needed to return the created user
  async register(data: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
    return await this.usersService.create({ ...data, passwordHash: hashedPassword, roles: ['user'] });
  }
}
