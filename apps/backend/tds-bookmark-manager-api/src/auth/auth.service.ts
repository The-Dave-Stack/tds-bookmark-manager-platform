import { CreateUserDto, JwtPayloadDto, LoginUserDto, TokenDto, User, mapEntityToDto } from '@tds/tds-bm-common';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private emailService: EmailService, private logger: PinoLogger) {
    this.logger.setContext(AuthService.name);
  }

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

  async validateUserByApiKey(token: string): Promise<User | null> {
    const user = await this.usersService.findOneByApiToken(token);
    if (user) {
      return mapEntityToDto(user, User);
    }
    return null;
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const token = await this.usersService.createPasswordResetToken(email);
      const user = await this.usersService.findOneByEmail({ email }, { withoutPassword: false });
      await this.emailService.sendPasswordResetEmail(user, token);
    } catch (error) {
      // Silently fail to prevent user enumeration attacks
      this.logger.warn(`Forgot password attempt for ${email} failed, but swallowing error.`);
    }
  }

  async resetPassword(token: string, newPass: string): Promise<TokenDto> {
    const user = await this.usersService.resetUserPassword(token, newPass);
    // Log the user in and return a new JWT token
    const payload: JwtPayloadDto = { username: user.username, sub: user.email, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(user: LoginUserDto): Promise<TokenDto> {
    const userFound = (await this.validateUser({ email: user.email, password: user.password }, { returnUser: true })) as User;
    if (!userFound) {
      throw new UnauthorizedException();
    }
    return this._getToken(userFound);
  }

  async register(data: CreateUserDto): Promise<TokenDto> {
    const newUser = await this.usersService.create({ ...data });
    return this._getToken(newUser);
  }

  private _getToken(user: User): TokenDto {
    const payload: JwtPayloadDto = {
      username: user.username,
      sub: `${user.email}`,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
