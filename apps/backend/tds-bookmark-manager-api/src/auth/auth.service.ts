import { CreateUserDto, JwtPayloadDto, LoginUserDto, TokenDto, UserWithoutPassword, mapEntityToDto } from '@tds/tds-bm-common';

import { EmailService } from '../email/email.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private emailService: EmailService, private logger: PinoLogger) {
    this.logger.setContext(AuthService.name);
  }

  async validateUser(data: Pick<LoginUserDto, 'email' | 'password'>, options: { returnUser: boolean } = { returnUser: false }): Promise<UserWithoutPassword | boolean> {
    this.logger.debug(`[validateUser] Login attempt for the user: %o`, data);
    const result = await this.usersService.validateUserCredentials(data);

    if (!result) {
      return false;
    }

    if (options.returnUser) {
      return result;
    }

    return !!result;
  }

  async validateUserByApiKey(token: string): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findOneByApiToken(token);
    if (user) {
      return mapEntityToDto(user, UserWithoutPassword);
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

  async login(user: UserWithoutPassword): Promise<TokenDto & UserWithoutPassword> {
    this.logger.debug(`[login] Login attempt for the user: %o`, user);
    return { ...this._getToken(user), ...user };
  }

  async register(data: CreateUserDto): Promise<TokenDto & UserWithoutPassword> {
    const newUser = await this.usersService.create(data);
    return { ...this._getToken(newUser), ...newUser };
  }

  private _getToken(user: UserWithoutPassword): TokenDto {
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
