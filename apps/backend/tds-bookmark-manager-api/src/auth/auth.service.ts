import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity, UserEntityWithoutPassword } from '../users/user.entity';
import { TokenDto } from './dto/token.dto';
import { JwtPayloadDto } from './dto/jwtpayload.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    data: Pick<UserEntity, 'email' | 'password'>,
    options: { returnUser: boolean } = { returnUser: false },
  ): Promise<UserEntityWithoutPassword | boolean> {
    const foundUser = (await this.usersService.findOne({ email: data.email }, { withoutPassword: false })) as UserEntity | undefined;
    const result = foundUser && (await bcrypt.compare(data.password, foundUser.password));

    if (!result) {
      return false;
    }

    if (options.returnUser) {
      return foundUser as UserEntityWithoutPassword;
    }

    return !!foundUser;
  }

  async login(user: LoginUserDto): Promise<TokenDto> {
    const userFound = (await this.validateUser({ email: user.email, password: user.password }, { returnUser: true })) as UserEntityWithoutPassword;
    if (!userFound) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayloadDto = {
      username: userFound.username,
      sub: `${userFound.userId}`,
      roles: userFound.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // TODO: Maybe not needed to return the created user
  async register(data: CreateUserDto): Promise<UserEntityWithoutPassword> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.usersService.create({ ...data, password: hashedPassword, roles: ['user'] });
  }
}
