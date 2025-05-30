import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy'; // Added import
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { RolesGuard } from './roles.guard'; // Added import

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' }, // TODO: Configure expiration time
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, RolesGuard], // Added LocalStrategy and RolesGuard
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
