/**
 * auth.module.ts
 *
 * Purpose:
 * - Defines the Authentication module for the API.
 *
 * Logic Overview:
 * - Integrates `UsersModule` and `EmailModule` for authentication processes.
 * - Configures `JwtModule` asynchronously using `ConfigService` for JWT secret and expiration.
 * - Registers authentication strategies (`JwtStrategy`, `LocalStrategy`, `ApiKeyStrategy`)
 *   and guards (`RolesGuard`).
 * - Declares `AuthController` to handle authentication-related requests.
 * - Exports `AuthService` for use in other modules.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { ConfigModule, ConfigService } from '@nestjs/config';

import { ApiKeyStrategy } from './strategies/api-key.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from '../email/email.module';
import { JwtConfig } from '../config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from '../users/users.module';

/**
 * NestJS module for handling all authentication and authorization concerns.
 * This module sets up JWT, Passport strategies, and related services and controllers.
 */
@Module({
  imports: [
    EmailModule,
    UsersModule,
    PassportModule, // Provides Passport.js integration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get<JwtConfig>('jwt');
        if (!jwtConfig) {
          throw new Error('JWT configuration is not defined');
        }
        return {
          secret: jwtConfig.secret,
          signOptions: { expiresIn: jwtConfig.expiresIn },
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService, // Provides authentication business logic
    JwtStrategy, // JWT authentication strategy
    LocalStrategy, // Local (username/password) authentication strategy
    ApiKeyStrategy, // API Key authentication strategy
    RolesGuard // Guard for role-based authorization
  ],
  controllers: [AuthController], // Registers AuthController to handle authentication requests
  exports: [AuthService], // Exports AuthService to be available for other modules
})
export class AuthModule {}
